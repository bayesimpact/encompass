#!/bin/bash

# TODO - Replace by an actual ping to the DB.
echo "Waiting for DB to become available..."
GRACE_PERIOD=5
if [[ -v DB_GRACE_PERIOD ]]; then
    GRACE_PERIOD=${DB_GRACE_PERIOD}
fi
sleep ${GRACE_PERIOD} # FIXME Wait for DB server to become available

exec "$@"
