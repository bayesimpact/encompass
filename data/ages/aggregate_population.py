# Crunch things!
# Specifically ages.
# Until we have new aggregated ages.
# Let's go!
import csv

STATES = ['al', 'ar', 'az', 'ca', 'fl', 'ga', 'id', 'la', 'mo', 'ms', 'nv', 'or', 'ri', 'tx', 'wa']

# These are the absolute paths in my filesystem.
# TODO update script to accept arguments for i/o paths and states to process.
INPUT_FILE_PATH_TEMPLATE = "/Users/philip/repos/tds/data/ages/ages-{}/DEC_10_SF1_QTP2.csv"
OUTPUT_FILE_PATH_TEMPLATE = "/Users/philip/repos/tds/data/ages/transformed/ages-{}-transformed.csv"

# There are a lot of columns - even more than this. This is the subset of columns which are
# useful to us - they contain values for specific individual years for both sexes.
RELEVANT_COLUMN_NAMES = dict(
    SUBHD0101_S03='Number - Both sexes; Total population (all ages) - Under 5 years - Under 1 year',
    SUBHD0101_S04='Number - Both sexes; Total population (all ages) - Under 5 years - 1 year',
    SUBHD0101_S05='Number - Both sexes; Total population (all ages) - Under 5 years - 2 years',
    SUBHD0101_S06='Number - Both sexes; Total population (all ages) - Under 5 years - 3 years',
    SUBHD0101_S07='Number - Both sexes; Total population (all ages) - Under 5 years - 4 years',
    SUBHD0101_S09='Number - Both sexes; Total population (all ages) - 5 to 9 years - 5 years',
    SUBHD0101_S10='Number - Both sexes; Total population (all ages) - 5 to 9 years - 6 years',
    SUBHD0101_S11='Number - Both sexes; Total population (all ages) - 5 to 9 years - 7 years',
    SUBHD0101_S12='Number - Both sexes; Total population (all ages) - 5 to 9 years - 8 years',
    SUBHD0101_S13='Number - Both sexes; Total population (all ages) - 5 to 9 years - 9 years',
    SUBHD0101_S15='Number - Both sexes; Total population (all ages) - 10 to 14 years - 10 years',
    SUBHD0101_S16='Number - Both sexes; Total population (all ages) - 10 to 14 years - 11 years',
    SUBHD0101_S17='Number - Both sexes; Total population (all ages) - 10 to 14 years - 12 years',
    SUBHD0101_S18='Number - Both sexes; Total population (all ages) - 10 to 14 years - 13 years',
    SUBHD0101_S19='Number - Both sexes; Total population (all ages) - 10 to 14 years - 14 years',
    SUBHD0101_S21='Number - Both sexes; Total population (all ages) - 15  to 19 years - 15 years',
    SUBHD0101_S22='Number - Both sexes; Total population (all ages) - 15  to 19 years - 16 years',
    SUBHD0101_S23='Number - Both sexes; Total population (all ages) - 15  to 19 years - 17 years',
    SUBHD0101_S24='Number - Both sexes; Total population (all ages) - 15  to 19 years - 18 years',
    SUBHD0101_S25='Number - Both sexes; Total population (all ages) - 15  to 19 years - 19 years',
    SUBHD0101_S27='Number - Both sexes; Total population (all ages) - 20 to 24 years - 20 years',
    SUBHD0101_S28='Number - Both sexes; Total population (all ages) - 20 to 24 years - 21 years',
    SUBHD0101_S29='Number - Both sexes; Total population (all ages) - 20 to 24 years - 22 years',
    SUBHD0101_S30='Number - Both sexes; Total population (all ages) - 20 to 24 years - 23 years',
    SUBHD0101_S31='Number - Both sexes; Total population (all ages) - 20 to 24 years - 24 years',
    SUBHD0101_S33='Number - Both sexes; Total population (all ages) - 25 to 29 years - 25 years',
    SUBHD0101_S34='Number - Both sexes; Total population (all ages) - 25 to 29 years - 26 years',
    SUBHD0101_S35='Number - Both sexes; Total population (all ages) - 25 to 29 years - 27 years',
    SUBHD0101_S36='Number - Both sexes; Total population (all ages) - 25 to 29 years - 28 years',
    SUBHD0101_S37='Number - Both sexes; Total population (all ages) - 25 to 29 years - 29 years',
    SUBHD0101_S39='Number - Both sexes; Total population (all ages) - 30 to 34 years - 30 years',
    SUBHD0101_S40='Number - Both sexes; Total population (all ages) - 30 to 34 years - 31 years',
    SUBHD0101_S41='Number - Both sexes; Total population (all ages) - 30 to 34 years - 32 years',
    SUBHD0101_S42='Number - Both sexes; Total population (all ages) - 30 to 34 years - 33 years',
    SUBHD0101_S43='Number - Both sexes; Total population (all ages) - 30 to 34 years - 34 years',
    SUBHD0101_S45='Number - Both sexes; Total population (all ages) - 35 to 39 years - 35 years',
    SUBHD0101_S46='Number - Both sexes; Total population (all ages) - 35 to 39 years - 36 years',
    SUBHD0101_S47='Number - Both sexes; Total population (all ages) - 35 to 39 years - 37 years',
    SUBHD0101_S48='Number - Both sexes; Total population (all ages) - 35 to 39 years - 38 years',
    SUBHD0101_S49='Number - Both sexes; Total population (all ages) - 35 to 39 years - 39 years',
    SUBHD0101_S51='Number - Both sexes; Total population (all ages) - 40 to 44 years - 40 years',
    SUBHD0101_S52='Number - Both sexes; Total population (all ages) - 40 to 44 years - 41 years',
    SUBHD0101_S53='Number - Both sexes; Total population (all ages) - 40 to 44 years - 42 years',
    SUBHD0101_S54='Number - Both sexes; Total population (all ages) - 40 to 44 years - 43 years',
    SUBHD0101_S55='Number - Both sexes; Total population (all ages) - 40 to 44 years - 44 years',
    SUBHD0101_S57='Number - Both sexes; Total population (all ages) - 45 to 49 years - 45 years',
    SUBHD0101_S58='Number - Both sexes; Total population (all ages) - 45 to 49 years - 46 years',
    SUBHD0101_S59='Number - Both sexes; Total population (all ages) - 45 to 49 years - 47 years',
    SUBHD0101_S60='Number - Both sexes; Total population (all ages) - 45 to 49 years - 48 years',
    SUBHD0101_S61='Number - Both sexes; Total population (all ages) - 45 to 49 years - 49 years',
    SUBHD0101_S63='Number - Both sexes; Total population (all ages) - 50 to 54 years - 50 years',
    SUBHD0101_S64='Number - Both sexes; Total population (all ages) - 50 to 54 years - 51 years',
    SUBHD0101_S65='Number - Both sexes; Total population (all ages) - 50 to 54 years - 52 years',
    SUBHD0101_S66='Number - Both sexes; Total population (all ages) - 50 to 54 years - 53 years',
    SUBHD0101_S67='Number - Both sexes; Total population (all ages) - 50 to 54 years - 54 years',
    SUBHD0101_S69='Number - Both sexes; Total population (all ages) - 55 to 59 years - 55 years',
    SUBHD0101_S70='Number - Both sexes; Total population (all ages) - 55 to 59 years - 56 years',
    SUBHD0101_S71='Number - Both sexes; Total population (all ages) - 55 to 59 years - 57 years',
    SUBHD0101_S72='Number - Both sexes; Total population (all ages) - 55 to 59 years - 58 years',
    SUBHD0101_S73='Number - Both sexes; Total population (all ages) - 55 to 59 years - 59 years',
    SUBHD0101_S75='Number - Both sexes; Total population (all ages) - 60 to 64 years - 60 years',
    SUBHD0101_S76='Number - Both sexes; Total population (all ages) - 60 to 64 years - 61 years',
    SUBHD0101_S77='Number - Both sexes; Total population (all ages) - 60 to 64 years - 62 years',
    SUBHD0101_S78='Number - Both sexes; Total population (all ages) - 60 to 64 years - 63 years',
    SUBHD0101_S79='Number - Both sexes; Total population (all ages) - 60 to 64 years - 64 years',
    SUBHD0101_S81='Number - Both sexes; Total population (all ages) - 65 to 69 years - 65 years',
    SUBHD0101_S82='Number - Both sexes; Total population (all ages) - 65 to 69 years - 66 years',
    SUBHD0101_S83='Number - Both sexes; Total population (all ages) - 65 to 69 years - 67 years',
    SUBHD0101_S84='Number - Both sexes; Total population (all ages) - 65 to 69 years - 68 years',
    SUBHD0101_S85='Number - Both sexes; Total population (all ages) - 65 to 69 years - 69 years',
    SUBHD0101_S87='Number - Both sexes; Total population (all ages) - 70 to 74 years - 70 years',
    SUBHD0101_S88='Number - Both sexes; Total population (all ages) - 70 to 74 years - 71 years',
    SUBHD0101_S89='Number - Both sexes; Total population (all ages) - 70 to 74 years - 72 years',
    SUBHD0101_S90='Number - Both sexes; Total population (all ages) - 70 to 74 years - 73 years',
    SUBHD0101_S91='Number - Both sexes; Total population (all ages) - 70 to 74 years - 74 years',
    SUBHD0101_S93='Number - Both sexes; Total population (all ages) - 75 to 79 years - 75 years',
    SUBHD0101_S94='Number - Both sexes; Total population (all ages) - 75 to 79 years - 76 years',
    SUBHD0101_S95='Number - Both sexes; Total population (all ages) - 75 to 79 years - 77 years',
    SUBHD0101_S96='Number - Both sexes; Total population (all ages) - 75 to 79 years - 78 years',
    SUBHD0101_S97='Number - Both sexes; Total population (all ages) - 75 to 79 years - 79 years',
    SUBHD0101_S99='Number - Both sexes; Total population (all ages) - 80 to 84 years - 80 years',
    SUBHD0101_S100='Number - Both sexes; Total population (all ages) - 80 to 84 years - 81 years',
    SUBHD0101_S101='Number - Both sexes; Total population (all ages) - 80 to 84 years - 82 years',
    SUBHD0101_S102='Number - Both sexes; Total population (all ages) - 80 to 84 years - 83 years',
    SUBHD0101_S103='Number - Both sexes; Total population (all ages) - 80 to 84 years - 84 years',
    SUBHD0101_S105='Number - Both sexes; Total population (all ages) - 85 to 89 years - 85 years',
    SUBHD0101_S106='Number - Both sexes; Total population (all ages) - 85 to 89 years - 86 years',
    SUBHD0101_S107='Number - Both sexes; Total population (all ages) - 85 to 89 years - 87 years',
    SUBHD0101_S108='Number - Both sexes; Total population (all ages) - 85 to 89 years - 88 years',
    SUBHD0101_S109='Number - Both sexes; Total population (all ages) - 85 to 89 years - 89 years',
    SUBHD0101_S111='Number - Both sexes; Total population (all ages) - 90 to 94 years - 90 years',
    SUBHD0101_S112='Number - Both sexes; Total population (all ages) - 90 to 94 years - 91 years',
    SUBHD0101_S113='Number - Both sexes; Total population (all ages) - 90 to 94 years - 92 years',
    SUBHD0101_S114='Number - Both sexes; Total population (all ages) - 90 to 94 years - 93 years',
    SUBHD0101_S115='Number - Both sexes; Total population (all ages) - 90 to 94 years - 94 years',
    SUBHD0101_S117='Number - Both sexes; Total population (all ages) - 95 to 99 years - 95 years',
    SUBHD0101_S118='Number - Both sexes; Total population (all ages) - 95 to 99 years - 96 years',
    SUBHD0101_S119='Number - Both sexes; Total population (all ages) - 95 to 99 years - 97 years',
    SUBHD0101_S120='Number - Both sexes; Total population (all ages) - 95 to 99 years - 98 years',
    SUBHD0101_S121='Number - Both sexes; Total population (all ages) - 95 to 99 years - 99 years',
    SUBHD0101_S122='Number - Both sexes; Total population (all ages) - 100 to 104 years',
    SUBHD0101_S123='Number - Both sexes; Total population (all ages) - 105 to 109 years',
    SUBHD0101_S124='Number - Both sexes; Total population (all ages) - 110 years and over')

