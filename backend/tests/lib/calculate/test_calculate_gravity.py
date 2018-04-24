"""Test methods used to calculate supply-and-demand spatial access measures."""
import functools

from backend.lib.calculate import gravity
from backend.lib.database.postgres import connect
from backend.lib.fetch import representative_points

from backend.models.measurers import get_measurer

import numpy as np

import pytest

engine = connect.create_db_engine()


@pytest.mark.filterwarnings('ignore::RuntimeWarning')
class TestGravityCalculations():
    """Test methods related to calculations of spatial accessibility."""

    def setup(self):
        """Initialize a measurer for use in the test cases."""
        self.locations = [
            {'id': 1, 'latitude': 33.77500830300005, 'longitude': -118.11176916399995},
            {'id': 2, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999},
        ]
        self.service_area_ids = ['ca_los_angeles_county_00000']

    def test_measure_one_to_many(self):
        """Test measure_one_to_many."""
        point = {'id': 0, 'latitude': 32.74753421600008, 'longitude': -122.2316317029999}
        output = gravity._measure_one_to_many(point, self.locations, get_measurer('haversine'))
        expected = {
            'id': 0,
            'locations': self.locations,
            'location_ids': [1, 2],
            'measurements': [399476.6135406669, 0],
        }
        assert output == expected

    def test_calculate_measurement_matrix(self):
        """Test calculate_measurement_matrix returns an array in the correct shape."""
        measurement_matrix = gravity.calculate_measurement_matrix(
            service_area_ids=self.service_area_ids,
            measurer_name='haversine',
            locations=self.locations,
            engine=engine,
        )
        assert measurement_matrix.shape == (1075, 2)

    def test_calculate_accessibility_indexes(self):
        """Test calculate_accessibility_indexes returns an array."""
        measurement_matrix = gravity.calculate_measurement_matrix(
            service_area_ids=self.service_area_ids,
            measurer_name='haversine',
            locations=self.locations,
            engine=engine,
        )
        points = representative_points.minimal_fetch_representative_points(
            service_area_ids=self.service_area_ids,
            engine=engine
        )
        decay_function = functools.partial(gravity.uniform_decay, scale=10.0 * 1609)
        output = gravity.calculate_accessibility_indexes(measurement_matrix, points, decay_function)

        assert len(output) == len(points)
        assert np.sum(0.0 < output) == 45


@pytest.mark.filterwarnings('ignore::RuntimeWarning')
class TestDecayFunctions():
    """Test decay functions used to model decreasing demand with increased distance."""

    def setup(self):
        """Initialize an array of measurements for use in the test cases."""
        self.measurement_array = np.asarray([[0.0, 1.0, 100.0, np.nan, float('inf')]])

    def test_gaussian_decay(self):
        output = gravity.gaussian_decay(self.measurement_array, sigma=2.0)
        expected = np.array([[1.0, 0.88249690258459546, 0.0, np.nan, 0.0]])
        np.testing.assert_equal(output, expected)

    def test_havercosine_decay(self):
        output = gravity.havercosine_decay(self.measurement_array, scale=2.0)
        expected = np.array([[1.0, 0.5, 0.0, np.nan, 0.0]])
        np.testing.assert_equal(output, expected)

    def test_uniform_decay(self):
        output = gravity.uniform_decay(self.measurement_array, scale=2.0)
        expected = np.array([[1.0, 1.0, 0.0, 0.0, 0.0]])
        np.testing.assert_equal(output, expected)
