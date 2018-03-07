"""Classes for measuring times between points."""
import operator
import os
import requests
import logging

from backend.lib.utils import iterators
from backend.models import distance
from backend.models.base import Measurer

import openrouteservice
from openrouteservice.distance_matrix import distance_matrix

from ratelimit import rate_limited

from retrying import retry

logger = logging.getLogger(__name__)

# TODO: Determine a more intelligent way for converting distance to time.
TIME_TO_DISTANCE_HOURS_TO_METERS = 104607.0  # 65 miles per hour in meters per hour.
ABSURDLY_LARGE_TIME_IN_MINUTES = 10**42  # Placeholder value when no nearby providers are found.


def _retry_if_result_none(result):
    """Return True if we should retry (in this case when result is None), False otherwise."""
    return result is None


# TODO - Abstract as APIMeasurer.
# TODO - Better handling of api_url and api_key.
class APIDrivingTime(Measurer):
    """Class for API driving time measurements."""

    def __init__(self, api_key=None, early_exit_outer_radius=120.0 * 10**3):
        """Initialize the distance class with for an API measurer."""
        self.api_key = api_key or ''
        self._haversine_measurer = distance.HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius
        # Some APIs only accept a maximum number of entries per call.
        self.max_matrix_size = None

    @retry(wait_fixed=500, stop_max_attempt_number=2)
    def _get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix from the matrix API.

        Results in the matrix are returned in seconds.
        Expects points as (latitude, longitude) named tuples to be consistent with other functions.
        """
        raise NotImplementedError

    def _measure_one_to_many_points(self, origin, point_list):
        """
        Measure duration from one to mamy points using the matrix API.

        Result is a list of durations in seconds.
        """
        if self.max_matrix_size is None:
            return self._get_matrix(source_points=[origin], destination_points=point_list)[0]

        measurements = []
        for batch in iterators.iterate_in_slices(
            iterable=iter(point_list),
                batch_size=self.max_matrix_size - 1):
            measurements.extend(
                self._get_matrix(
                    source_points=[origin],
                    destination_points=batch)[0]
            )
        return measurements

    def closest_with_early_exit(self, origin, point_list, exit_distance):
        """
        Find closest point in a list of points, exiting early if exit_distance is reached.

        The exit_distance uses haversine distance (in meters).
        """
        haversine_distances = [
            self._haversine_measurer.measure_between_two_points(origin, point)
            for point in point_list
        ]
        min_haversine_idx, min_haversine_distance = min(
            enumerate(haversine_distances),
            key=operator.itemgetter(1)
        )

        # TODO - Avoid early 'return' so that we can implement one call to
        # `closest_with_early_exit` function building on `haversine` and `closest`,
        # one return statement, and make it clearer as a result.
        if min_haversine_distance <= exit_distance:
            return (
                min_haversine_distance / TIME_TO_DISTANCE_HOURS_TO_METERS * 60.0,
                point_list[min_haversine_idx]
            )

        relevant_points = [
            point_list[idx]
            for idx, distance in enumerate(haversine_distances)
            if distance < min(self.early_exit_outer_radius, 1.5 * min_haversine_distance)
        ]

        if not relevant_points:
            return ABSURDLY_LARGE_TIME_IN_MINUTES, point_list[0]

        return self.closest(origin=origin, point_list=relevant_points)

    def closest(self, origin, point_list):
        """
        Find closest point in a list of points and returns min_measurement, min_point.

        min_measurement is returned in minutes.
        """
        distance_responses = self._measure_one_to_many_points(origin=origin, point_list=point_list)

        min_idx, min_measurement = min(
            enumerate(distance_responses),
            key=operator.itemgetter(1)
        )
        return float(min_measurement) / 60.0, point_list[min_idx]

    @staticmethod
    def _represent_point_as_str(point):
        """Represent a point dictionary in the format (longitude,latitude)."""
        return '{lng},{lat}'.format(lat=point.latitude, lng=point.longitude)


class OSRMDrivingTime(APIDrivingTime):
    """
    Class for OSRM driving time measurements.

    Uses the `table` OSRM API endpoint.
    """

    def __init__(self, api_url=None, early_exit_outer_radius=120.0 * 10**3):
        """Initialize the distance class with the OSRM URL."""
        # FIXME: Once the API accepts distances, enable a `distance` mode.
        logger.debug('Initializing OSRM measurer.')
        super().__init__()
        self.api_url = api_url or os.getenv('OSRM_URL')
        self._haversine_measurer = distance.HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius

    # TODO - Abstract and merge with MapBox _get_matrix function.
    @retry(retry_on_result=_retry_if_result_none, stop_max_attempt_number=10, wait_fixed=2000)
    def _get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix using the OSRM API.

        Time is expressed in seconds.
        """
        all_points = source_points + destination_points
        coordinates = ';'.join([self._represent_point_as_str(point) for point in all_points])

        url = '{base_url}/{api_string}'.format(
            base_url=self.api_url,
            api_string='table/v1/car/{coords}'.format(coords=coordinates)
        )

        params = {
            'sources': 0,
            'destinations': ';'.join(
                [str(1 + i) for i, _ in enumerate(destination_points)]
            )
        }
        response = requests.get(url, params=params)

        try:
            response.raise_for_status()
        except requests.HTTPError:
            return None
        content = response.json()

        if content['code'] == 'Ok' and content['durations']:
            return content['durations']


