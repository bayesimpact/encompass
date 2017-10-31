"""Test providers requests for Time-Distance API."""
from backend.app.requests import representative_points

import flask

from flask_testing import LiveServerTestCase

import mock

import pytest


class TestRepresentativePointsRequest(LiveServerTestCase):
    """Test class for providers request file."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    def test_provider_request(self):
        """Test provider requests in a simple case."""
        request_service_areas = {'service_area_ids': ['1', '2']}

        def _mock_get_json(force=True):
            return request_service_areas
        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        try:
            response = representative_points.representative_points_request(self.app, mock_request)
            print(response)
        except TypeError:
            pytest.fail('Could not fetch representative_points.')
