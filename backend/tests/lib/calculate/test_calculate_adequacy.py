"""Test calculate adequacies."""
from functools import partial

from backend.lib.calculate import adequacy
from backend.lib.database.postgres import connect

import pyproj

from shapely import ops, wkt


engine = connect.create_db_engine()


def area_in_square_meters(polygon):
    """Calculate area in square meters."""
    projection = partial(
        pyproj.transform, pyproj.Proj(init='epsg:4326'),
        pyproj.Proj(init='epsg:3857')
    )
    return ops.transform(projection, polygon).area


def test_fetch_service_area_polygons_db_no_radius():
    service_area_ids = ['ca_alameda_94502']
    service_area = wkt.loads((
        'POLYGON ((-122.260377792 37.72227831000004, '
        '-122.2316317029999 37.72227831000004, '
        '-122.2316317029999 37.74753421600008, '
        '-122.260377792 37.74753421600008, '
        '-122.260377792 37.72227831000004))'
    ))
    results = adequacy._fetch_service_area_polygons_db(
        service_area_ids=service_area_ids,
        engine=engine,
        radius_in_meters=0
    )
    diff_pol = results[service_area_ids[0]].difference(service_area)
    assert area_in_square_meters(diff_pol) < 1


def test_fetch_service_area_polygons_db_radius():
    service_area_ids = ['ca_alameda_94502']
    service_area = wkt.loads((
        'POLYGON ((-122.260377792 37.72227831000004, '
        '-122.2316317029999 37.72227831000004, '
        '-122.2316317029999 37.74753421600008, '
        '-122.260377792 37.74753421600008, '
        '-122.260377792 37.72227831000004))'
    ))
    results = adequacy._fetch_service_area_polygons_db(
        service_area_ids=service_area_ids,
        engine=engine,
        radius_in_meters=1000
    )

    diff_pol = results[service_area_ids[0]].difference(service_area)
    assert area_in_square_meters(diff_pol) > 1000


def test_find_addresses_near_service_area():
    service_area_polygon = adequacy._fetch_service_area_polygons_db(
        service_area_ids=['ca_alameda_94502'],
        engine=engine,
        radius_in_meters=10**4
    )['ca_alameda_94502']
    filtered_providers = adequacy._find_addresses_near_service_area(
        service_area_polygon=service_area_polygon,
        providers=[
            {'id': 1, 'latitude': 37.74753421600008, 'longitude': -122.2316317029999},
            {'id': 3, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
        ]
    )

    assert len(filtered_providers) == 1


def test_calculate_adequacies():

    adequacies = adequacy.calculate_adequacies(
        service_area_ids=['ca_alameda_94502'],
        provider_ids=[1, 2],
        engine=engine,
        radius_in_meters=1000
    )

    assert adequacies is not None
