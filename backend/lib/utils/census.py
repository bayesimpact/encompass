"""Tools to manage census tables."""
POSTGRES_COLUMN_NAME_LIMIT = 63


def _verified_column_name(column_name, limit=POSTGRES_COLUMN_NAME_LIMIT):
    if len(column_name) > limit:
        raise Exception('Column name {} is too long. Postgres limit is {}.'.format(
            column_name, limit))
    return column_name


def readable_columns_from_census_mapping(census_mapping):
    census_columns = [
        '{key} AS {unique_column_name}'.format(
            key=group,
            unique_column_name=_verified_column_name(
                census_mapping[category][group]['joined_column_name']
            )
        ) for category in census_mapping
        for group in census_mapping[category]

    ]
    return census_columns
