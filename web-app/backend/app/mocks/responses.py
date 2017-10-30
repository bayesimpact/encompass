"""Mock Providers."""
import random


def mock_provider(provider_id, success=True):
    """Create a mock provider."""
    if success:
        return {
            'status': 'success',
            'id': provider_id,
            'lat': 37 + random.uniform(0, 0.3),
            'lng': -122 - random.uniform(0, 0.3)
        }
    return {
        'status': 'error',
        'message': 'Failed to geocode address for this provider.'
    }
