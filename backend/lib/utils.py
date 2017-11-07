"""Utilities."""


def list_to_dict(input_list, mapping):
    """Convert a list to a dict with the provided key mapping function."""
    return {mapping[i]: value for i, value in enumerate(input_list)}
