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
        """Find closest point in a list of points."""
        return min(
            point_list,
            key=lambda p: self.get_distance_in_miles(origin, p)
        )


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
