"""
Handle requests to the provider endpoint.

The /api/providers enpoint accepts a list of addresses and return a list of
provider_id and the associated lat, lng.

REQUEST - POST
[
  { address: '1855 Mission Street, San Francisco, CA',
    languages: string[],
    npi: number
    specialty: string
  },
  { address: '1855 Mission Road, San Francisco, CA',
    languages: string[],
    npi: number
    specialty: string
  },
  { address: '100855 South Van Ness, San Francisco, CA',
    languages: string[],
    npi: number
    specialty: string
  }
]

RESPONSE
[
    {'status': 'error', 'message': 'Failed to geocode address for this provider.'},
    {'status': 'success', 'id': 392, 'lat': 37.06660983626426, 'lng': -122.03874290199911}
    {'status': 'success', 'id': 43, 'lat': 37.06098362, 'lng': -122.038742210}
]
"""
import json

from backend.lib import fetch
from backend.app.exceptions.format import InvalidFormat


def providers_request(app, flask_request):
    """Handle /api/providers requests."""
    app.logger.info('Fetching providers.')
    try:
        request_json = flask_request.get_json(force=True)
        provider_addresses = request_json['providers']
    except json.JSONDecodeError:
        raise InvalidFormat(message='Invalid JSON format.')
    return fetch.fetch_providers(provider_addresses)
