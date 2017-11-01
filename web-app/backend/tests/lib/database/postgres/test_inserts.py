"""Test Postgres inserts."""
from backend.lib.database.postgres import connect
from backend.lib.database.postgres import methods
from backend.lib.database.tables import address, provider


def test_core():
    engine = connect.create_db_engine()
    address_data = [
        {
            'address': "Brian's House",
            'latitude': 23,
            'longitude': 35,
        }
    ]

    addresss_inserted_primary_key = methods.core_insert(
        engine,
        sql_class=address.Address,
        data=address_data
    )

    provider_data = [
        {
            'address_id': addresss_inserted_primary_key[0],
            'languages': ['english', 'spanish'],
            'npi': 'npi_hello',
            'specialty': 'doctor_for_teddies'
        }
    ]

    provider_inserted_primary_key = methods.core_insert(
        engine,
        sql_class=provider.Provider,
        data=provider_data
    )

    methods.delete(
        engine=engine,
        table_name=provider.Provider.__tablename__,
        ids=provider_inserted_primary_key
    )

    methods.delete(
        engine=engine,
        table_name=address.Address.__tablename__,
        ids=addresss_inserted_primary_key
    )
