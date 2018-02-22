"""Tests for methods measuring distance between two series of points."""
from backend.lib.utils.datatypes import Point
from backend.models import base
from backend.models import distance

import pytest


NEWPORT_RI = Point(**{'longitude': -71.312796, 'latitude': 41.49008})
CLEVELAND_OH = Point(**{'longitude': -81.695391, 'latitude': 41.499498})
EUCLID_OH = Point(**{'longitude': -81.526787, 'latitude': 41.593105})
NASSAU = Point(**{'longitude': -77.3554, 'latitude': 25.0480})
MIAMI_FL = Point(**{'longitude': -80.1918, 'latitude': 25.7617})


class TestMetrics():
    """Test base metrics in the distance module."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        self.measurer = distance.HaversineDistance()

    def test_haversine_distance_class(self):
        """Check that the haversine distance matches expectations."""
        d = self.measurer.measure_between_two_points(NEWPORT_RI, CLEVELAND_OH)
        assert abs(d - 863.731 * 10**3) < 10**-2

    def test_haversine_distance_returns_none_when_a_point_is_missing(self):
        """Check that the haversine distance matches expectations."""
        d1 = self.measurer.measure_between_two_points(NEWPORT_RI, None)
        d2 = self.measurer.measure_between_two_points(None, CLEVELAND_OH)
        assert d1 is None
        assert d2 is None

    def test_measure_distance_class_raises_not_implemented_error(self):
        """The base interface for measurement should raise a NotImplementedError."""
        measurer = base.Measurer()
        with pytest.raises(NotImplementedError):
            measurer.measure_between_two_points(NEWPORT_RI, CLEVELAND_OH)

    def test_haversine_distance_closest(self):
        """Check that the haversine closest distance works."""
        closest_distance, closest_town = self.measurer.closest(
            origin=NASSAU,
            point_list=[NEWPORT_RI, CLEVELAND_OH]
        )
        assert closest_town == CLEVELAND_OH

    def test_haversine_distance_closest_with_early_exit(self):
        """Check that the haversine closest_with_early_exit distance works."""
        closest_distance, closest_town = self.measurer.closest_with_early_exit(
            origin=NASSAU,
            point_list=[MIAMI_FL, NASSAU, NEWPORT_RI, CLEVELAND_OH],
            exit_distance=320 * 10**3
        )
        assert closest_town == MIAMI_FL

        closest_distance, closest_town = self.measurer.closest_with_early_exit(
            origin=NASSAU,
            point_list=[MIAMI_FL, NASSAU, NEWPORT_RI, CLEVELAND_OH],
            exit_distance=80 * 10**3
        )
        assert closest_town == NASSAU
