"""Configuration management."""
import os
import ujson as json

_CONFIG = None

# Configuration key constants.
GEOCODING_ENABLED_KEY = 'geocoding_enabled'
GEOCODER_KEY = 'geocoder'
MEASURER_KEY = 'measurer'


class Config(object):
    """
    An internal representation of a configuration file.

    Handles multiple possible config sources (path or env var) and nested-key lookups.
    """
    def __init__(self, config):
        """Instantiate a Config object with config file contents."""
        self._config = config

    @classmethod
    def from_path(cls, path):
        """Load configuration from a given path."""
        with open(path) as file:
            return cls(json.loads(file.read()))

    @classmethod
    def default_config(cls):
        """
        Load configuration based on information provided in this file and ENV.

        TODO: figure out how exactly we want to determine configuration to use.
        """
        return cls(CONFIG)

    def get(self, key, default=None):
        """
        Fetch a configuration variable, returning `default` if the key does not exist.

        :param key: Variable key.
        :param default: Default value to return if `key` is not found.
        :returns: The value, or `default` if the key does not exist.
        """
        try:
            value = self[key]
        except KeyError as e:
            if default is None:
                raise e
            value = default
        return value

    def __getitem__(self, key):
        """
        Fetch a configuration variable, returning `default` if the key does not exist.

        :param key: Variable key.
        :returns: The value.
        :raises: TypeError if key is not found.
        """
        # Handle nested parameters
        return_object = self._config
        for key in key.split('.'):
            return_object = return_object[key]

        return return_object


def get(key, default=None):
    """
    Fetch a configuration variable, returning `default` if the key does not exist.

    :param key: Variable key, possibly nested via `.`s.
    :param default: Default value to return.
    :returns: The value, or `default` if the key does not exist.
    """
    global _CONFIG
    if _CONFIG is None:
        _CONFIG = _load_config()
    return _CONFIG.get(key, default)


def reload_config(path=None):
    """
    Public function to reload configuration variable.

    This method looks in two places, in order, to find the config file:
        1. an explicit path, if one is passed as an argument
        2. this file, for CONFIG and CONFIG_ENV dictionaries.
    """
    global _CONFIG
    _CONFIG = _load_config(path)


def _load_config(path=None):
    """
    Reload configuration.

    This method looks in two places, in order, to find the config file:
        1. an explicit path, if one is passed as an argument
        2. this file, for CONFIG and CONFIG_ENV dictionaries.
    """
    if path is not None:
        config = Config.from_path(path)
    else:
        config = Config.default_config()

    return config


def _get_env_variable(env_variable, resource=None, default=None):
    """
    Wrapper around os.environ.

    This way, Python will only complain if someone actively tries to load
    the desired environment variable.
    """
    if env_variable in os.environ:
        return os.environ[env_variable]
    if default is not None:
        return default
    if resource is not None:
        print('If you wish to access {}, please set the environment variable {}'.format(
            resource, env_variable))


CONFIG = {
    'geocoding_enabled': True,
    'geocoder': 'oxcoder',
    'measurer': 'haversine'
}
