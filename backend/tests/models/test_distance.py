"""Tests for methods measuring distance between two series of points."""
from backend.models import distance

import mock

import pytest


NEWPORT_RI = {'town': 'newport_ri', 'longitude': -71.312796, 'latitude': 41.49008}
CLEVELAND_OH = {'town': 'cleveland_oh', 'longitude': -81.695391, 'latitude': 41.499498}
EUCLID_OH = {'town': 'euclid_oh', 'longitude': -81.526787, 'latitude': 41.593105}
NASSAU = {'town': 'nassau', 'longitude': -77.3554, 'latitude': 25.0480}
MIAMI_FL = {'town': 'miami_fl', 'longitude': -80.1918, 'latitude': 25.7617}


class TestMetrics():
    """Test base metrics in the distance module."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        self.measurer = distance.HaversineDistance()

    def test_haversine_distance_class(self):
        """Check that the haversine distance matches expectations."""
        d = self.measurer.get_distance_in_meters(NEWPORT_RI, CLEVELAND_OH)
        assert abs(d - 863.731 * 10**3) < 10**-2

    def test_haversine_distance_returns_none_when_a_point_is_missing(self):
        """Check that the haversine distance matches expectations."""
        d1 = self.measurer.get_distance_in_meters(NEWPORT_RI, None)
        d2 = self.measurer.get_distance_in_meters(None, CLEVELAND_OH)
        assert d1 is None
        assert d2 is None

    def test_measure_distance_class_raises_not_implemented_error(self):
        """The base interface for measurement should raise a NotImplementedError."""
        measurer = distance.MeasureDistance(api_url=None, api_key=None)
        with pytest.raises(NotImplementedError):
            measurer.get_distance_in_meters(NEWPORT_RI, CLEVELAND_OH)

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


class TestOSRMDistanceMetric():
    """Test OSRM driving distance metric."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        self.measurer = distance.OSRMDrivingDistance(api_url='http://router.project-osrm.org/')

    def test_get_distance_in_meters(self):
        """Check that the OSRM distance matches expectations."""
        d = self.measurer.get_distance_in_meters(NEWPORT_RI, CLEVELAND_OH)
        assert abs(d - 1033026.0882499999) < 20.0 * 10**3

    def test_closest(self):
        """Check that the closest method works as expected."""
        closest_distance, closest_town = self.measurer.closest(
            origin=NEWPORT_RI,
            point_list=[MIAMI_FL, CLEVELAND_OH, EUCLID_OH],
        )
        assert closest_town == EUCLID_OH

    def test_closest_with_early_exit(self):
        """Check that the closest_with_early_exit method works as expected."""
        closest_distance, closest_town = self.measurer.closest_with_early_exit(
            origin=NEWPORT_RI,
            point_list=[MIAMI_FL, CLEVELAND_OH, EUCLID_OH],
            exit_distance=10**21
        )
        closest_haversine_distance, closest_haversine_town = \
            self.measurer._haversine_measurer.closest(
                origin=NEWPORT_RI,
                point_list=[MIAMI_FL, CLEVELAND_OH, EUCLID_OH],
            )
        assert closest_distance == closest_haversine_distance
        assert closest_town == closest_haversine_town

    @mock.patch('backend.models.distance.OSRMDrivingDistance.closest')
    def test_closest_with_early_exit_within_outer_radius(self, mock_closest):
        """
        Check that the closest_with_early_exit method works as expected.

        Since only EUCLID_OH is nearby to CLEVELAND_OH, only this comparison should be made.
        """
        self.measurer.closest_with_early_exit(
            origin=CLEVELAND_OH,
            point_list=[MIAMI_FL, NEWPORT_RI, EUCLID_OH],
            exit_distance=0.01
        )

        mock_closest.assert_called_with(
            origin=CLEVELAND_OH,
            point_list=[EUCLID_OH]
        )

    @mock.patch('backend.models.distance.OSRMDrivingDistance.closest')
    def test_closest_with_early_exit_no_points_within_outer_radius(self, mock_closest):
        """
        Check that the closest_with_early_exit method works as expected.

        Since no points are nearby to CLEVELAND_OH, no API calls should be made.
        """
        closest_distance, closest_town = self.measurer.closest_with_early_exit(
            origin=CLEVELAND_OH,
            point_list=[MIAMI_FL, NEWPORT_RI],
            exit_distance=80.0 * 10**3
        )

        mock_closest.assert_not_called()
        assert closest_distance == 10**42
        assert closest_town == MIAMI_FL
