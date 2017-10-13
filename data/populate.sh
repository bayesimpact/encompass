#!/bin/bash
#
# This scripts is used to populate a MongoDB with fixtures. It should be used
# inside a Docker container.

while read LOGLINE
do
  if [[ "${LOGLINE}" == *"waiting for connections"* ]]; then
    mongoimport --db "na-db" -c "representative_points" --jsonArray --file="eddm_data.json"
    mongoimport --db "na-db" -c "service_areas" --jsonArray --file="service_areas.json"
    mongoimport --db "na-db" -c "boundaries" --jsonArray --file="service_area_boundaries.json"
    mongo 127.0.0.1:27017/na-db --eval "db.getCollectionNames()"
    killall mongod
  fi
  if [[ "${LOGLINE}" == *"dbexit"* ]]; then
    break
  fi
done < <(mongod $@)
