"""File holding the main representative point table and mapping definitions."""
from backend.lib.database.postgres.base import Base

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String, func


class RepresentativePoints(Base):
    """Definition of the representative_points table."""

    __tablename__ = 'representative_points'
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    service_area_id = Column(String, ForeignKey('service_areas.service_area_id'), index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    population = Column(JSON, nullable=False)
    county = Column(String, nullable=False, index=True)
    isodistancePolygon = Column(JSON)
    zip_code = Column(String, nullable=False, index=True)
