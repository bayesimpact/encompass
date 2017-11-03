"""Methods to geocode a given address."""
import osmnx as ox

from shapely import geometry


class Geocoder():
    """Geocoder class."""

    def __init__(self, api_url=None, api_key=None):
        """Initialize the goecoder class."""
        self.api_url = api_url
        self.api_key = api_key

    def geocode(self, address):
        """Geocode method. To be replaced for different API services."""
        try:
            return geometry.Point((ox.geocode(address)[1], ox.geocode(address)[0]))
        except:
            return
