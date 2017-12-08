# Time Distance Standards (Frontend) [![Build Status][build]](https://circleci.com/gh/bayesimpact/tds) [![apache2]](https://www.apache.org/licenses/LICENSE-2.0)

[build]: https://img.shields.io/circleci/project/bayesimpact/tds.svg?branch=master&style=flat-square
[apache2]: https://img.shields.io/badge/License-Apache%202.0-blue.svg

> Explore Healthcare network adequacies and population distance to services.

## Install

Clone this repo:

```sh
git clone git@github.com:bayesimpact/tds.git
```

## Build & Run

```sh
docker build -t tds/frontend .
docker run tds/frontend
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

## Tests

```sh
yarn test
```

## License

Apache2