# The columns below correspond to each different grouping that we want.
ZERO_TO_EIGHTEEN = ['SUBHD0101_S03',
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
                    'SUBHD0101_S24']

NINETEEN_TO_TWENTY_FIVE = ['SUBHD0101_S25',
                           'SUBHD0101_S27',
                           'SUBHD0101_S28',
                           'SUBHD0101_S29',
                           'SUBHD0101_S30',
                           'SUBHD0101_S31',
                           'SUBHD0101_S33']

TWENTY_SIX_TO_THIRTY_FOUR = ['SUBHD0101_S34',
                             'SUBHD0101_S35',
                             'SUBHD0101_S36',
                             'SUBHD0101_S37',
                             'SUBHD0101_S39',
                             'SUBHD0101_S40',
                             'SUBHD0101_S41',
                             'SUBHD0101_S42',
                             'SUBHD0101_S43']

THIRTY_FIVE_TO_FIFTY_FOUR = ['SUBHD0101_S43',
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
                             'SUBHD0101_S67']

FIFTY_FIVE_TO_SIXTY_FOUR = ['SUBHD0101_S69',
                            'SUBHD0101_S70',
                            'SUBHD0101_S71',
                            'SUBHD0101_S72',
                            'SUBHD0101_S73',
                            'SUBHD0101_S75',
                            'SUBHD0101_S76',
                            'SUBHD0101_S77',
                            'SUBHD0101_S78',
                            'SUBHD0101_S79']

