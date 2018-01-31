#!/bin/bash

python runners/initialize_postgres.py
#python runners/load_representative_points.py -f data/California/laPoints.geojson
#python runners/load_addresses.py -f data/mock-providers.csv
exec "$@"
