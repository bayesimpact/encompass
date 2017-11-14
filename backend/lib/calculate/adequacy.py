"""Caclulate adequacy metrics."""
from backend.lib.database.postgres import connect
from backend.lib.database.tables import address
from backend.lib.fetch import representative_points

from backend.lib.timer import timed
from backend.models import distance

from sqlalchemy.orm import sessionmaker

# TODO - Use config or environment variable.
MEASURER = distance.get_measure('haversine')
EXIT_DISTANCE = 10.0


def _find_closest_provider(point, providers, exit_distance_in_miles=None):
    """Find closest provider from to a representative point."""
    if not exit_distance_in_miles:
        closest_distance, closest_provider = MEASURER.closest(
            origin=point,
            point_list=providers,
        )
    else:
        closest_distance, closest_provider = MEASURER.closest_with_early_exit(
            origin=point,
            point_list=providers,
            exit_distance=exit_distance_in_miles
        )
    provider_time = closest_distance * 2
    provider = {
        'id': point['id'],
        'closest_provider_by_distance': closest_provider['id'],
        'closest_provider_by_time': closest_provider['id'],
        'time_to_closest_provider': provider_time,
        'distance_to_closest_provider': closest_distance
    }
    return provider


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
        _find_closest_provider(point, providers, exit_distance_in_miles=EXIT_DISTANCE)
        for point in points
    ]
    print('Returning adequacy results.')
    return adequacies_response
