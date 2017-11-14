"""Caclulate adequacy metrics."""
from backend.lib.database.postgres import connect
from backend.lib.database.tables import address
from backend.lib.fetch import representative_points

from backend.lib.timer import timed
from backend.models import distance

from sqlalchemy.orm import sessionmaker

# TODO - Use config or environment variable.
MEASURER = distance.get_measure('haversine')


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
def calculate_adequacies(service_area_ids, provider_ids, engine=connect.create_db_engine()):
    """Calculate adequacies."""
    points = representative_points.fetch_representative_points(
        service_area_ids=service_area_ids, format_response=False)
    providers = _fetch_address_from_ids(
        address_ids=provider_ids, engine=engine
    )
    print('Calculating adequacies for {} provider addresses and {} representative points.'.format(
        len(providers), len(points))
    )
    # TODO - Split analyis by specialty.
    adequacies_response = [
        _find_closest_provider(point, providers)
        for point in points
    ]
    print('Returning adequacy results.')
    return adequacies_response
