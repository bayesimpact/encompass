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

# Fetch data from S3 and load to Postgres.
# State should be specified as a lowercase, two-letter abbreviation, e.g. 'ca'.
# Example usage: make load_representative_points state='ca'
S3_BUCKET='https://s3-us-west-1.amazonaws.com/network-adequacy/data-011317/etl/output/'
load_representative_points:
	curl  --create-dirs -o 'data/representative_points.geojson' ${S3_BUCKET}$(state)'_representative_points.geojson'
	docker-compose run backend bash -c "python runners/load_representative_points.py -f 'data/representative_points.geojson'"
	rm data/representative_points.geojson

# Export representative points data and build a MapBox tileset.
# Note: You may need to run `brew install tippecanoe`.
create_tileset_from_representative_points:
	docker-compose run --no-deps backend bash -c "python runners/export_representative_points.py -o data/representative_points_from_db.geojson"
	tippecanoe -o data/repr_pop_points.mbtiles -Z 3 -z 22 -r 2.5 -B 8.0 -f data/representative_points_from_db.geojson

# Run the app in debug mode.
flask-debug:
	docker-compose run --service-ports backend bash -c "python main.py"

backend-lint:
	docker-compose run --no-deps backend bash -c "flake8 ."
	docker-compose run --no-deps backend bash -c "pep257 --match-dir '[^\.*data]' ."

backend-test:
	docker-compose run --no-deps backend pytest -s tests

backend-coverage:
	docker-compose run --no-deps backend pytest --cov=backend --cov-config .coveragerc --cov-fail-under=78 --cov-report term-missing

backend-coverage-ci:
    docker-compose -f docker-compose.yml -f docker-compose.override.local.yml run backend pytest --cov=backend --cov-config .coveragerc --cov-fail-under=68 --cov-report term-missing

frontend-test:
	docker-compose run frontend bash -c "yarn test"

# Run tests for all components.
test:
	$(MAKE) backend-lint
	$(MAKE) backend-coverage
	$(MAKE) frontend-test

# [Dummy dependency to force a make command to always run.]
FORCE:
