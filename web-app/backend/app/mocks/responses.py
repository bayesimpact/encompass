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


def mock_representative_point(service_area_id=0, rp_id=0):
    """Create a mock representative point."""
    county = 'county_placeholder'
    zip_code = 'zip_code_placeholder'
    return {
        'id': rp_id,
        'service_area_id': service_area_id,
        'lat': 37 + random.uniform(0, 0.3),
        'lng': -122 - random.uniform(0, 0.3),
        'county': county,
        'population': {0.5: 18, 2.5: 30, 5: 2000},
        'zip': zip_code,
        'census_block_group': 105,
        'census_block': 3,
        'census_tract': 304,
    }


def mock_adequacy(rp_id, provider_id):
    """Create a mock adequacy response."""
    return {
        'id': rp_id,
        'closest_provider_by_distance': provider_id,
        'closest_provider_by_time': provider_id,
        'time_to_clostest_provider': round(random.uniform(10, 60)),
        'distance_to_closest_povider': random.uniform(5, 40)
    }
