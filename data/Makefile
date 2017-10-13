all-full-datasets: service_area_boundaries.json eddm_data.json service_areas.json

S3_BUCKET='https://s3-us-west-1.amazonaws.com/network-adequacy/'
DATASET_PATH=''

# Single dataset for boundaries
service_area_boundaries.json:
	curl -o $@ ${S3_BUCKET}${DATASET_PATH}$@
	
# Full dataset paths
eddm_data.json:
	curl -o 'eddm_data.json' ${S3_BUCKET}${DATASET_PATH}$@
	
service_areas.json:
	curl -o 'service_areas.json' ${S3_BUCKET}${DATASET_PATH}$@
