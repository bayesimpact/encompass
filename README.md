# Encompass [![Build Status][build]](https://circleci.com/gh/bayesimpact/tds) [![apache2]](https://www.apache.org/licenses/LICENSE-2.0)

[build]: https://img.shields.io/circleci/project/bayesimpact/encompass.svg?branch=master&style=flat-square
[apache2]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[![Waffle.io - Columns and their card count](https://badge.waffle.io/bayesimpact/encompass.svg?columns=all)](http://waffle.io/bayesimpact/tds)

> Explore Healthcare network adequacies and population distance to services.

## Usage

### 0. Clone this repository
```bash
git clone git@github.com:bayesimpact/encompass.git
```

### 1. Install Docker

Download and install Docker Community Edition ([link](https://store.docker.com/search?offering=community&type=edition)).

### 2. Setup environment variables

In this project's root folder, add a file called `.env` with the following info (replacing `???` with real values):

```sh
MAPBOX_TOKEN=???
POSTGRES_URL=???
API_ROOT=http://localhost:8080
TITLE_SUFFIX=LOCAL
IS_AWS=FALSE
```

* `MAPBOX_TOKEN`: API key provided by [Mapbox](mapbox.com) for mapping.
(https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html).
* `POSTGRES_URL`: URL for database to use for the application. This might be `localhost` for development.

To use with an AWS RDS instance, additional environment variables `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` are Required for AWS CLI. In addition, `IS_AWS` should be set to `TRUE`. This is to initialize the database correctly when using an RDS instance. You will not need this environment variable if you are not using an RDS database.

### 3. Run the app

In your terminal, run:

```sh
docker-compose up backend frontend
```

## Local Development

Four docker containers are available for development:

- [Frontend](frontend/Dockerfile): React/TypeScript app to fetch and visualize network adequacies.
- [Backend](backend/Dockerfile): Flask/uWSGI/Nginx-powered REST API to geocode providers and compute network adequacies.
- [Explorer](explorer/Dockerfile): A container running jupyter notebook for easy exploration and model testing.
- DB: A container running a Postgres server with the relevant extensions.

### Backend

```sh
docker-compose up backend
```

- The API will then be accessible at [localhost:8080](http://localhost:8080)
- It provides the following REST routes (we document each route with its corresponding [JSON-Schema](https://spacetelescope.github.io/understanding-json-schema/) definitions):

| Method  | Route                               | Request schema  | Response schema | Description           |
|---------|-------------------------------------|-----------------|-----------------|-----------------------|
| GET     | /api/available-service-areas/       | (none)          | [Schema](shared/api-spec/available-service-areas-response.json) | Fetches and returns all available service areas |
| POST    | /api/providers/                     | [Schema](shared/api-spec/providers-request.json) | [Schema](shared/api-spec/providers-response.json) | Geocodes, saves to the database, and returns (or, reads from the database if already defined) the given providers |
| POST    | /api/representative_points/         | [Schema](shared/api-spec/representative-points-request.json) | [Schema](shared/api-spec/representative-points-response.json) | Computes representative points for the given service areas |
| POST    | /api/adequacies/                    | [Schema](shared/api-spec/adequacies-request.json) | [Schema](shared/api-spec/adequacies-response.json) | Computes adequacies for the given service areas against the given providers |

### Frontend

```sh
docker-compose up frontend
```

See [frontend/README.md](frontend/README.md) for more documentation.

### DB
```bash
docker-compose up db
```

This container will allow you to run a fully functioning local system with a `POSTGRES_URL` at `db.local`.

The database will be initialized but won't contain any data. There is some sample data for Rhode Island population included in this repository in the `data` directory as well as a script to load the data into the database. With the DB container running, on the `backend` container, run:
```bash
python runners/load_representative_points.py -f data/rhode-island/ri_representative_points.geojson
``` 
