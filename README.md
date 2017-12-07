# Time Distance Standards [![Build Status][build]](https://circleci.com/gh/bayesimpact/tds-frontend) [![apache2]](https://www.apache.org/licenses/LICENSE-2.0)

[build]: https://img.shields.io/circleci/project/bayesimpact/tds-frontend.svg?branch=master&style=flat-square
[apache2]: https://img.shields.io/npm/l/bayes-mvp.svg?style=flat-square

> Network adequacy tool for [Bayes Impact](https://github.com/bayesimpact)


# Local Development

Two dockers are available for development:
- Explorer: A container running jupyter notebook for easy exploration and model testing.
- Backend: A container running a Flask API served by uWSGI and Nginx.

## Setup
In the main folder, you should add a `.env` with the following info (replacing `???` with real values):
```
MAPBOX_TOKEN=???
AWS_ACCESS_KEY=???
AWS_SECRET_KEY=???
POSTGRES_URL=???
```

## App
To start the App, run one of the following command.
```
docker-compose up backend frontend
```

Or simply:
```
make local
```
The App will then be available at `http://localhost`

## Backend - API

```
docker-compose up -d backend
```

- The API will then be accessible on port 8080. `localhost:8080`.
- Three POST endpoints are available to you:
	- /api/providers/
	- /api/representative_points/
	- /api/adequacies/


## Explorer
To explore RPG data and algorithm, you can use the Explorer docker with Jupyter Notebooks.
```
make explorer
```

- Open a browser and navigate to `localhost:9001`.

This environment gives you the following:
- geopandas
- scikit-learn
- statsmodels
- seaborn
