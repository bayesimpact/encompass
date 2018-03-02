"""
Methods to fetch and transform TIGER shapefiles from the census.

By default, census tract files are fetched and stored as GeoJSON collections.
"""
import os
import shutil
import subprocess
import sys

import geojson

import geopandas as gpd

BASE_CENSUS_FILENAME = 'tl_2016_{fips_code}_tract.zip'
BASE_CENSUS_URL = 'https://www2.census.gov/geo/tiger/TIGER2016/TRACT/{filename}'
OUTPUT_DIRECTORY = 'data/census/TIGER/TRACT'
TEMP_DIRECTORY = os.path.join(OUTPUT_DIRECTORY, 'tmp')


def fetch_and_project_census_data(state_fips_codes):
    """Fetch and store TIGER files in GeoJSON format using the WGS84 projection."""
    for fips_code in state_fips_codes:
        output_path = os.path.join(
            OUTPUT_DIRECTORY,
            BASE_CENSUS_FILENAME.format(fips_code=fips_code).replace(
                '.zip', '.geojson'
            )
        )

        if not os.path.isfile(output_path):
            fetch_single_state(fips_code=fips_code)
            project_and_store_census_data(fips_code=fips_code)

    shutil.rmtree(path=TEMP_DIRECTORY, ignore_errors=True)


def fetch_single_state(fips_code):
    """Fetch and unzip census data for a single state."""
    filename = BASE_CENSUS_FILENAME.format(fips_code=fips_code)
    url = BASE_CENSUS_URL.format(filename=filename)
    temp_filepath = os.path.join(TEMP_DIRECTORY, filename)

    commands = [
        "curl --create-dirs -o '{temp_path}' '{url}'".format(
            temp_path=temp_filepath,
            url=url
        ),
        'unzip -o {temp_path} -d {temp_directory}'.format(
            temp_path=temp_filepath,
            temp_directory=TEMP_DIRECTORY
        ),
    ]

    for command in commands:
        subprocess.call(args=['echo "{}"'.format(command)], shell=True)
        exit_code = subprocess.call(args=[command], shell=True)
        if exit_code != 0:
            sys.exit(exit_code)


def project_and_store_census_data(fips_code):
    """Reproject census data to SRID 4326 and store as GeoJSON."""
    input_file = BASE_CENSUS_FILENAME.format(fips_code=fips_code).replace(
        '.zip', '.shp'
    )
    input_path = os.path.join(TEMP_DIRECTORY, input_file)

    output_file = BASE_CENSUS_FILENAME.format(fips_code=fips_code).replace(
        '.zip', '.geojson'
    )
    output_path = os.path.join(OUTPUT_DIRECTORY, output_file)

    if not os.path.isfile(output_path):
        gdf = gpd.read_file(input_path).to_crs({'init': 'epsg:4326'})
        gdf.to_file(output_path, driver='GeoJSON')


def merge_geojson_feature_collections(filepaths):
    """Merge all GeoJSON feature collections into a single, nation-wide file."""
    all_features = []
    for fp in filepaths:
        with open(fp, 'r') as f:
            json_blob = geojson.load(f)
            new_features = json_blob['features']
            all_features.extend(new_features)
            crs = json_blob['crs']

    full_feature_collection = geojson.FeatureCollection(features=all_features, crs=crs)
    return full_feature_collection


def _get_valid_fips_codes():
    """Return the full list of valid FIPS codes."""
    fips_codes = [str(x).zfill(2) for x in range(1, 57)] + ['60', '66', '69', '72', '78']
    for code in ['03', '07', '14', '43', '52']:
        fips_codes.remove(code)

    assert len(fips_codes) == 56
    return fips_codes


if __name__ == '__main__':
    fips_codes = _get_valid_fips_codes()
    fetch_and_project_census_data(fips_codes)
    output_filepaths = [
        os.path.join(OUTPUT_DIRECTORY, filename)
        for filename in os.listdir(OUTPUT_DIRECTORY)
        if any(code in filename for code in fips_codes)
    ]
    print('Merging all files in {}.'.format(OUTPUT_DIRECTORY))
    feature_collection = merge_geojson_feature_collections(output_filepaths)
    with open(os.path.join('data/census/', 'census_tract_boundaries.geojson'), 'w+') as f:
        geojson.dump(feature_collection, f)
