"""
This test class is running on a local postgres to test the basic connection features.

It will evolve to test connections to the aws db as well.
"""
from backend.lib.database.postgres import connect

import pytest

from sqlalchemy.exc import OperationalError


def test_engine_creation():
    """ Test that we can create a connection without any error."""
    db = connect.create_db_engine()
    assert db is not None


def test_engine_creation_retry_fail():
    """Test that engines retries to connect by providing a fake URL."""
    with pytest.raises(OperationalError):
        db_engine = connect.create_db_engine(db_url='postgresql://user:pwd@fake_url:5432/postgres')
        db_engine.connect()
