"""Methods for geocoding with Geocodio or Open Street Map."""
import os

from geocodio import GeocodioClient
from geocodio.exceptions import (
    GeocodioAuthError, GeocodioDataError, GeocodioError, GeocodioServerError
)  # noqa: F401

import osmnx as ox

from retrying import retry


WAIT_FIXED_MILLISECONDS = 2000
STOP_MAX_ATTEMPT_NUMBER = 4


def _retry_on_geocodio_errors(exception):
    errors = [GeocodioAuthError, GeocodioDataError, GeocodioServerError, GeocodioError]
    return any(isinstance(exception, error) for error in errors)


class GeocodioCoder():
    """Geocodio geocoder class."""

    def __init__(self, api_key=os.environ.get('GEOCODIO_KEY', None)):
        """Initialize Geocodio geocoder class."""
        self.client = GeocodioClient(api_key)

    @staticmethod
    def _format_result(address, geocoding_result):
        """Format an address and geocoding result for use throughout the application."""
        return {
            'address': address,
            'latitude': geocoding_result.coords[0],
            'longitude': geocoding_result.coords[1],
        }

    def geocode(self, address):
        """Geocode a single point with geocodio."""
        result = self.client.geocode(address)
        return GeocodioCoder._format_result(address=address, geocoding_result=result)

    def geocode_batch(self, addresses):
        """
        Geocode a list of addresses with geocodio.

        Returns a list of dictionaries with address, latitude, and longitude.
        The results are returned in the same order as the original list.
        """
        try:
            results = self._safe_geocode(addresses)
            return [
                GeocodioCoder._format_result(
                    address=address,
                    geocoding_result=results.get(address)
                )
                for address in addresses
                if results.get(address) and results.get(address).coords
            ]
        except Exception as error:
            print(error.__class__, error, 'geocoding - switching to single geocoding.')
            return [self.geocode(address) for address in addresses]

    @retry(
        retry_on_exception=_retry_on_geocodio_errors,
        wait_fixed=WAIT_FIXED_MILLISECONDS,
        stop_max_attempt_number=STOP_MAX_ATTEMPT_NUMBER)
    def _safe_geocode(self, addresses):
        # TODO: Handle more than 10,000 addresses at once.
        return self.client.geocode(addresses)


class OxCoder():
    """Open Street Maps geocoder class."""

    def __init__(self, api_url=None, api_key=None):
        """Initialize the geocoder class."""
        self.api_url = api_url
        self.api_key = api_key

    def geocode(self, address):
        """Geocode a single address with OSM."""
        try:
            result = ox.geocode(address)
            return {
                'address': address,
                'latitude': result[0],
                'longitude': result[1],
            }
        except:
            return None


def get_geocoder(name):
    """Return an instantiated geocoder of the required class."""
    return GEOCODER_NAME_TO_FUNCTION_MAPPING[name.lower()]()


GEOCODER_NAME_TO_FUNCTION_MAPPING = {
    'geocodio': GeocodioCoder,
    'oxcoder': OxCoder
}
