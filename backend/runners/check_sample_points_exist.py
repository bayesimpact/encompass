"""Verify whether setup of sample data (used by some tests) has been performed."""
from backend.lib.database.postgres import connect
from backend.lib.fetch import representative_points


def check_sample_points_exist():
    """
    Retrieve sample points for a service area from the sample data and if none exists, exit
    with nonzero code to indicate that initial sample data population should proceed.
    """
    engine = connect.create_db_engine(echo=True)
    service_areas = ['ca_los_angeles_county_00000']  # A service area from the base sample data.
    results = representative_points.fetch_representative_points(
        service_areas, include_census_data=False, engine=engine
    )
    if len(results) == 0:
        exit(1)  # Exit nonzero to indicate that no records exist.


if __name__ == '__main__':
    check_sample_points_exist()
