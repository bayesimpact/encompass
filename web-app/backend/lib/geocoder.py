"""Methods for geocoding with Geocodio."""
from geocodio import GeocodioClient
import os


class GeocodioCoder():
    """Geocodio geocoder class."""

    def __init__(self, api_key=os.environ['GEOCODIO_KEY']):
        """Initialize Geocodio geocoder class."""
        self.client = GeocodioClient(api_key)

    def geocode(self, address):
        """Geocode a single point with geocodio."""
        result = self.client.geocode(address)
        return {
            'address': address,
            'latitude': result.coords[0],
            'longitude': result.coords[1]
        }

    def geocode_batch(self, addresses):
        """
        Geocode a list of addressed with geocodio.

        Returns a list of tuples with addresses, and coordinates in the format:
        [(address, (long, lat)), ...]
        """
        results = self.client.geocode(addresses)
        return [{
            'address': address,
            'latitude': results.get(address).coords[0],
            'longitude': results.get(address).coords[1]
        } for address in addresses]
