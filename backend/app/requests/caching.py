"""Methods to cache adequacy and representative points responses."""
import json
import logging
import os
import six

from backend.config import config

logger = logging.getLogger(__name__)

CACHE_DIRECTORY = config.get('cache.directory')


def cache(hint_fields, prefix=None):
    """
    Decorator function for caching API responses.

    If caching is disabled, responses are not cached.
    If any of the hint fields are empty or missing, responses are not cached.

    Otherwise, attempt to return previously cached responses, saving the responses
    whose files do not yet exist.
    """
    def wrap(f):
        @six.wraps(f)
        def wrapped_f(**kwargs):
            return _cache(func=f, hint_fields=hint_fields, prefix=prefix, **kwargs)
        return wrapped_f
    return wrap


# TODO: Consider separating cache.enabled into cache.read_from_cache
# and cache.write_to_cache.
def _cache(func, hint_fields, prefix, **kwargs):
    function_name = func.__name__
    hint_values = [kwargs.get(field) for field in hint_fields]
    cache_filepath = _get_cached_filepath(
        prefix=prefix or function_name,
        hint_values=hint_values,
    )
    # If caching is disabled or a hint is missing, call the function normally.
    if not config.get('cache.enabled') or any(val is None for val in hint_values):
        response = func(**kwargs)
    # If the file exists, read and return.
    elif os.path.isfile(cache_filepath):
        with open(cache_filepath, 'r') as f:
            response = json.load(f)
        logger.debug('Returning cached response for {}.'.format(function_name))
    # If the file does not exist, calculate and write to the cache.
    else:
        response = func(**kwargs)
        logger.debug('Storing cached response for {}.'.format(function_name))
        with open(cache_filepath, 'w+') as f:
            json.dump(obj=response, fp=f)

    return response


def _get_cached_filepath(prefix, hint_values):
    """Return the filepath where a cached response would live for the given inputs."""
    filename = '{prefix}_{hash_string}.json'.format(
        prefix=prefix,
        hash_string=_hash_hint_values(hint_values),
    )
    return os.path.join(CACHE_DIRECTORY, filename)


def _hash_hint_values(hint_values):
    """
    Hash hint values to help identify what cached file to use.

    Attempts to convert unhashable types to hashable equivalents.
    """
    # TODO: Handle other unhashable objects.
    hash_strings = []
    for value in hint_values:
        if isinstance(value, str):
            hash_string = value
        else:
            try:
                hash_string = str(hash(value))
            except TypeError:
                hash_string = str(hash(tuple(sorted(value))))

        hash_strings.append(hash_string)

    return '_'.join(hash_strings)
