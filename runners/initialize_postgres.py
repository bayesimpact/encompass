"""Initialize Postgres tables."""
from backend.lib.database.postgres import connect
from backend.lib.database.postgres import postgis
from backend.lib.database.postgres.base import Base
from backend.lib.database.tables import address, provider, representative_point, service_area  # NOQA


def initialize_postgres():
    """Initialize Postgres tables."""
    postgres_engine = connect.create_db_engine(echo=True)
    # Install Postgis
    postgis.install()
    # Create tables
    Base.metadata.create_all(postgres_engine, checkfirst=True)


if __name__ == '__main__':
    initialize_postgres()
