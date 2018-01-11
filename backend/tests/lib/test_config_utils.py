"""Test config_utils."""
from backend.lib.utils import config_utils


def test_list_to_dict():
    """Test list_to_dict."""
    input_list = ['1', '2', '3']
    mapping = {0: 1, 1: 2, 2: 3}
    result = config_utils.list_to_dict(input_list, mapping)
    assert result == {1: '1', 2: '2', 3: '3'}


def test_nested_update_independent():
    """Test nested update with independent dicts."""
    orig_dict = {'a': 'a'}
    new_dict = {'b': 'b'}
    updated_dict = config_utils.nested_update(orig_dict, new_dict)
    assert updated_dict == {'a': 'a', 'b': 'b'}


def test_nested_update_dependent():
    """Test nested update with dependent dicts."""
    orig_dict = {'a': 'a'}
    new_dict = {'a': 'b'}
    updated_dict = config_utils.nested_update(orig_dict, new_dict)
    assert updated_dict == {'a': 'b'}


def test_nested_update_dependent_second_layer():
    """Test nested update with dependent dicts on second layer."""
    orig_dict = {'a': {'a': 'a'}, 'b': {'a': 'a'}}
    new_dict = {'a': {'a': 'b'}}
    updated_dict = config_utils.nested_update(orig_dict, new_dict)
    assert updated_dict == {'a': {'a': 'b'}, 'b': {'a': 'a'}}

# TODO - Add tests and merge_dictionaries_with_list_values.
