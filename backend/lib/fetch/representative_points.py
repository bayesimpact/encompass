"""Fetch representative points."""
from backend.lib.database.postgres import connect
from backend.lib.database.tables import representative_point, service_area
from backend.lib.timer import timed

from sqlalchemy.orm import sessionmaker


@timed
def fetch_representative_points(
    service_area_ids,
    format_response=True,
    engine=connect.create_db_engine()
):
    """Fetch representative points for a list of service areas."""
    if not service_area_ids:
        return []

    id_list = '(' + ', '.join(["'%s'" % _id for _id in service_area_ids]) + ')'
    select_query = 'SELECT * FROM {table_name} WHERE service_area_id in {id_list};'.format(
        table_name=representative_point.RepresentativePoint.__tablename__,
        id_list=id_list)
    representative_points = engine.execute(select_query)
    return [
        representative_point.row_to_dict(point, format_response) for point in representative_points
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
        service_area.ServiceArea.state
    ).all()
