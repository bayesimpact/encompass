"""Test census information requests for the Encompass API."""
from backend.app.requests import census
from backend.lib.database.postgres import connect

import flask

from flask_testing import LiveServerTestCase

import mock

import pytest

engine = connect.create_db_engine()


class TestCensusByServiceAreaRequest(LiveServerTestCase):
    """Test class for census info requests."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    @mock.patch('backend.lib.fetch.census.fetch_census_info_by_service_area')
    def test_census_info_by_service_area_request(self, mock_fetch):
        """Test census by service area request in a simple case."""
        service_area_ids = ['ca_alameda_94601']
        mock_fetch.return_value = {'ca_alameda_94601': {'age': {'0-18 Years': 10.0}}}

        def _mock_get_json(force=True):
            return {'service_area_ids': service_area_ids}

        mock_request = mock.MagicMock()
        mock_request.get_json = _mock_get_json

        try:
            output = census.census_info_by_service_area_request(
                app=self.app, flask_request=mock_request, engine=engine
            )
        except TypeError:
            pytest.fail('Could not retrieve census information.')

        assert output == {'ca_alameda_94601': {'age': {'0-18 Years': 10.0}}}
