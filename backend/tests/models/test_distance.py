"""Tests for methods measuring distance between two series of points."""
from backend.models import distance

import pytest

import shapely.geometry


class TestMetrics():
    """Test all metrics in the distance module."""

    def setup(self):
        """Initialize test points."""
        self.newport_ri = shapely.geometry.Point(-71.312796, 41.49008)
        self.cleveland_oh = shapely.geometry.Point(-81.695391, 41.499498)

    def test_haversine_distance_class(self):
        """Check that the haversine distance matches expectations."""
        measurer = distance.HaversineDistance()
        d = measurer.get_distance_in_miles(self.newport_ri, self.cleveland_oh)
        assert abs(d - 537.148525) < 10**-5

    def test_haversine_distance_returns_none_when_a_point_is_missing(self):
        """Check that the haversine distance matches expectations."""
        measurer = distance.HaversineDistance()
        d1 = measurer.get_distance_in_miles(self.newport_ri, None)
        d2 = measurer.get_distance_in_miles(None, self.cleveland_oh)

        assert d1 is None
        assert d2 is None

    def test_measure_distance_class_raises_not_implemented_error(self):
        """The base interface for measurement should raise a NotImplementedError."""
        measurer = distance.MeasureDistance(api_url=None, api_key=None)
        with pytest.raises(NotImplementedError):
            measurer.get_distance_in_miles(self.newport_ri, self.cleveland_oh)
