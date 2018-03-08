"""Test loading of representative points."""
from backend.runners import load_representative_points

import geojson

FILEPATH = 'data/sample/los-angeles-points.geojson'


def _load_geojson(filepath):
    with open(FILEPATH, 'r') as f:
        return geojson.load(f)['features']


def test_fake_state():
    json_features = _load_geojson(FILEPATH)
    faked_points = load_representative_points._fake_data(json_features, 'test_state')
    expected_faked_point = {
        'geometry': {
            'coordinates':
                [-118.5737432137393, 33.02345370094241],
                'type': 'Point'
        },
        'properties': {
            'county': 'county',
            'countyfp': '',
            'population': 5.683404445648193,
            'state': 'test_state',
            'statefp': '',
            'tractce': '',
            'zip_code': '00000'
        },
        'type': 'Feature'
    }
    assert faked_points[0] == expected_faked_point


def test_get_all_service_areas():
    json_features = _load_geojson(FILEPATH)
    # Test data has no ZIP code, so let's fake it.
    json_features = load_representative_points._fake_zip(json_features)
    service_areas = load_representative_points._get_all_service_areas(json_features)
    excpected_service_area = [
        {
            'service_area_id': 'ca_los_angeles_county_00000',
            'county': 'Los Angeles County',
            'state': 'CA',
            'zip_code': '00000',
            'location': 'POLYGON((-118.92710934124173 33.02345370094241,'
                        ' -117.6521542981911 33.02345370094241,'
                        ' -117.6521542981911 34.818454460221425,'
                        ' -118.92710934124173 34.818454460221425,'
                        ' -118.92710934124173 33.02345370094241))',
            'state_fips': '06',
            'county_fips': '037',
            'nchs_urban_rural_code': '1'
        }
    ]
    assert service_areas == excpected_service_area


def test_get_all_service_areas_fake_data():
    json_features = _load_geojson(FILEPATH)
    # Test data has no ZIP code, so let's fake it.
    json_features = load_representative_points._fake_zip(json_features)
    json_features = load_representative_points._fake_data(json_features, 'wonderland')
    service_areas = load_representative_points._get_all_service_areas(json_features)

    excpected_service_area = [
        {
            'service_area_id': 'wonderland_county_00000',
            'county': 'county',
            'state': 'wonderland',
            'zip_code': '00000',
            'location': 'POLYGON((-118.92710934124173 33.02345370094241,'
                        ' -117.6521542981911 33.02345370094241,'
                        ' -117.6521542981911 34.818454460221425,'
                        ' -118.92710934124173 34.818454460221425,'
                        ' -118.92710934124173 33.02345370094241))',
            'state_fips': '',
            'county_fips': '',
            'nchs_urban_rural_code': None
        }
    ]
    assert service_areas == excpected_service_area


def test_get_urban_rural_code_map():
    urban_code_dict = load_representative_points._get_urban_rural_code_map(
        filepath='data/urban_rural_codes/NCHSURCodes2013.txt'
    )

    assert urban_code_dict[('01', '001')] == '3'
