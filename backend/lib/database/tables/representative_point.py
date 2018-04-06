"""File holding the main representative point table and mapping definitions."""
from backend.config import config
from backend.lib.database.postgres.base import Base

from geoalchemy2 import Geography

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String, func


class RepresentativePoint(Base):
    """Definition of the representative_points table."""

    __tablename__ = config.get('database.prefix') + 'representative_points'
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    service_area_id = Column(
        String,
        ForeignKey(config.get('database.prefix') + 'service_areas.service_area_id'),
        index=True
    )
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location = Column(
        Geography(geometry_type='POINT', srid=4326, spatial_index=True),
        nullable=False, unique=True)
    population = Column(Float, nullable=False)
    county = Column(String, nullable=False, index=True)
    isodistancePolygon = Column(JSON)
    zip_code = Column(String, nullable=False, index=True)
    census_block_group = Column(String)
    census_block = Column(String)
    census_tract = Column(String)


def prepare_demographics_dict_from_row(row_dict, census_mapping):
    """
    Extract demographic information from a row_dict using a census_mapping.

    Note that the census_mapping used here should be the same or a subset of the one
    used during extraction.
    """
    return {
        category: {
            names['human_readable_name']: float(row_dict[names['joined_column_name']] or 0.0)
            for names in census_mapping[category].values()
            if names['joined_column_name'] in row_dict
        }
        for category in census_mapping
    }


def row_to_dict(rp_row, census_mapping={}):
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
      zip: "94105",
      census_tract: 304,
      census_block?: 3,
      census_block_group?: 105,
      demographics?: {'age': {'under_5': 2.0}},
    }
    """
    rp_dict = {
        'id': rp_row['id'],
        'census_tract': rp_row['census_tract'],
        'county': rp_row['county'],
        'lat': rp_row['latitude'],
        'lng': rp_row['longitude'],
        'population': rp_row['population'],
        'service_area_id': rp_row['service_area_id'],
        'zip': rp_row['zip_code']
    }
    # TODO - Find a nicer way to handle this case.
    if census_mapping:
        rp_dict['demographics'] = prepare_demographics_dict_from_row(
            row_dict=rp_row,
            census_mapping=census_mapping
        )
    return rp_dict
