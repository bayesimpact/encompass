"""Runner to load addresses to databse from a CSV."""
import argparse
import csv

from backend.lib.database.postgres import connect, methods, postgis
from backend.lib.database.tables import address


def _get_arguments():
    """Build argument parser."""
    parser = argparse.ArgumentParser(description="""
        This script loads provider address data from a specified file into PostGIS.
    """)
    parser.add_argument(
        '-f', '--filepath',
        help='CSV filepath containing provider address data.',
        required=True,
        type=str
    )
    return parser.parse_args().__dict__


def load_csv(filepath):
    """
    Load a csv file to the address database.

    Expects address, latitude, longitude fields.
    """
    with open(filepath) as csv_f:
        data = list(csv.DictReader(csv_f))

    address_data = [
        {
            'address': temp['address'],
            'latitude': float(temp['latitude']),
            'longitude': float(temp['longitude']),
            'location': postgis.to_point(float(temp['longitude']), float(temp['latitude']))
        }
        for temp in data
    ]

    engine = connect.create_db_engine()
    methods.core_insert(
        engine,
        sql_class=address.Address,
        data=address_data,
        return_insert_ids=True,
        unique_column='address'
    )


if __name__ == '__main__':
    arguments = _get_arguments()
    print('Load providers from - %s' % arguments['filepath'])
    try:
        load_csv(**arguments)
    except Exception as e:
        print('An error occured uploading addresses.')
