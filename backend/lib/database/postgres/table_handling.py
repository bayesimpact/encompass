"""Postgres functions to create and handle tables."""
from __future__ import absolute_import

import logging
import random
import string

from sqlalchemy import MetaData, Table

logger = logging.getLogger(__name__)


def get_table(engine, table_name):
    """Create a sql_aclhemy table from engine. To be used for queries."""
    if not engine.dialect.has_table(engine, table_name):
        logger.info('Table {} does not exist. Passing.'.format(table_name))
        return
    metadata = MetaData(engine)
    return Table(table_name, metadata, autoload=True)


def get_random_table_name(prefix='', length=12):
    """Return a random valid Postgres table name."""
    return '{}_{}'.format(
        prefix,
        ''.join(random.choice(string.ascii_lowercase) for _ in range(12))
    )
