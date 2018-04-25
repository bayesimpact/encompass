"""
Handle requests to the census-data-by-service-area/ endpoint.

The /api/census-data-by-service-area/ endpoint returns census info for each service area.
"""
import json
import logging

from backend.app.exceptions.format import InvalidFormat
from backend.app.requests.caching import cache
from backend.lib.fetch import census

from retrying import retry

WAIT_FIXED_MILLISECONDS = 500
STOP_MAX_ATTEMPT_NUMBER = 2

logger = logging.getLogger(__name__)


@retry(
    wait_fixed=WAIT_FIXED_MILLISECONDS,
    stop_max_attempt_number=STOP_MAX_ATTEMPT_NUMBER
)
def census_info_by_service_area_request(app, flask_request, engine):
    """Handle /api/census-data-by-service-area/ requests."""
    logger.info('Fetching census data by service area.')
    try:
        request_json = flask_request.get_json(force=True)
        service_area_ids = request_json['service_area_ids']
    except (json.JSONDecodeError, KeyError):
        raise InvalidFormat(message='Invalid JSON format.')

    return construct_census_info_response(
        service_area_ids=service_area_ids,
        engine=engine
    )


@cache(prefix='census', hint_fields=('service_area_ids',))
def construct_census_info_response(service_area_ids, engine):
    """Construct responses for /api/census-data-by-service-area/ requests."""
    return census.fetch_census_info_by_service_area(
        service_area_ids=service_area_ids,
        engine=engine
    )
