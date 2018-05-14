"""Classes for measuring times between points."""
import operator
import os
import requests
import logging

from backend.config import config
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

ABSURDLY_LARGE_TIME_IN_MINUTES = config.get('absurdly_large_placeholder_time') # Placeholder value when no nearby providers are found.


def _retry_if_result_none(result):
    """Return True if we should retry (in this case when result is None), False otherwise."""
    return result is None


def _represent_point_as_str(point):
    """Represent a point dictionary in the format (longitude,latitude)."""
    return '{lng},{lat}'.format(lat=point.latitude, lng=point.longitude)


@retry(retry_on_result=_retry_if_result_none, stop_max_attempt_number=10, wait_fixed=2000)
def _get_matrix_http(
        source_points, destination_points, api_url='', access_token='', max_matrix_size=None):
    """
    Retrieve a time matrix from the matrix API using HTTP requests.

    Results in the matrix are returned in seconds for time and meters for distances.
    Expects points as (latitude, longitude) named tuples to be consistent with other functions.
    """
    logger.debug('_get_matrix from {} to {} points'.format(
        source_points[0],
        len(destination_points)
    ))
    request_url = api_url + '{points}'
    all_points = source_points + destination_points
    if max_matrix_size and len(all_points) > max_matrix_size:
        raise RuntimeError(
            'This matrix API only accepts {} locations.'.format(max_matrix_size)
        )
    coordinates = ';'.join([_represent_point_as_str(point) for point in all_points])

    params = {
        'sources': ';'.join([str(i) for i, _ in enumerate(source_points)]),
        'destinations': ';'.join(
            [str(len(source_points) + i) for i, _ in enumerate(destination_points)]
        )
    }

    if access_token:
        params['access_token'] = access_token

    response = requests.get(
        url=request_url.format(points=coordinates),
        params=params
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as error:
        logger.error('Measure API request error - {}'.format(error))
        return None
    content = response.json()
    return content['durations']


# TODO - Abstract as APIMeasurer.
# TODO - Better handling of api_url and access_token.
# TODO - Explain the different behaviors of exit distances and early_exit_outer_radius.
# FIXME - Use smart url merge.
class APITime(Measurer):
    """Class for API driving time measurements."""

    def __init__(
            self, access_token='', api_url='',
            early_exit_outer_radius=200.0 * 10**3,
            *args, **kwargs):
        """Initialize the distance class with for an API measurer."""
        self.access_token = access_token
        self.api_url = api_url
        self._haversine_measurer = distance.HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius
        # Some APIs only accept a maximum number of entries per call.
        self.max_matrix_size = None

    def _get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix from the matrix API.

        Results in the matrix are returned in seconds for time and meters for distances.
        Expects points as (latitude, longitude) named tuples to be consistent with other functions.
        """
        raise NotImplementedError

    def _measure_one_to_many_points(self, origin, point_list):
        """
        Measure duration from one to mamy points using the matrix API.

        Result is a list of durations in seconds.
        """
        if self.max_matrix_size is None:
            measurements = self._get_matrix(
                source_points=[origin],
                destination_points=point_list)[0]
        else:
            measurements = []
            for batch in iterators.iterate_in_slices(
                iterable=iter(point_list),
                    batch_size=self.max_matrix_size - 1):
                measurements.extend(
                    self._get_matrix(
                        source_points=[origin],
                        destination_points=batch)[0]
                )

        if all(x is None for x in measurements):
            logger.warning('API only returned None data.')
        # To avoid errors if data is missing, we replace missing durations
        # with ABSURDLY_LARGE_TIME_IN_SECONDS.
        return [
            measurement if measurement is not None else ABSURDLY_LARGE_TIME_IN_MINUTES * 60
            for measurement in measurements
        ]

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
            logger.warning(
                'No relevant points. Returning min_haversine * time_to_distance_multiplier.'
            )
            return (
                min_haversine_distance / TIME_TO_DISTANCE_HOURS_TO_METERS * 60.0 * 2,
                point_list[min_haversine_idx]
            )

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


class OSRMDrivingTime(APITime):
    """
    Class for OSRM driving time measurements.

    Uses the `table` OSRM API endpoint.
    """

    def __init__(self, *args, **kwargs):
        """Initialize the distance class with the OSRM URL."""
        # FIXME: Once the API accepts distances, enable a `distance` mode.
        logger.debug('Initializing OSRM measurer.')
        super(OSRMDrivingTime, self).__init__(*args, **kwargs)
        osrm_url = kwargs.get('api_url', None) or os.getenv('OSRM_URL')
        self.api_url = '{base_url}/{api_string}'.format(
            base_url=osrm_url, api_string='table/v1/car/')

    def _get_matrix(self, source_points, destination_points):
        return _get_matrix_http(
            source_points=source_points,
            destination_points=destination_points,
            api_url=self.api_url
        )


class MapBoxDrivingTime(APITime):
    """Class for MapBox driving time measurements."""

    def __init__(self, *args, **kwargs):
        """Initialize the distance class with a MapBox API access token."""
        logger.debug('Initializing MapBox measurer.')
        super(MapBoxDrivingTime, self).__init__(*args, **kwargs)
        self.access_token = self.access_token or os.getenv('MAPBOX_TOKEN')
        self.api_url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/'
        # The MapBox API accepts 25 points max as input.
        self.max_matrix_size = 25

    @rate_limited(1, 1.0)  # 1 per second - period=1, every=1.0.
    def _get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix using the MapBox API.

        Time is expressed in seconds.
        NOTES:
         - MapBox API requires a list of lon,lat;lon,lat points.
         - The MapBox API accepts 25 points max as input.
        """
        return _get_matrix_http(
            source_points=source_points,
            destination_points=destination_points,
            api_url=self.api_url,
            access_token=self.access_token,
            max_matrix_size=self.max_matrix_size
        )


class MapBoxWalkingTime(APITime):
    """Class for MapBox walking time measurements."""
    def __init__(self, *args, **kwargs):
        """Initialize the distance class with a MapBox API access token."""
        logger.debug('Initializing MapBox measurer.')
        super(MapBoxWalkingTime, self).__init__(*args, **kwargs)
        self.access_token = self.access_token or os.getenv('MAPBOX_TOKEN')
        self.api_url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/'
        # The MapBox API accepts 25 points max as input.
        self.max_matrix_size = 25

    @rate_limited(1, 1.0)  # 1 per second - period=1, every=1.0.
    def _get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix using the MapBox API.

        Time is expressed in seconds.
        NOTES:
         - MapBox API requires a list of lon,lat;lon,lat points.
         - The MapBox API accepts 25 points max as input.
        """
        return _get_matrix_http(
            source_points=source_points,
            destination_points=destination_points,
            api_url=self.api_url,
            access_token=self.access_token,
            max_matrix_size=self.max_matrix_size
        )


class OpenRouteDrivingTime(APITime):
    """Class for OpenRouteService driving time measurements."""

    def __init__(self, *args, **kwargs):
        """Initialize the distance class with an Open Routing Service API key."""
        logger.debug('Initializing OpenRouting measurer.')
        super(OpenRouteDrivingTime, self).__init__(*args, **kwargs)
        self.access_token = self.access_token or os.getenv('ORS_TOKEN')
        self.client = openrouteservice.Client(key=self.access_token)

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
