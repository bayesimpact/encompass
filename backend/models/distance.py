"""All methods for measuring distance between two series of points."""
from cHaversine import haversine


ONE_METER_IN_MILES = 0.0006213711922373339


class MeasureDistance():
    """Generic class for measuring distance."""

    def __init__(self, api_url=None, api_key=None):
        """
        Class for measuring distances, possibly using an API.

        This is an interface to be extended by other specific classes.
        """
        self.api_url = api_url
        self.api_key = api_key

    def get_distance_in_miles(self, point_a, point_b):
        """
        Get distance between two points.

        Expects points as dicts with latitude and longitude.
        """
        raise NotImplementedError('Distance type must be specified.')

    def closest(self, origin, point_list):
        """Find closest point in a list of points and returns min_distance, min_point."""
        min_point = min(
            point_list,
            key=lambda p: self.get_distance_in_miles(origin, p)
        )
        min_distance = self.get_distance_in_miles(origin, min_point)
        return min_distance, min_point

    def closest_with_early_exit(self, origin, point_list, exit_distance):
        """
        Find closest point in a list of points, exiting early if min_distance is reached.

        Returns min_distance, min_point.
        """
        min_distance = float('inf')
        min_point = None
        for point in point_list:
            distance = self.get_distance_in_miles(origin, point)
            if distance < min_distance:
                min_distance = distance
                min_point = point
                if min_distance <= exit_distance:
                    break
        return min_distance, min_point


class HaversineDistance(MeasureDistance):
    """Class for haversine distance measurements."""

    def get_distance_in_miles(self, point_a, point_b):
        """Get haversine distance between two points."""
        # cHaversine expects points to be given as (latitude, longitude) pairs.
        if point_a and point_b:
            return haversine(
                (point_a['latitude'], point_a['longitude']),
                (point_b['latitude'], point_b['longitude'])
            ) * ONE_METER_IN_MILES
        return


def get_measure(name):
    """Return an instantiated measure class with the given name."""
    return MEASURE_NAME_TO_FUNCTION_MAPPING[name.lower()]()


MEASURE_NAME_TO_FUNCTION_MAPPING = {
    'haversine': HaversineDistance
}
