"""Test row_to_dict functions."""
from backend.lib.database.tables import representative_point

CENSUS_MAPPING = {
    'age': {
        'census_acs_dp_05.hc03_vc08': 'percent_age_under_5_y',
        'census_acs_dp_05.hc03_vc09': 'percent_age_5_9_y',
        'census_acs_dp_05.hc03_vc10': 'percent_age_10_14_y',
        'census_acs_dp_05.hc03_vc11': 'percent_age_15_19_y'
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
        'zip_code': 'zip_code'
    }

    expected_output = {
        'id': 123,
        'census_tract': None,
        'county': 'county',
        'lat': 40,
        'lng': -79,
        'population': 200,
        'service_area_id': 'service_area_id',
        'zip': 'zip_code'
    }

    output_dict = representative_point.row_to_dict(rp_row)
    assert output_dict == expected_output


def test_prepare_demographics_dict_from_rows():
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
        'percent_age_under_5_y': 76
    }
    demographics = representative_point.prepare_demographics_dict_from_rows(
        rp_row, CENSUS_MAPPING
    )
    assert demographics == {'age': {'percent_age_under_5_y': 76.0}}


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
        'percent_age_under_5_y': 76
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
        'demographics': {'age': {'percent_age_under_5_y': 76.0}}
    }

    output_dict = representative_point.row_to_dict(rp_row, census_mapping=CENSUS_MAPPING)
    assert output_dict == expected_output
