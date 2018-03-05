"""Test Postgres inserts."""
from backend.lib.database.postgres import connect, postgis
from backend.lib.database.postgres import methods
from backend.lib.database.tables import address, provider


def test_core_insert():
    engine = connect.create_db_engine()
    address_data = [
        {
            'address': "Aaaat Brian's House",
            'latitude': 23,
            'longitude': 35,
            'location': postgis.to_point(35, 22)
        }
    ]

    addresss_inserted_primary_key = methods.core_insert(
        engine,
        sql_class=address.Address,
        data=address_data,
        return_insert_ids=True,
        unique_column='address'
    )

    provider_data = [
        {
            'address_id': addresss_inserted_primary_key[0],
            'languages': ['english', 'spanish'],
            'npi': 'aaa_npi_hello',
            'specialty': 'doctor_for_teddies'
        }
    ]

    provider_inserted_primary_key = methods.core_insert(
        engine,
        sql_class=provider.Provider,
        data=provider_data,
        return_insert_ids=True
    )

    methods.delete(
        engine=engine,
        sql_class=provider.Provider,
        ids=provider_inserted_primary_key
    )

    methods.delete(
        engine=engine,
        sql_class=address.Address,
        ids=addresss_inserted_primary_key
    )
