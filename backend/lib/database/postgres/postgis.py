"""Setup PostGIS."""
import os

from backend.lib.database.postgres import connect

EXTENSIONS = ['postgis', 'fuzzystrmatch', 'postgis_tiger_geocoder', 'postgis_topology']
ALTER_SCHEMAS = ['tiger', 'tiger_data', 'topology']

CREATE_EXTENSION = 'create extension {extension};'
ALTER_USER = 'alter schema {extension} owner to rds_superuser;'

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


def install():
    """Install Postgis to Postgres on AWS."""
    # In the postgres database.
    postgres_db = connect.create_db_engine(os.getenv('POSTGRES_URL_POSTGRES'))
    create_command = '\n'.join(
        CREATE_EXTENSION.format(extension=extension)
        for extension in EXTENSIONS
    )
    alter_command = '\n'.join(
        ALTER_USER.format(extension=schema)
        for schema in ALTER_SCHEMAS
    )
    for statement in [
        create_command, alter_command,
        TRANSFER_OWNERSHIP_FUNCTION, TRANSFER_OWNERSHIP
    ]:
        try:
            postgres_db.execute(statement=statement)
        except Exception as err:
            print(err)

    time_distance_db = connect.create_db_engine(os.getenv('POSTGRES_URL'))
    time_distance_db.execute(statement=ADD_TIGER_TO_PATH)
