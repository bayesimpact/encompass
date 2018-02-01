#!/bin/bash
echo "Waiting for DB to become available..."
sleep 5 # FIXME Wait for DB server to become available
python runners/initialize_postgres.py
python runners/check_sample_points_exist.py
FIRST_INIT=$?
if (($FIRST_INIT == 1)); then
    echo "Performing load of initial Encompass data"
    python runners/load_representative_points.py -f data/sample/los-angeles-points.geojson
    python runners/load_addresses.py -f data/sample/mock-providers.csv
else
    echo "Bypassing load of initial Encompass data"
fi
exec "$@"
