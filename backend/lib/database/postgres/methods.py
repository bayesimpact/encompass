"""Postgres insert functions."""
import logging

from sqlalchemy import MetaData, Table
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
# from io import StringIO

logger = logging.getLogger(__name__)


def _get_table(engine, table_name):
    """Create a sql_aclhemy table from engine. To be used for queries."""
    if not engine.dialect.has_table(engine, table_name):
        logger.info('Table {} does not exist. Passing.'.format(table_name))
        return
    metadata = MetaData(engine)
    return Table(table_name, metadata, autoload=True)


def get_ids(conn, sql_class, columns, data):
    """
    Get row ids based on data and column_names.

    This function returns only the first id per data point.
    Be careful if the columns do not ensure uniqueness.
    """
    return [
        _get_data(
            conn=conn,
            sql_class=sql_class,
            columns_to_select=['id'],
            column_to_value_map={k: row[k] for k in row if k in columns})[0]
        for row in data
    ]


def _get_data(conn, sql_class, columns_to_select, column_to_value_map):
    """
    Get first available row based on a list of column_name:value pairs.

    Return the data as a dictionary.
    """
    columns = ', '.join(columns_to_select)
    column_to_value_clause = 'AND '.join(
        ["{k} = '{v}'".format(k=k, v=v) for k, v in column_to_value_map.items()]
    )
    query = 'SELECT {columns} FROM {table_name} WHERE {column_to_value_clause};'.format(
        columns=columns,
        table_name=sql_class.__tablename__,
        column_to_value_clause=column_to_value_clause)
    results = conn.execute(query)
    data = results.first()
    if data:
        return dict(data)
    return {}


def _safe_core_insert(conn, sql_class, row):
    """Safe insert in case of duplicates."""
    try:
        result = conn.execute(sql_class.__table__.insert(), row)
        return result.inserted_primary_key[0]
    except IntegrityError:
        # FIXME - SHOULD NOT DEPEND ON ADDRESS_ID.
        data = _get_data(
            conn,
            sql_class,
            columns_to_select=['id'],
            column_to_value_map={'address_id': row['address_id']}
        )
        return data.get('id', None)


def bulk_insert_via_query(engine, sql_class, data):
    """
    Insert data into a table using a single INSERT statement.

    The argument `data` should be a list of dictionaries, each of whose keys are
        a) identical across different list elements,
        b) contained in the schema for `sql_class`
        c) cover all NOT NULL columns in the schema for `sql_class`
    """
    # TODO: Handle NULL and None.
    if not data:
        logger.info('No data provided. Passing.')
        return

    bulk_insert_str = []
    columns = sorted(data[0].keys())
    base_value_string = ', '.join(['\'{{{col}}}\''.format(col=col) for col in columns])

    for entry in data:
        current_value_string = '(' + base_value_string.format(**entry) + ')'
        bulk_insert_str.append(current_value_string)

    query = """
            INSERT INTO {table} ({insert_columns})
            VALUES {values}
        """.format(
            table=sql_class.__tablename__,
            insert_columns=', '.join(columns),
            values=', '.join(bulk_insert_str))

    with engine.connect() as conn:
        results = conn.execute(query)
        return results


def core_insert(engine, sql_class, data, return_insert_ids=False, unique=True):
    """
    A single Core INSERT construct inserting mappings in bulk.

    This is one of the fastest method possible for bulk inserts.

    sql_class (Base): a sqlAlchemy declarative class.
    data ([dicts]): list of dictionary with the key corresponsing to the sql_class
          column names.
    return_insert_ids (boolean): flag to return row ids after insert.
    unique: flag to warn of uniqueness constraints one or more of the inserted fields.
    """
    with engine.connect() as conn:
        if return_insert_ids or unique:
            return [
                _safe_core_insert(conn, sql_class, row)
                for row in data
            ]
        results = conn.execute(sql_class.__table__.insert().values(data))
        logger.info('{n_rows} rows inserted into {table}.'.format(
            n_rows=results.rowcount,
            table=sql_class.__tablename__
        ))
        return results


def bulk_insert(engine, sql_class, data):
    """
    Bulk insert using a session.

    sql_class (Base): a sqlAlchemy declarative class.
    data ([dicts]): list of dictionary with the key corresponsing to the sql_class
          column names.
    """
    with Session(bind=engine) as session:
        session.bulk_insert_mappings(sql_class, data)
        session.commit()


def delete(engine, sql_class, ids):
    """Delete ids."""
    id_list = '(' + ', '.join([str(_id) for _id in ids]) + ')'
    delete_query = 'DELETE FROM {table_name} WHERE id in {id_list};'.format(
        table_name=sql_class.__tablename__,
        id_list=id_list)
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
