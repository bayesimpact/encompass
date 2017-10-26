"""Test main.py for Time-Distance API."""
from backend.app import main

import flask

from flask_testing import LiveServerTestCase

import mock

import pytest


class TestMainAPIFile(LiveServerTestCase):
    """Test class for handle_zip_counties_request method."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    def test_fetch_providers(self):
        """Test method for fetching providers."""
        mock_request = mock.MagicMock()
        mock_request.args = {'zipcounty_file': 'hello'}
        try:
            main.fetch_providers()
        except:
            pytest.fail('Could not fetch provider.')

    # TODO - Mock dynamodb response.
    # def test_fetch_service_areas(self):
    #     """Test method for fetching providers."""
    #     mock_request = mock.MagicMock()
    #     mock_request.args = {'zipcounty_file': 'hello'}
    #     try:
    #         main.fetch_available_service_areas()
    #     except:
    #         pytest.fail('Could not fetch service areas.')
