"""Methods to upload demographic data to the Postgres database."""
import multiprocessing.dummy
import re

from backend.lib.database.postgres import connect

import pandas as pd

N_THREADS = 100
CENSUS_TABLE_NAME = 'census_tract_demographics'


def _drop_census_table_if_exists():
    """Drop the census demographics table if it already exists."""
    engine = connect.create_db_engine()
    engine.execute('DROP TABLE IF EXISTS {};'.format(CENSUS_TABLE_NAME))


def _read_census_data_in_batches(filepath='data/census/acs2015_census_tract_data.csv'):
    dataframes = list(
        pd.read_csv(
            filepath,
            dtype={'CensusTract': str},
            chunksize=500,
        )
    )
    return [_clean_dataframe(df) for df in dataframes]


def _convert_string_to_snake_case(input):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', input)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def _clean_dataframe(df):
    """Make columns snake_case and zero-pad census tract information."""
    df.columns = [
        _convert_string_to_snake_case(col)
        for col in df.columns
    ]
    df['census_tract'] = df['census_tract'].apply(
        lambda tract_string:
            '0' + tract_string if len(tract_string) == 10
            else tract_string
    )
    return df


def _upload_single_dataframe(df):
    engine = connect.create_db_engine()
    df.to_sql(
        name=CENSUS_TABLE_NAME,
        con=engine,
        if_exists='append',
        index=False,
        index_label='census_tract'
    )


def upload_all_dataframes(dataframes):
    """
    Upload all dataframes to the specified table using multithreading.

    Re-creates the table if it does not yet exist.
    """
    # Ensure that the table exists by running the first INSERT statement separately.
    _upload_single_dataframe(dataframes[0])
    with multiprocessing.dummy.Pool(N_THREADS) as executor:
        executor.map(_upload_single_dataframe, dataframes[1:])


if __name__ == '__main__':
    _drop_census_table_if_exists()
    dataframes = _read_census_data_in_batches()
    upload_all_dataframes(dataframes)
