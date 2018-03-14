"""File holding the main service area table and mapping definitions."""
from backend.config import config
from backend.lib.database.postgres.base import Base

from geoalchemy2 import Geography

from sqlalchemy import Column, DateTime, Integer, String, func


class ServiceArea(Base):
    """Definition of the service_areas table."""

    __tablename__ = config.get('database.prefix') + 'service_areas'
    id = Column(Integer, primary_key=True, autoincrement=True)
    service_area_id = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    state = Column(String, nullable=False)
    county = Column(String, nullable=False, index=True)
    zip_code = Column(String, nullable=False, index=True)
    location = Column(
        Geography(geometry_type='POLYGON', srid=4326, spatial_index=True),
        nullable=False
    )
    state_fips = Column(String, nullable=False)
    county_fips = Column(String, nullable=False)
    nchs_urban_rural_code = Column(String)
