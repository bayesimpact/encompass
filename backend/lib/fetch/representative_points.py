"""Fetch representative points."""
import json

import logging

from backend.config import config
from backend.lib.database.postgres import connect
from backend.lib.database.tables import representative_point, service_area
from backend.lib.timer import timed
from backend.lib.utils.census import readable_columns_from_census_mapping

from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

CENSUS_TABLES = [
    'aggregated_ages',
    'census_acs_dp_02',
    'census_acs_dp_03',
    'census_acs_dp_04',
    'census_acs_dp_05'
]

if config.get('is_census_data_available'):
    CENSUS_FIELDS_BY_CATEGORY = json.load(open(config.get('census_mapping_json')))
else:
    CENSUS_FIELDS_BY_CATEGORY = {}

# The full list of representative point columns required for use in the frontend.
# Used by `fetch_representative_points`. When census data is present, the representative_points
# table name is used to disambiguate between shared column names.
RP_COLUMNS = [
    'id',
    representative_point.RepresentativePoint.__tablename__ + '.census_tract',
    'county',
    'latitude',
    'longitude',
    'population',
    'service_area_id',
    'zip_code'
]

# A minimal list of representative point columns. Used by the backend during adequacy calculation.
MINIMAL_RP_COLUMNS = [
    'id',
    'population',
    'latitude',
    'longitude',
    'service_area_id',
]


@timed
def fetch_representative_points(
    service_area_ids,
    include_census_data,
    engine=connect.create_db_engine()
):
    """
    Fetch representative points for a list of service areas.

    Prepares responses for use by the frontend.
    """
    if not service_area_ids:
        return []

    query_params = {
        'id_list': tuple(service_area_ids)
    }

    # Set census mapping.
    census_mapping = CENSUS_FIELDS_BY_CATEGORY if include_census_data else {}

    if include_census_data:
        join_list = ' '.join(["""
            LEFT JOIN {table}
            ON (representative_points.census_tract = {table}.census_tract)
        """.format(
            table=table) for table in CENSUS_TABLES
        ])

        select_query = """
            SELECT {cols}
            FROM {table_name}
            {joins}
            WHERE service_area_id IN %(id_list)s
            ORDER BY id
            ;
        """.format(
            cols=', '.join(
                RP_COLUMNS + readable_columns_from_census_mapping(CENSUS_FIELDS_BY_CATEGORY)),
            table_name=representative_point.RepresentativePoint.__tablename__,
            joins=join_list,
        )
        logger.info('Fetching representative_points with census data.')
    else:
        select_query = """
            SELECT {cols}
            FROM {table_name}
            WHERE service_area_id IN %(id_list)s
            ORDER BY id
            ;
        """.format(
            cols=', '.join(RP_COLUMNS),
            table_name=representative_point.RepresentativePoint.__tablename__
        )

    return [
        representative_point.row_to_dict(row, census_mapping=census_mapping)
        for row in engine.execute(select_query, query_params).fetchall()
    ]


@timed
def minimal_fetch_representative_points(service_area_ids, engine=connect.create_db_engine()):
    """
    Fetch representative points for a list of service areas.

    No transformations are applied to the points. In particular, census data is not added and the
    format does not necessarily match the frontend's expectations.
    """
    if not service_area_ids:
        return []

    query_params = {
        'id_list': tuple(service_area_ids)
    }

    select_query = """
        SELECT {cols}
        FROM {table_name}
        WHERE service_area_id IN %(id_list)s
        ORDER BY id
        ;
    """.format(
        cols=', '.join(MINIMAL_RP_COLUMNS),
        table_name=representative_point.RepresentativePoint.__tablename__,
    )

    return [dict(row) for row in engine.execute(select_query, query_params).fetchall()]


def fetch_all_service_areas(engine=connect.create_db_engine()):
    """
    Fetch all available service areas from the database.

    Returns a dictionary containing service_area_id, county, and zip_code.
    """
    session = sessionmaker(bind=engine)()
    return session.query(
        service_area.ServiceArea.service_area_id,
        service_area.ServiceArea.county,
        service_area.ServiceArea.zip_code,
        service_area.ServiceArea.state,
        service_area.ServiceArea.nchs_urban_rural_code
    ).order_by(service_area.ServiceArea.service_area_id).all()
