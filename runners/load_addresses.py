"""Runner to load addresses to databse from a CSV."""
import csv

from backend.lib.database.postgres import connect
from backend.lib.database.postgres import methods
from backend.lib.database.tables import address

CSV_FILE = './data/addresses_to_load.csv'


def load_csv(csv_file=CSV_FILE):
    """load a csv file to the address database."""
    with open(csv_file) as csv_f:
        data = list(csv.DictReader(csv_f))

    for address_row in data:
        lat_long = eval(address_row['lat_long'])
        address_row['latitude'] = lat_long[0]
        address_row['longitude'] = lat_long[1]

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
