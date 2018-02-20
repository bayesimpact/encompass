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
    population = Column(Float, nullable=False)
    county = Column(String, nullable=False, index=True)
    isodistancePolygon = Column(JSON)
    zip_code = Column(String, nullable=False, index=True)
    census_block_group = Column(String)
    census_block = Column(String)
    census_tract = Column(String)


def prepare_demographics_dict_from_rows(row_dict, census_mapping):
    """
    Extract demographic information from a row_dict using a census_mapping.

    Note that the census_mapping used here should be the same or a subset of the one
    used during extraction.
    """
    return {
        category: {
            names['human_readable_name']: float(row_dict[names['joined_column_name']] or 0)
            for names in census_mapping[category].values()
            if names['joined_column_name'] in row_dict
        }
        for category in census_mapping
    }


def row_to_dict(rp_row, format_response=True, census_mapping=None):
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
      population: 2000,
      demographics?: {'age': {'under_5': 2.0}},
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
    response_dict = {
        'id': rp_dict['id'],
        'census_tract': rp_dict['census_tract'],
        'county': rp_dict['county'],
        'lat': rp_dict['latitude'],
        'lng': rp_dict['longitude'],
        'population': rp_dict['population'],
        'service_area_id': rp_dict['service_area_id'],
        'zip': rp_dict['zip_code']
    }
    if census_mapping:
        response_dict['demographics'] = prepare_demographics_dict_from_rows(
            row_dict=rp_dict,
            census_mapping=census_mapping
        )
    return response_dict
