"""Classes for measuring distances between points."""
from cHaversine import haversine

from backend.models.base import Measurer


class HaversineDistance(Measurer):
    """Class for haversine distance measurements."""

    def measure_between_two_points(self, point_a, point_b):
        """
        Get haversine distance between two points.

        Expects points as (latitude, longitude) tuples.
        """
        # cHaversine expects points to be given as (latitude, longitude) pairs.
        # TODO: Determine if this check for non-null values is necessary.
        if point_a and point_b:
            return haversine(tuple(point_a), tuple(point_b))

    def _get_matrix(self, source_points, destination_points):
        """Retrieve a distance matrix."""
        return [
            [self.measure_between_two_points(point_a, point_b) for point_b in destination_points]
            for point_a in source_points
        ]
