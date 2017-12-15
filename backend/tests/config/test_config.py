"""Tests for methods of the Config class."""
import json

from backend.config import config

import mock

import pytest


class TestConfig():
    """Tests for the Config class methods."""

    def test_load_config_from_path(self):
        """Verify that a Config object can be properly instantiated from a filepath."""
        test_config_dict = {'test': 'test'}

        with mock.patch('builtins.open', mock.mock_open(read_data=json.dumps(test_config_dict))):
            test_config = config.Config.from_path('test_path')

        assert test_config._config == test_config_dict

    def test_get(self):
        """Verify that get returns value if present in config."""
        test_config_dict = {'key': 'value'}
        test_config = config.Config(test_config_dict)
        assert test_config.get('key') == 'value'

    def test_get_missing_key(self):
        """Verify that a KeyError is raised if the key is not present in the config."""
        test_config_dict = {}
        test_config = config.Config(test_config_dict)
        with pytest.raises(KeyError):
            test_config.get('key')

    def test_getitem(self):
        """Test the get item private method."""
        test_config_dict = {
            'layer1': {
                'layer2': {
                    'layer3': 'value'
                }
            }
        }

        test_config = config.Config(test_config_dict)
        output = test_config.__getitem__('layer1.layer2.layer3')

        assert output == 'value'

    def test_reload_config_from_path(self):
        """Test that reload loads config from path if provided."""
        with mock.patch.object(config.Config, 'from_path') as mock_from_path:
            config._load_config(path='path')
            mock_from_path.assert_called_once_with('path')

    @mock.patch('backend.config.config._load_config')
    def test_get_value_not_set(self, _load_config):
        """Test that global get function calls reload if config isn't set."""
        config._CONFIG = None
        config.get('key')
        _load_config.assert_called_once_with()

    @mock.patch('backend.config.config._load_config')
    def test_get_value_set(self, _load_config):
        """Test that if the config_ is set, _load_config is not called."""
        config._CONFIG = config.Config({'key': 'value'})
        config.get('key')
        assert not _load_config.called

    @mock.patch('backend.config.config._load_config')
    def test_get_sets_value(self, _load_config):
        """Test that if global config value is not set initially, it's set after get is called."""
        test_config = {'key': 'value'}
        config._CONFIG = None
        _load_config.return_value = test_config
        config.get('key')
        assert config._CONFIG == test_config

    @classmethod
    def teardown_class(cls):
        # Reload default config for the other tests.
        config.reload_config()
