"""Test MapBox API."""
import os

from backend.models import distance

import mock

import requests


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


class TestMapBoxAPI():
    """Test base metrics in the distance module."""
    def setup(self):
        """Initialize a measurer for use in the test cases."""
        api_key = os.environ.get('MAPBOX_TOKEN', 'MAPBOX_API')
        self.api_key = api_key
        self.measurer = distance.MapBoxDrivingTime(api_key=api_key)

    @mock.patch('requests.get')
    def test_matrix(self, mock_get):
        """Check that the driving time matches expectations."""
        json_data = {'durations': [[35799.4, 35799.4]]}
        mock_get.return_value = MockResponse(json_data=json_data, status_code=200)
        matrix_durations = self.measurer.get_matrix(
            source_points=[(41.49008, -71.312796)],
            destination_points=[(41.499498, -81.695391), (41.499498, -81.695391)]
        )

        url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{points}'.format(
            points='-71.312796,41.49008;-81.695391,41.499498;-81.695391,41.499498'
        )

        params = {
            'sources': '0',
            'destinations': '1;2',
            'access_token': self.api_key
        }

        mock_get.assert_called_with(url=url, params=params)
        assert abs(matrix_durations[0][0] - 35799.4) < 20.0 * 60
