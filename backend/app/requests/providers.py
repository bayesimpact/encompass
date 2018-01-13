"""
Handle requests to the provider endpoint.

The /api/geocode enpoint accepts a list of addresses and return a list of
associated lat, lng.

REQUEST - POST
[
  '1855 Mission Street, San Francisco, CA',
  '1855 Mission Road, San Francisco, CA',
  '100855 South Van Ness, San Francisco, CA'
]

RESPONSE
[
    {'status': 'error', 'message': 'Failed to geocode address for this provider.'},
    {'status': 'success', lat': 37.06660983626426, 'lng': -122.03874290199911}
    {'status': 'success', lat': 37.06098362, 'lng': -122.038742210}
]
"""
import json
import logging

from backend.lib.fetch import providers
from backend.app.exceptions.format import InvalidFormat

from retrying import retry

# TODO - Use config.
# TODO - Create a dedicated retry decorator to avoid duplication.
WAIT_FIXED_MILLISECONDS = 500
STOP_MAX_ATTEMPT_NUMBER = 2

logger = logging.getLogger(__name__)


@retry(
    wait_fixed=WAIT_FIXED_MILLISECONDS,
    stop_max_attempt_number=STOP_MAX_ATTEMPT_NUMBER)
def providers_request(app, flask_request, engine):
    """Handle /api/geocode requests."""
    logger.info('Geocoding providers.')
    try:
        request_json = flask_request.get_json(force=True)
        provider_addresses = request_json['addresses']
    except json.JSONDecodeError:
        raise InvalidFormat(message='Invalid JSON format.')
    return providers.geocode_providers(provider_addresses, engine=engine)
