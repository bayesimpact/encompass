"""All methods for measuring distance between two series of points."""
import operator
import os
import requests

from cHaversine import haversine

from retrying import retry

# TODO: Determine the origin of these magic numbers to convert hours to meters.
TIME_TO_DISTANCE = 104607.0  # Magic number in m/h


def _retry_if_result_none(result):
    """Return True if we should retry (in this case when result is None), False otherwise."""
    return result is None


class MeasureDistance():
    """Generic class for measuring distance."""

    def __init__(self, api_url=None, api_key=None):
        """
        Class for measuring distances, possibly using an API.

        This is an interface to be extended by other specific classes.
        """
        self.api_url = api_url
        self.api_key = api_key

    def measure_between_two_points(self, point_a, point_b):
        """
        Get distance or time measure between two points.

        Expects points as (latitude, longitude) tuples.
        """
        raise NotImplementedError('Distance type must be specified.')

    def closest(self, origin, point_list):
        """Find closest point in a list of points and returns min_distance, min_point."""
        min_point = min(
            point_list,
            key=lambda p: self.measure_between_two_points(origin, p)
        )
        min_distance = self.measure_between_two_points(origin, min_point)
        return min_distance, min_point

    def closest_with_early_exit(self, origin, point_list, exit_distance):
        """
        Find closest point in a list of points, exiting early if exit_distance is reached.

        Returns min_distance, min_point.
        """
        min_distance = float('inf')
        min_point = None
        for point in point_list:
            distance = self.measure_between_two_points(origin, point)
            if distance < min_distance:
                min_distance = distance
                min_point = point
                if min_distance <= exit_distance:
                    break
        return min_distance, min_point


class HaversineDistance(MeasureDistance):
    """Class for haversine distance measurements."""

    def measure_between_two_points(self, point_a, point_b):
        """
        Get haversine distance between two points.

        Expects points as (latitude, longitude) tuples.
        """
        # cHaversine expects points to be given as (latitude, longitude) pairs.
        if point_a and point_b:
            return haversine(tuple(point_a), tuple(point_b))
        return


class OSRMDriving(MeasureDistance):
    """
    Class for OSRM driving distance measurements.

    Uses the `table` OSRM API endpoint.
    """

    def __init__(self, mode='time', api_url=None, early_exit_outer_radius=50.0 * 10**3):
        """Initialize the distance class with the OSRM URL."""
        self.mode = mode
        self.api_url = api_url or os.getenv('OSRM_URL')
        self._haversine_measurer = HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius

    @staticmethod
    def _represent_point_as_str(point):
        """Represent a point dictionary in the format (longitude,latitude)."""
        return '{lng},{lat}'.format(lat=point.latitude, lng=point.longitude)

    @retry(retry_on_result=_retry_if_result_none, stop_max_attempt_number=10, wait_fixed=2000)
    def measure_between_two_points(self, point_a, point_b):
        """
        Use an OSRM server to compute the distance or time between two points.

        If mode is time, unit is minute. Else, unit is meter.
        Expects points as (latitude, longitude) tuples.
        """
        min_distance, _ = self.closest(origin=point_a, point_list=[point_b])
        return min_distance

    @retry(retry_on_result=_retry_if_result_none, stop_max_attempt_number=10, wait_fixed=2000)
    def closest(self, origin, point_list):
        """Find closest point in a list of points and returns min_distance, min_point."""
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
            distance_responses = content['durations'][0][1:]
        else:
            return None

        min_idx, min_distance = min(
            enumerate(distance_responses),
            key=operator.itemgetter(1)
        )
        if self.mode == 'time':
            return min_distance / 60.0, point_list[min_idx]
        return min_distance * TIME_TO_DISTANCE / 3600, point_list[min_idx]

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
            if self.mode == 'time':
                return (
                    min_haversine_distance / TIME_TO_DISTANCE * 60.0, point_list[min_haversine_idx]
                )
            return min_haversine_distance, point_list[min_haversine_idx]

        relevant_points = [
            point_list[idx]
            for idx, distance in enumerate(haversine_distances)
            if distance < min(self.early_exit_outer_radius, 1.5 * min_haversine_distance)
        ]

        if not relevant_points:
            return 10**42, point_list[0]

        return self.closest(origin=origin, point_list=relevant_points)


class MapBoxDrivingTime(MeasureDistance):
    """Class for MapBox driving time measurements."""

    def measure_between_two_points(self, point_a, point_b):
        """
        Get MapBox driving time between two points.

        Expects points as (latitude, longitude) tuples.
        """
        if point_a and point_b:
            return haversine(tuple(point_a), tuple(point_b))
        return

    def get_matrix(self, source_points, destination_points):
        """
        Retrieve a time matrix from the distance API.

        Results in the matrix are returned in seconds.
        Expects points as (latitude, longitude) tuples to be consistent with other functions.
        NOTE - MapBox API requires a list of lon,lat;lon,lat points.
        """
        request_url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{points}'
        all_points = source_points + destination_points
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


def get_measurer(name):
    """Return an instantiated measurer class with the given name."""
    return MEASURER_NAME_TO_FUNCTION_MAPPING[name.lower()]()


MEASURER_NAME_TO_FUNCTION_MAPPING = {
    'haversine': HaversineDistance,
    'osrm': OSRMDriving,
    'mapbox': MapBoxDrivingTime
}
