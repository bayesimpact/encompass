"""Routing for backend API."""
from backend.app.requests import adequacy, providers, representative_points
from backend.lib.database import dynamo_db
from backend.lib.timer import timed

import flask

from flask_cors import CORS

app = flask.Flask(__name__)

CORS(app, resources={r'/api/*': {'origins': '*'}})
DYNAMODB = dynamo_db.connect()

service_areas_table = dynamo_db.get_table(DYNAMODB, 'network-adequacy-test-2')


@timed
@app.route('/api/available-service-areas/', methods=['GET'])
def fetch_available_service_areas():
    """Fetch and return all available service areas from db."""
    app.logger.debug('Return service areas.')
    # Get the available service areas from DynamoDB.
    db_response = service_areas_table.scan()
    response = db_response['Items']
    return flask.jsonify(response)


@timed
@app.route('/api/providers/', methods=['POST'])
def fetch_providers():
    """Fetch and return all available service areas from db."""
    app.logger.debug('Return provider ids.')
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
