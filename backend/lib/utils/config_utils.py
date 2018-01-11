"""Utilities."""
import collections


def list_to_dict(input_list, mapping):
    """Convert a list to a dict with the provided key mapping function."""
    return {mapping[i]: value for i, value in enumerate(input_list)}


def nested_update(orig_dict, new_dict):
    """
    Method to update only the innermost elements of dictionaries.

    This function takes two nested dictionaries and updates the first one
    only with final non-nested values of the second one.
    This allows us to specify only the specific nested values to update.
    """
    for key, val in new_dict.items():
        if isinstance(val, collections.Mapping):
            tmp = nested_update(orig_dict.get(key, {}), val)
            orig_dict[key] = tmp
        elif isinstance(val, list):
            orig_dict[key] = (orig_dict.get(key, []) + val)
        else:
            orig_dict[key] = new_dict[key]
    return orig_dict


def merge_dictionaries_with_list_values(dictionaries):
    """
    Merge dictionaries with list values, concatenating the lists.

    Returns a dictionary with keys in the union of the input keys.
    The value for a particular key is the concatenation of the values for that key
    across all input dictionaries.
    """
    result = collections.defaultdict(list)
    for d in dictionaries:
        for k in d:
            result[k].extend(d[k])

    return result
