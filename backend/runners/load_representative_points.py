"""Methods to update representative population points and service areas in the database."""
# TODO: Add tests for these methods.
import argparse
import collections

from backend.lib.database.postgres import connect, postgis
from backend.lib.database.postgres import maintenance
from backend.lib.database.postgres import methods
from backend.lib.database.tables import representative_point, service_area

import geojson

import pandas as pd

# Map of GeoJSON feature attributes in the form new_name: old_name.
ATTRIBUTE_MAPPING = {
    'county': 'name_2'
}
FAKE_ZIP_CODE = '00000'
FAKE_COUNTY = 'county'


def _get_arguments():
    """Build argument parser."""
    parser = argparse.ArgumentParser(description="""
        This script loads representative population point data from a specified file into PostGIS.
    """)
    parser.add_argument(
        '-f', '--filepath',
        help='GeoJSON filepath containing representative population point data.',
        required=True,
        type=str
    )
    parser.add_argument(
        '-s', '--fake_state',
        help=('Fake state name to use to fill in GeoJSON. If a fake state is provided, '
              'all census and urban data will be faked.'),
        required=False,
        type=str
    )
    return parser.parse_args().__dict__


def _fake_zip(json_features, fake_zip=FAKE_ZIP_CODE):
    """Fake ZIP code."""
    for ft in json_features:
        ft['properties']['zip_code'] = fake_zip
    return json_features


def _fake_data(json_features, fake_state, attribute_mapping=ATTRIBUTE_MAPPING):
    """
    Fake ZIP code, state, county, statefp, countyfp and tractce.

    If all attributes specified in attribute_mapping are present in the features, these values
    will be used for the new attributes. Otherwise, the constants at the top of the file are used.
    """
    if not json_features:
        return json_features

    for ft in json_features:
        ft['properties']['zip_code'] = FAKE_ZIP_CODE or '00000'
        ft['properties']['state'] = fake_state
        ft['properties']['county'] = FAKE_COUNTY
        ft['properties']['statefp'] = ''
        ft['properties']['countyfp'] = ''
        ft['properties']['tractce'] = ''

    # If every attribute in the mapping is present, set the new attribute equal to the value of
    # the old attribute.
    if all(attribute in json_features[0]['properties'] for attribute in attribute_mapping.values()):
        for new_attribute, old_attribute in attribute_mapping.items():
            for ft in json_features:
                ft['properties'][new_attribute] = ft['properties'][old_attribute]

    return json_features


def _main(kwargs):
    """
    Add all service areas and representative points from a specified file into PostGIS.

    The file should be a GeoJSON feature collection, where each feature has geometry type Point.
    Each feature should have the following properties:
        - state: str
        - county: str
        - population: float

    Note: To ensure referential integrity, service areas must be added first.
    """
    with open(kwargs['filepath'], 'r') as f:
        json_features = geojson.load(f)['features']

    if FAKE_ZIP_CODE:
        json_features = _fake_zip(json_features, fake_zip=FAKE_ZIP_CODE)

    # If a fake state is used, fake all data.
    if kwargs['fake_state']:
        json_features = _fake_data(json_features, fake_state=kwargs['fake_state'])

    _insert_service_areas(json_features)
    _insert_representative_population_points(json_features)
    maintenance.vacuum()
    maintenance.cluster()


def _insert_service_areas(json_features):
    """Insert service areas into the database from a GeoJSON file."""
    print('Inserting service areas...')
    data = _get_all_service_areas(json_features)
    try:
        methods.core_insert(
            engine=connect.create_db_engine(),
            sql_class=service_area.ServiceArea,
            data=data,
            return_insert_ids=False,
        )
    except Exception as e:
        print('Error inserting service areas: {}'.format(str(e)[:1000]))


def _insert_representative_population_points(json_features):
    """Insert representative points into the database from a GeoJSON file."""
    print('Inserting representative points...')
    data = [_transform_single_point(point) for point in json_features]
    try:
        methods.core_insert(
            engine=connect.create_db_engine(),
            sql_class=representative_point.RepresentativePoint,
            data=data,
            return_insert_ids=False,
        )
        return data
    except Exception as e:
        print('Error inserting representative points: {}'.format(str(e)[:1000]))


