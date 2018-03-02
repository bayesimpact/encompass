"""
Script to generate GeoJSON from GHSL raster data.

Requires the following data sources in the locations specified at the top of the file:

- GHSL raster data
- Census tract data for the United States (in GeoJSON or Shapefile format)
- State and county FIPS code lookup

Given the size of the raster dataset, it is highly recommended that you follow the steps outlined in
../../osrm/initialize.py for enabling swap memory.
"""
import collections

import geopandas as gpd

import pandas as pd

import rasterio

import unrasterize


MASK_WIDTH = 8      # Measured in pixels.
THRESHOLD = 0.05   # Measured in persons per pixel. This is two people per square mile.

# Input file paths.
RASTER_DATA_PATH = (
    'data/GHSL/GHS_POP_GPW42015_GLOBE_R2015A_54009_250_v1_0/'
    'GHS_POP_GPW42015_GLOBE_R2015A_54009_250_v1_0.tif'
)
CENSUS_TRACT_PATH = 'data/census/census_tract_boundaries.geojson'
FIPS_CODE_PATH = 'data/census/county_fips_codes.csv'

WORLD_OUTPUT_PATH = 'data/world_mw-{}_t-{}.geojson'.format(str(MASK_WIDTH), str(THRESHOLD))
US_OUTPUT_PATH = 'data/united_states_mw-{}_t-{}.geojson'.format(str(MASK_WIDTH), str(THRESHOLD))

MOLLWEIDE = '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'


def raster_to_geojson():
    """Convert raster data to GeoJSON for the entire world."""
    raster_data = rasterio.open(
        'data/GHSL/GHS_POP_GPW42015_GLOBE_R2015A_54009_250_v1_0/'
        'GHS_POP_GPW42015_GLOBE_R2015A_54009_250_v1_0.tif'
    )

    print('World: Unrasterizing...')
    n = unrasterize.WindowedUnrasterizer(mask_width=MASK_WIDTH, threshold=THRESHOLD)
    n.select_representative_pixels(raster_data)

    print('World: Converting to GeoDataFrame and reprojecting...')
    points = n.to_geopandas(value_attribute_name='population')

    points.crs = MOLLWEIDE
    points.to_crs({'init': 'epsg:4326'}, inplace=True)

    print('World: Writing to file...')
    points.to_file(
        WORLD_OUTPUT_PATH,
        driver='GeoJSON'
    )
    return points


def extract_united_states_from_world(points):
    """Use census geometries to restrict attention to the United States only."""
    print('Loading census data...')
    tracts = gpd.read_file(CENSUS_TRACT_PATH)

    print('Joining census data and world data...')
    us = gpd.sjoin(points, tracts, how='inner', op='within')
    columns_to_drop = [
        'NAME', 'GEOID', 'NAMELSAD', 'MTFCC', 'FUNCSTAT', 'ALAND',
        'AWATER', 'INTPTLAT', 'INTPTLON', 'index_right'
    ]
    us.drop(columns_to_drop, axis=1, inplace=True)
    us.rename(columns={col: col.lower() for col in us.columns}, inplace=True)

    us.to_file(
        US_OUTPUT_PATH,
        driver='GeoJSON'
    )
    return us


def clean_united_states_dataframe(us):
    """Clean data and finalize columns."""
    print('Adding state and county names...')
    fips_df = pd.read_csv(
        FIPS_CODE_PATH,
        names=['state', 'statefp', 'countyfp', 'county', 'what'], dtype=str
    )
    fips_df.set_index(['statefp', 'countyfp'], inplace=True)
    nested_dict = lambda: collections.defaultdict(nested_dict)
    fips_dict = nested_dict()

    for lst in fips_df.index:
        fips_dict[lst[0]][lst[1]] = fips_df.loc[lst].to_dict()

    fips_dict = dict(fips_dict)
    us['state'] = us[['statefp', 'countyfp']].apply(
        lambda row: fips_dict[row[0]][row[1]]['state'], axis=1
    )
    us['county'] = us[['statefp', 'countyfp']].apply(
        lambda row: fips_dict[row[0]][row[1]]['county'], axis=1
    )
    # Remove rows that could not be a assign a county.
    # These are 46, 102 and 02, 158: two non-existent counties in SD and AK.
    rows_to_drop = (us[us['county'].apply(len) == 0]).index
    us.drop(rows_to_drop, inplace=True)
    us.to_file(US_OUTPUT_PATH.replace('.geojson', '_with_names.geojson'), driver='GeoJSON')
    return us


if __name__ == '__main__':
    points = raster_to_geojson()
    us = extract_united_states_from_world(points)
    clean_us = clean_united_states_dataframe(us)
    print('Finished!')
