"""
Handle requests to the adequacy endpoint.

The /api/adequacy/ enpoint accepts a list of providers and a list of service areas
or representative points.

REQUEST - POST  /api/adequacies

{
  provider_ids: [int]
  service_area_ids: [str]
}

RESPONSE
[
  {
    id: 17323,
    closest_provider_by_distance: int,
    closest_provider_by_time: int,
    time_to_clostest_provider: int,
    distance_to_closest_povider: float
  }
]
"""
import json
import random

from backend.app.exceptions.format import InvalidFormat
from backend.app.mocks.responses import mock_adequacy
from backend.lib import fetch


def mock_adequacy_calculation(provider_ids, service_area_ids):
    """Mock adequacy calculation."""
    representative_points = fetch.fetch_representative_points(service_area_ids)
    point_ids = [point['id'] for point in representative_points]

    return [
        mock_adequacy(point_id, random.choice(provider_ids))
        for point_id in point_ids
    ]


def adequacy_request(app, flask_request):
    """Handle /api/providers requests."""
    app.logger.info('Fetching representative_points.')
    try:
        request = flask_request.get_json(force=True)
    except json.JSONDecodeError:
        raise InvalidFormat(message='Invalid JSON format.')

    if 'provider_ids' not in request:
        raise InvalidFormat(message='Invalid format. Could not find provider_ids.')
    if 'service_area_ids' not in request:
        raise InvalidFormat(message='Invalid format. Could not find service_area_ids.')

    provider_ids = request['provider_ids']
    service_area_ids = request['service_area_ids']

    return fetch.fetch_adeqacies(
        service_area_ids=service_area_ids,
        provider_ids=provider_ids
    )
