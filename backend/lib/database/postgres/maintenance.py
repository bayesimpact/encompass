"""Methods to perform regular database maintenance."""
from backend.lib.database.postgres import connect
from backend.lib.timer import timed

from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


def _execute_outside_of_transaction_block(query):
    """
    Execute a SQL statement outside of a transaction block.

    Bypasses the transaction start enforced by the Python DB-API.
    """
    engine = connect.create_db_engine()
    connection = engine.raw_connection()
    connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    with connection.cursor() as cur:
        cur.execute(query)
    connection.close()


@timed
def vacuum():
    """
    Vacuum all tables to remove ghost rows, then gather helpful statistics for the query optimizer.

    This should be run after any substantial INSERT, UPDATE, or DELETE statements.
    """
    _execute_outside_of_transaction_block('VACUUM ANALYZE')


@timed
def cluster():
    """Re-organize all physical tables to have records in the order of their clustered indexes."""
    # FIXME: Include specific indexes / columns to cluster on. The current implementation only
    # re-clusters tables on existing clustered indexes.
    _execute_outside_of_transaction_block('CLUSTER')
