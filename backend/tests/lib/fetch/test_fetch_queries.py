"""Test fetch queries."""
from backend.lib.database.postgres import connect
from backend.lib.fetch import providers, representative_points

engine = connect.create_db_engine()


class TestFetchRepresentativePoints():
    """Test fetch representative_points."""

    @staticmethod
    def test_fetch_representative_points_one_service_area():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_90001']
        results = representative_points.fetch_representative_points(service_areas, engine=engine)
        assert len(results) == 5

    @staticmethod
    def test_fetch_representative_points_two_service_areas():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_90001', 'ca_los_angeles_90002']
        results = representative_points.fetch_representative_points(service_areas, engine=engine)
        assert len(results) == 10

    @staticmethod
    def test_fetch_representative_points_no_service_area():
        """Test fetch_representative_points."""
        service_areas = []
        results = representative_points.fetch_representative_points(service_areas, engine=engine)
        assert len(results) == 0

    @staticmethod
    def test_fetch_representative_points_no_valid_service_area():
        """Test fetch_representative_points."""
        service_areas = ['not_valid']
        results = representative_points.fetch_representative_points(service_areas, engine=engine)
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
        results = providers.fetch_providers(providers_input, engine=engine)
        assert results[0]['status'] == 'success'
        assert results[0]['id'] is not None

    @staticmethod
    def test_fetch_providers_address_does_not_exist():
        """Test fetch_representative_points."""
        providers_input = [{'address': 'I DO NOT EXIST'}]
        results = providers.fetch_providers(providers_input, engine=engine)
        assert len(results) == 1
        assert results[0]['status'] == 'error'

    @staticmethod
    def test_fetch_providers_address_multiple_input():
        """Test fetch_representative_points."""
        providers_input = [
            {
                'address': '1000 E DOMINGUEZ ST, CARSON, CA 90746',
                'npi': '1032023833'
            },
            {
                'address': 'I DO NOT EXIST'
            }
        ]
        results = providers.fetch_providers(providers_input, engine=engine)
        assert len(results) == 2
        assert results[0]['status'] == 'success'
        assert results[1]['status'] == 'error'


class TestFetchServiceAreas():
    """Test methods to fetch service areas."""

    @staticmethod
    def test_fetch_all_service_areas():
        """Test fetch_all_service_areas."""
        results = representative_points.fetch_all_service_areas(engine=engine)
        assert len(results) > 0
