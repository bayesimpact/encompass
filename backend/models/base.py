"""Base classes and methods for measuring distance or time between points."""


class Measurer():
    """Generic class for measuring distance or time."""

    def measure_between_two_points(self, point_a, point_b):
        """
        Get distance or time measure between two points.

        Expects points as (latitude, longitude) tuples.
        """
        raise NotImplementedError('Distance type must be specified.')

    def closest(self, origin, point_list):
        """Find closest point in a list of points and returns min_measurement, min_point."""
        min_point = min(
            point_list,
            key=lambda p: self.measure_between_two_points(origin, p)
        )
        min_measurement = self.measure_between_two_points(origin, min_point)
        return min_measurement, min_point

    def closest_with_early_exit(self, origin, point_list, exit_distance):
        """
        Find closest point in a list of points, exiting early if exit_distance is reached.

        Returns min_measurement, min_point.
        """
        min_measurement = float('inf')
        min_point = None
        for point in point_list:
            distance = self.measure_between_two_points(origin, point)
            if distance < min_measurement:
                min_measurement = distance
                min_point = point
                if min_measurement <= exit_distance:
                    break
        return min_measurement, min_point
