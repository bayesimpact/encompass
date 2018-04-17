"""Test MapBox API."""
from backend.lib.utils.datatypes import Point
from backend.models import time

import mock

NEWPORT_RI = Point(**{'longitude': -71.312796, 'latitude': 41.49008})
CLEVELAND_OH = Point(**{'longitude': -81.695391, 'latitude': 41.499498})
EUCLID_OH = Point(**{'longitude': -81.526787, 'latitude': 41.593105})
NASSAU = Point(**{'longitude': -77.3554, 'latitude': 25.0480})
MIAMI_FL = Point(**{'longitude': -80.1918, 'latitude': 25.7617})


class TestOSRMDrivingTimeMetric():
    """Test OSRMDrivingTime metric."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        self.measurer = time.OSRMDrivingTime(api_url='http://router.project-osrm.org')

    def test_measure_between_two_points(self):
        """Check that the OSRM time matches expectations."""
        measurements = self.measurer._measure_one_to_many_points(NEWPORT_RI, [CLEVELAND_OH])
        # measure_one_to_many_points return measurements in seconds.
        # The time should be more than 200 minutes (~3 hours) but less than 2000 minutes (33 hours).
        assert abs(float(measurements[0]) / 60 - 1100.0) < 900.0

    def test_closest(self):
        """Check that the closest method works as expected."""
        min_time, closest_town = self.measurer.closest(
            origin=NEWPORT_RI,
            point_list=[MIAMI_FL, CLEVELAND_OH]
        )
        assert closest_town == CLEVELAND_OH

    def test_closest_with_early_exit(self):
        """Check that the closest_with_early_exit method works as expected."""
        min_time, closest_town = self.measurer.closest_with_early_exit(
            origin=NEWPORT_RI,
            point_list=[MIAMI_FL, CLEVELAND_OH, EUCLID_OH],
            exit_distance=10**21
        )
        closest_haversine_distance, closest_haversine_town = \
            self.measurer._haversine_measurer.closest(
                origin=NEWPORT_RI,
                point_list=[MIAMI_FL, CLEVELAND_OH, EUCLID_OH],
            )
        assert min_time / 60.0 == closest_haversine_distance / time.TIME_TO_DISTANCE_HOURS_TO_METERS
        assert closest_town == closest_haversine_town

    @mock.patch('backend.models.time.OSRMDrivingTime.closest')
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

    @mock.patch('backend.models.time.OSRMDrivingTime.closest')
    def test_closest_with_early_exit_no_points_within_outer_radius(self, mock_closest):
        """
        Check that the closest_with_early_exit method works as expected.

        Since no points are nearby to CLEVELAND_OH, no API calls should be made.
        """
        min_time, closest_town = self.measurer.closest_with_early_exit(
            origin=CLEVELAND_OH,
            point_list=[MIAMI_FL, NEWPORT_RI],
            exit_distance=80.0 * 10**3
        )

        mock_closest.assert_not_called()
        assert min_time == 10**42
        assert closest_town == MIAMI_FL
