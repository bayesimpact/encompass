"""File holding the main service area table and mapping definitions."""
from backend.lib.database.postgres.base import Base

from geoalchemy2 import Geography

from sqlalchemy import Column, DateTime, Integer, String, func


class ServiceArea(Base):
    """Definition of the service_areas table."""

    __tablename__ = 'service_areas'
    # TODO: Add nullable=False for the relevant columns.
    id = Column(Integer, primary_key=True, autoincrement=True)
    service_area_id = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    county = Column(String, nullable=False, index=True)
    zip_code = Column(String, nullable=False, index=True)
    location = Column(
        Geography(geometry_type='POLYGON', srid=4326, spatial_index=True),
        nullable=False
    )
