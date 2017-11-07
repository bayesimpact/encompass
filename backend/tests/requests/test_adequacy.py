"""Test providers requests for Time-Distance API."""
from backend.app.exceptions.format import InvalidFormat
from backend.app.requests import adequacy

import flask

from flask_testing import LiveServerTestCase

import mock

import pytest


class TestProvidersRequest(LiveServerTestCase):
    """Test class for providers request file."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    def test_adequacy_request(self):
        """Test provider requests in a simple case."""
        request_adequacy = {
            'provider_ids': [1, 2],
            'service_area_ids': ['ca_alameda_0000']
        }

        def _mock_get_json(force=True):
            return request_adequacy

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        try:
            adequacy.adequacy_request(self.app, mock_request)
        except TypeError:
            pytest.fail('Could not fetch providers.')

    def test_adequacy_request_missing_area(self):
        """Test provider requests in a simple case."""
        request_adequacy = {
            'provider_ids': [1, 2]
        }

        def _mock_get_json(force=True):
            return request_adequacy

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        with pytest.raises(InvalidFormat):
            adequacy.adequacy_request(self.app, mock_request)