def _transform_single_point(point):
    """Convert a single feature to the format expected by the database."""
    representative_point = {
        'latitude': point['geometry']['coordinates'][1],
        'longitude': point['geometry']['coordinates'][0],
        'location': postgis.to_point(
            longitude=point['geometry']['coordinates'][0],
            latitude=point['geometry']['coordinates'][1]
        ),
        'population': point['properties']['population'],
        'county': point['properties']['county'],
        'zip_code': point['properties']['zip_code'],
        'service_area_id': '{state}_{county}_{zip}'.format(
            state=point['properties']['state'].lower(),
            county=_sanitize_county_name_in_service_area_id(point['properties']['county']),
            zip=point['properties']['zip_code']
        ),
        'census_tract': '{statefp}{countyfp}{tractce}'.format(
            statefp=point['properties']['statefp'],
            countyfp=point['properties']['countyfp'],
            tractce=point['properties']['tractce'],
        )
    }
    return representative_point


def _get_all_service_areas(features):
    """
    Extract service area information from a list of JSON features.

    Each feature should have `state`, `county`, `zip_code` attributes.
    """
    service_area_to_coords = collections.defaultdict(list)
    service_area_to_fips_codes = {}
    for point in features:
        service_area_id = (
            point['properties']['state'],
            point['properties']['county'],
            point['properties']['zip_code']
        )
        service_area_to_coords[service_area_id].append(point['geometry']['coordinates'])
        service_area_to_fips_codes[service_area_id] = {
            'state_fips': point['properties']['statefp'],
            'county_fips': point['properties']['countyfp']
        }

    service_area_to_bounding_box = {
        service_area: {
            'min_lon': min(p[0] for p in coords),
            'max_lon': max(p[0] for p in coords),
            'min_lat': min(p[1] for p in coords),
            'max_lat': max(p[1] for p in coords),
        }
        for service_area, coords in service_area_to_coords.items()
    }

    urban_rural_designations = _get_urban_rural_code_map()

    service_areas = []
    for state, county, zip_code in service_area_to_bounding_box:
        bbox = service_area_to_bounding_box[(state, county, zip_code)]
        geometry = [
            (bbox['min_lon'], bbox['min_lat']),
            (bbox['max_lon'], bbox['min_lat']),
            (bbox['max_lon'], bbox['max_lat']),
            (bbox['min_lon'], bbox['max_lat']),
            (bbox['min_lon'], bbox['min_lat']),
        ]

        service_area = {
            'service_area_id': '{state}_{county}_{zip}'.format(
                state=state.lower(),
                county=_sanitize_county_name_in_service_area_id(county),
                zip=zip_code
            ),
            'county': county,
            'state': state,
            'zip_code': zip_code,
            'location': postgis.to_polygon(geometry),
            'state_fips': service_area_to_fips_codes[(state, county, zip_code)].get(
                'state_fips', ''
            ),
            'county_fips': service_area_to_fips_codes[(state, county, zip_code)].get(
                'county_fips', ''
            )
        }

        service_area['nchs_urban_rural_code'] = urban_rural_designations.get(
            (service_area['state_fips'], service_area['county_fips']),
            None
        )

        service_areas.append(service_area)

    return service_areas


def _get_urban_rural_code_map(filepath='data/urban_rural_codes/NCHSURCodes2013.txt'):
    """
    Return a map (state_fips, county_fips) --> NCHS urban/rural code.

    This map is used to populate the nchs_urban_rural_code column in the service_areas table.
    """
    colspecs = [
        (0, 2),
        (2, 5),
        (6, 8),
        (9, 45),
        (46, 96),
        (97, 105),
        (106, 114),
        (115, 116),
        (117, 118),
        (119, 120),
    ]
    names = [
        'statefips',
        'countyfips',
        'state',
        'county',
        'cbsa_title',
        'cbsa_population',
        'county_population',
        'urban_rural_code_2013',
        'urban_rural_code_2006',
        'urban_rural_code_1990',
    ]
    raw_data = pd.read_fwf(
        filepath,
        colspecs=colspecs,
        names=names,
        dtype=str
    )
    return raw_data.set_index(['statefips', 'countyfips'])['urban_rural_code_2013'].to_dict()


CHARACTER_SUBSTITUTIONS = collections.OrderedDict({
    ' ': '_',   # San Luis Obispo County
    '.': '',    # St. Louis County
    '-': '_',   # Miami-Dade County
    '\'': ''    # Queen Anne's County
})


def _sanitize_county_name_in_service_area_id(county, replacement_mapping=CHARACTER_SUBSTITUTIONS):
    """Clean a county string for use in the service_area_id field."""
    result = county.lower()
    for original_str, replacement_str in replacement_mapping.items():
        result = result.replace(original_str, replacement_str)
    return result


if __name__ == '__main__':
    arguments = _get_arguments()
    print('Adding file - %s with args - %s' % (arguments['filepath'], arguments))
    _main(arguments)
