deploy:
	git pull
	$(MAKE) clear-cache
	docker-compose down
	docker-compose -f docker-compose.yml -f docker-compose.remote.yml up -d backend frontend

local:
	docker-compose -f docker-compose.yml -f docker-compose.local.yml up backend frontend

local-db:
	docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.override.db.yml up -d db

initialize-local-db:
	docker-compose -f docker-compose.yml -f docker-compose.override.db.yml run backend bash -c "python runners/initialize_postgres.py"
	echo "Performing load of initial Encompass data."
	docker-compose -f docker-compose.yml -f docker-compose.override.db.yml run backend bash -c "python runners/load_representative_points.py -f 'data/sample/los-angeles-points.geojson'"
	docker-compose -f docker-compose.yml -f docker-compose.override.db.yml run backend bash -c "python runners/load_addresses.py -f 'data/sample/mock-providers.csv'"

rebuild:
	docker-compose build --no-cache

# TODO - Figure out network issue to use docker instead for yarn.
load-local-state:
	# Usage 1: make load-local-state filename=sample/los-angeles-points.geojson
	# Usage 2: make load-local-state filename=sample/random_state.geojson args="-s fake_state" # This wil force fake all census and urban data.
	docker-compose -f docker-compose.yml -f docker-compose.override.db.yml run backend bash -c "python runners/load_representative_points.py -f 'data/$(filename)' $(args)"
	docker-compose -f docker-compose.yml -f docker-compose.override.db.yml up -d backend
	cd frontend; yarn codegen
	cd ..
	docker-compose -f docker-compose.yml -f docker-compose.override.db.yml stop backend

load-representative-points:
	# Usage: make load-representative-point filename=california.geojson
	docker-compose run backend bash -c "python runners/load_representative_points.py -f 'data/$(filename)' $(args)"

normalize-population-totals:
	docker-compose run backend bash -c "python runners/normalize_population_totals.py"

# Export representative points data and build a MapBox tileset.
# Note: You may need to run `brew install tippecanoe`.
create-tileset-from-representative-points:
	docker-compose run --no-deps backend bash -c "python runners/export_representative_points.py -o data/representative_points_from_db.geojson"
	tippecanoe -o data/repr_pop_points.mbtiles -Z 7 -z 22 -r 2.5 -B 8.0 -f data/representative_points_from_db.geojson

# Clear cached adequacy results.
clear-cache:
	rm -f .cache/*

# Run the backend in debug mode.
flask-debug:
	docker-compose run --service-ports backend bash -c "python main.py"

backend-lint:
	docker-compose run --no-deps backend bash -c "flake8 ."
	docker-compose run --no-deps backend bash -c "pep257 --match-dir '[^\.*data]' ."

backend-test:
	docker-compose run --no-deps backend pytest -s tests

BACKEND_COVERAGE=pytest --cov=backend --cov-config .coveragerc --cov-fail-under=84 --cov-report term-missing
backend-coverage:
	docker-compose run --no-deps backend ${BACKEND_COVERAGE}

backend-coverage-ci:
	$(MAKE) initialize-local-db
	docker-compose -f docker-compose.yml -f docker-compose.override.db.yml run backend ${BACKEND_COVERAGE}

frontend-test:
	docker-compose run frontend bash -c "yarn test"

# Run tests for all components.
test:
	$(MAKE) backend-lint
	$(MAKE) backend-coverage
	$(MAKE) frontend-test

# [Dummy dependency to force a make command to always run.]
FORCE:
