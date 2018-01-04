"""Functions to install and work with PostGIS."""
import os

from backend.lib.database.postgres import connect

EXTENSIONS = [
    'postgis', 'fuzzystrmatch', 'postgis_tiger_geocoder',
    'postgis_topology', 'address_standardizer'
]
ALTER_SCHEMAS = ['tiger', 'tiger_data', 'topology']

CREATE_EXTENSION = 'create extension {extension};'
ALTER_USER = 'alter schema {schema} owner to rds_superuser;'

TRANSFER_OWNERSHIP_FUNCTION = """
    CREATE FUNCTION exec(text) returns text language plpgsql
     volatile AS $f$ BEGIN EXECUTE $1; RETURN $1; END; $f$;
"""

TRANSFER_OWNERSHIP = """
    SELECT exec('ALTER TABLE ' || quote_ident(s.nspname) || '.' ||
     quote_ident(s.relname) || ' OWNER TO rds_superuser;')
      FROM (
        SELECT nspname, relname
        FROM pg_class c JOIN pg_namespace n ON (c.relnamespace = n.oid)
        WHERE nspname in ('tiger','topology') AND
        relkind IN ('r','S','v') ORDER BY relkind = 'S')
    s;
"""

ADD_TIGER_TO_PATH = 'SET search_path=public,tiger;'


def to_point(longitude, latitude):
    """Format point for insertion into Postgres."""
    return 'SRID=4326;POINT({} {})'.format(longitude, latitude)


def to_polygon(long_lat_tuples):
    """Format polygon for insertion into Postgres."""
    long_lat_string = ', '.join([
        '{} {}'.format(longitude, latitude)
        for longitude, latitude in long_lat_tuples
    ])
    return 'POLYGON(({}))'.format(long_lat_string)


def install():
    """Install Postgis to Postgres on AWS."""
    # In the postgres database.
    postgres_db = connect.create_db_engine(os.getenv('POSTGRES_URL_POSTGRES'))
    create_commands = [
        CREATE_EXTENSION.format(extension=extension)
        for extension in EXTENSIONS
    ]
    alter_commands = [
        ALTER_USER.format(schema=schema)
        for schema in ALTER_SCHEMAS
    ]

    for statement in create_commands + alter_commands + [
            TRANSFER_OWNERSHIP_FUNCTION, TRANSFER_OWNERSHIP]:
        try:
            postgres_db.execute(statement=statement)
        except Exception as err:
            print(err)

    time_distance_db = connect.create_db_engine(os.getenv('POSTGRES_URL'))
    time_distance_db.execute(statement=ADD_TIGER_TO_PATH)
