"""Test fetch queries."""
from backend.lib.database.postgres import connect
from backend.lib.fetch import providers, representative_points

engine = connect.create_db_engine()


class TestFetchRepresentativePoints():
    """Test fetch representative_points."""

    @staticmethod
    def test_fetch_representative_points_one_service_area():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_00000']
        results = representative_points.fetch_representative_points(
            service_areas, census_data=False, engine=engine
        )
        assert len(results) > 1000

    @staticmethod
    def test_fetch_representative_points_two_service_areas():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_00000', 'ca_los_angeles_00000']
        results = representative_points.fetch_representative_points(
            service_areas, census_data=False, engine=engine
        )
        assert len(results) > 1000

    @staticmethod
    def test_fetch_representative_points_no_service_area():
        """Test fetch_representative_points."""
        service_areas = []
        results = representative_points.fetch_representative_points(
            service_areas, census_data=False, engine=engine
        )
        assert len(results) == 0

    @staticmethod
    def test_fetch_representative_points_no_valid_service_area():
        """Test fetch_representative_points."""
        service_areas = ['not_valid']
        results = representative_points.fetch_representative_points(
            service_areas, census_data=False, engine=engine
        )
        assert len(results) == 0

    @staticmethod
    def test_minimal_fetch_representative_points_one_service_area():
        """Test fetch_representative_points as used internally by the backend."""
        service_areas = ['ca_los_angeles_00000']
        results = representative_points.minimal_fetch_representative_points(
            service_areas, engine=engine
        )
        assert len(results) > 1000

    def test_readable_columns_from_census_mapping(self):
        census_mapping = {
            'age': {
                'aggregated_ages.zero_to_eighteen': {
                    'joined_column_name': 'zero_to_eighteen',
                    'human_readable_name': '0-18 Years'
                },
                'aggregated_ages.nineteen_to_twenty_five': {
                    'joined_column_name': 'nineteen_to_twenty_five',
                    'human_readable_name': '19-25 Years'
                }
            }
        }

        readable_columns = representative_points.readable_columns_from_census_mapping(
            census_mapping=census_mapping
        )
        excpected_readable_columns = [
            'aggregated_ages.zero_to_eighteen AS zero_to_eighteen',
            'aggregated_ages.nineteen_to_twenty_five AS nineteen_to_twenty_five'
        ]
        assert readable_columns == excpected_readable_columns


class TestFetchProviders():
    """Test fetch providers."""

    @staticmethod
    def test_geocode_providers_existing_address():
        """Test geocode_providers when the address exists."""
        # Note - This address should exist in the database.
        providers_input = ['1000 E DOMINGUEZ ST, CARSON, CA 90746']
        results = providers.geocode_providers(providers_input, engine=engine)
        assert results[0]['status'] == 'success'

    @staticmethod
    def test_geocode_providers_address_does_not_exist():
        """Test fetch_representative_points."""
        providers_input = ['I DO NOT EXIST']
        results = providers.geocode_providers(providers_input, engine=engine)
        assert len(results) == 1
        assert results[0]['status'] == 'error'

    @staticmethod
    def test_geocode_providers_address_multiple_input():
        """Test fetch_representative_points."""
        providers_input = ['1000 E DOMINGUEZ ST, CARSON, CA 90746', 'I DO NOT EXIST']
        results = providers.geocode_providers(providers_input, engine=engine)
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
