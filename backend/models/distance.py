"""All methods for measuring distance between two series of points."""
import geopy.distance


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
        """Get distance between two points."""
        raise NotImplementedError('Distance type must be specified.')


class HaversineDistance(MeasureDistance):
    """Class for haversine distance measurements."""

    def get_distance_in_miles(self, point_a, point_b):
        """Get haversine distance between two points."""
        if point_a and point_b:
            return(haversine_distance(point_a, point_b))
        return


def haversine_distance(origin, destination):
    """Haversine distance between origin and destination."""
    # GeoPy expects points to be given as (latitude, longitude) pairs.
    return geopy.distance.great_circle(
        (origin.y, origin.x),
        (destination.y, destination.x)
    ).miles
