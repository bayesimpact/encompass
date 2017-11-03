"""All methods for measuring distance between two series of points."""
import math

from backend.models.time_distance_model import _meters_to_miles


class MeasureDistance():
    """Generic class for measuring distance."""

    def __init__(self, api_url=None, api_key=None):
        """Initialize the measure distance class."""
        self.api_url = api_url
        self.api_key = api_key

    def get_distance_in_miles(self, point_a, point_b):
        """Get distance between two points."""
        raise NotImplementedError('get_isocrone is a required method.')


class HaversineDistance(MeasureDistance):
    """Class for haversine distance measurements."""

    def get_distance_in_miles(self, point_a, point_b):
        """Get hoversine distance between two points."""
        if point_a and point_b:
            return(haversine_distance(point_a, point_b))
        return


def haversine_distance(origin, destination):
    """Haversine distance between origin and destination."""
    lat1, lon1 = origin.y, origin.x
    lat2, lon2 = destination.y, destination.x
    radius = 6371  # km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon / 2) * math.sin(dlon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = radius * c

    return _meters_to_miles(d * 1000)
