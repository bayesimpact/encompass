"""Methods to update representative population points in the database."""
# TODO: Add tests for these methods.
import collections

from backend.lib.database.postgres import connect, postgis
from backend.lib.database.postgres import methods
from backend.lib.database.tables import representative_point, service_area

import geojson

STATE_TO_STATE_ID = {'california': 'ca', 'texas': 'tx'}


def _load_geojson_features(json_path='data/representative_points.geojson'):
    """Load representative points data as a GeoJSON feature collection."""
    with open(json_path, 'r') as f:
        json_features = geojson.load(f)['features']

    return json_features


def insert_service_areas(state, json_features=_load_geojson_features()):
    """Insert service areas into the database from a GeoJSON file."""
    data = _get_all_service_areas(state, json_features)

    methods.core_insert(
        engine=connect.create_db_engine(),
        sql_class=service_area.ServiceArea,
        data=data,
        return_insert_ids=False,
        unique=False
    )
    return data


def insert_representative_population_points(state, json_features=_load_geojson_features()):
    """Insert representative points into the database from a GeoJSON file."""
    data = [_transform_single_point(point, state) for point in json_features]

    methods.core_insert(
        engine=connect.create_db_engine(),
        sql_class=representative_point.RepresentativePoint,
        data=data,
        return_insert_ids=False,
        unique=False
    )
    return data


def _transform_single_point(point, state):
    """Convert a single feature to the format expected by the database."""
    return {
        'latitude': point['geometry']['coordinates'][1],
        'longitude': point['geometry']['coordinates'][0],
        'location': postgis.to_point(
            longitude=point['geometry']['coordinates'][0],
            latitude=point['geometry']['coordinates'][1]
        ),
        'population': _convert_population_list_to_population_dict(
            point['properties']['population']
        ),
        'state': state.lower(),
        'county': point['properties']['county'],
        'zip_code': point['properties']['zip'],
        'service_area_id': '{state}_{county}_{zip}'.format(
            state=STATE_TO_STATE_ID[state.lower()],
            county=point['properties']['county'].lower().replace(' ', '_'),
            zip=point['properties']['zip']
        )
    }


def _convert_population_list_to_population_dict(population_list, cutoffs=[0.5, 2.5, 5.0]):
    """
    Convert a list of populations at different cutoffs to a dictionary.

    Assumes that the population list is non-decreasing (starts with the largest cutoff).
    """
    return {
        cutoff: population
        for population, cutoff in zip(population_list[::-1], cutoffs)
    }


def _get_all_service_areas(state, features):
    """
    Extract service area information from a list of JSON features.

    Each feature should have `county` and `zip` attributes.
    """
    service_area_to_coords = collections.defaultdict(list)

    for point in features:
        key = (point['properties']['county'], point['properties']['zip'])
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
    for county, zip_code in service_area_to_bounding_box:
        c = service_area_to_bounding_box[(county, zip_code)]

        bbox = [
            (c['min_lon'], c['min_lat']),
            (c['max_lon'], c['min_lat']),
            (c['max_lon'], c['max_lat']),
            (c['min_lon'], c['max_lat']),
            (c['min_lon'], c['min_lat']),
        ]
        service_areas.append({
            'service_area_id': '{state}_{county}_{zip}'.format(
                state=STATE_TO_STATE_ID[state.lower()],
                county=county.lower().replace(' ', '_'),
                zip=zip_code
            ),
            'county': county,
            'state': state.lower(),
            'zip_code': zip_code,
            'location': postgis.to_polygon(bbox)
        })

    return service_areas
