"""All methods that create or fetch Isolines from different services."""
import networkx as nx
import osmnx as ox
from shapely import geometry
import geopandas as gpd

from models.lib.time_distance_model import _miles_to_meters


class OSMIsonliner():
    """Generic Isoliner class."""

    def __init__(self, api_url=None, api_key=None):
        """Initialize the isoliner class."""
        self.api_url = api_url
        self.api_key = api_key

    def get_isochrone_nodes(self, graph, point, radius_in_miles):
        """Given a point and radius, return a bounding polygon of the isochorne in graph."""
        radius = _miles_to_meters(radius_in_miles)
        center_node = self._get_nearest_node(graph, point)
        subg = nx.ego_graph(graph, center_node, radius, distance='length')
        isochrone_nodes = [geometry.Point((d['x'], d['y'])) for node, d in subg.nodes(data=True)]
        return isochrone_nodes

    def get_single_isochrone_polygon(self, graph, point, radius_in_miles):
        """Given a point, return the isochrone polygon."""
        iso_nodes = self.get_isochrone_nodes(graph, point, radius_in_miles)
        # TODO: change this to concave hull.
        return gpd.GeoSeries(iso_nodes).unary_union.convex_hull

    def _get_nearest_node(self, graph, point):
        """Given a point, return the nearest node in a graph."""
        return ox.get_nearest_node(graph, (point.y, point.x))
