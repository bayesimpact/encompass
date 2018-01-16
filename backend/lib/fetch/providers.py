"""Fetch data from database."""
import logging

from backend.config import config
from backend.lib import geocoder
from backend.lib.database.postgres import connect, methods, postgis
from backend.lib.database.tables import address
from backend.lib.timer import timed

from sqlalchemy.orm import sessionmaker

# Use values from configuration if they exist.
GEOCODING = config.get('geocoding')
GEOCODER = config.get('geocoder')


logger = logging.getLogger(__name__)


def _fetch_addresses_from_db(raw_addresses, session):
    """
    Fetch addresses from DB.

    Given a list of addresses, look through the database and return
    the corresponding list of rows.
    """
    results = session.query(
        address.Address.id,
        address.Address.address,
        address.Address.latitude,
        address.Address.longitude
    ).filter(
        address.Address.address.in_(raw_addresses)
    ).all()
    return results


def _format_provider_response(geocoded_address=None):
    if not geocoded_address:
        return {
            'status': 'error',
            'message': 'Failed to geocode address for this provider.'
        }
    return {
        'status': 'success',
        'lat': geocoded_address['latitude'],
        'lng': geocoded_address['longitude']
    }


def _geocode_addresses(addresses, geocoder_name, engine, add_to_db=True):
    """Geocode addresses and add to database."""
    local_geocoder = geocoder.get_geocoder(geocoder_name)
    geocoded_addresses = local_geocoder.geocode_batch(addresses)
    for geocoded_address in geocoded_addresses:
        geocoded_address['location'] = postgis.to_point(
            longitude=geocoded_address['longitude'],
            latitude=geocoded_address['latitude']
        )
    if geocoded_addresses and add_to_db:
        # Add new addresses to DB.
        # TODO: Add addresses to DB as they are geocoded to make ingestion more robust.
        methods.core_insert(
            engine=engine,
            sql_class=address.Address,
            data=geocoded_addresses,
            return_insert_ids=False
        )
    return geocoded_addresses


@timed
def geocode_providers(providers, geocoder_name=GEOCODER, engine=connect.create_db_engine()):
    """
    Fetch providers location and IDs from a list of provider inputs.

    Provider inputs must contain (address, npi)
    and can contain other information (e.g., languages, specialty)
    """
    if not providers:
        return []

    session = sessionmaker(bind=engine)()

    provider_responses = []

    provider_addresses = {provider['address'] for provider in providers}
    logger.debug('Searching {} addresses for {} providers.'.format(
        len(provider_addresses), len(providers))
    )

    if config.get('address_database'):
        existing_addresses = {
            result.address: {
                'latitude': result.latitude,
                'longitude': result.longitude
            } for result in _fetch_addresses_from_db(provider_addresses, session)
        }
        logger.debug('Found {} addresses in DB out of {}.'.format(
            len(existing_addresses), len(provider_addresses))
        )
    else:
        logger.debug('Address database deactivated.')
        existing_addresses = {}

    addresses_to_geocode = provider_addresses.difference(existing_addresses)
    if len(addresses_to_geocode) > 0 and GEOCODING:
        logger.debug('{} addresses to geocode.'.format(len(addresses_to_geocode)))
        logger.debug('Geocoding...')
        geocoded_addresses = _geocode_addresses(
            addresses=addresses_to_geocode,
            geocoder_name=geocoder_name,
            engine=engine,
            add_to_db=config.get('address_database'))
        logger.debug('{} addresses geocoded.'.format(len(geocoded_addresses)))
        if geocoded_addresses:
            existing_addresses.update({
                result.address: {
                    'latitude': result.latitude,
                    'longitude': result.longitude
                } for result in _fetch_addresses_from_db(addresses_to_geocode, session)
            })
    elif len(addresses_to_geocode) == 0:
        logger.debug('No addresses to geocode.')
    elif not GEOCODING:
        logger.debug('Warning - Geocoding is not active. Processing without missing addresses.')

    for i, raw_provider in enumerate(providers):
        if i % 10000 == 0:
            logger.debug('Processsed {} out of {}...'.format(i, len(providers)))

        # TODO - Fuzzy matching.
        # Retrieve lat, lng from DB.
        # Popping address to avoid confusion by Postgres between address and address_id.
        raw_address = raw_provider.pop('address')
        if raw_address in existing_addresses:
            geocoded_address = existing_addresses[raw_address]
            provider_responses.append(
                _format_provider_response(
                    geocoded_address=geocoded_address
                )
            )
        else:
            provider_responses.append(
                _format_provider_response(geocoded_address=None)
            )

    logger.debug('Processing done for {} providers.'.format(len(providers)))

    session.close()
    return provider_responses
