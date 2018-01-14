"""Test row_to_dict functions."""
from backend.lib.database.tables import representative_point


def test_representative_point_to_row():
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
        'population': {'1.0': 200},
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
