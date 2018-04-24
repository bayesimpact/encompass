"""Test APITime class."""
from backend.lib.utils.datatypes import Point
from backend.models import time

import mock

import pytest

import requests

NEWPORT_RI = Point(**{'longitude': -71.312796, 'latitude': 41.49008})
CLEVELAND_OH = Point(**{'longitude': -81.695391, 'latitude': 41.499498})


class MockResponse:
    """Mock HTTP responses."""

    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data

    def raise_for_status(self):
        if self.status_code != 200:
            raise requests.exceptions.HTTPError(
                '{}'.format(self.status_code),
                response=self
            )


@mock.patch('requests.get')
def test_get_matrix_http(mock_get):
    json_data = {'durations': [[35799.4, 35799.4]]}
    mock_get.return_value = MockResponse(json_data=json_data, status_code=200)
    matrix_durations = time._get_matrix_http(
        source_points=[NEWPORT_RI],
        destination_points=[CLEVELAND_OH, CLEVELAND_OH],
        api_url='API_URL/'
    )

    url = 'API_URL/{points}'.format(
        points='-71.312796,41.49008;-81.695391,41.499498;-81.695391,41.499498'
    )

    params = {
        'sources': '0',
        'destinations': '1;2',
    }

    mock_get.assert_called_with(url=url, params=params)
    assert abs(matrix_durations[0][0] - 35799.4) < 20.0 * 60


class TestAPITime():
    """Test methods related to the APITime class."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        self.measurer = time.APITime()

    @mock.patch('requests.get')
    def test_get_matrix(self, mock_get):
        """Check that the get_matrix raises a NotImplementedError."""
        with pytest.raises(NotImplementedError):
            self.measurer._get_matrix(
                source_points=[NEWPORT_RI],
                destination_points=[CLEVELAND_OH, CLEVELAND_OH]
            )

    @mock.patch('backend.models.time.APITime._get_matrix')
    def test_measure_one_to_many_points_no_none(self, get_matrix):
        """Check that measure_one_to_many_points returns the correct values."""
        get_matrix.return_value = [[10, 10]]
        measurements = self.measurer._measure_one_to_many_points(
            origin=NEWPORT_RI, point_list=[CLEVELAND_OH, CLEVELAND_OH]
        )
        assert measurements == [10, 10]

    @mock.patch('backend.models.time.APITime._get_matrix')
    def test_measure_one_to_many_points_with_nones(self, get_matrix):
        """
        Check that measure_one_to_many_points replaces None
        with ABSURDLY_LARGE_TIME_IN_MINUTES.
        """
        get_matrix.return_value = [[10, None]]
        measurements = self.measurer._measure_one_to_many_points(
            origin=NEWPORT_RI, point_list=[CLEVELAND_OH, CLEVELAND_OH]
        )
        assert measurements == [10, time.ABSURDLY_LARGE_TIME_IN_MINUTES * 60]
