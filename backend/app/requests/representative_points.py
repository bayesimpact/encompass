"""
Handle requests to the representative_points endpoint.

The /api/representative_points/ endpoint accepts a list service areas and returns a list
of ids and associated data.

REQUEST - POST /api/representative_points

{
  service_area_ids: ["alameda_020202", "alameda_94100"]
}

RESPONSE
[
    {
      id: 17323,
      service_area_id: "ca_alameda_94100",
      lat: 74.38732,
      lng: -122.323331
      county: "Alameda",
      population: 2000,
      zip: 94105,
      census_block_group: 105,
      census_block: 3,
      census_tract: 304,
    },
]
"""
import json
import logging

from backend.config import config
from backend.lib.fetch import representative_points
from backend.app.exceptions.format import InvalidFormat

from retrying import retry

WAIT_FIXED_MILLISECONDS = 500
STOP_MAX_ATTEMPT_NUMBER = 2

logger = logging.getLogger(__name__)


@retry(
    wait_fixed=WAIT_FIXED_MILLISECONDS,
    stop_max_attempt_number=STOP_MAX_ATTEMPT_NUMBER)
def representative_points_request(app, flask_request, engine):
    """Handle /api/representative_points requests."""
    logger.debug('Fetching representative points.')
    try:
        request_json = flask_request.get_json(force=True)
        service_area_ids = request_json['service_area_ids']
    except (json.JSONDecodeError, KeyError):
        raise InvalidFormat(message='Invalid JSON format.')
    return representative_points.fetch_representative_points(
        service_area_ids,
        census_data=config.get('census_data'),
        engine=engine
    )
