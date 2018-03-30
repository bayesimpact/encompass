"""
Handle requests to the service_areas endpoint.

The /api/available-service-areas/ endpoint returns all available service areas.
"""
from backend.lib.fetch import representative_points
import logging

logger = logging.getLogger(__name__)


def service_areas_request(app, flask_request, engine):
    """Handle /api/available-service-areas requests."""
    logger.info('Fetching service areas.')
    return representative_points.fetch_all_service_areas(engine=engine,)
