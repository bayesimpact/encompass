# Encompass (Frontend)

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

## Firebase

To deploy it as a standalone frontend on Firebase:

```sh
docker-compose build frontend
docker-compose run --rm frontend bash -c "cp dist/* public/"
cd frontend
firebase deploy
cd -
```
