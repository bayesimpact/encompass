"""Fetch data from database."""
from backend.lib.database.postgres import connect, methods
from backend.lib.database.tables import address, provider, representative_point

from sqlalchemy.orm import sessionmaker


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


def _fetch_address(raw_address, session):
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


def _format_provider_response(success=True, provider_id=0, geocoded_address=None):
    if success and geocoded_address:
        return {
            'status': 'success',
            'id': provider_id,
            'lat': geocoded_address.latitude,
            'lng': geocoded_address.longitude
        }

    return {
        'status': 'error',
        'message': 'Failed to geocode address for this provider.'
    }


def fetch_providers(providers, engine=connect.create_db_engine()):
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

    for raw_provider in providers:
        try:
            # TODO - Geocode missing addresses and add to DB.
            # TODO - Fuzzy matching.
            # Retrieve lat, lng from DB.
            # Pop address to avoid confusion by Postgres between address and address_id.
            geocoded_address = _fetch_address(raw_provider.pop('address'), session)
            # TODO - Decide on the behavior, early ?exit if no complete address is found.
            # Add address_id to each provider.
            address_id = 0 if not geocoded_address else geocoded_address.id
            raw_provider['address_id'] = address_id

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
        except Exception as error:
            print(error)
            provider_responses.append(_format_provider_response(success=False))

    session.close()
    return provider_responses
