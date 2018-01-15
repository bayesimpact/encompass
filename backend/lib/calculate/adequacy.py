"""Caclulate adequacy metrics."""
import collections
import itertools
import logging
import multiprocessing

from backend.config import config
from backend.lib.database.postgres import connect, table_handling
from backend.lib.database.tables import address, service_area
from backend.lib.fetch import representative_points
from backend.lib.timer import timed
from backend.lib.utils.datatypes import Point

from backend.models import distance

MEASURER = distance.get_measure(config.get('measurer'))
ONE_MILE_IN_METERS = 1609.344
ONE_METER_IN_MILES = 1.0 / ONE_MILE_IN_METERS
EXIT_DISTANCE_IN_METERS = 10.0 * ONE_MILE_IN_METERS
# Adequacy results will be inaccurate with smaller values.
RELEVANCY_RADIUS_IN_METERS = 15.0 * ONE_MILE_IN_METERS


logger = logging.getLogger(__name__)


def _find_closest_location(point, locations, exit_distance_in_meters=None):
    """Find closest provider from to a representative point."""
    point_coords = Point(latitude=point['latitude'], longitude=point['longitude'])
    if not exit_distance_in_meters:
        closest_distance, closest_provider = MEASURER.closest(
            origin=point_coords,
            point_list=locations,
        )
    else:
        closest_distance, closest_provider = MEASURER.closest_with_early_exit(
            origin=point_coords,
            point_list=locations,
            exit_distance=exit_distance_in_meters
        )
    provider_time = closest_distance * ONE_METER_IN_MILES * 2
    provider = {
        'id': point['id'],
        'closest_providers_by_distance': [1],
        'closest_providers_by_time': [1],
        'time_to_closest_provider': provider_time,
        'distance_to_closest_provider': closest_distance * ONE_METER_IN_MILES
    }
    return provider


@timed
def _get_locations_to_check_by_service_area(
    service_area_ids,
    locations,
    radius_in_meters,
    engine=connect.create_db_engine()
):
    """
    Find locations near each service area.

    This method reduces the number of distance calulations required by `calculate_adequacies`.

    Returns a mapping service_area_id --> list of relevant locations.
    """
    locations_to_check_by_service_area = collections.defaultdict(list)

    service_area_id_list = '(VALUES' + ', '.join([
        "('{}')".format(_id) for _id in service_area_ids
    ]) + ')'

    address_values = [
        '({idx}, ST_SetSRID(ST_Point({longitude}, {latitude}), 4326)::geography)'.format(
            idx=idx,
            longitude=provider_address.longitude,
            latitude=provider_address.latitude
        ) for idx, provider_address in enumerate(locations)
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
        locations_to_check_by_service_area[row['service_area_id']].append(
            locations[row['address_idx']]
        )

    for service_area_id in service_area_ids:
        if service_area_id not in locations_to_check_by_service_area:
            locations_to_check_by_service_area[service_area_id] = locations

    engine.execute('DROP TABLE IF EXISTS {temp_table_name}'.format(temp_table_name=temp_table_name))

    return locations_to_check_by_service_area


@timed
def calculate_adequacies(
    service_area_ids,
    locations,
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
    # TODO - Remove duplicate locations (cannot use set with dicts).
    logger.debug('Calculating adequacies for {} provider locations and {} service areas.'.format(
        len(locations), len(service_area_ids)))

    location_mapping = collections.defaultdict(list)
    for location in locations:
        point_id = location.pop('id')
        location_mapping[Point(**location)].append(point_id)

    locations = list(location_mapping.keys())

    points = representative_points.fetch_representative_points(
        service_area_ids=service_area_ids,
        format_response=False,
        engine=engine
    )

    locations_to_check_by_service_area = _get_locations_to_check_by_service_area(
        service_area_ids=service_area_ids,
        locations=locations,
        engine=engine,
        radius_in_meters=radius_in_meters
    )

    locations_to_check_by_point = [
        locations_to_check_by_service_area[point['service_area_id']]
        for point in points
    ]

    logger.debug(
        '{} pairwise distances to calculate.'.format(
            str(sum(len(locations) for locations in locations_to_check_by_point)))
    )

    n_processors = config.get('number_of_adequacy_processors')

    with multiprocessing.Pool(processes=n_processors) as executor:
        adequacies_response = executor.starmap(
            func=_find_closest_location,
            iterable=zip(
                points,
                locations_to_check_by_point,
                itertools.repeat(EXIT_DISTANCE_IN_METERS)
            )
        )

    logger.debug('Returning adequacy results.')
    return list(adequacies_response)
