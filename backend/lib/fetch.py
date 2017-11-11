"""Fetch data from database."""
from backend.lib import geocoder
from backend.lib.database.postgres import connect, methods
from backend.lib.database.tables import address, provider, representative_point, service_area
from backend.lib.timer import timed
from backend.models import distance

from sqlalchemy.orm import sessionmaker

# TODO - Use config or environment variable.
# Consider
GEOCODING = False
MEASURER = distance.get_measure('haversine')


def fetch_representative_points(
    service_areas,
    format_response=True,
    engine=connect.create_db_engine()
):
    """Fetch representative points for a list of service areas."""
    if not service_areas:
        return []

    id_list = '(' + ', '.join(["'%s'" % _id for _id in service_areas]) + ')'
    select_query = 'SELECT * FROM {table_name} WHERE service_area_id in {id_list};'.format(
        table_name=representative_point.RepresentativePoint.__tablename__,
        id_list=id_list)
    representative_points = engine.execute(select_query)
    return [
        representative_point.row_to_dict(point, format_response) for point in representative_points
    ]


def fetch_all_service_areas(engine=connect.create_db_engine()):
    """
    Fetch all available service areas from the database.

    Returns a dictionary containing service_area_id, county, and zip_code.
    """
    session = sessionmaker(bind=engine)()
    return session.query(
        service_area.ServiceArea.service_area_id,
        service_area.ServiceArea.county,
        service_area.ServiceArea.zip_code
    ).all()


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


def _return_geocoded_address(engine, local_geocoder, raw_address):
    print('Geocoing address {}.'.format(raw_address))
    geocoded_address = local_geocoder.geocode(raw_address)
    print('Inserting {}'.format(geocoded_address))
    address_id = methods.core_insert(
        engine,
        sql_class=address.Address,
        data=[geocoded_address],
        return_insert_ids=True
    )[0]
    geocoded_address['id'] = address_id
    return geocoded_address


def _format_provider_response(geocoded_address=None, provider_id=0):
    if not geocoded_address:
        return {
            'status': 'error',
            'message': 'Failed to geocode address for this provider.'
        }
    return {
        'status': 'success',
        'id': provider_id,
        'lat': geocoded_address['latitude'],
        'lng': geocoded_address['longitude']
    }


def _fetch_provider_from_address(addresses, session):
    results = session.query(
        provider.Provider, address.Address
    ).filter(
        provider.Provider.address_id == address.Address.id
    ).filter(
        address.Address.address.in_(addresses)
    ).all()
    if results:
        return [
            {
                'id': result.Provider.id,
                'address': result.Address.address,
                'latitude': result.Address.latitude,
                'longitude': result.Address.longitude
            } for result in results
        ]
    return []


@timed
def fetch_providers(providers, geocoder_name='geocodio', engine=connect.create_db_engine()):
    """
    Fetch providers location and IDs from a list of provider inputs.

    Provider inputs must contain (address, npi)
    and can contain other information (e.g., languages, specialty)
    """
    if not providers:
        return []

    engine = connect.create_db_engine()
    session = sessionmaker(bind=engine)()

    provider_responses = []

    provider_addresses = {provider['address'] for provider in providers}
    print('Searching {} addresses for {} providers.'.format(
        len(provider_addresses), len(providers))
    )

    existing_addresses = {
        result.address: {
            'id': result.id,
            'latitude': result.latitude,
            'longitude': result.longitude
        } for result in _fetch_addresses_from_db(provider_addresses, session)
    }

    print('Found {} addresses in DB out of {}.'.format(
        len(existing_addresses), len(provider_addresses))
    )

    addresses_to_geocode = provider_addresses.difference(existing_addresses)
    print('{} addresses to geocode.'.format(len(addresses_to_geocode)))

    if len(addresses_to_geocode) > 0 and GEOCODING:
        local_geocoder = geocoder.get_geocoder(geocoder_name)()
        print('Geocoding...')
        try:
            geocoded_address = local_geocoder.geocode_batch(addresses_to_geocode)
            # Add new addresses to DB
            methods.core_insert(
                engine=engine,
                sql_class=address.Address,
                data=geocoded_address,
                return_insert_ids=False
            )
            existing_addresses.update({
                result.address: {
                    'id': result.id,
                    'latitude': result.latitude,
                    'longitude': result.longitude
                } for result in _fetch_addresses_from_db(addresses_to_geocode, session)
            })
        except geocoder.GeocodioAuthError as error:
            print(error)
            geocoded_address = []

    for i, raw_provider in enumerate(providers):
        if i % 100 == 0:
            print('Processsing {} out of {}'.format(i, len(providers)))
        try:
            # TODO - Fuzzy matching.
            # Retrieve lat, lng from DB.
            # Popping address to avoid confusion by Postgres between address and address_id.
            raw_address = raw_provider.pop('address')
            if raw_address in existing_addresses:
                geocoded_address = existing_addresses[raw_address]
                provider_responses.append(
                    _format_provider_response(
                        provider_id=geocoded_address['id'],
                        geocoded_address=geocoded_address
                    )
                )
            else:
                provider_responses.append(
                    _format_provider_response(geocoded_address=None)
                )
        # TODO: Have each Geocoder class raise the same errors.
        except (
            geocoder.GeocodioAuthError,
            geocoder.GeocodioDataError,
            NotImplementedError
        ) as error:
            print(error)
            provider_responses.append(_format_provider_response(geocoded_address=None))

    session.close()
    return provider_responses


def _find_closest_provider(point, providers):
    """Find closest provider from to a representative point."""
    closest_provider = MEASURER.closest(
        origin=point,
        point_list=providers
    )
    provider_distance = MEASURER.get_distance_in_miles(point, closest_provider)
    provider_time = provider_distance * 2
    return {
        'id': point['id'],
        'closest_provider_by_distance': closest_provider['id'],
        'closest_provider_by_time': closest_provider['id'],
        'time_to_closest_provider': provider_distance,
        'distance_to_closest_provider': provider_time
    }


def _fetch_address_from_ids(address_ids, engine):
    session = sessionmaker(bind=engine)()
    results = session.query(
        address.Address
    ).filter(
        address.Address.id.in_(address_ids)
    ).all()
    if results:
        return [
            {
                'id': result.id,
                'latitude': result.latitude,
                'longitude': result.longitude
            } for result in results
        ]
    return []


@timed
def fetch_adeqacies(service_area_ids, provider_ids, engine=connect.create_db_engine()):
    """Calculate adequacies."""
    representative_points = fetch_representative_points(service_area_ids, format_response=False)
    providers = _fetch_address_from_ids(
        address_ids=provider_ids, engine=engine
    )
    print('Calculating adequacies for {} provider addresses and {} representative points.'.format(
        len(providers), len(representative_points))
    )
    # TODO - Split analyis by specialty.
    adequacies_response = [
        _find_closest_provider(point, providers)
        for point in representative_points
    ]
    print('Returning adequacy results.')
    return adequacies_response
