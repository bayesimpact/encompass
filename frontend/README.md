# Time Distance Standards (Frontend) [![Build Status][build]](https://circleci.com/gh/bayesimpact/encompass) [![apache2]](https://www.apache.org/licenses/LICENSE-2.0)

[build]: https://img.shields.io/circleci/project/bayesimpact/encompass.svg?branch=master&style=flat-square
[apache2]: https://img.shields.io/badge/License-Apache%202.0-blue.svg

> Explore Healthcare network adequacies and population distance to services.

## Install

Clone this repo:

```sh
git clone git@github.com:bayesimpact/encompass.git
```

## Build & Run

```sh
docker-compose build frontend
docker-compose run frontend
```

## Build & Run (for Local Development)

### Install Dependencies

1. Install [NVM](https://github.com/creationix/nvm#installation)
2. Install Node 8: `nvm install v8.1.3`
3. Install [Yarn](https://yarnpkg.com/en/docs/install)

### Build & Run

```sh
yarn
yarn build
yarn start
```

Then, open [localhost:8081](http://localhost:8081) in your browser.

## Codegen API typings and Service Areas

When the shape of an API endpoint changes, or when available service areas change:

1. Update the endpoint's JSON-Schema in [shared/api-spec](../shared/api-spec)
2. Regenerate code with `yarn codegen`

## Tests

```sh
yarn test
```

## Remote Environment Overrides (SSL)
To enforce HTTPS on remote environments (by redirecting HTTP requests) you can use the remote override docker-compose file. This will run an Nginx server inside the frontend container to act as reverse proxy, which uses the `ROOT_DOMAIN` environment variable to determine where to redirect to.

Sample usage:
```bash
docker-compose -f docker-compose.yml -f docker-compose.remote.yml up -d frontend backend
```

## License

Apache2
