"""Caclulate adequacy metrics."""
import collections

import concurrent.futures
import itertools

from backend.config import config
from backend.lib.database.postgres import connect
from backend.lib.database.tables import address, service_area
from backend.lib.fetch import representative_points
from backend.lib.timer import timed

from backend.models import distance

import descartes

from shapely import wkb

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
def _find_addresses_near_service_area(
    service_area_polygon,
    providers
):
    """
    Find providers within the given radius of the service area polygon.

    This method reduces the number of distance calulations required by `calculate_adequacies`.
    """
    # TODO - Investigate ways to improve performance knowing that the polygons are rectangles
    # (After switch to geometry datatype.)
    # TODO - Investigate use of minmax latlon instead of complete polygons.
    path = descartes.PolygonPatch(service_area_polygon).get_path()
    return list(itertools.compress(
        providers,
        path.contains_points(
            [(provider['longitude'], provider['latitude']) for provider in providers]
        )
    ))


@timed
def _fetch_service_area_polygons_db(
    service_area_ids,
    radius_in_meters,
    engine=connect.create_db_engine()
):
    """
    Find service areas and all providers within the given radius of the service area polygon.

    This method reduces the number of distance calulations required by `calculate_adequacies`.
    """
    # TODO - Add ST_ENVELOPE to force square bounding box after switch to geomery.
    service_area_id_list = '(VALUES' + ', '.join([
        "('{}')".format(_id) for _id in service_area_ids
    ]) + ')'

    query = """
        SELECT
            areas.service_area_id AS service_area_id,
            ST_Buffer(areas.location, {radius}) AS polygon
        FROM {service_areas} areas
        WHERE 1=1
            AND areas.service_area_id IN {service_area_id_list}
    """.format(
        radius=radius_in_meters,
        service_areas=service_area.ServiceArea.__tablename__,
        service_area_id_list=service_area_id_list,
    )

    results = engine.execute(query)
    if results:
        return {
            result.service_area_id: wkb.loads(result.polygon, hex=True)
            for result in results
        }
    return {}


def _process_service_area(service_area_id, service_area_polygons, all_addresses):
    addresses = _find_addresses_near_service_area(
        service_area_polygon=service_area_polygons[service_area_id],
        providers=all_addresses
    ) or all_addresses

    return (service_area_id, addresses)


@timed
def _get_addresses_to_check_by_service_area(
        service_area_ids, service_area_polygons, addresses, n_processors):
    addresses_to_check_by_service_area = collections.defaultdict(list)

    # TODO - Properly compare performance.
    # with concurrent.futures.ProcessPoolExecutor(n_processors) as executor:
    #     for service_area_id, addresses in executor.map(
    #         _process_service_area,
    #             service_area_ids, itertools.repeat(service_area_polygons),
    #             itertools.repeat(addresses)):
    #         addresses_to_check_by_service_area[service_area_id] = addresses

    for service_area_id in service_area_ids:
        _, addresses_to_check_by_service_area[service_area_id] = _process_service_area(
            service_area_id=service_area_id,
            service_area_polygons=service_area_polygons,
            all_addresses=addresses)

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

    service_area_polygons = _fetch_service_area_polygons_db(
        service_area_ids=service_area_ids,
        radius_in_meters=RELEVANCY_RADIUS_IN_METERS,
        engine=engine
    )

    all_addresses = _fetch_addresses_from_ids(provider_ids, engine)

    if not all_addresses:
        return []

    points = representative_points.fetch_representative_points(
        service_area_ids=service_area_ids, format_response=False
    )

    n_processors = config.get('number_of_adequacy_processors')

    addresses_to_check_by_service_area = _get_addresses_to_check_by_service_area(
        service_area_ids=service_area_ids,
        service_area_polygons=service_area_polygons,
        addresses=all_addresses,
        n_processors=n_processors)

    addresses_to_check_by_point = (
        addresses_to_check_by_service_area.get(point['service_area_id'])
        for point in points
    )

    with concurrent.futures.ProcessPoolExecutor(n_processors) as executor:
        adequacies_response = executor.map(
            _find_closest_provider,
            points, addresses_to_check_by_point, itertools.repeat(EXIT_DISTANCE_IN_METERS)
        )

    print('Returning adequacy results.')
    return list(adequacies_response)
