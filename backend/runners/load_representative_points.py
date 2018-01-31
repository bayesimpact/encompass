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
        print("Error inserting service areas: {}".format(e))


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
        print("Error inserting representative points")


def _transform_single_point(point):
    """Convert a single feature to the format expected by the database."""
    return {
        'latitude': point['geometry']['coordinates'][1],
        'longitude': point['geometry']['coordinates'][0],
        'location': postgis.to_point(
            longitude=point['geometry']['coordinates'][0],
            latitude=point['geometry']['coordinates'][1]
        ),
        # FIXME: Once appropriate behavior is implemented in the frontend,
        # move to a more honest representation for this column.
        'population': point['properties']['population'],
        'county': point['properties']['county'],
        'zip_code': point['properties']['zip_code'],
        'service_area_id': '{state}_{county}_{zip}'.format(
            state=point['properties']['state'].lower(),
            county=point['properties']['county'].lower().replace(' ', '_'),
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
    for point in features:
        key = (
            point['properties']['state'],
            point['properties']['county'],
            point['properties']['zip_code']
        )
        service_area_to_coords[key].append(point['geometry']['coordinates'])

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
        c = service_area_to_bounding_box[(state, county, zip_code)]
        bbox = [
            (c['min_lon'], c['min_lat']),
            (c['max_lon'], c['min_lat']),
            (c['max_lon'], c['max_lat']),
            (c['min_lon'], c['max_lat']),
            (c['min_lon'], c['min_lat']),
        ]
        service_areas.append({
            'service_area_id': '{state}_{county}_{zip}'.format(
                state=state.lower(),
                county=county.lower().replace(' ', '_'),
                zip=zip_code
            ),
            'county': county,
            'state': state,
            'zip_code': zip_code,
            'location': postgis.to_polygon(bbox)
        })

    return service_areas


if __name__ == '__main__':
    _main(_get_arguments())
