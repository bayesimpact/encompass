"""Test calculate adequacies."""
from functools import partial

from backend.lib.calculate import adequacy
from backend.lib.database.postgres import connect
from backend.lib.utils.datatypes import Point

import pyproj

from shapely import ops


engine = connect.create_db_engine()


def area_in_square_meters(polygon):
    """Calculate area in square meters."""
    projection = partial(
        pyproj.transform, pyproj.Proj(init='epsg:4326'),
        pyproj.Proj(init='epsg:3857')
    )
    return ops.transform(projection, polygon).area


def test_calculate_adequacies():
    locations = [
        {'id': 1, 'latitude': 37.74753421600008, 'longitude': -122.2316317029999},
        {'id': 2, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
    ]
    adequacies = adequacy.calculate_adequacies(
        service_area_ids=['ca_alameda_94502'],
        locations=locations,
        engine=engine,
        radius_in_meters=1000
    )
    assert adequacies is not None


def test_get_locations_to_check_by_service_area():
    locations = [
        Point(**{'latitude': 37.74753421600008, 'longitude': -122.2316317029999}),
        Point(**{'latitude': 40.74753421600008, 'longitude': -80.2316317029999})
    ]
    output = adequacy._get_locations_to_check_by_service_area(
        service_area_ids=['ca_alameda_94502'],
        locations=locations,
        radius_in_meters=10**4,
        engine=engine,
    )['ca_alameda_94502']
    assert output == [locations[0]]
