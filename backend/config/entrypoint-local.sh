#!/bin/bash

python runners/initialize_postgres.py
python runners/load_representative_points.py -f data/rhode-island/ri_representative_points.geojson
exec /usr/bin/supervisord
