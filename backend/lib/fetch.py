"""Fetch data from database."""
from backend.lib.database.postgres import connect
from backend.lib.database.tables import representative_point


def fetch_representative_points(service_areas, engine=connect.create_db_engine()):
    """Fetch representative points for a list of service areas."""
    if not service_areas:
        return []

    id_list = '(' + ', '.join(["'%s'" % _id for _id in service_areas]) + ')'
    select_query = 'SELECT * FROM {table_name} WHERE service_area_id in {id_list};'.format(
        table_name=representative_point.RepresentativePoint.__tablename__,
        id_list=id_list)
    representative_points = engine.execute(select_query)

    return [representative_point.row_to_dict(point) for point in representative_points]
