"""Runner to load addresses to databse from a CSV."""
import csv

from backend.lib.database.postgres import connect
from backend.lib.database.postgres import methods
from backend.lib.database.tables import address

CSV_FILE = './data/last-1100-geocoded-pointBs-93710.csv'


def load_csv(csv_file=CSV_FILE):
    """
    Load a csv file to the address database.

    Expects address, latitude, longitude fields.
    """
    with open(csv_file) as csv_f:
        data = list(csv.DictReader(csv_f))

    address_data = [
        {
            'address': temp['address'],
            'latitude': temp['latitude'],
            'longitude': temp['longitude']
        }
        for temp in data
    ]

    engine = connect.create_db_engine()
    methods.core_insert(
        engine,
        sql_class=address.Address,
        data=address_data,
        return_insert_ids=True
    )


if __name__ == '__main__':
    load_csv()