class MapBoxDrivingTime(APIDrivingTime):
    """Class for MapBox driving time measurements."""

    def __init__(self, api_key=None, early_exit_outer_radius=120.0 * 10**3):
        """Initialize the distance class with a MapBox API key."""
        self.api_key = api_key or os.getenv('MAPBOX_TOKEN')
        self._haversine_measurer = distance.HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius
        self.max_matrix_size = 25

    @retry(wait_fixed=500, stop_max_attempt_number=2)
    @rate_limited(1, 1.0)  # 1 per second - period=1, every=1.0.
    def _get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix using the MapBox API.

        Time is expressed in seconds.
        NOTES:
         - MapBox API requires a list of lon,lat;lon,lat points.
         - The MapBox API accepts 25 points max as input.
        """
        logger.debug('_get_matrix from {} to {} points'.format(
            source_points[0],
            len(destination_points)
        ))
        request_url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{points}'
        all_points = source_points + destination_points
        if len(all_points) > self.max_matrix_size:
            raise RuntimeError('Mapbox matrix API only accepts 25 locations.')
        coordinates = ';'.join([self._represent_point_as_str(point) for point in all_points])

        params = {
            'sources': ';'.join([str(i) for i, _ in enumerate(source_points)]),
            'destinations': ';'.join(
                [str(len(source_points) + i) for i, _ in enumerate(destination_points)]
            ),
            'access_token': self.api_key
        }

        response = requests.get(
            url=request_url.format(points=coordinates),
            params=params
        )

        response.raise_for_status()
        content = response.json()
        return content['durations']


class OpenRouteDrivingTime(APIDrivingTime):
    """Class for OpenRouteService driving time measurements."""

    def __init__(self, api_key=None, early_exit_outer_radius=120.0 * 10**3):
        """Initialize the distance class with an Open Routing Service API key."""
        super().__init__()
        self.api_key = api_key or os.getenv('ORS_TOKEN')
        self.client = openrouteservice.Client(key=self.api_key)

    @retry(wait_fixed=500, stop_max_attempt_number=2)
    @rate_limited(40, 60.0)  # 40 per minute - period=40, every=60.0.
    def _get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix using the Open Route Service API.
        Time is expressed in seconds.

        NOTES:
         - The ORS API requires a list of [lon,lat],[lon,lat] points.
        """
        logger.debug('_get_matrix from {} to {} points'.format(
            source_points[0],
            len(destination_points)
        ))

        coordinates = [[point[1], point[0]] for point in source_points + destination_points]

        results = distance_matrix(
            self.client,
            locations=coordinates,
            sources=[str(i) for i, _ in enumerate(source_points)],
            destinations=[str(len(source_points) + i) for i, _ in enumerate(destination_points)]
        )
        return results['durations']
