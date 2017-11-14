"""File holding the main representative point table and mapping definitions."""
from backend.lib.database.postgres.base import Base

from geoalchemy2 import Geography

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String, func


class RepresentativePoint(Base):
    """Definition of the representative_points table."""

    __tablename__ = 'representative_points'
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    service_area_id = Column(String, ForeignKey('service_areas.service_area_id'), index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location = Column(
        Geography(geometry_type='POINT', srid=4326, spatial_index=True),
        nullable=False)
    population = Column(JSON, nullable=False)
    county = Column(String, nullable=False, index=True)
    isodistancePolygon = Column(JSON)
    zip_code = Column(String, nullable=False, index=True)
    census_block_group = Column(Integer)
    census_block = Column(Integer)
    census_tract = Column(Integer)


def row_to_dict(rp_row, format_response=True):
    """
    Transform a representative point row to a dictionary.

    The dictionary should be in the response format for the API shown below.
    For Representative Points, the expected return fields are:
    {
      id: 17323,
      service_area_id: "ca_alameda_94100",
      lat: 74.38732,
      lng: -122.323331
      county: "Alameda",
      population: {0.5: 18, 2.5: 30, 5: 2000},
      zip: "94105",
      census_block_group: 105,
      census_block: 3,
      census_tract: 304,
    }
    """
    rp_dict = dict(rp_row)
    # TODO - Revisit naming to latitude and longitude if performance is ok.
    if not format_response:
        return rp_dict
    return {
        'id': rp_dict['id'],
        'county': rp_dict['county'],
        'lat': rp_dict['latitude'],
        'lng': rp_dict['longitude'],
        'population': rp_dict['population'],
        'service_area_id': rp_dict['service_area_id'],
        'zip': rp_dict['zip_code']
    }
