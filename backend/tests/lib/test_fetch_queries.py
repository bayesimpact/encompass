"""Test fetch queries."""
from backend.lib import fetch


def test_fetch_representative_points_one_service_area():
    """Test fetch_representative_points."""
    service_areas = ['ca_los_angeles_90001']
    results = fetch.fetch_representative_points(service_areas)
    assert len(results) == 13
    assert all(result['service_area_id'] in service_areas for result in results)


def test_fetch_representative_points_two_service_areas():
    """Test fetch_representative_points."""
    service_areas = ['ca_los_angeles_90001', 'ca_los_angeles_90002']
    results = fetch.fetch_representative_points(service_areas)
    assert len(results) == 24
    assert all(result['service_area_id'] in service_areas for result in results)


def test_fetch_representative_points_no_service_area():
    """Test fetch_representative_points."""
    service_areas = []
    results = fetch.fetch_representative_points(service_areas)
    assert len(results) == 0


def test_fetch_representative_points_no_valid_service_area():
    """Test fetch_representative_points."""
    service_areas = ['not_valid']
    results = fetch.fetch_representative_points(service_areas)
    assert len(results) == 0
