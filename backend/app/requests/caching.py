"""Methods to cache adequacy and representative points responses."""
import json
import logging
import os
import six

from backend.config import config

logger = logging.getLogger(__name__)

CACHE_DIRECTORY = config.get('cache.directory')


def cache(hint_fields):
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
            return _cache(func=f, hint_fields=hint_fields, **kwargs)
        return wrapped_f
    return wrap


# TODO: Consider separating cache.enabled into cache.read_from_cache
# and cache.write_to_cache.
def _cache(func, hint_fields, **kwargs):
    hint_values = [kwargs.get(field) for field in hint_fields]
    cache_filepath = _get_cached_filepath(
        prefix=func.__name__,
        hint_values=hint_values,
    )
    # If caching is disabled or a hint is missing, call the function normally.
    if not config.get('cache.enabled') or not all(hint_values):
        response = func(**kwargs)
    # If the file exists, read and return.
    elif os.path.isfile(cache_filepath):
        with open(cache_filepath, 'r') as f:
            response = json.load(f)
        logger.debug('Returning cached response.')
    # If the file does not exist, calculate and write to the cache.
    else:
        response = func(**kwargs)
        logger.debug('Storing cached response.')
        with open(cache_filepath, 'w+') as f:
            json.dump(obj=response, fp=f)

    return response


def _get_cached_filepath(prefix, hint_values):
    """Return the filepath where a cached response would live for the given inputs."""
    filename = '{prefix}_{hash_value}.json'.format(
        prefix=prefix,
        hash_value=_hash_hint_values(hint_values),
    )
    return os.path.join(CACHE_DIRECTORY, filename)


def _hash_hint_values(hint_values):
    """
    Hash hint values to help identify what cached file to use.

    Attempts to convert unhashable types to hashable equivalents.
    """
    # TODO: Handle other unhashable objects.
    hash_value = 0
    for value in hint_values:
        try:
            hash_value += hash(value)
        except TypeError:
            hash_value += (hash(tuple(sorted(value))))

    return hash_value
