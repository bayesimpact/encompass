# Contributing

## Install and run locally

```
docker-compose up backend
```
The API then becomes available at [http://localhost:8080]()

## Stack & Libraries
The backend of the app uses Flask, uWSGI and Nginx to serve the API.
Prefer open-source libraries when possible.

## Docstring
When contributing, please be mindful of people coming after you and write down clear docstrings. We suggest the following schema for docstrings:

```
"""
Function description

:param key: Variable key.
:returns: The value.
:raises: TypeError if key is not found.
"""
```

## Tests
This repository uses CircleCI for continuous testing. When contributing, please write / update tests relating to your additions.

