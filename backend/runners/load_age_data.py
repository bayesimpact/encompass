"""
Methods to upload age data to the Postgres database.

The data comes from the 2010 decennial census under the table SF1-QP2: Single Years of Age and Sex.
"""
import csv

from backend.runners.load_census_tract_demographics import (
    _create_census_table_from_csv,
    _drop_table_if_exists,
    _upload_csv
)

INPUT_FILE_PATH = 'data/census/age/raw/DEC_10_SF1_QTP2.csv'
OUTPUT_FILE_PATH = 'data/census/age/age-data-transformed.csv'

OUTPUT_COLUMNS = [
    'census_tract', 'zero_to_eighteen', 'zero_to_eighteen_percent',
    'nineteen_to_twenty_five', 'nineteen_to_twenty_five_percent',
    'twenty_six_to_thirty_four', 'twenty_six_to_thirty_four_percent',
    'thirty_five_to_fifty_four', 'thirty_five_to_fifty_four_percent',
    'fifty_five_to_sixty_four', 'fifty_five_to_sixty_four_percent',
    'sixty_five_plus', 'sixty_five_plus_percent'
]

INPUT_COLUMNS_BY_COHORT = {
    'zero_to_eighteen': [
        'SUBHD0101_S03',
        'SUBHD0101_S04',
        'SUBHD0101_S05',
        'SUBHD0101_S06',
        'SUBHD0101_S07',
        'SUBHD0101_S09',
        'SUBHD0101_S10',
        'SUBHD0101_S11',
        'SUBHD0101_S12',
        'SUBHD0101_S13',
        'SUBHD0101_S15',
        'SUBHD0101_S16',
        'SUBHD0101_S17',
        'SUBHD0101_S18',
        'SUBHD0101_S19',
        'SUBHD0101_S21',
        'SUBHD0101_S22',
        'SUBHD0101_S23',
        'SUBHD0101_S24'
    ],
    'nineteen_to_twenty_five': [
        'SUBHD0101_S25',
        'SUBHD0101_S27',
        'SUBHD0101_S28',
        'SUBHD0101_S29',
        'SUBHD0101_S30',
        'SUBHD0101_S31',
        'SUBHD0101_S33'
    ],
    'twenty_six_to_thirty_four': [
        'SUBHD0101_S34',
        'SUBHD0101_S35',
        'SUBHD0101_S36',
        'SUBHD0101_S37',
        'SUBHD0101_S39',
        'SUBHD0101_S40',
        'SUBHD0101_S41',
        'SUBHD0101_S42',
        'SUBHD0101_S43'
    ],
    'thirty_five_to_fifty_four': [
        'SUBHD0101_S43',
        'SUBHD0101_S45',
        'SUBHD0101_S46',
        'SUBHD0101_S47',
        'SUBHD0101_S48',
        'SUBHD0101_S49',
        'SUBHD0101_S51',
        'SUBHD0101_S52',
        'SUBHD0101_S53',
        'SUBHD0101_S54',
        'SUBHD0101_S55',
        'SUBHD0101_S57',
        'SUBHD0101_S58',
        'SUBHD0101_S59',
        'SUBHD0101_S60',
        'SUBHD0101_S61',
        'SUBHD0101_S63',
        'SUBHD0101_S64',
        'SUBHD0101_S65',
        'SUBHD0101_S66',
        'SUBHD0101_S67'
    ],
    'fifty_five_to_sixty_four': [
        'SUBHD0101_S69',
        'SUBHD0101_S70',
        'SUBHD0101_S71',
        'SUBHD0101_S72',
        'SUBHD0101_S73',
        'SUBHD0101_S75',
        'SUBHD0101_S76',
        'SUBHD0101_S77',
        'SUBHD0101_S78',
        'SUBHD0101_S79'
    ],
    'sixty_five_plus': [
        'SUBHD0101_S81',
        'SUBHD0101_S82',
        'SUBHD0101_S83',
        'SUBHD0101_S84',
        'SUBHD0101_S85',
        'SUBHD0101_S87',
        'SUBHD0101_S88',
        'SUBHD0101_S89',
        'SUBHD0101_S90',
        'SUBHD0101_S91',
        'SUBHD0101_S93',
        'SUBHD0101_S94',
        'SUBHD0101_S95',
        'SUBHD0101_S96',
        'SUBHD0101_S97',
        'SUBHD0101_S99',
        'SUBHD0101_S100',
        'SUBHD0101_S101',
        'SUBHD0101_S102',
        'SUBHD0101_S103',
        'SUBHD0101_S105',
        'SUBHD0101_S106',
        'SUBHD0101_S107',
        'SUBHD0101_S108',
        'SUBHD0101_S109',
        'SUBHD0101_S111',
        'SUBHD0101_S112',
        'SUBHD0101_S113',
        'SUBHD0101_S114',
        'SUBHD0101_S115',
        'SUBHD0101_S117',
        'SUBHD0101_S118',
        'SUBHD0101_S119',
        'SUBHD0101_S120',
        'SUBHD0101_S121',
        'SUBHD0101_S122',
        'SUBHD0101_S123',
        'SUBHD0101_S124'
    ]
}

TABLE_NAME = 'aggregated_ages'


def _convert_input_row_to_output_row(row):
    """Convert an input row using unreadable column names to one grouped by age cohort."""
    age_totals = {
        cohort: sum([float(row[column]) for column in column_list])
        for cohort, column_list in INPUT_COLUMNS_BY_COHORT.items()
    }
    total_population = sum(age_totals.values())
    percentages = {
        (cohort + '_percent'):
            0.0 if total_population < 1.0 else (population_by_cohort / total_population * 100)
        for cohort, population_by_cohort in age_totals.items()
    }
    return dict(**age_totals, **percentages, **{'census_tract': row['GEO.id2']})


def convert_input_file_to_output_rows(input_path):
    """Convert rows from an input filepath to the output format."""
    with open(input_path, 'r', encoding='latin-1') as file:
        data = csv.DictReader(file)
        next(data)  # Skip the first row since it's the header row.
        return [_convert_input_row_to_output_row(row) for row in data]


def transform_csv_file(input_path, output_path):
    """Transform an input csv into the format expected by the database."""
    print('Transforming {} to {}.'.format(input_path, output_path))
    # Convert the rows to a usable format.
    rows = convert_input_file_to_output_rows(input_path=input_path)
    # Write the rows to the output file.
    with open(output_path, 'w+', encoding='latin-1') as file:
        writer = csv.DictWriter(file, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)


def main(input_path=INPUT_FILE_PATH, output_path=OUTPUT_FILE_PATH, table_name=TABLE_NAME):
    """
    Add the data from the specified CSV to the database.

    This process happens in three steps:
        1. Create a CSV in the correct format.
        2. Create a corresponding table in the database (dropping any existing tables by that name).
        3. Upload the CSV to the database.
    """
    transform_csv_file(input_path=input_path, output_path=output_path)
    _drop_table_if_exists(table_name=table_name)
    _create_census_table_from_csv(raw_csv_path=output_path, target_table=table_name)
    _upload_csv(csv_path=output_path, target_table=table_name, with_header=True)


if __name__ == '__main__':
    main()
