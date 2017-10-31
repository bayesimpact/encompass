"""
Handle requests to the representative_points endpoint.

The /api/representative_points/ enpoint accepts a list service areas and returns a list
of ids and associated data.

REQUEST - POST /api/representative_points

{
  service_area_ids: ["alameda_020202", "alameda_94100"]
}

RESPONSE
[
    {
      id: 17323,
      service_area_id: "alameda_94100",
      lat: 74.38732,
      lng: -122.323331
      county: "Alameda",
      population: {0.5: 18, 2.5: 30, 5: 2000},
      zip: 94105,
      census_block_group: 105,
      census_block: 3,
      census_tract: 304,
    },
]
"""
import json

from backend.app.mocks.responses import mock_representative_point
from backend.app.exceptions.format import InvalidFormat


def representative_points_request(app, flask_request):
    """Handle /api/providers requests."""
    app.logger.info('Fetching representative_points.')
    try:
        request = flask_request.get_json(force=True)
        if 'service_area_ids' not in request:
            raise InvalidFormat(message='Invalid format. Could not find service_area_ids.')
        service_areas = request['service_area_ids']
    except json.JSONDecodeError:
        raise InvalidFormat(message='Invalid JSON format.')

    return [
        mock_representative_point(
            service_area_id=service_area_id,
            rp_id=i * 10)
        for i, service_area_id in enumerate(service_areas)
    ]
