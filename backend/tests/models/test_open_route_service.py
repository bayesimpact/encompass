"""Test Open Route Service API."""
import os

from backend.lib.utils.datatypes import Point
from backend.models import time

import mock

NEWPORT_RI = Point(**{'longitude': -71.312796, 'latitude': 41.49008})
CLEVELAND_OH = Point(**{'longitude': -81.695391, 'latitude': 41.499498})


class TestOpenRouteDrivingTime():
    """Test methods related to the Open Route Service API."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        self.access_token = os.environ.get('ORS_TOKEN', 'fake')
        self.measurer = time.OpenRouteDrivingTime(access_token=self.access_token)

    @mock.patch('backend.models.time.distance_matrix')
    def test_get_matrix(self, mock_distance_matrix):
        """Check that the get_matrix function sends back the complete 'durations' element."""
        mock_distance_matrix.return_value = {'durations': [[35799.4, 35799.4]]}
        matrix_durations = self.measurer._get_matrix(
            source_points=[NEWPORT_RI],
            destination_points=[CLEVELAND_OH, CLEVELAND_OH]
        )

        assert abs(matrix_durations[0][0] - 35799.4) < 20.0 * 60

    def test_distance_matrix(self):
        """Check that the distance_matrix function is working of a correct API is provided."""
        if self.access_token != 'fake':
            matrix_durations = self.measurer._get_matrix(
                source_points=[NEWPORT_RI],
                destination_points=[CLEVELAND_OH, CLEVELAND_OH]
            )

            assert len(matrix_durations[0]) == 2
            assert matrix_durations[0][0] is not None
        else:
            print('OpenRouteDrivingTime not fully tested. No API key provided. $ORS_TOKEN.')
