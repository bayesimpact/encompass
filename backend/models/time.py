"""Classes for measuring times between points."""
import operator
import os
import requests
import logging

from backend.lib.utils import iterators
from backend.models import distance
from backend.models.base import Measurer

from ratelimit import rate_limited

from retrying import retry

logger = logging.getLogger(__name__)

# TODO: Determine a more intelligent way for converting distance to time.
TIME_TO_DISTANCE_HOURS_TO_METERS = 104607.0  # 65 miles per hour in meters per hour.


def _retry_if_result_none(result):
    """Return True if we should retry (in this case when result is None), False otherwise."""
    return result is None


class OSRMDrivingTime(Measurer):
    """
    Class for OSRM driving time measurements.

    Uses the `table` OSRM API endpoint.
    """

    def __init__(self, api_url=None, early_exit_outer_radius=120.0 * 10**3):
        """Initialize the distance class with the OSRM URL."""
        # FIXME: Once the API accepts distances, enable a `distance` mode.
        logger.debug('Initializing OSRM measurer.')
        self.api_url = api_url or os.getenv('OSRM_URL')
        self._haversine_measurer = distance.HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius

    @staticmethod
    def _represent_point_as_str(point):
        """Represent a point dictionary in the format (longitude,latitude)."""
        return '{lng},{lat}'.format(lat=point.latitude, lng=point.longitude)

    @retry(retry_on_result=_retry_if_result_none, stop_max_attempt_number=10, wait_fixed=2000)
    def measure_between_two_points(self, point_a, point_b):
        """
        Use an OSRM server to compute the time between two points in minutes.

        Expects points as (latitude, longitude) tuples.
        """
        min_time, _ = self.closest(origin=point_a, point_list=[point_b])
        return min_time

    @retry(retry_on_result=_retry_if_result_none, stop_max_attempt_number=10, wait_fixed=2000)
    def closest(self, origin, point_list):
        """
        Find closest point in a list of points and returns min_time, min_point.

        min_time is measured in minutes.
        """
        origin_str = self._represent_point_as_str(origin)
        coordinates = ';'.join(
            [origin_str] + [self._represent_point_as_str(point) for point in point_list]
        )

        url = '{base_url}/{api_string}'.format(
            base_url=self.api_url,
            api_string='table/v1/car/{coords}'.format(coords=coordinates)
        )

        params = {'sources': 0}
        response = requests.get(url, params=params)

        # TODO - Add retrying for common HTTP errors.
        response.raise_for_status()
        content = response.json()

        if content['code'] == 'Ok' and content['durations']:
            time_responses = content['durations'][0][1:]
        else:
            return None

        min_idx, min_time_in_seconds = min(
            enumerate(time_responses),
            key=operator.itemgetter(1)
        )
        return min_time_in_seconds / 60.0, point_list[min_idx]

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
            return 10**42, point_list[0]

        return self.closest(origin=origin, point_list=relevant_points)


class MapBoxDrivingTime(Measurer):
    """Class for MapBox driving time measurements."""

    def __init__(self, api_key=None, early_exit_outer_radius=120.0 * 10**3):
        """Initialize the distance class with a MapBox API key."""
        self.api_key = api_key or os.getenv('MAPBOX_TOKEN')
        self._haversine_measurer = distance.HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius

    @rate_limited(1, 1.0)  # 1 per second - period=1, every=1.0.
    @retry(wait_fixed=500, stop_max_attempt_number=2)
    def get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix from the matrix API.

        Results in the matrix are returned in seconds.

        Expects points as (latitude, longitude) tuples to be consistent with other functions.

        NOTES:
         - MapBox API requires a list of lon,lat;lon,lat points.
         - The matrix API accepts 25 points max as input.
        """
        logger.debug('get_matrix from {} to {} points'.format(
            source_points[0],
            len(destination_points)
        ))
        request_url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{points}'
        all_points = source_points + destination_points
        if len(all_points) > 25:
            raise RuntimeError('Mapbox matrix API only accepts 25 locations.')
        points = ';'.join([
            '{longitude},{latitude}'.format(longitude=point[1], latitude=point[0])
            for point in all_points
        ])

        params = {
            'sources': ';'.join([str(i) for i, _ in enumerate(source_points)]),
            'destinations': ';'.join(
                [str(len(source_points) + i) for i, _ in enumerate(destination_points)]
            ),
            'access_token': self.api_key
        }

        response = requests.get(
            url=request_url.format(points=points),
            params=params
        )

        response.raise_for_status()
        content = response.json()
        return content['durations']

    def measure_one_to_many_points(self, origin, point_list):
        """
        Measure duration from one to mamy points using the matrix API.

        Result is a list of duration in  minutes.
        """
        measurements = []

        for batch in iterators.iterate_in_slices(
            iterable=iter(point_list),
                batch_size=24):
            measurements.extend(
                self.get_matrix(
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
            return 10**42, point_list[0]

        return self.closest(origin=origin, point_list=relevant_points)

    def closest(self, origin, point_list):
        """
        Find closest point in a list of points and returns min_measurement, min_point.

        min_measurement is returned in minutes.
        """
        distance_responses = self.measure_one_to_many_points(origin=origin, point_list=point_list)

        min_idx, min_measurement = min(
            enumerate(distance_responses),
            key=operator.itemgetter(1)
        )
        return min_measurement / 60.0, point_list[min_idx]
