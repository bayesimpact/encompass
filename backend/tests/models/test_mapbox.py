"""Test MapBox API."""
import os

from backend.lib.utils.datatypes import Point
from backend.models import time

import mock

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


class TestMapBoxAPIDriving():
    """Test methods related to the MapBox API."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        access_token = os.environ.get('MAPBOX_TOKEN', 'MAPBOX_API')
        self.access_token = access_token
        self.measurer = time.MapBoxDrivingTime(access_token=access_token)

    @mock.patch('requests.get')
    def test_matrix(self, mock_get):
        """Check that the driving time matches expectations."""
        json_data = {'durations': [[35799.4, 35799.4]]}
        mock_get.return_value = MockResponse(json_data=json_data, status_code=200)
        matrix_durations = self.measurer._get_matrix(
            source_points=[NEWPORT_RI],
            destination_points=[CLEVELAND_OH, CLEVELAND_OH]
        )

        url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{points}'.format(
            points='-71.312796,41.49008;-81.695391,41.499498;-81.695391,41.499498'
        )

        params = {
            'sources': '0',
            'destinations': '1;2',
            'access_token': self.access_token
        }

        mock_get.assert_called_with(url=url, params=params)
        assert abs(matrix_durations[0][0] - 35799.4) < 20.0 * 60


class TestMapBoxAPIWalking():
    """Test methods related to the MapBox API."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        access_token = os.environ.get('MAPBOX_TOKEN', 'MAPBOX_API')
        self.access_token = access_token
        self.measurer = time.MapBoxWalkingTime(access_token=access_token)

    @mock.patch('requests.get')
    def test_matrix(self, mock_get):
        """Check that the driving time matches expectations."""
        json_data = {'durations': [[35799.4, 35799.4]]}
        mock_get.return_value = MockResponse(json_data=json_data, status_code=200)
        matrix_durations = self.measurer._get_matrix(
            source_points=[NEWPORT_RI],
            destination_points=[CLEVELAND_OH, CLEVELAND_OH]
        )

        url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/{points}'.format(
            points='-71.312796,41.49008;-81.695391,41.499498;-81.695391,41.499498'
        )

        params = {
            'sources': '0',
            'destinations': '1;2',
            'access_token': self.access_token
        }

        mock_get.assert_called_with(url=url, params=params)
        assert abs(matrix_durations[0][0] - 35799.4) < 20.0 * 60
