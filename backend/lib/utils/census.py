def readable_columns_from_census_mapping(census_mapping):
    census_columns = [
        '{key} AS {intelligible_name}'.format(
            key=group,
            intelligible_name=census_mapping[category][group]['joined_column_name']
        ) for category in census_mapping
        for group in census_mapping[category]

    ]
    return census_columns