SIXTY_FIVE_PLUS = ['SUBHD0101_S81',
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
                   'SUBHD0101_S124']

# Now that we have identified the relevant columns, we can do the transformation.
for state in STATES:
    # Output object.
    output = []

    # Input path.
    input_file_path = INPUT_FILE_PATH_TEMPLATE.format(state)

    # Now let's get the data for each state.
    with open(input_file_path) as file:
        data = csv.DictReader(file)
        next(data)  # Skip the first row since it's the header row.
        for row in data:  # For each census tract...
            census_tract = {  # Create a new output dict.
                'census_tract': row['GEO.id2'],
                'zero_to_eighteen': 0,
                'nineteen_to_twenty_five': 0,
                'twenty_six_to_thirty_four': 0,
                'thirty_five_to_fifty_four': 0,
                'fifty_five_to_sixty_four': 0,
                'sixty_five_plus': 0,
            }
            # Then sum together the relevant categories.
            for column in ZERO_TO_EIGHTEEN:
                census_tract['zero_to_eighteen'] += float(row[column])
            for column in NINETEEN_TO_TWENTY_FIVE:
                census_tract['nineteen_to_twenty_five'] += float(row[column])
            for column in TWENTY_SIX_TO_THIRTY_FOUR:
                census_tract['twenty_six_to_thirty_four'] += float(row[column])
            for column in THIRTY_FIVE_TO_FIFTY_FOUR:
                census_tract['thirty_five_to_fifty_four'] += float(row[column])
            for column in FIFTY_FIVE_TO_SIXTY_FOUR:
                census_tract['fifty_five_to_sixty_four'] += float(row[column])
            for column in SIXTY_FIVE_PLUS:
                census_tract['sixty_five_plus'] += float(row[column])

            # Update: Also calculate percentages.
            total_population = 0
            total_population += sum([census_tract[group] for group in census_tract
                                    if group != 'census_tract'])
            percentages = {}
            for group in census_tract:
                if group != 'census_tract':
                    # Some tracts are in the sea, and have no-one in them.
                    if total_population < 1:
                        percentages[group + '_percent'] = 0
                    else:
                        percent = float(census_tract[group]) / total_population * 100
                        percentages[group + '_percent'] = percent
            census_tract.update(percentages)

            # Now we have the aggregated values for each census tract.
            output.append(census_tract)

    # Now write the transformed data to a new file.
    output_file_path = OUTPUT_FILE_PATH_TEMPLATE.format(state)
    with open(output_file_path, 'w') as file:
        fieldnames = ['census_tract', 'zero_to_eighteen', 'zero_to_eighteen_percent',
                      'nineteen_to_twenty_five', 'nineteen_to_twenty_five_percent',
                      'twenty_six_to_thirty_four', 'twenty_six_to_thirty_four_percent',
                      'thirty_five_to_fifty_four', 'thirty_five_to_fifty_four_percent',
                      'fifty_five_to_sixty_four', 'fifty_five_to_sixty_four_percent',
                      'sixty_five_plus', 'sixty_five_plus_percent']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(output)
