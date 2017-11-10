"""
Handle requests to the service_areas endpoint.

The /api/available-service-areas/ enpoint returns all available service areas.
"""
from backend.lib import fetch


def service_areas_request(app, flask_request):
    """Handle /api/available-service-areas requests."""
    app.logger.info('Fetching service areas.')
    return fetch.fetch_all_service_areas()
