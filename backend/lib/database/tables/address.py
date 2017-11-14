"""File holding the main address table and mapping definitions."""
from backend.lib.database.postgres.base import Base

from geoalchemy2 import Geometry

from sqlalchemy import Column, DateTime, Float, Integer, JSON, String, func


class Address(Base):
    """Definition of the addresses table."""

    __tablename__ = 'addresses'
    # TODO: Add nullable=False for the relevant columns.
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    address = Column(String, nullable=False, index=True, unique=True)
    latitude = Column(Float)
    longitude = Column(Float)
    # TODO - Add special GIST index on 'location'.
    location = Column(Geometry('GEOMETRY'))
    isodistancePolygon = Column(JSON)
