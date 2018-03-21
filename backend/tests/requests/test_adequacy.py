"""Test adequacy requests for Time-Distance API."""
import json

from backend.app.exceptions.format import InvalidFormat
from backend.app.requests import adequacy
from backend.lib.database.postgres import connect

import flask

from flask_testing import LiveServerTestCase

import mock

import pytest

engine = connect.create_db_engine()


class TestAdequacyRequest(LiveServerTestCase):
    """Test class for adequacy request file."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    def test_adequacy_request_invalid_json(self):
        """Test adequacy requests in a simple case."""
        def _mock_get_json(force=True):
            raise json.JSONDecodeError(msg='', doc='', pos=0)

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        with pytest.raises(InvalidFormat):
            adequacy.adequacy_request(self.app, mock_request, engine)

    def test_adequacy_request(self):
        """Test adequacy requests in a simple case."""
        request_adequacy = {
            'method': 'straight_line',
            'providers': [
                {'id': 1, 'latitude': 37.74753421600008, 'longitude': -122.2316317029999},
                {'id': 2, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
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
        """Test adequacy requests without service areas raise an error."""
        request_adequacy = {
            'providers': [
                {'id': 1, 'latitude': 37.74753421600008, 'longitude': -122.2316317029999},
                {'id': 2, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
            ]
        }

        def _mock_get_json(force=True):
            return request_adequacy

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        with pytest.raises(InvalidFormat):
            adequacy.adequacy_request(self.app, mock_request, engine)

    def test_adequacy_request_missing_providers(self):
        """Test adequacy requests without providers raise an error."""
        request_adequacy = {
            'method': 'straight_line',
            'service_area_ids': ['ca_los_angeles_90001']
        }

        def _mock_get_json(force=True):
            return request_adequacy

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        with pytest.raises(InvalidFormat):
            adequacy.adequacy_request(self.app, mock_request, engine)

    def test_adequacy_request_missing_method(self):
        """Test adequacy requests without method raise an error."""
        request_adequacy = {
            'providers': [
                {'id': 1, 'latitude': 37.74753421600008, 'longitude': -122.2316317029999},
                {'id': 2, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
            ],
            'service_area_ids': ['ca_los_angeles_90001']
        }

        def _mock_get_json(force=True):
            return request_adequacy

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        with pytest.raises(InvalidFormat):
            adequacy.adequacy_request(self.app, mock_request, engine)

    def test_adequacy_request_invalid_method(self):
        """Test adequacy requests without a valid method default to haversine."""
        request_adequacy = {
            'method': 'not_a_real_method',
            'providers': [
                {'id': 1, 'latitude': 37.74753421600008, 'longitude': -122.2316317029999},
                {'id': 2, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
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

    def test_adequacy_request_no_providers_no_service_areas(self):
        """Test adequacy requests with neither providers nor service areas."""
        request_adequacy = {
            'method': 'straight_line',
            'providers': [],
            'service_area_ids': []
        }

        def _mock_get_json(force=True):
            return request_adequacy

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json
        try:
            output = adequacy.adequacy_request(self.app, mock_request, engine)
            assert output == []
        except TypeError:
            pytest.fail('Could not calculate adequacy.')
