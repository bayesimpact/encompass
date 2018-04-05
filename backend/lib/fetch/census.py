"""Fetch census data by service area."""
import collections
import logging

from backend.lib.fetch import representative_points
from backend.lib.timer import timed

logger = logging.getLogger(__name__)


@timed
def fetch_census_info_by_service_area(service_area_ids, engine):
    """
    Fetch census information aggregated across an entire service area.

    For each service area and census field combination, calculate the average of each
    point's census value, weighted by population.

    The returned mapping for each service area has the same structure as each representative point.
    """
    logger.debug('Fetching census information for {} service areas'.format(len(service_area_ids)))
    # Fetch all points for the given service areas.
    all_points = representative_points.fetch_representative_points(
        service_area_ids=service_area_ids,
        include_census_data=True,
        engine=engine
    )

    # Infer the demographics fields from the first returned point.
    try:
        sample_demographic_map = all_points[0]['demographics']
    except IndexError:
        logger.debug('No points found for specified service areas.')
        return {}

    # Group points by service area.
    points_by_service_area = collections.defaultdict(list)
    for point in all_points:
        points_by_service_area[point['service_area_id']].append(point)

    response = {}
    for service_area in points_by_service_area:

        service_area_demographics = collections.defaultdict(dict)
        points = points_by_service_area[service_area]
        total_population = sum(point['population'] for point in points)

        # Set the service area value to the weighted average of its constituent points' values.
        for category in sample_demographic_map:
            for field in sample_demographic_map[category]:
                service_area_demographics[category][field] = sum(
                    point['population'] * point['demographics'][category][field]
                    for point in points
                ) / total_population

        response[service_area] = dict(service_area_demographics)

    return response
