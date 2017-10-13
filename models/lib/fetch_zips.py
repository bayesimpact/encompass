"""This module scrapes ZIP code boundaries from the USPS EDDM tool."""
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

WHERE_CLAUSE_TEMPLATE = '''
    STATE=\'CA\' AND ZIP LIKE \'{zip_code}%\'
'''


def fetch_zip_boundary_polygons(zip_codes):
    """
    Request ZIP boundary polygons from the EDDM tool.

    The results are saved as GeoJSON to the specified file path.
    """
    features = _request_zip_boundary_polygons(zip_codes)
    feature_collection = geojson.FeatureCollection(features=features)

    return feature_collection


def _request_zip_boundary_polygons(zip_codes):
    """
    Request ZIP boundary polygons from the EDDM tool.

    Returns a list of features in GeoJSON format.
    """
    features = []

    for zip_code in zip_codes:
        params = BASE_PARAMS.copy()
        params['where'] = WHERE_CLAUSE_TEMPLATE.format(
            zip_code=zip_code
        )

        response = requests.get(
            url=BASE_URL,
            headers=HEADERS,
            params=params,
        )
        response.raise_for_status()

        features.extend(response.json()['features'])

    return features
