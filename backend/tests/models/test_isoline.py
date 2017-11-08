"""Tests for methods for generating isolines and isochrones."""
from backend.models import isoline

import osmnx

import pytest

import shapely.geometry


class TestIsolineGeneration():
    """Test all metrics in the distance module."""

    def setup(self):
        """Initialize test points."""
        self.newport_ri = shapely.geometry.Point(-71.312796, 41.49008)
        self.cleveland_oh = shapely.geometry.Point(-81.695391, 41.499498)
        self.graph = osmnx.core.graph_from_bbox

    def test_base_isoliner_class_raises_not_implemented_error(self):
        """The base interface for isolines should raise a NotImplementedError."""
        measurer = isoline.Isoliner(api_url=None, api_key=None)
        with pytest.raises(NotImplementedError):
            measurer.get_single_isodistance_polygon(
                point=self.newport_ri,
                radius_in_miles=15.0
            )

    def test_osm_isoliner_class(self):
        """Test that isodistances can be calculated using Open Street Maps."""
        isoliner = isoline.OSMIsoliner()
        # FIXME: Store an OSM graph for use during tests.
        graph = osmnx.core.graph_from_bbox(
            north=self.newport_ri.y + 10**-3,
            south=self.newport_ri.y - 10**-3,
            east=self.newport_ri.x + 10**-3,
            west=self.newport_ri.x - 10**-3,
            network_type='drive',
            simplify=True
        )
        polygon = isoliner.get_single_isodistance_polygon(
            graph=graph,
            point=self.newport_ri,
            radius_in_miles=15
        )

        assert polygon.is_valid
