"""All methods for measuring distance between two series of points."""
import operator
import os
import requests

from cHaversine import haversine

from retrying import retry


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

    def get_distance_in_meters(self, point_a, point_b):
        """
        Get distance between two points.

        Expects points as dicts with latitude and longitude.
        """
        raise NotImplementedError('Distance type must be specified.')

    def closest(self, origin, point_list):
        """Find closest point in a list of points and returns min_distance, min_point."""
        min_point = min(
            point_list,
            key=lambda p: self.get_distance_in_meters(origin, p)
        )
        min_distance = self.get_distance_in_meters(origin, min_point)
        return min_distance, min_point

    def closest_with_early_exit(self, origin, point_list, exit_distance):
        """
        Find closest point in a list of points, exiting early if exit_distance is reached.

        Returns min_distance, min_point.
        """
        min_distance = float('inf')
        min_point = None
        for point in point_list:
            distance = self.get_distance_in_meters(origin, point)
            if distance < min_distance:
                min_distance = distance
                min_point = point
                if min_distance <= exit_distance:
                    break
        return min_distance, min_point


class HaversineDistance(MeasureDistance):
    """Class for haversine distance measurements."""

    def get_distance_in_meters(self, point_a, point_b):
        """Get haversine distance between two points."""
        # cHaversine expects points to be given as (latitude, longitude) pairs.
        if point_a and point_b:
            return haversine(
                (point_a['latitude'], point_a['longitude']),
                (point_b['latitude'], point_b['longitude'])
            )
        return


class OSRMDrivingDistance(MeasureDistance):
    """
    Class for OSRM driving distance measurements.

    Uses the `table` OSRM API endpoint.
    """

    def __init__(self, api_url=None, early_exit_outer_radius=50.0 * 10**3):
        """Initialize the distance class with the OSRM URL."""
        self.api_url = api_url or os.getenv('OSRM_URL')
        self._haversine_measurer = HaversineDistance()
        self.early_exit_outer_radius = early_exit_outer_radius

    @staticmethod
    def _represent_point_as_str(point):
        """Represent a point dictionary in the format (longitude,latitude)."""
        return '{lng},{lat}'.format(lat=point['latitude'], lng=point['longitude'])

    @retry(retry_on_result=_retry_if_result_none, stop_max_attempt_number=10, wait_fixed=2000)
    def get_distance_in_meters(self, point_a, point_b):
        """Use an OSRM server to compute the distance and time between two points."""
        min_distance, min_point = self.closest(origin=point_a, point_list=[point_b])
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

        # TODO: Add retrying for common HTTP errors.
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
        # TODO: Determine the origin of these magic numbers to convert seconds to miles.
        return min_distance * 104607.0 / 3600, point_list[min_idx]

    def closest_with_early_exit(self, origin, point_list, exit_distance):
        """
        Find closest point in a list of points, exiting early if exit_distance is reached.

        The exit_distance uses haversine distance.
        """
        haversine_distances = [
            self._haversine_measurer.get_distance_in_meters(origin, point)
            for point in point_list
        ]
        min_haversine_idx, min_haversine_distance = min(
            enumerate(haversine_distances),
            key=operator.itemgetter(1)
        )

        if min_haversine_distance <= exit_distance:
            return min_haversine_distance, point_list[min_haversine_idx]
        else:
            relevant_points = [
                point_list[idx]
                for idx, distance in enumerate(haversine_distances)
                if distance < min(self.early_exit_outer_radius, 1.5 * min_haversine_distance)
            ]
            if not relevant_points:
                return 10**42, point_list[0]
            else:
                return self.closest(origin=origin, point_list=relevant_points)


def get_measure(name):
    """Return an instantiated measure class with the given name."""
    return MEASURE_NAME_TO_FUNCTION_MAPPING[name.lower()]()


MEASURE_NAME_TO_FUNCTION_MAPPING = {
    'haversine': HaversineDistance,
    'osrm': OSRMDrivingDistance
}
