local:
	docker-compose up backend frontend

backend:
	docker-compose up backend

frontend:
	docker-compose up frontend

explorer:
	docker-compose up explorer

rebuild:
	docker-compose build --no-cache

# Initialize containerized Postgres DB.
setup-local-db:
	docker-compose run backend bash -c "python runners/initialize_postgres.py"

# Fetch data from S3 and load to Postgres.
# State should be specified as a lowercase, two-letter abbreviation, e.g. 'ca'.
# Example usage: make load_representative_points state='ca'
S3_BUCKET='https://s3-us-west-1.amazonaws.com/network-adequacy/data-011317/etl/output/'
load_representative_points:
	curl  --create-dirs -o 'data/representative_points.geojson' ${S3_BUCKET}$(state)'_representative_points.geojson'
	docker-compose run backend bash -c "python runners/load_representative_points.py -f 'data/representative_points.geojson'"
	rm data/representative_points.geojson

# Run the app in debug mode.
flask-debug:
	docker-compose run --service-ports backend bash -c "python main.py"

backend-lint:
	docker-compose run --no-deps backend bash -c "flake8 ."
	docker-compose run --no-deps backend bash -c "pep257 --match-dir '[^\.*data]' ."

backend-test:
	docker-compose run --no-deps backend pytest -s tests

backend-coverage:
	docker-compose run --no-deps backend pytest --cov=backend --cov-config .coveragerc --cov-fail-under=65 --cov-report term-missing

frontend-test:
	docker-compose run frontend bash -c "yarn test"

# Run tests for all components.
test:
	$(MAKE) backend-lint
	$(MAKE) backend-coverage
	$(MAKE) frontend-test

# [Dummy dependency to force a make command to always run.]
FORCE:
