"""Functions to install PostGIS."""
import logging
import os

from backend.lib.database.postgres import connect


EXTENSIONS = ['postgis', 'fuzzystrmatch', 'postgis_tiger_geocoder', 'postgis_topology']
ALTER_SCHEMAS = ['tiger', 'tiger_data', 'topology']
CREATE_EXTENSION = 'create extension if not exists {extension};'
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

logger = logging.getLogger(__name__)


def install():
    """Use appropriate setup function for AWS environment or otherwise."""
    # TODO reach consensus on how we would like to do this.
    if os.getenv('IS_AWS') == 'TRUE':
        install_aws()
    else:
        install_local()


def install_aws():
    """Install Postgis to Postgres on AWS."""
    # In the postgres database.
    # POSTGRES_URL_POSTGRES is the URL of the system DB on which to install the
    # extensions as opposed to POSTGRES_URL which is the DB used by the rest of
    # the encompass app.
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
        except Exception:
            logger.exception('Error installing Postgis to Postgres')

    time_distance_db = connect.create_db_engine(os.getenv('POSTGRES_URL'))
    time_distance_db.execute(statement=ADD_TIGER_TO_PATH)


def install_local():
    """Install Postgis to Postgres in local DB."""
    postgres_db = connect.create_db_engine(os.getenv('POSTGRES_URL_POSTGRES'))
    extension_create_commands = [
        CREATE_EXTENSION.format(extension=extension) for extension in EXTENSIONS
    ]
    for statement in extension_create_commands:
        try:
            postgres_db.execute(statement=statement)
        except Exception as err:
            print(err)

    time_distance_db = connect.create_db_engine(os.getenv('POSTGRES_URL'))
    time_distance_db.execute(statement=ADD_TIGER_TO_PATH)


if __name__ == '__main__':
    install()
