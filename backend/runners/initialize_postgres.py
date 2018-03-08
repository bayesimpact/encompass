"""Initialize Postgres tables."""
from backend.lib.database.postgres import connect
from backend.lib.database.postgres.base import Base
from backend.lib.database.tables import address, provider, representative_point, service_area  # NOQA
from backend.runners import install_postgis

from sqlalchemy_utils import create_database, database_exists


def initialize_postgres():
    """Initialize Postgres tables."""
    postgres_engine = connect.create_db_engine(echo=True)

    # Create DB if necessary...
    if not database_exists(postgres_engine.url):
        create_database(postgres_engine.url)

    # Install Postgis.
    install_postgis.install()

    # Create tables.
    Base.metadata.create_all(postgres_engine, checkfirst=True)


if __name__ == '__main__':
    initialize_postgres()
