"""All implementations of isochorne model for time and distance problem of network adequacy."""
import logging
import math

import osmnx as ox

import pandas as pd

from shapely import geometry

logger = logging.getLogger(__name__)


class TimeDistanceModel(object):
    """Generic time and distance model object."""

    def __init__(self, isoliner, service_area, graph=None, logger=logger):
        """Initialize the class."""
        self.logger = logger
        self.isoliner = isoliner
        self.service_area = service_area
        self.bounding_box = None
        self.graph = graph or None
        self.all_isolines = None
        self.covered_point_as = []
        self.uncovered_point_as = []

    def runner(self, point_as, point_bs, isoline_radius=15, enlarge_bbox_by_miles=15):
        """Run all necessary steps of the model."""
        print('Building the bounding box.')
        self.set_inclusive_bounding_box(enlarge_bbox_by_miles)

        print('Fetching graph inside the bounding box. This will take some time; be patient!')
        self.fetch_graph()

        print('Building all isolines from point As.')
        self.build_all_isolines(point_as, isoline_radius)

        print('Finding all point As that are not covered by providers.')
        self.find_point_as_covered_by_all_providers(point_bs)

        self.uncovered_point_as = set(range(len(point_as))) - self.covered_point_as

    def set_inclusive_bounding_box(self, enlarge_by_miles=15):
        """Given a polygon return a sufficiently large bbox with all possible nearest Point Bs."""
        service_area_bbox = self._get_bounding_box(self.service_area)
        self.bounding_box = enlarge_box(service_area_bbox, enlarge_by_miles)
        return self.bounding_box

    def fetch_graph(self):
        """Given a bbox, return OSM graph of driving routes."""
        if not self.graph:
            if self.bounding_box:
                self.graph = ox.graph_from_polygon(self.bounding_box, network_type='drive')
            else:
                print('No bounding box is defined.')
        else:
            print('Already fetched a graph. To override, clear_graph first')

    def clear_graph(self):
        """Clear current model's graph."""
        self.graph = None

    def build_all_isolines(self, points, radius_in_miles):
        """Given a list of points, return all their isochrone polygons."""
        isoline_polygons = []
        for point in points:
            isoline_polygon = self.isoliner(self.graph, point, radius_in_miles)
            isoline_polygons.append(isoline_polygon)
        self.all_isolines = list(zip(points, isoline_polygons))
        return self.all_isolines

    def _is_point_within_polygon(self, point, polygon):
        if isinstance(point, geometry.Point):
            return polygon.contains(point)
        return

    def if_single_provider_within_all_isolines(self, provider_point):
        """Check if a provider covers all point As."""
        covering, not_covering = [], []
        for point_a_id, (point_a, isoline) in enumerate(self.all_isolines):
            is_within = self._is_point_within_polygon(provider_point, isoline)
            covering.append(point_a_id) if is_within else not_covering.append(point_a_id)
        return pd.Series([covering, not_covering], index=['covering_points', 'not_covering_points'])

    def find_point_as_covered_by_all_providers(self, provider_points):
        """Given a list of providers, check all of them."""
        res = []
        for provider_point in provider_points:
            res.append(self.if_single_provider_within_all_isolines(provider_point))

        self.covered_point_as = set(sum([x['covering_points'] for x in res], []))
        return res

    def _get_bounding_box(self, polygon):
        return geometry.box(
            polygon.bounds[0],
            polygon.bounds[1],
            polygon.bounds[2],
            polygon.bounds[3])


def enlarge_box(small_box, half_side_in_miles):
    """Given coordinates of a box, returns a larger box."""
    assert half_side_in_miles > 0
    small_box_coords = small_box.bounds
    assert small_box_coords[0] >= -180.0 and small_box_coords[0] <= 180.0
    assert small_box_coords[1] >= -90.0 and small_box_coords[1] <= 90.0
    assert small_box_coords[2] >= -180.0 and small_box_coords[2] <= 180.0
    assert small_box_coords[3] >= -90.0 and small_box_coords[3] <= 90.0

    half_side_in_km = _miles_to_meters(half_side_in_miles) / 1000

    radius = 6371
    # Radius of the parallel at given latitude
    parallel_radius = radius * math.cos(math.radians(small_box_coords[1]))

    lon_min = math.radians(small_box_coords[0]) - half_side_in_km / parallel_radius
    lat_min = math.radians(small_box_coords[1]) - half_side_in_km / radius
    lon_max = math.radians(small_box_coords[2]) + half_side_in_km / parallel_radius
    lat_max = math.radians(small_box_coords[3]) + half_side_in_km / radius

    rad2deg = math.degrees

    lat_min = rad2deg(lat_min)
    lon_min = rad2deg(lon_min)
    lat_max = rad2deg(lat_max)
    lon_max = rad2deg(lon_max)
    large_box = geometry.box(lon_min, lat_min, lon_max, lat_max)

    return (large_box)


def _miles_to_meters(distance_in_miles):
    return distance_in_miles * 1609.344


def _meters_to_miles(distance_in_meters):
    return distance_in_meters / 1609.344
