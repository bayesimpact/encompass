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

models-lint:
	echo "Missing models-lint"
	# docker-compose run --no-deps explorer bash -c "flake8 ./models"
	# docker-compose run --no-deps explorer bash -c "pep257 ./models"

# Backend Debug
flask-debug:
	docker-compose run --service-ports backend bash -c "python main.py"

# Backend tests
backend-lint:
	docker-compose run --no-deps backend bash -c "flake8 ."
	docker-compose run --no-deps backend bash -c "pep257 ."

backend-test:
	docker-compose run --no-deps backend pytest -s tests

backend-coverage:
	docker-compose run --no-deps backend pytest --cov=backend --cov-config .coveragerc --cov-fail-under=60 --cov-report term-missing

frontend-test:
	docker-compose run frontend bash -c "yarn test"

# Tests
test:
	$(MAKE) backend-lint
	$(MAKE) backend-coverage
	$(MAKE) frontend-test

# [Dummy dependency to force a make command to always run.]
FORCE:
