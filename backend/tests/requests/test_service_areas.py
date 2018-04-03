"""Test service area requests for the Encompass API."""
from backend.app.requests import service_areas
from backend.lib.database.postgres import connect

import flask

from flask_testing import LiveServerTestCase

import mock

import pytest

engine = connect.create_db_engine()


class TestServiceAreaRequest(LiveServerTestCase):
    """Test class for service areas requests."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    @mock.patch('backend.lib.fetch.representative_points.fetch_all_service_areas')
    def test_request_service_areas(self, mock_fetch_service_areas):
        """Test service area requests in a simple case."""
        complete_list_of_service_areas = ['ca_alameda_94601']
        mock_fetch_service_areas.return_value = complete_list_of_service_areas
        try:
            output = service_areas.service_areas_request(self.app, {}, engine)
        except TypeError:
            pytest.fail('Could not retrieve service areas.')

        assert output == complete_list_of_service_areas
