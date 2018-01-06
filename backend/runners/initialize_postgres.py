"""Initialize Postgres tables."""
from sqlalchemy_utils import database_exists, create_database

from backend.lib.database.postgres import connect
from backend.lib.database.postgres import postgis
from backend.lib.database.postgres.base import Base
from backend.lib.database.tables import address, provider, representative_point, service_area  # NOQA


def initialize_postgres():
    """Initialize Postgres tables."""
    postgres_engine = connect.create_db_engine(echo=True)

    # Create DB if necessary...
    if not database_exists(postgres_engine.url):
        create_database(postgres_engine.url)

    # Install Postgis
    postgis.install()
    # Create tables
    Base.metadata.create_all(postgres_engine, checkfirst=True)


if __name__ == '__main__':
    initialize_postgres()
