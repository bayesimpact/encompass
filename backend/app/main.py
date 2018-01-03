"""Routing for backend API."""
import logging
import os
from logging.config import dictConfig

from backend.app.requests import adequacy, providers, representative_points, service_areas
from backend.config import config
from backend.lib.database.postgres import connect
from backend.lib.timer import timed

import flask

from flask_cors import CORS

from raven.contrib.flask import Sentry


dictConfig(config.get('logging'))
app = flask.Flask(__name__)
engine = connect.create_db_engine()

CORS(app, resources={r'/api/*': {'origins': '*'}})

sentry = Sentry(app, dsn=os.environ.get('SENTRY_DSN', None))
logger = logging.getLogger(__name__)


@timed
@app.route('/api/available-service-areas/', methods=['GET'])
def fetch_service_areas():
    """Fetch and return all available service areas from db."""
    logger.debug('Return service areas.')
    response = service_areas.service_areas_request(app, flask.request, engine)
    return flask.jsonify(response)


@timed
@app.route('/api/providers/', methods=['POST'])
def fetch_providers():
    """Fetch and return providers with geocoded addresses."""
    logger.debug('Fetch providers.')
    response = providers.providers_request(app, flask.request, engine)
    return flask.jsonify(response)


@timed
@app.route('/api/representative_points/', methods=['POST'])
def fetch_representative_points():
    """Fetch and return all representative points for the requested service areas."""
    logger.debug('Fetch representative_points for the specifed service areas.')
    response = representative_points.representative_points_request(app, flask.request, engine)
    return flask.jsonify(response)


@timed
@app.route('/api/adequacies/', methods=['POST'])
def calculate_adequacies():
    """Calculate adequacy for the input service areas and providers."""
    logger.debug('Calculate time distance standards.')
    response = adequacy.adequacy_request(app, flask.request, engine)
    return flask.jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8080)
