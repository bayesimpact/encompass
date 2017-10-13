"""All methods that create or fetch Isolines from different services."""
import networkx as nx
import osmnx
from shapely import geometry
import geopandas as gpd

from models.lib.time_distance_model import _miles_to_meters


class Isoliner():
    """Base Isoliner Class to be inherited."""

    def __init__(self, api_url=None, api_key=None):
        """Initialize the isoliner class."""
        self.api_url = api_url
        self.api_key = api_key

    def get_single_isodistance_polygon(self, point, radius_in_miles):
        """Get an isodistance polygon for the given point and radius."""
        raise NotImplementedError("get_isocrone is a required method.")


class OSMIsonliner(Isoliner):
    """Generic Isoliner class."""

    def __init__(self, *args, **kwargs):
        """Instantiate a OSMIsoliner."""
        super(OSMIsonliner, self).__init__(*args, **kwargs)

    def get_single_isodistance_polygon(self, graph, point, radius_in_miles):
        """Given a point, return the isodistance polygon."""
        iso_nodes = self.get_isodistance_nodes(graph, point, radius_in_miles)
        # TODO: change this to concave hull.
        return gpd.GeoSeries(iso_nodes).unary_union.convex_hull

    def get_isodistance_nodes(self, graph, point, radius_in_miles):
        """Given a point and radius, return a bounding polygon of the isochorne in graph."""
        radius = _miles_to_meters(radius_in_miles)
        center_node = self._get_nearest_node(graph, point)
        subg = nx.ego_graph(graph, center_node, radius, distance='length')
        isodistance_nodes = [geometry.Point((d['x'], d['y'])) for node, d in subg.nodes(data=True)]
        return isodistance_nodes

    def _get_nearest_node(self, graph, point):
        """Given a point, return the nearest node in a graph."""
        return osmnx.get_nearest_node(graph, (point.y, point.x))


class MapBoxIsoliner():
    """Isoline class for MapBox API."""

    def __init__(self, *args, **kwargs):
        """Instantiate a MapBoxIsoliner."""
        super(MapBoxIsoliner, self).__init__(*args, **kwargs)

    def get_single_isodistance_polygon(self, point, radius_in_miles):
        """Get isodistance polygon for a given point at a given radius in miles."""
        # TODO: Implement this.
        pass
