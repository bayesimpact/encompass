"""Caclulate adequacy metrics."""
import collections
import itertools
import multiprocessing

from backend.config import config
from backend.lib.database.postgres import connect, table_handling
from backend.lib.database.tables import address, service_area
from backend.lib.fetch import representative_points
from backend.lib.timer import timed

from backend.models import distance

from sqlalchemy.orm import sessionmaker

MEASURER = distance.get_measure(config.get('measurer'))
ONE_MILE_IN_METERS = 1609.344
ONE_METER_IN_MILES = 1.0 / ONE_MILE_IN_METERS
EXIT_DISTANCE_IN_METERS = 10.0 * ONE_MILE_IN_METERS
# Adequacy results will be inaccurate with smaller values.
RELEVANCY_RADIUS_IN_METERS = 15.0 * ONE_MILE_IN_METERS


def _find_closest_provider(point, providers, exit_distance_in_meters=None):
    """Find closest provider from to a representative point."""
    if not exit_distance_in_meters:
        closest_distance, closest_provider = MEASURER.closest(
            origin=point,
            point_list=providers,
        )
    else:
        closest_distance, closest_provider = MEASURER.closest_with_early_exit(
            origin=point,
            point_list=providers,
            exit_distance=exit_distance_in_meters
        )
    provider_time = closest_distance * ONE_METER_IN_MILES * 2
    provider = {
        'id': point['id'],
        'closest_provider_by_distance': closest_provider['id'],
        'closest_provider_by_time': closest_provider['id'],
        'time_to_closest_provider': provider_time,
        'distance_to_closest_provider': closest_distance * ONE_METER_IN_MILES
    }
    return provider


def _fetch_addresses_from_ids(address_ids, engine):
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
def _get_addresses_to_check_by_service_area(
    service_area_ids,
    addresses,
    radius_in_meters,
    engine=connect.create_db_engine()
):
    """
    Find addresses near each service area.

    This method reduces the number of distance calulations required by `calculate_adequacies`.

    Returns a mapping service_area_id --> list of relevant addresses.
    """
    addresses_to_check_by_service_area = collections.defaultdict(list)

    service_area_id_list = '(VALUES' + ', '.join([
        "('{}')".format(_id) for _id in service_area_ids
    ]) + ')'

    address_values = [
        '({idx}, ST_SetSRID(ST_Point({longitude}, {latitude}), 4326)::geography)'.format(
            idx=idx,
            longitude=address['longitude'],
            latitude=address['latitude']
        )
        for idx, address in enumerate(addresses)
    ]

    temp_table_name = table_handling.get_random_table_name(prefix='addr')
    create_temp_table_query = """
        DROP TABLE IF EXISTS {temp_table_name};
        CREATE TEMP TABLE {temp_table_name}  AS
        SELECT * FROM (
            VALUES {address_values_list}
        ) AS t (idx, location);
        CREATE INDEX tmp_{temp_table_name}_gix ON {temp_table_name} USING GIST (location);
    """.format(
        temp_table_name=temp_table_name,
        address_values_list=', '.join(address_values)
    )

    engine.execute(create_temp_table_query)

    query = """
        SELECT
            areas.service_area_id AS service_area_id
            , tmp.idx AS address_idx
        FROM {service_areas} areas
        JOIN {temp_table_name} tmp
            ON (
            ST_DWithin(areas.location, tmp.location, {radius}, FALSE)
        )
        WHERE 1=1
            AND areas.service_area_id IN {service_area_id_list}
    """.format(
        temp_table_name=temp_table_name,
        service_areas=service_area.ServiceArea.__tablename__,
        addresses=address.Address.__tablename__,
        service_area_id_list=service_area_id_list,
        radius=radius_in_meters
    )

    query_results = (dict(row) for row in engine.execute(query))

    for row in query_results:
        addresses_to_check_by_service_area[row['service_area_id']].append(
            addresses[row['address_idx']]
        )

    for service_area_id in service_area_ids:
        if service_area_id not in addresses_to_check_by_service_area:
            addresses_to_check_by_service_area[service_area_id] = addresses

    engine.execute('DROP TABLE IF EXISTS {temp_table_name}'.format(temp_table_name=temp_table_name))

    return addresses_to_check_by_service_area


@timed
def calculate_adequacies(
    service_area_ids,
    provider_ids,
    engine,
    radius_in_meters=RELEVANCY_RADIUS_IN_METERS
):
    """
    Calculate adequacies.

    The calculation proceeds as follows:
        - Determine nearby providers for each service area using the radius_in_meters.
        - If no nearby providers are found, use the full provider list.
        - Fetch representative points.
        - Compare each representative point to the subset of nearby providers to determine
            the closest provider.
        - Aggregate the information for each point and return.
    """
    # TODO - Split analyis by specialty.
    print('Calculating adequacies for {} provider addresses and {} service areas.'.format(
        len(provider_ids), len(service_area_ids)))

    all_addresses = _fetch_addresses_from_ids(provider_ids, engine)

    if not all_addresses:
        return []

    points = representative_points.fetch_representative_points(
        service_area_ids=service_area_ids, format_response=False
    )

    addresses_to_check_by_service_area = _get_addresses_to_check_by_service_area(
        service_area_ids=service_area_ids,
        addresses=all_addresses,
        radius_in_meters=radius_in_meters
    )

    addresses_to_check_by_point = (
        addresses_to_check_by_service_area[point['service_area_id']]
        for point in points
    )

    n_processors = config.get('number_of_adequacy_processors')

    with multiprocessing.Pool(processes=n_processors) as executor:
        adequacies_response = executor.starmap(
            func=_find_closest_provider,
            iterable=zip(
                points,
                addresses_to_check_by_point,
                itertools.repeat(EXIT_DISTANCE_IN_METERS)
            )
        )

    print('Returning adequacy results.')
    return list(adequacies_response)
