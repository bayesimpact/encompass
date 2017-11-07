"""Test providers requests for Time-Distance API."""
from backend.app.exceptions.format import InvalidFormat
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

    def test_rp_request(self):
        """Test provider requests in a simple case."""
        request_service_areas = {'service_area_ids': ['ca_los_angeles_90001', 'not_valid']}

        def _mock_get_json(force=True):
            return request_service_areas
        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        try:
            results = representative_points.representative_points_request(self.app, mock_request)
            assert len(results) == 13
            assert all(
                result['service_area_id'] in request_service_areas['service_area_ids']
                for result in results
            )
        except Exception:
            pytest.fail('Could not fetch representative_points.')

    def test_rp_request_missing_service_areas(self):
        """Test provider requests in a simple case."""
        request_service_areas = {'no_service_area_ids': ['ca_los_angeles_90001', 'not_valid']}

        def _mock_get_json(force=True):
            return request_service_areas
        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        with pytest.raises(InvalidFormat):
            representative_points.representative_points_request(self.app, mock_request)
