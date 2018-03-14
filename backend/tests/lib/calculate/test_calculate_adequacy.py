"""Test calculate adequacies."""
from functools import partial

from backend.lib.calculate import adequacy
from backend.lib.database.postgres import connect
from backend.lib.utils.datatypes import Point
from backend.models.measurers import get_measurer

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


def test_find_closest_location():
    point = {
        'id': 0,
        'latitude': 37.74753421600008,
        'longitude': -122.2316317029999,
    }
    locations = [
        Point(**{'latitude': 37.74753421600008, 'longitude': -122.2316317029999}),
        Point(**{'latitude': 32.74753421600008, 'longitude': -122.2316317029999}),
    ]
    output = adequacy._find_closest_location(
        point=point,
        measurer=get_measurer('haversine'),
        locations=locations,
    )

    expected = {
        'id': point['id'],
        'closest_point': Point(latitude=37.74753421600008, longitude=-122.2316317029999),
        'to_closest_provider': 0
    }

    assert output == expected


def test_calculate_adequacies():
    measurer_name = 'haversine'
    locations = [
        {'id': 1, 'latitude': 33.77500830300005, 'longitude': -118.11176916399995},
        {'id': 2, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999},
        {'id': 3, 'latitude': 33.77500830300005, 'longitude': -118.11176916399995}
    ]
    adequacies = adequacy.calculate_adequacies(
        service_area_ids=['ca_los_angeles_county_00000'],
        measurer_name=measurer_name,
        locations=locations,
        engine=engine,
        radius_in_meters=1000
    )
    assert adequacies[0]['closest_providers'] == [1, 3]
    assert adequacies is not None


def test_get_locations_to_check_by_service_area():
    locations = [
        Point(**{'latitude': 33.77500830300005, 'longitude': -118.11176916399995}),
        Point(**{'latitude': 85.00000000000000, 'longitude': -100.00000000000000})
    ]
    output = adequacy._get_locations_to_check_by_service_area(
        service_area_ids=['ca_los_angeles_county_00000'],
        locations=locations,
        radius_in_meters=10**4,
        engine=engine,
    )['ca_los_angeles_county_00000']
    assert output == [locations[0]]
