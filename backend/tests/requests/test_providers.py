"""Test providers requests for Time-Distance API."""
from backend.app.requests import providers
from backend.lib.database.postgres import connect

import flask

from flask_testing import LiveServerTestCase

import mock


engine = connect.create_db_engine()


class TestProvidersRequest(LiveServerTestCase):
    """Test class for providers request file."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    def test_provider_request(self):
        """Test provider requests in a simple case."""
        request_providers = {
            'addresses': ['1855 Mission Street, San Francisco, CA 94110']
        }

        def _mock_get_json(force=True):
            return request_providers
        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        response = providers.providers_request(self.app, mock_request, engine)
        assert response[0]['status'] == 'success'

    def test_provider_request_db_error(self):
        """Test provider requests in a simple case with badly formatted addresses."""
        request_providers = {
            'addresses': ['provider_address_1', 'provider_address_1']
        }

        def _mock_get_json(force=True):
            return request_providers
        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        response = providers.providers_request(self.app, mock_request, engine)
        error_message = {
            'message': 'Failed to geocode address for this provider.', 'status': 'error'
        }
        assert response == [error_message, error_message]
