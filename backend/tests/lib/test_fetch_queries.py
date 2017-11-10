"""Test fetch queries."""
from backend.lib import fetch


class TestFetchRepresentativePoints():
    """Test fetch representative_points."""

    @staticmethod
    def test_fetch_representative_points_one_service_area():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_90001']
        results = fetch.fetch_representative_points(service_areas)
        assert len(results) == 13

    @staticmethod
    def test_fetch_representative_points_two_service_areas():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_90001', 'ca_los_angeles_90002']
        results = fetch.fetch_representative_points(service_areas)
        assert len(results) == 24

    @staticmethod
    def test_fetch_representative_points_no_service_area():
        """Test fetch_representative_points."""
        service_areas = []
        results = fetch.fetch_representative_points(service_areas)
        assert len(results) == 0

    @staticmethod
    def test_fetch_representative_points_no_valid_service_area():
        """Test fetch_representative_points."""
        service_areas = ['not_valid']
        results = fetch.fetch_representative_points(service_areas)
        assert len(results) == 0


class TestFetchProviders():
    """Test fetch providers."""

    @staticmethod
    def test_fetch_providers_existing_address():
        """Test fetch_providers when the address exists."""
        # Note - This address should exist in the database.
        providers_input = [
            {
                'address': '1000 E DOMINGUEZ ST, CARSON, CA 90746',
                'npi': '1032023833'
            }
        ]
        results = fetch.fetch_providers(providers_input)
        assert results[0]['status'] == 'success'
        assert results[0]['id'] is not None

    @staticmethod
    def test_fetch_providers_address_does_not_exist():
        """Test fetch_representative_points."""
        providers_input = [{'address': 'I DO NOT EXIST, CARSON, CA 90746'}]
        results = fetch.fetch_providers(providers_input)
        assert len(results) == 1
        assert results[0]['status'] == 'error'


class TestFetchServiceAreas():
    """Test methods to fetch service areas."""

    @staticmethod
    def test_fetch_all_service_areas():
        """Test fetch_all_service_areas."""
        results = fetch.fetch_all_service_areas()
        assert len(results) > 0
