"""
Methods to upload demographic data to the Postgres database.

The csv files come from the ACS 5-year estimates and can be found using American Fact Finder:
e.g.,
    https://factfinder.census.gov/faces/tableservices/jsf/pages/
    productview.xhtml?pid=ACS_16_5YR_DP02&prodType=table
"""
import csv

from backend.lib.database.postgres import connect

import pandas as pd

N_THREADS = 100

UNUSED_COLUMNS = ['GEO.display-label', 'GEO.id']
COLUMN_MAPPING = {'GEO.id2': 'census_tract'}


def _drop_table_if_exists(table_name):
    """Drop the provided table if it already exists."""
    print('Dropping {} (if such a table exists).'.format(table_name))
    engine = connect.create_db_engine()
    engine.execute('DROP TABLE IF EXISTS {};'.format(table_name))


def _clean_column_name(column_name, column_mapping=COLUMN_MAPPING):
    """Transform a column name into a format accepted by Postgres."""
    if column_name in COLUMN_MAPPING:
        return COLUMN_MAPPING[column_name]
    return column_name.lower().replace('.', '_').replace('-', '_')


def _clean_csv(raw_csv_path, output_path):
    """Clean a csv, rewriting to the specified filepath."""
    print('Cleaning csv {}.'.format(raw_csv_path))
    df = pd.read_csv(raw_csv_path, skiprows=[1], encoding='latin-1')
    df.drop(columns=UNUSED_COLUMNS, inplace=True)
    df.columns = [
        _clean_column_name(col)
        for col in df.columns
    ]
    df = df.apply(pd.to_numeric, args=('coerce',))
    # Zero-pad the census tract ID if necessary.
    df['census_tract'] = df['census_tract'].astype(str).apply(
        lambda tract_str:
            '0' + tract_str if len(tract_str) == 10
            else tract_str
    )
    df.to_csv(
        path_or_buf=output_path,
        header=False,
        index=False,
    )
    return output_path


def _create_census_table_from_csv(raw_csv_path, target_table):
    """Create a census table using the columns from the provided csv."""
    print('Creating table {}.'.format(target_table))
    with open(raw_csv_path, 'r', newline='') as csv_file:
        reader = csv.reader(csv_file)
        columns = next(reader)

    columns = [
        _clean_column_name(col) for col in columns if col not in UNUSED_COLUMNS
    ]
    datatypes = [
        'VARCHAR' if col == 'census_tract' else 'DECIMAL'
        for col in columns
    ]
    columns_with_types = [
        '{} {}'.format(col, dtype)
        for col, dtype in zip(columns, datatypes)
    ]
    if 'census_tract' in columns:
        primary_key_index = columns.index('census_tract')
        columns_with_types[primary_key_index] += ' PRIMARY KEY '

    create_table_query = """
        CREATE TABLE {target_table} (
            {columns_with_types}
        )
        ;
    """.format(
        target_table=target_table,
        columns_with_types=', '.join(columns_with_types)
    )
    engine = connect.create_db_engine()
    engine.execute(create_table_query)


def _upload_csv(csv_path, target_table, sep=',', with_header=False):
    """Upload a (headerless) csv to the target table via a COPY command."""
    print('Uploading {} to table {}.'.format(csv_path, target_table))
    engine = connect.create_db_engine()
    conn = engine.raw_connection()
    cur = conn.cursor()
    with open(csv_path, 'r') as csv_file:
        cur.copy_expert(
            sql="""
                COPY {target_table} FROM STDIN
                WITH CSV
                {header}
                DELIMITER AS ','
            """.format(target_table=target_table, header=' HEADER ' if with_header else ''),
            file=csv_file
        )
    conn.commit()
    cur.close()
    conn.close()


if __name__ == '__main__':
    table_names = [
        'census_acs_dp_02',
        'census_acs_dp_03',
        'census_acs_dp_04',
        'census_acs_dp_05'
    ]
    raw_filepaths = [
        'data/census/data-profile-tables/raw/ACS_16_5YR_DP02_with_ann.csv',
        'data/census/data-profile-tables/raw/ACS_16_5YR_DP03_with_ann.csv',
        'data/census/data-profile-tables/raw/ACS_16_5YR_DP04_with_ann.csv',
        'data/census/data-profile-tables/raw/ACS_16_5YR_DP05_with_ann.csv',
    ]
    clean_filepaths = [
        'data/census/data-profile-tables/acs_16_5yr_dp02.csv',
        'data/census/data-profile-tables/acs_16_5yr_dp03.csv',
        'data/census/data-profile-tables/acs_16_5yr_dp04.csv',
        'data/census/data-profile-tables/acs_16_5yr_dp05.csv',
    ]
    for target_table, raw_path, clean_path in zip(table_names, raw_filepaths, clean_filepaths):
        _clean_csv(raw_path, clean_path)
        _drop_table_if_exists(target_table)
        _create_census_table_from_csv(raw_path, target_table)
        _upload_csv(clean_path, target_table)
