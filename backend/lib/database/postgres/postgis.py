"""Functions to work with PostGIS geometry and geography types."""


def to_point(longitude, latitude):
    """Format point for insertion into Postgres."""
    return 'SRID=4326;POINT({} {})'.format(longitude, latitude)


def to_polygon(long_lat_tuples):
    """Format polygon for insertion into Postgres."""
    long_lat_string = ', '.join([
        '{} {}'.format(longitude, latitude)
        for longitude, latitude in long_lat_tuples
    ])
    return 'POLYGON(({}))'.format(long_lat_string)
