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
        r.latitude as lat,
        r.longitude AS lng,
        (r.population #>> '{1.0}')::int AS population,
        r.service_area_id,
        r.zip_code AS zip,
        r.location
    FROM representative_points r
    JOIN service_areas sa
        ON (r.service_area_id = sa.service_area_id)
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
    return parser.parse_args().__dict__


if __name__ == '__main__':
    kwargs = _get_arguments()
    command = EXPORT_COMMAND.format(
        output_path=kwargs['output_path'],
        connection_string=os.getenv('POSTGRES_URL'),
        extraction_query=SELECT_REPRESENTATIVE_POINTS_QUERY
    )
    subprocess.call(args=[command], shell=True)
