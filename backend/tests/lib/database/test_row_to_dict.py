"""Test row_to_dict functions."""
from backend.lib.database.tables import representative_point

CENSUS_MAPPING = {
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


def test_representative_point_to_dict():
    """
    Test representative_point_row_to_dict.

    Assumes that the object can first be transformed into a dict.
    Verify that the ouput format is as expected.
    """
    rp_row = {
        'id': 123,
        'census_tract': None,
        'county': 'county',
        'latitude': 40,
        'longitude': -79,
        'population': 200.0,
        'service_area_id': 'service_area_id',
        'zip_code': 'zip_code',
        'random_extra_column': 'random_string'
    }

    expected_output = {
        'id': 123,
        'census_tract': None,
        'county': 'county',
        'lat': 40,
        'lng': -79,
        'population': 200,
        'zip': 'zip_code',
        'service_area_id': 'service_area_id'
    }

    output_dict = representative_point.row_to_dict(rp_row)
    assert output_dict == expected_output


def test_prepare_demographics_dict_from_row():
    """Test prepare_demographics."""
    rp_row = {
        'id': 123,
        'census_tract': None,
        'county': 'county',
        'latitude': 40,
        'longitude': -79,
        'population': 200.0,
        'service_area_id': 'service_area_id',
        'zip_code': 'zip_code',
        'zero_to_eighteen': 76
    }
    demographics = representative_point.prepare_demographics_dict_from_row(
        rp_row, CENSUS_MAPPING
    )
    assert demographics == {'age': {'0-18 Years': 76.0}}


def test_representative_point_to_dict_with_census():
    """Test rp_to_dict with census mapping passed in."""
    rp_row = {
        'id': 123,
        'census_tract': None,
        'county': 'county',
        'latitude': 40,
        'longitude': -79,
        'population': 200.0,
        'service_area_id': 'service_area_id',
        'zip_code': 'zip_code',
        'zero_to_eighteen': 76,
        'nineteen_to_twenty_five': None,
    }

    expected_output = {
        'id': 123,
        'census_tract': None,
        'county': 'county',
        'lat': 40,
        'lng': -79,
        'population': 200.0,
        'service_area_id': 'service_area_id',
        'zip': 'zip_code',
        'demographics': {
            'age': {'0-18 Years': 76.0, '19-25 Years': 0.0}
        }
    }

    output_dict = representative_point.row_to_dict(rp_row, census_mapping=CENSUS_MAPPING)
    assert output_dict == expected_output
