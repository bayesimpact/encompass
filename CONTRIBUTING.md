# Contributing
We want to invite the vast community of developers to contribute to our mission of promoting a culture of evidence-based and transparent policymaking. Please read the following instruction to start contributing to this project.


## Installation

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
ENV=LOCAL
IS_AWS=FALSE
```

* `MAPBOX_TOKEN`: API key provided by [Mapbox](mapbox.com) for mapping.
(https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html).
* `POSTGRES_URL`: URL for database to use for the application. This might be `localhost` for development.

To use with an AWS RDS instance, additional environment variables `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` are Required for AWS CLI. In addition, `IS_AWS` should be set to `TRUE`. This is to initialize the database correctly when using an RDS instance. You will not need this environment variable if you are not using an RDS database.

### 3. Run the app

In your terminal, run:

```sh
docker-compose -f docker-compose.yml -f docker-compose.local.yml up backend frontend
```

## Local Development

Three docker containers are available for development:

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

- [Read more on how to contribute to the backend](backend/CONTRIBUTING.md)

### Frontend

```sh
docker-compose -f docker-compose.yml -f docker-compose.local.yml up frontend
```

See [frontend/README.md](frontend/README.md) for more documentation.

[Read more on how to contribute to the frontend](frontend/CONTRIBUTING.md)

### DB
```bash
docker-compose up db
```

This container will allow you to run a fully functioning local system with a `POSTGRES_URL` at `db.local`.

The database will be initialized but won't contain any data. There is some sample data for Rhode Island population included in this repository in the `data` directory as well as a script to load the data into the database. With the DB container running, on the `backend` container, run:
```bash
python runners/load_representative_points.py -f data/rhode-island/ri_representative_points.geojson
```

### Deploy
To pull the latest version and re-spin the dockers, simply run `make deploy` in the main directory.

### Remote Deployment
Sample [Terraform](terraform.io) configuration is provided in the [/terraform directory](/terraform). Further information is available [here](/terraform/README.md).

Sample [CircleCI](circleci.com) configuration is provided in the [/.circleci directory](/.circleci). The default configurations are setup to run all tests and coverage on any branch, and to update remote environments on specific branches. You can modify this configuration to match your own remote environment schema.

To use these CircleCI jobs for deployment, you'll need to set up keys in CircleCI to allow SSH access to your application servers. You'll also need to set the relevant environment variables up containing the DNS names for your application servers.

### Remote Environment Overrides (SSL)
To enforce HTTPS on remote environments (by redirecting HTTP requests) you can use the remote override docker-compose file. This will run an Nginx server inside the frontend container to act as reverse proxy, which uses the `ROOT_DOMAIN` environment variable to determine where to redirect to.

Sample usage:
```bash
docker-compose -f docker-compose.yml -f docker-compose.remote.yml up -d frontend backend
```
