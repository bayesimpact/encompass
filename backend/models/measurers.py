"""Methods to measure distance or time between geographic coordinates."""
from backend.models import distance
from backend.models import time


def get_measurer(name, **kwargs):
    """Return an instantiated measurer class with the given name."""
    return MEASURER_NAME_TO_CLASS_MAPPING[name.lower()](**kwargs)


MEASURER_NAME_TO_CLASS_MAPPING = {
    'haversine': distance.HaversineDistance,
    'open_route_service_driving': time.OpenRouteDrivingTime,
    'osrm': time.OSRMDrivingTime,
    'mapbox': time.MapBoxDrivingTime,
    'walking': time.MapBoxWalkingTime
}
