"""Test utils."""
from backend.lib import utils


def test_list_to_dict():
    """Test list_to_dict."""
    input_list = ['1', '2', '3']
    mapping = {0: 1, 1: 2, 2: 3}
    result = utils.list_to_dict(input_list, mapping)
    assert result == {1: '1', 2: '2', 3: '3'}

# TODO - Add tests for nested_update and merge_dictionaries_with_list_values.
