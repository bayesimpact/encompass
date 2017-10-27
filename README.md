# bayes-mvp [![Build Status][build]](https://circleci.com/gh/bcherny/bayes-mvp) [![apache2]](https://www.apache.org/licenses/LICENSE-2.0)

[build]: https://img.shields.io/circleci/project/bcherny/bayes-mvp.svg?branch=master&style=flat-square
[apache2]: https://img.shields.io/npm/l/bayes-mvp.svg?style=flat-square

> Network adequacy tool for [Bayes Impact](https://github.com/bayesimpact)

## Install

1. Install [NVM](https://github.com/creationix/nvm#installation)
2. Install Node 8: `nvm install v8.1.3`
3. Install [Yarn](https://yarnpkg.com/en/docs/install)
4. Clone this repo: `git clone git@github.com:bcherny/bayes-mvp.git`

## Environment

Create a file called ".env" in the root of this repo and define `MAPBOX_TOKEN` in it. For example:

```sh
# contents of .env:
MAPBOX_TOKEN=abcdefg
```

## Run

```sh
cd bayes-mvp/client
yarn
yarn build
yarn start
```

Then, open *https://localhost:9000* in your browser.

## Editor

I suggest editing this project using [VSCode](https://code.visualstudio.com/).

## License

Apache2
