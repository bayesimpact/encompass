"""Postgres insert functions."""
import logging

from sqlalchemy import MetaData, Table
# from io import StringIO

logger = logging.getLogger(__name__)

EXCLUDED_COLUMNS = ['id', 'created_at', 'updated_at']


def _get_table(engine, table_name):
    """Create a sql_aclhemy table from engine. To be used for queries."""
    if not engine.dialect.has_table(engine, table_name):
        logger.info('Table {} does not exist. Passing.'.format(table_name))
        return
    metadata = MetaData(engine)
    return Table(table_name, metadata, autoload=True)


def core_insert(engine, sql_class, data):
    """
    A single Core INSERT construct inserting mappings in bulk.

    This is one of the fastest method possible for bulk inserts.
    """
    with engine.connect() as conn:
        inserts = conn.execute(sql_class.__table__.insert(), data)
        return inserts.inserted_primary_key


def delete(engine, table_name, ids):
    """Delete ids."""
    id_list = '(' + ', '.join([str(_id) for _id in ids]) + ')'
    delete_query = 'DELETE FROM {table_name} WHERE id in {id_list};'.format(
        table_name=table_name, id_list=id_list)
    engine.execute(delete_query)


# def _build_tsv_from_dict(dictionary, columns):
#     """
#     Build the TSV content for a claim.

#     Args:
#         dictionary: (dict) claim line as a dict
#         columns: ([str]) columns to upload
#     Return:
#         tsv_line: (str)
#     """
#     # '\\N' means inserting NULL for that column.
#     return '\t'.join([str(dictionary.get(column, '\\N') or '\\N') for column in columns])


# def _build_tsv_from_dicts(data, columns):
#     """
#     Create a TSV file in memory StringIO for the selected columns.

#     Args:
#         data: (list(dict)) claim lines as dict
#         columns: ([str]) columns to upload
#     Return:
#         tsv: (StringIO)
#     """
#     tsv_str = u'\n'.join([_build_tsv_from_dict(row, columns) for row in data])

#     if not tsv_str:
#         return None

#     tsv = StringIO()
#     tsv.write(tsv_str)
#     tsv.seek(0)

#     return tsv


# def _insert_as_tsv(engine, data, table, columns):
#     """
#     Insert data using PG_COPY and a TSV file in memory StringIO.

#     Args:
#         engine: (pg database)
#         data: (list(dict)) claim lines as dict
#         table_name
#         columns: ([str]) columns to upload
#     """
#     tsv = _build_tsv_from_dicts(data, columns)
#     if not tsv:
#         return

#     try:
#         connection = engine.raw_connection()
#         cursor = connection.cursor()
#         cursor.copy_from(tsv, table, columns=columns)
#         connection.commit()
#     except Exception as e:
#         logger.warn('Error inserting: {} - Sample data:'.format(repr(e), data[0]))
#         connection.rollback()
#         raise e
#     finally:
#         tsv.close()
#         connection.close()
