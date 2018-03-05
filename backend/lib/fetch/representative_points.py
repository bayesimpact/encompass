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

CENSUS_TABLES = ['aggregated_ages', 'census_acs_dp_02', 'census_acs_dp_03', 'census_acs_dp_04',
                 'census_acs_dp_05']
CENSUS_FIELDS_BY_CATEGORY = json.load(open(config.get('census_mapping_json')))

RP_COLUMNS = [
    'id',
    'representative_points.census_tract',
    'county',
    'latitude',
    'longitude',
    'population',
    'service_area_id',
    'zip_code'
]


@timed
def fetch_representative_points(
    service_area_ids,
    format_response=True,
    census_data=False,
    engine=connect.create_db_engine()
):
    """Fetch representative points for a list of service areas."""
    if not service_area_ids:
        return []
    id_list = '(' + ', '.join(["'%s'" % _id for _id in service_area_ids]) + ')'
    if not census_data:
        select_query = """
            SELECT {cols}
            FROM {table_name}
            WHERE service_area_id IN {id_list}
            ORDER BY id
            ;
        """.format(
            cols=', '.join(RP_COLUMNS),
            table_name=representative_point.RepresentativePoint.__tablename__,
            id_list=id_list
        )

        return [
            representative_point.row_to_dict(point, format_response)
            for point in engine.execute(select_query).fetchall()
        ]

    join_list = ' '.join([
        'LEFT JOIN {table} ON (representative_points.census_tract = {table}.census_tract)'.format(
            table=table) for table in CENSUS_TABLES
    ])

    select_query = """
        SELECT {cols}
        FROM {table} {joins}
        WHERE service_area_id IN {id_list}
        ORDER BY id
        ;
    """.format(
        cols=', '.join(RP_COLUMNS + readable_columns_from_census_mapping(
            CENSUS_FIELDS_BY_CATEGORY)),
        table=representative_point.RepresentativePoint.__tablename__,
        joins=join_list,
        id_list=id_list
    )

    logger.info('Fetched representative_points with census data.')
    return [
        representative_point.row_to_dict(
            point,
            format_response,
            census_mapping=CENSUS_FIELDS_BY_CATEGORY
        )
        for point in engine.execute(select_query).fetchall()
    ]


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
