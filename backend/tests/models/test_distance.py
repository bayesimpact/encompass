"""Tests for methods measuring distance between two series of points."""
from backend.models import distance

import pytest


class TestMetrics():
    """Test all metrics in the distance module."""

    def setup(self):
        """Initialize test points."""
        self.newport_ri = {'town': 'newport_ri', 'longitude': -71.312796, 'latitude': 41.49008}
        self.cleveland_oh = {'town': 'cleveland_oh', 'longitude': -81.695391, 'latitude': 41.499498}
        self.nassau = {'town': 'nassau', 'longitude': -77.3554, 'latitude': 25.0480}
        self.miami = {'town': 'nassau', 'longitude': -80.1918, 'latitude': 25.7617}

    def test_haversine_distance_class(self):
        """Check that the haversine distance matches expectations."""
        measurer = distance.HaversineDistance()
        d = measurer.get_distance_in_miles(self.newport_ri, self.cleveland_oh)
        assert abs(d - 536.6975637) < 10**-5

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

    def test_haversine_distance_closest(self):
        """Check that the haversine closest distance works."""
        measurer = distance.HaversineDistance()
        closest_distance, closest_town = measurer.closest(
            origin=self.nassau,
            point_list=[self.newport_ri, self.cleveland_oh]
        )
        assert closest_town == self.cleveland_oh

    def test_haversine_distance_closest_with_early_exit(self):
        """Check that the haversine closest_with_early_exit distance works."""
        measurer = distance.HaversineDistance()
        closest_distance, closest_town = measurer.closest_with_early_exit(
            origin=self.nassau,
            point_list=[self.miami, self.nassau, self.newport_ri, self.cleveland_oh],
            exit_distance=200
        )
        assert closest_town == self.miami

        closest_distance, closest_town = measurer.closest_with_early_exit(
            origin=self.nassau,
            point_list=[self.miami, self.nassau, self.newport_ri, self.cleveland_oh],
            exit_distance=50
        )
        assert closest_town == self.nassau
