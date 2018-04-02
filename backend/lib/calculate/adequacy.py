"""Caclulate adequacy metrics."""
import collections
import itertools
import logging

from backend.config import config
from backend.lib.database.postgres import connect, table_handling
from backend.lib.database.tables import service_area
from backend.lib.fetch import representative_points
from backend.lib.timer import timed
from backend.lib.utils.datatypes import Point

from backend.models.measurers import get_measurer

ONE_MILE_IN_METERS = 1609.344
ONE_METER_IN_MILES = 1.0 / ONE_MILE_IN_METERS
# Adequacy results will be inaccurate with smaller RELEVANCY_RADIUS_IN_METERS values.
RELEVANCY_RADIUS_IN_METERS = 80.0 * ONE_MILE_IN_METERS


logger = logging.getLogger(__name__)


def _find_closest_location(point, locations, measurer, exit_distance_in_meters=None):
    """Find closest provider from to a representative point."""
    point_coords = Point(latitude=point['latitude'], longitude=point['longitude'])
    if not exit_distance_in_meters:
        closest_distance, closest_provider = measurer.closest(
            origin=point_coords,
            point_list=locations,
        )
    else:
        closest_distance, closest_provider = measurer.closest_with_early_exit(
            origin=point_coords,
            point_list=locations,
            exit_distance=exit_distance_in_meters
        )
    provider = {
        'id': point['id'],
        'closest_point': closest_provider,
        'to_closest_provider': closest_distance
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

    # FIXME: Use psycopg2.extras.execute_values to insert these values.
    address_values = [
        '({idx}, ST_SetSRID(ST_Point({longitude}, {latitude}), 4326)::geography)'.format(
            idx=idx,
            longitude=float(provider_address.longitude),
            latitude=float(provider_address.latitude)
        ) for idx, provider_address in enumerate(locations)
    ]

    query_params = {
        'service_area_id_list': tuple(service_area_ids),
    }

    temp_table_name = table_handling.get_random_table_name(prefix='addr')
    create_temp_table_query = """
        DROP TABLE IF EXISTS {temp_table_name};
        CREATE TEMP TABLE {temp_table_name}  AS
        SELECT * FROM (
            VALUES {address_values_list}
        ) AS t (idx, location);
        CREATE INDEX tmp_{temp_table_name}_gix ON {temp_table_name} USING GIST (location)
        ;
    """.format(
        temp_table_name=temp_table_name,
        address_values_list=', '.join(address_values)
    )
    gis_query = """
        SELECT
            areas.service_area_id AS service_area_id
            , tmp.idx AS address_idx
        FROM {service_areas} areas
        JOIN {temp_table_name} tmp
            ON (
            ST_DWithin(areas.location, tmp.location, {radius}, FALSE)
        )
        WHERE 1=1
            AND areas.service_area_id IN %(service_area_id_list)s
        ;
    """.format(
        temp_table_name=temp_table_name,
        service_areas=service_area.ServiceArea.__tablename__,
        radius=radius_in_meters,
    )

    full_query = """
        {create_temp_table_query}
        {gis_query}
    """.format(
        create_temp_table_query=create_temp_table_query,
        gis_query=gis_query
    )
    query_results = (dict(row) for row in engine.execute(full_query, query_params).fetchall())

    for row in query_results:
        locations_to_check_by_service_area[row['service_area_id']].append(
            locations[row['address_idx']]
        )

    for service_area_id in service_area_ids:
        if service_area_id not in locations_to_check_by_service_area:
            locations_to_check_by_service_area[service_area_id] = locations

    return locations_to_check_by_service_area


def _add_closest_provider_id(adequacies_response, location_mapping):
    for adequacy in adequacies_response:
        point = adequacy.pop('closest_point')
        adequacy['closest_providers'] = location_mapping[point]
        adequacy['closest_location'] = {'latitude': point.latitude, 'longitude': point.longitude}

    return adequacies_response


@timed
def calculate_adequacies(
    service_area_ids,
    locations,
    engine,
    measurer_name,
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
    location_mapping = collections.defaultdict(list)
    for i, location in enumerate(locations):
        # TODO - Permanently fix this on the frontend side.
        point_id = location.pop('id', i)
        location_mapping[Point(**location)].append(point_id)

    locations = list(location_mapping.keys())

    logger.debug(
        'Calculating adequacies for {} locations ({} unique) and {} service areas using {}.'.format(
            len(locations), len(location_mapping), len(service_area_ids), measurer_name))

    points = representative_points.minimal_fetch_representative_points(
        service_area_ids=service_area_ids,
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

    measurer = get_measurer(measurer_name)
    measurer_config = config.get('measurer_config')[measurer_name]
    executor_type = measurer_config['adequacy_executor_type']
    n_processors = measurer_config['n_adequacy_processors']
    exit_distance = measurer_config['exit_distance_in_miles'] * ONE_MILE_IN_METERS

    logger.debug('Starting {} executors for adequacy calculations...'.format(n_processors))
    with executor_type(processes=n_processors) as executor:
        adequacies = executor.starmap(
            func=_find_closest_location,
            iterable=zip(
                points,
                locations_to_check_by_point,
                itertools.repeat(measurer),
                itertools.repeat(exit_distance)
            )
        )

    adequacies_response = _add_closest_provider_id(adequacies, location_mapping)
    logger.debug('Returning adequacy results.')
    return list(adequacies_response)
