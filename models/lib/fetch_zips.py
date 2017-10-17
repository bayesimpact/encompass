"""This module scrapes ZIP code boundaries from the USPS EDDM tool."""
# TODO - Switch to accept STATE, ZIP range pairs.
import geojson

import requests


HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

BASE_URL = '''https://gis.usps.com/arcgis/rest/services/EDDM/EDDM_ZIP5/MapServer/1/query'''

BASE_PARAMS = {
    'where': '1=1',
    'text': '',
    'objectIds': '',
    'time': '',
    'geometry': '',
    'geometryType': 'esriGeometryEnvelope',
    'inSR': '',
    'spatialRel': 'esriSpatialRelIntersects',
    'relationParam': '',
    'outFields': '',
    'returnGeometry': 'true',
    'returnTrueCurves': 'false',
    'maxAllowableOffset': '',
    'geometryPrecision': '',
    'outSR': '4326',
    'returnIdsOnly': 'false',
    'returnCountOnly': 'false',
    'orderByFields': '',
    'groupByFieldsForStatistics': '',
    'outStatistics': '',
    'returnZ': 'false',
    'returnM': 'false',
    'gdbVersion': '',
    'returnDistinctValues': 'false',
    'resultOffset': '',
    'resultRecordCount': '',
    'f': 'geojson'
}

WHERE_CLAUSE_TEMPLATE = "STATE='CA' AND ZIP LIKE '{first_two_digits_of_zip_code}%'"


def fetch_zip_boundary_polygons(zip_codes):
    """
    Request ZIP boundary polygons from the EDDM tool.

    The results are saved as GeoJSON to the specified file path.
    """
    features = _request_zip_boundary_polygons(zip_codes)
    feature_collection = geojson.FeatureCollection(features=features)

    return feature_collection


def _request_zip_boundary_polygons(zip_codes_first_two_digits, retries=10):
    """
    Request ZIP boundary polygons from the EDDM tool.
    Returns a list of features in GeoJSON format.
    """
    features = []
    failed = []
    i = 0

    while i < retries and len(zip_codes_first_two_digits) > 0:
        print('Round {}'.format(i))
        for first_two_digits in zip_codes_first_two_digits:
            params = BASE_PARAMS.copy()
            params['where'] = WHERE_CLAUSE_TEMPLATE.format(
                first_two_digits_of_zip_code=first_two_digits
            )
            try:
                response = requests.get(
                    url=BASE_URL,
                    headers=HEADERS,
                    params=params,
                )
                response.raise_for_status()
                features.extend(response.json()['features'])
                print('Processed {}.'.format(first_two_digits))
            except KeyError:
                failed.append(first_two_digits)
        print('{} ZIP code groups remaining.'.format(len(failed)))

        zip_codes_first_two_digits = failed
        failed = []
        i = i + 1

    print('Final list of failed Zip Codes after {} retries:'.format(i))
    print(failed)
    return features


def main(output_file):
    """
    Main function for extracting GeoJSON for CA.
    """

    california_zips_first_digits = range(90, 100)
    with open(output_file, 'w') as fp:
        geojson.dump(fetch_zip_boundary_polygons(california_zips_first_digits), fp)
    print('Done!')


if __name__ == '__main__':
    main('california_zips.geojson')
