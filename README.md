# Time Distance Standards [![Build Status][build]](https://circleci.com/gh/bayesimpact/tds) [![apache2]](https://www.apache.org/licenses/LICENSE-2.0)

[build]: https://img.shields.io/circleci/project/bayesimpact/tds.svg?branch=master&style=flat-square
[apache2]: https://img.shields.io/badge/License-Apache%202.0-blue.svg


> Explore Healthcare network adequacies and population distance to services.

## Usage

### 1. Install Docker

Download and install Docker Community Edition ([link](https://store.docker.com/search?offering=community&type=edition)).

### 2. Setup the app

In this project's root folder, add a file called `.env` with the following info (replacing `???` with real values):

```sh
MAPBOX_TOKEN=???
AWS_ACCESS_KEY=???
AWS_SECRET_KEY=???
POSTGRES_URL=???
```

### 3. Run the app

In your terminal, run:

```sh
docker-compose up backend frontend
```

## Local Development

Three docker containers are available for development:

- [Frontend](frontend/Dockerfile): React/TypeScript app to fetch and visualize network adequacies.
- [Backend](backend/Dockerfile): Flask/uWSGI/Nginx-powered REST API to geocode providers and compute network adequacies.
- [Explorer](explorer/Dockerfile): A container running jupyter notebook for easy exploration and model testing.

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
