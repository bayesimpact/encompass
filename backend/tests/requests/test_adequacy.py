"""Test providers requests for Time-Distance API."""
from backend.app.exceptions.format import InvalidFormat
from backend.app.requests import adequacy
from backend.lib.database.postgres import connect

import flask

from flask_testing import LiveServerTestCase

import mock

import pytest

engine = connect.create_db_engine()


class TestAdequacyRequest(LiveServerTestCase):
    """Test class for providers request file."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    def test_adequacy_request(self):
        """Test provider requests in a simple case."""
        request_adequacy = {
            'providers': [
                {'id': 1, 'latitude': 37.74753421600008, 'longitude': -122.2316317029999},
                {'id': 3, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
            ],
            'service_area_ids': ['ca_los_angeles_90001']
        }

        def _mock_get_json(force=True):
            return request_adequacy

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        try:
            adequacy.adequacy_request(self.app, mock_request, engine)
        except TypeError:
            pytest.fail('Could not calculate adequacy.')

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
            adequacy.adequacy_request(self.app, mock_request, engine)
