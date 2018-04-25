"""
Methods to calculate gravity-based measures of potential spatial accessibility.

These measures assign accessibility scores to demand locations based on their proximity to supply
locations. The main method used here is a gravitational model using non-standard decay functions.

References:
    Luo, W. and Qi, Y. (2009) An enhanced two-step floating catchment area (E2SFCA) method for
    measuring spatial accessibility to primary care physicians. Health and Place 15, 1100–1107.

    Luo, W. and Wang, F. (2003) Measures of spatial accessibility to health care in a GIS
    environment: synthesis and a case study in the Chicago region.
    Environment and Planning B: Planning and Design 30, 865–884.

    Wang, F. (2012) Measurement, optimization, and impact of health care accessibility:
    a methodological review. Annals of the Association of American Geographers 102, 1104–1112.
"""
import itertools
import logging
import math

from backend.config import config
from backend.lib.database.postgres import connect
from backend.lib.fetch import representative_points
from backend.lib.utils.datatypes import Point

from backend.models.measurers import get_measurer

import numpy as np


logger = logging.getLogger(__name__)


def _measure_one_to_many(point, locations, measurer):
    """Measure the distance from the input point to all locations."""
    point_coords = Point(latitude=point['latitude'], longitude=point['longitude'])
    supply_locations = [
        Point(latitude=location['latitude'], longitude=location['longitude'])
        for location in locations
    ]
    distance_matrix = measurer._get_matrix(
        source_points=[point_coords],
        destination_points=supply_locations
    )
    # TODO: Determine exactly which keys are needed in the response.
    return {
        'id': point['id'],
        'locations': locations,
        'location_ids': [location['id'] for location in locations],
        'measurements': distance_matrix[0],
    }


def calculate_measurement_matrix(
    service_area_ids,
    locations,
    measurer_name,
    engine=connect.create_db_engine(),
):
    """
    Calculate a measurement matrix for the given service area IDs.

    The measurement between point i and location j in the cell with row i, column j.
    """
    # TODO: Share introduction of this function with calculate.adequacy.
    points = representative_points.minimal_fetch_representative_points(
        service_area_ids=service_area_ids,
        engine=engine
    )
    logger.debug('{} pairwise distances to calculate.'.format(len(locations) * len(points)))

    measurer = get_measurer(measurer_name)
    measurer_config = config.get('measurer_config')[measurer_name]
    executor_type = measurer_config['adequacy_executor_type']
    n_processors = measurer_config['n_adequacy_processors']

    logger.debug('Starting {} executors for gravity calculations...'.format(n_processors))
    with executor_type(processes=n_processors) as executor:
        measurements_by_point = executor.starmap(
            func=_measure_one_to_many,
            iterable=zip(
                points,
                itertools.repeat(locations),
                itertools.repeat(measurer),
            )
        )

    measurement_matrix = np.full(
        shape=(len(points), len(locations)), fill_value=float('inf')
    )
    for i, response in enumerate(measurements_by_point):
        for j, distance in enumerate(response['measurements']):
            measurement_matrix[i][j] = distance

    return measurement_matrix


def calculate_accessibility_indexes(measurement_matrix, points, decay_function):
    """
    Calculate accessibility indexes for a list of points given a measurement matrix.

    The demand at each point is assumed to be proportional to its population.
    """
    return calculate_accessibility_indexes_from_supply_and_demand(
        measurement_matrix=measurement_matrix,
        demand_array=np.array([point['population'] for point in points]),
        supply_array=None,
        decay_function=decay_function
    )


def _calculate_demand_potentials_by_location(measurement_matrix, demand_array, decay_function):
    """Calculate the demand potential at each input location."""
    demand_by_location = np.zeros(measurement_matrix.shape[1])
    for location_index, _ in enumerate(demand_by_location):
        matrix = demand_array * decay_function(measurement_matrix[:, location_index])
        matrix[matrix == np.inf] = 0.0
        demand_by_location[location_index] = np.nansum(matrix)

    return demand_by_location


def calculate_accessibility_indexes_from_supply_and_demand(
    measurement_matrix,
    decay_function,
    demand_array=None,
    supply_array=None
):
    """
    Calculate accessibility given a measurement matrix.

    Optional supply and demand arrays can be specified corresponding to the axes of the
    measurement matrix.
    """
    if demand_array is None:
        demand_array = np.ones(measurement_matrix.shape[0])
    if supply_array is None:
        supply_array = np.ones(measurement_matrix.shape[1])

    demand_potentials_by_location_index = _calculate_demand_potentials_by_location(
        measurement_matrix=measurement_matrix,
        demand_array=demand_array,
        decay_function=decay_function
    )

    access_by_point = np.zeros(measurement_matrix.shape[0])
    for point_index, _ in enumerate(access_by_point):
        matrix = decay_function(measurement_matrix[point_index, :])
        matrix *= 1.0 / demand_potentials_by_location_index
        matrix[matrix == np.inf] = 0.0
        access_by_point[point_index] = np.nansum(matrix)

    return access_by_point


def gaussian_decay(measurement_array, sigma=75 * 10**3):
    """
    Transform a measurement array using a normal (Gaussian) distribution.

    When the measurement is small, the output should be close to 1.
    When the measurement is large, the output should be close to 0.

    Some sample values (in multiples of sigma):
        measurement   |   decay value
        -----------------------------
            0.0       |         1.0 (full value)
            0.7582    |         0.75
            1.0       |         0.60647
            1.17      |         0.5
            2.0       |         0.13531
            2.14597   |         0.1
    """
    return np.exp(-(measurement_array**2 / (2.0 * sigma**2)))


def havercosine_decay(measurement_array, scale=75 * 10**3):
    """
    Transform a measurement array using a raised cosine distribution.

    When the measurement is small, the output should be close to 1.
    When the measurement is large, the output should be close to 0.

    Some sample values (in multiples of the scale parameter):
        measurement   |   decay value
        -----------------------------
            0.0       |         1.0 (full value)
            0.25      |         0.853553
            0.5       |         0.5
            0.75      |         0.146447
            1.0       |         0.0
    """
    masked_array = np.clip(a=measurement_array, a_min=0.0, a_max=scale)
    return (1.0 + np.cos((masked_array / scale) * math.pi)) / 2.0


def uniform_decay(measurement_array, scale=75 * 10**3):
    """
    Transform a measurement array the uniform distribution.

    The output is 1 below the scale parameter and 0 above it.

    Using this decay function results in the standard 2SFCA method.
    """
    # FIXME: Confirm that this correctly captures 2SFCA.
    return (measurement_array <= scale).astype(np.float64)
