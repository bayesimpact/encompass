"""Test fetch queries."""
from backend.lib.database.postgres import connect
from backend.lib.fetch import census, providers, representative_points

import mock

engine = connect.create_db_engine()


class TestFetchRepresentativePoints():
    """Test fetch representative_points."""

    @staticmethod
    def test_fetch_representative_points_one_service_area():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_county_00000']
        results = representative_points.fetch_representative_points(
            service_areas, census_data=False, engine=engine
        )
        assert len(results) > 1000

    @staticmethod
    def test_fetch_representative_points_two_service_areas():
        """Test fetch_representative_points."""
        service_areas = ['ca_los_angeles_county_00000', 'ca_los_angeles_county_00000']
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
        service_areas = ['ca_los_angeles_county_00000']
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


class TestFetchCensus(object):
    """Test fetching of census data for service areas."""

    def setup(self):
        """Initialize a mock representative point dictionary with census data."""
        self.mock_point = {
            'id': 17323,
            'service_area_id': 'ca_los_angeles_county_00000',
            'lat': 74.38732,
            'lng': -122.323331,
            'county': 'Los Angeles',
            'population': 2000,
            'zip': '94105',
            'census_tract': 304,
            'demographics': {
                'age': {
                    '0-18 Years': 24.0,
                    '19-25 Years': 9.0,
                    '26-34 Years': 14.0,
                    '35-54 Years': 30.0,
                    '55-64 Years': 10.0,
                    '65+ Years': 10.0
                },
                'income': {
                    '$100k - $150k': 17.0,
                    '$150k - $200k': 9.0,
                    '$15k - $50k': 24.0,
                    '$50k - $100k': 26.0,
                    '< $15k': 8.0,
                    '> $200k': 13.0
                },
                'insurance': {
                    'No Health Insurance': 8.0,
                    'Private Health Insurance': 71.0,
                    'Public Health Insurance': 29.0
                },
                'race': {
                    'American Indian & Alaska Native': 0.0,
                    'Asian': 28.0,
                    'Black': 11.0,
                    'Hispanic or Latino (any race)': 22.0,
                    'Multiracial or Other': 4.0,
                    'Native Hawaiian & other Pacific Islander': 0.0,
                    'White': 31.0
                },
                'sex': {
                    'Female': 51.0, 'Male': 48.0
                }
            }
        }

    @mock.patch('backend.lib.fetch.representative_points.fetch_representative_points')
    def test_fetch_census_info_by_service_area(self, mock_fetch_rps):
        """Test fetch_census_info_by_service_area."""
        mock_fetch_rps.return_value = [self.mock_point] * 10
        output = census.fetch_census_info_by_service_area(['ca_los_angeles_county_00000'], engine)
        assert output['ca_los_angeles_county_00000'] == self.mock_point['demographics']

    @staticmethod
    @mock.patch('backend.lib.fetch.representative_points.fetch_representative_points')
    def test_fetch_census_info_by_service_area_missing_service_area(mock_fetch_rps):
        """Test fetch_census_info_by_service_area for a non-existent service area."""
        mock_fetch_rps.return_value = []
        output = census.fetch_census_info_by_service_area(['i_am_not_a_valid_service_area'], engine)
        assert output == {}
