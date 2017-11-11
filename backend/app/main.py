"""Routing for backend API."""
from backend.app.requests import adequacy, providers, representative_points, service_areas
from backend.lib.timer import timed

import flask

from flask_cors import CORS

app = flask.Flask(__name__)

CORS(app, resources={r'/api/*': {'origins': '*'}})


@timed
@app.route('/api/available-service-areas/', methods=['GET'])
def fetch_service_areas():
    """Fetch and return all available service areas from db."""
    app.logger.debug('Return service areas.')
    response = service_areas.service_area_request(app, flask.request)
    return flask.jsonify(response)


@timed
@app.route('/api/providers/', methods=['POST'])
def fetch_providers():
    """Fetch and return all available service areas from db."""
    app.logger.debug('Fetch provider ids.')
    response = providers.providers_request(app, flask.request)
    return flask.jsonify(response)


@timed
@app.route('/api/representative_points/', methods=['POST'])
def fetch_representative_points():
    """Fetch and return all available service areas from db."""
    app.logger.debug('Fetch representative_points for the specifed service areas.')
    response = representative_points.representative_points_request(app, flask.request)
    return flask.jsonify(response)


@timed
@app.route('/api/adequacies/', methods=['POST'])
def calculate_adequacies():
    """Fetch and return all available service areas from db."""
    app.logger.debug('Calculate time distance standards.')
    response = adequacy.adequacy_request(app, flask.request)
    return flask.jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8080)
