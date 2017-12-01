"""Methods to connect to AWS/RDS/Postgres."""
import logging
import os

from sqlalchemy import create_engine

logger = logging.getLogger(__name__)


def create_db_engine(db_url=os.getenv('POSTGRES_URL'), echo=False):
    """Create a sqlaclhemy engine from a database url.

    Example url "host=postgres port=5432 user=postgres password=*** dbname=postgres".
    """
    logger.info('Creating Postgres engine.')
    return create_engine(db_url, pool_size=20, max_overflow=0, echo=echo)
