"""Methods to export representative points from PostGIS to GeoJSON."""
import argparse
import os
import subprocess


# TODO: Keep these fields in sync with `to_dict` method of representative point table.
SELECT_REPRESENTATIVE_POINTS_QUERY = """
    SELECT
        r.id,
        r.census_tract,
        r.county,
        r.latitude::NUMERIC(10, 6) AS lat,
        r.longitude::NUMERIC(10, 6) AS lng,
        r.population,
        r.service_area_id,
        r.zip_code AS zip,
        r.location
    FROM representative_points r
    JOIN service_areas sa
        ON (r.service_area_id = sa.service_area_id)
    WHERE 1=1
    ;
""".replace('\n', ' ')

EXPORT_COMMAND = """
    ogr2ogr -f GeoJSON {output_path} "PG:{connection_string}" -sql "{extraction_query}"
"""


def _get_arguments():
    """Build argument parser."""
    parser = argparse.ArgumentParser(description="""
        This script extracts representative population points from the database into GeoJSON format.
    """)
    parser.add_argument(
        '-o', '--output_path',
        help='Filepath at which to output GeoJSON data.',
        required=True,
        type=str
    )
    parser.add_argument(
        '-s', '--state',
        help="State to extract GeoJSON data for (e.g., 'TX'.",
        required=False,
        type=str
    )
    return parser.parse_args().__dict__


if __name__ == '__main__':
    kwargs = _get_arguments()

    state = kwargs.get('state', None)
    if state:
        query = SELECT_REPRESENTATIVE_POINTS_QUERY.replace(
            'WHERE 1=1', 'WHERE state = \'{}\''.format(state.upper())
        )
    else:
        query = SELECT_REPRESENTATIVE_POINTS_QUERY

    command = EXPORT_COMMAND.format(
        output_path=kwargs['output_path'],
        connection_string=os.getenv('POSTGRES_URL'),
        extraction_query=query
    )
    subprocess.call(args=[command], shell=True)
