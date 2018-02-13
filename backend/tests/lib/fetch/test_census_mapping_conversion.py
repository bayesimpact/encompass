from backend.lib.utils.census import readable_columns_from_census_mapping

MOCK_CENSUS_MAPPING = {
    'category1': {
        'c1g1': {
            'joined_column_name': 'category_one_group_one',
            'human_readable_name': 'Category One, Group One'
        },
        'c1g2': {
            'joined_column_name': 'category_one_group_two',
            'human_readable_name': 'Category One, Group Two'
        }
    },
    'category2': {
        'c2g1': {
            'joined_column_name': 'category_two_group_one',
            'human_readable_name': 'Category Two, Group One'
        },
        'c2g2': {
            'joined_column_name': 'category_two_group_two',
            'human_readable_name': 'Category Two, Group Two'
        }
    }
}


class TestReadableColumnsFromCensusMapping:

    @staticmethod
    def test_readable_columns_from_census_mapping():
        census_columns = readable_columns_from_census_mapping(MOCK_CENSUS_MAPPING)

        expected_census_columns = [
            'c1g1 AS category_one_group_one',
            'c1g2 AS category_one_group_two',
            'c2g1 AS category_two_group_one',
            'c2g2 AS category_two_group_two'
        ]

        assert all([a == b for a, b in zip(census_columns, expected_census_columns)])
