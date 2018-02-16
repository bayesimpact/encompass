"""Methods to update representative population points and service areas in the database."""
# TODO: Add tests for these methods.
import argparse
import collections

from backend.lib.database.postgres import connect, postgis
from backend.lib.database.postgres import methods
from backend.lib.database.tables import representative_point, service_area

import geojson


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
    return parser.parse_args().__dict__


def _main(kwargs):
    """
    Add all service areas and representative points from a specified file into PostGIS.

    The file should be a GeoJSON feature collection, where each feature has geometry type Point.
    Each feature should have the following properties:
        - state: str
        - county: str
        - zip_code: str
        - population: mapping (distance cutoff --> population at that cutoff)

    Note: To ensure referential integrity, service areas must be added first.
    """
    with open(kwargs['filepath'], 'r') as f:
        json_features = geojson.load(f)['features']

    _insert_service_areas(json_features)
    _insert_representative_population_points(json_features)


def _insert_service_areas(json_features):
    """Insert service areas into the database from a GeoJSON file."""
    data = _get_all_service_areas(json_features)
    try:
        methods.core_insert(
            engine=connect.create_db_engine(),
            sql_class=service_area.ServiceArea,
            data=data,
            return_insert_ids=False,
            unique=False
        )
        return data
    except Exception as e:
        print('Error inserting service areas: {}'.format(e))


def _insert_representative_population_points(json_features):
    """Insert representative points into the database from a GeoJSON file."""
    data = [_transform_single_point(point) for point in json_features]
    try:
        methods.core_insert(
            engine=connect.create_db_engine(),
            sql_class=representative_point.RepresentativePoint,
            data=data,
            return_insert_ids=False,
            unique=False
        )
        return data
    except Exception as e:
        print('Error inserting representative points: {}'.format(e))


def _transform_single_point(point):
    """Convert a single feature to the format expected by the database."""
    return {
        'latitude': point['geometry']['coordinates'][1],
        'longitude': point['geometry']['coordinates'][0],
        'location': postgis.to_point(
            longitude=point['geometry']['coordinates'][0],
            latitude=point['geometry']['coordinates'][1]
        ),
        'population': point['properties']['population']['1.0'],
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
        ),
        'census_block_group': '{statefp}{countyfp}{tractce}{blkgrpce}'.format(
            statefp=point['properties']['statefp'],
            countyfp=point['properties']['countyfp'],
            tractce=point['properties']['tractce'],
            blkgrpce=point['properties']['blkgrpce']
        )
    }


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
            'county_fips': point['properties']['countyfp'],
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
        service_areas.append({
            'service_area_id': '{state}_{county}_{zip}'.format(
                state=state.lower(),
                county=_sanitize_county_name_in_service_area_id(county),
                zip=zip_code
            ),
            'county': county,
            'state': state,
            'zip_code': zip_code,
            'location': postgis.to_polygon(geometry),
            'state_fips': service_area_to_fips_codes[(state, county, zip_code)]['state_fips'],
            'county_fips': service_area_to_fips_codes[(state, county, zip_code)]['county_fips'],
        })

    return service_areas


CHARACTER_SUBSTITUTIONS = collections.OrderedDict({
    ' ': '_',
    '.': '',
    '-': '_',
})


def _sanitize_county_name_in_service_area_id(county, replacement_mapping=CHARACTER_SUBSTITUTIONS):
    """Clean a county string for use in the service_area_id field."""
    result = county.lower()
    for original_str, replacement_str in replacement_mapping.items():
        result = result.replace(original_str, replacement_str)
    return result


if __name__ == '__main__':
    _main(_get_arguments())
