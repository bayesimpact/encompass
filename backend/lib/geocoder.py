"""Methods for geocoding with Geocodio or Open Street Map."""
import logging
import multiprocessing.dummy
import os

from geocodio import GeocodioClient
from geocodio.exceptions import (
    GeocodioAuthError, GeocodioDataError, GeocodioError, GeocodioServerError
)  # noqa: F401

import osmnx as ox


WAIT_FIXED_MILLISECONDS = 2000
STOP_MAX_ATTEMPT_NUMBER = 4
MAX_THREADS = 32

logger = logging.getLogger(__name__)


class GeocodioCoder():
    """Geocodio geocoder class."""

    def __init__(self, api_key=os.environ.get('GEOCODIO_KEY')):
        """Initialize Geocodio geocoder class."""
        self.client = GeocodioClient(api_key)

    @staticmethod
    def _format_result(address, geocoding_result):
        """Format an address and geocoding result for use throughout the application."""
        try:
            return {
                'address': address,
                'latitude': geocoding_result['results'][0]['location']['lat'],
                'longitude': geocoding_result['results'][0]['location']['lng'],
            }
        except (IndexError, KeyError):
            pass

        try:
            return {
                'address': address,
                'latitude': geocoding_result.coords[0],
                'longitude': geocoding_result.coords[1],
            }
        except Exception as error:
            logger.warning(error)
            logger.warning(geocoding_result)
            return None

    def geocode(self, address):
        """Geocode a single point with Geocodio."""
        result = self._safe_geocode(address)
        if result:
            return GeocodioCoder._format_result(address=address, geocoding_result=result)
        return None

    def geocode_batch(self, addresses):
        """
        Geocode a list of addresses with Geocodio.

        Returns a list of dictionaries with address, latitude, and longitude.
        The results are returned in the same order as the original list.
        """
        try:
            results = self._safe_geocode(addresses)
        except GeocodioError as error:
            logger.error(error.__class__.__name__ + ' - ' + str(error))
            results = []

        if len(addresses) == 0:
            return []

        if results:
            geocoded_addresses = [
                GeocodioCoder._format_result(
                    address=address,
                    geocoding_result=results.get(address)
                )
                for address in addresses
                if results.get(address) and results.get(address).coords
            ]
        else:
            logger.warning('Error in batch geocoding - switching to single geocoding.')
            with multiprocessing.dummy.Pool(processes=MAX_THREADS) as executor:
                geocoded_addresses = executor.map(self.geocode, addresses)

        return [
            geocoded_address for geocoded_address
            in geocoded_addresses if geocoded_address
        ]

    def _safe_geocode(self, addresses):
        if isinstance(addresses, (list, set)):
            if len(addresses) > 1000:
                raise GeocodioError('Too many addresses. Switch to single geocoding.')
            try:
                return self.client.geocode(list(addresses))
            except GeocodioError as error:
                    logger.info('Error {} - in geocoding batch.'.format(
                        error.__class__.__name__)
                    )
        else:
            try:
                return self.client.geocode(addresses)
            except (GeocodioAuthError, GeocodioDataError, GeocodioServerError) as error:
                logger.debug('Error {} - in geocoding address {}.'.format(
                    error.__class__.__name__, addresses)
                )
        return None


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
        # Note - Ox raises general exceptions Exception.
        except Exception as error:
            logger.error(error.__class__.__name__ + ' - ' + str(error))
            return None

    def geocode_batch(self, addresses):
        """
        Geocode a list of addresses with geocodio.

        Returns a list of dictionaries with address, latitude, and longitude.
        The results are returned in the same order as the original list.
        """
        with multiprocessing.dummy.Pool(processes=MAX_THREADS) as executor:
            geocoded_addresses = executor.map(self.geocode, addresses)

        return [
            geocoded_address for geocoded_address
            in geocoded_addresses if geocoded_address
        ]


def get_geocoder(name):
    """Return an instantiated geocoder of the required class."""
    return GEOCODER_NAME_TO_FUNCTION_MAPPING[name.lower()]()


GEOCODER_NAME_TO_FUNCTION_MAPPING = {
    'geocodio': GeocodioCoder,
    'oxcoder': OxCoder
}
