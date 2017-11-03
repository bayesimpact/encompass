"""Methods to handle point A and Bs."""
import pandas as pd

from shapely import geometry


def fetch_point_as(db_client, zip_code, county_name, collection='representative_points'):
    """Fetch all point As as Shapely Points from collection."""
    point_a_collection = db_client['representative_points']
    db_object = point_a_collection.find_one({'ServiceArea.ZipCode': zip_code,
                                             'ServiceArea.CountyName': county_name})
    point_as = []
    for geojson_obj in db_object['ReprPopPoints']['PointA']:
        point_as.append(geometry.Point(geojson_obj['geometry']['coordinates']))
    return point_as


def fetch_provider_addresses(csv_path,
                             address_cols=['Address', 'City', 'State', 'County', 'Zip Code']):
    """Fetch all point addresses."""
    with open(csv_path, 'r') as fname:
        point_bs_df = pd.read_csv(
            fname,
            usecols=address_cols,
            dtype={k: 'str' for k in address_cols}).dropna().drop_duplicates()
    print('There are {} unique addresses in this file.'.format(point_bs_df.shape[0]))
    point_bs_df['full_address'] = point_bs_df.apply(_build_standard_address, axis=1)
    return point_bs_df


def _build_standard_address(row):
    address_base = '{}, {}, {} {}'
    return address_base.format(row['Address'], row['City'], row['State'], row['Zip Code'][:5])
