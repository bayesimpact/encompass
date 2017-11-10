"""Fetch data from database."""
from backend.lib import geocoder
from backend.lib.database.postgres import connect, methods
from backend.lib.database.tables import address, provider, representative_point, service_area

from sqlalchemy.orm import sessionmaker

# TODO - Use config or environment variable.
# Consider
GEOCODING = False


def fetch_representative_points(service_areas, engine=connect.create_db_engine()):
    """Fetch representative points for a list of service areas."""
    if not service_areas:
        return []

    id_list = '(' + ', '.join(["'%s'" % _id for _id in service_areas]) + ')'
    select_query = 'SELECT * FROM {table_name} WHERE service_area_id in {id_list};'.format(
        table_name=representative_point.RepresentativePoint.__tablename__,
        id_list=id_list)
    representative_points = engine.execute(select_query)
    return [representative_point.row_to_dict(point) for point in representative_points]


def _fetch_address_from_db(raw_address, session):
    """
    Fetch address from DB.

    Given an address string, look through the database and return
    the corresponding row as a dict.
    """
    # TODO - Geocode missing addresses.
    result = session.query(
        address.Address.id,
        address.Address.latitude,
        address.Address.longitude
    ).filter(
        address.Address.address == raw_address
    ).first()
    return result


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


def _return_geocoded_address(engine, geocodiocoder, raw_address):
    if geocodiocoder:
        print('Geocoing address {}.'.format(raw_address))
        geocoded_address = geocodiocoder.geocode(raw_address)
        print('Inserting {}'.format(geocoded_address))
        address_id = methods.core_insert(
            engine,
            sql_class=address.Address,
            data=[geocoded_address],
            return_insert_ids=True
        )[0]
        geocoded_address['id'] = address_id
        return geocoded_address
    raise NotImplementedError('Unable to geocode address. Geocoding is off.')


def _format_provider_response(success=True, provider_id=0, geocoded_address=None):
    if success and geocoded_address:
        return {
            'status': 'success',
            'id': provider_id,
            'lat': geocoded_address['latitude'],
            'lng': geocoded_address['longitude']
        }

    return {
        'status': 'error',
        'message': 'Failed to geocode address for this provider.'
    }


def fetch_providers(providers, geocoder_name='geocodio', engine=connect.create_db_engine()):
    """
    Fetch providers location and IDs from a list of provider inputs.

    Provider inputs must contain (address, npi)
    and can contain other information (e.g., languages, specialty)
    """
    if not providers:
        return []

    engine = connect.create_db_engine()
    Session = sessionmaker(bind=engine)
    session = Session()
    provider_responses = []
    geocodiocoder = geocoder.get_geocoder(geocoder_name) if GEOCODING else None

    for raw_provider in providers:
        try:
            # TODO - Fuzzy matching.
            # Retrieve lat, lng from DB.
            # Popping address to avoid confusion by Postgres between address and address_id.
            raw_address = raw_provider.pop('address')
            result_address = _fetch_address_from_db(raw_address, session)
            if result_address:
                geocoded_address = {
                    'id': result_address.id,
                    'address': raw_address,
                    'latitude': result_address.latitude,
                    'longitude': result_address.longitude,
                }
            else:
                geocoded_address = _return_geocoded_address(
                    engine=engine,
                    geocodiocoder=geocodiocoder,
                    raw_address=raw_address
                )

            # TODO - Decide on the behavior, early ?exit if no complete address is found.
            # Add address_id to each provider.
            raw_provider['address_id'] = geocoded_address['id']
            # Upload provider to the DB if needed and get the corresponding id.
            provider_id = methods.core_insert(
                engine,
                sql_class=provider.Provider,
                data=[raw_provider],
                return_insert_ids=True
            )[0]

            # Prepare and append response for each input provider.
            provider_responses.append(
                _format_provider_response(
                    success=True,
                    provider_id=provider_id,
                    geocoded_address=geocoded_address
                )
            )
        except (geocoder.GeocodioDataError, NotImplementedError) as error:
            print(error)
            provider_responses.append(_format_provider_response(success=False))

    session.close()
    print(provider_responses)
    return provider_responses
