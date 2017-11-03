"""Methods to update representative population points in the database."""
from backend.lib.database.postgres import connect
from backend.lib.database.postgres import methods
from backend.lib.database.tables import representative_point, service_area

import geojson


# TODO: Add tests for these methods.

def insert_service_areas(json_path='data/representative_points.geojson'):
    """Insert service areas into the database from a GeoJSON file."""
    with open(json_path, 'r') as f:
        json_features = geojson.load(f)['features']

    data = _get_all_service_areas(json_features)

    results = methods.core_insert(
        engine=connect.create_db_engine(),
        sql_class=service_area.ServiceArea,
        data=data,
        return_insert_ids=False,
        unique=False
    )
    return results


def insert_representative_population_points(json_path='data/representative_points.geojson'):
    """Insert representative points into the database from a GeoJSON file."""
    with open(json_path, 'r') as f:
        json_features = geojson.load(f)['features']

    data = [_transform_single_point(point) for point in json_features]

    results = methods.core_insert(
        engine=connect.create_db_engine(),
        sql_class=representative_point.RepresentativePoints,
        data=data,
        return_insert_ids=False,
        unique=False
    )
    return results


def _transform_single_point(point):
    return {
        'latitude': point['geometry']['coordinates'][1],
        'longitude': point['geometry']['coordinates'][0],
        'population': point['properties']['population'],
        'county': point['properties']['county'],
        'zip_code': point['properties']['zip'],
        'service_area_id': '{state}_{county}_{zip}'.format(
            state='ca',
            county=point['properties']['county'].lower().replace(' ', '_'),
            zip=point['properties']['zip']
        )
    }


def _get_all_service_areas(features):
    service_area_tuples = {
        (point['properties']['county'], point['properties']['zip'])
        for point in features
    }

    service_areas = []
    for county, zip_code in service_area_tuples:
        service_areas.append({
            'service_area_id': '{state}_{county}_{zip}'.format(
                state='ca',
                county=county.lower().replace(' ', '_'),
                zip=zip_code
            ),
            'county': county,
            'zip_code': zip_code
        })

    return service_areas
