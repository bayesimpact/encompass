"""File holding the main provider table and mapping definitions."""
from backend.lib.database.postgres.base import Base

from sqlalchemy import ARRAY, Column, DateTime, ForeignKey, Integer, String, func


class Provider(Base):
    """Definition of the service_areas table."""

    __tablename__ = 'providers'
    id = Column(Integer, primary_key=True, autoincrement=True)
    address_id = Column(Integer, ForeignKey('addresses.id'), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    # Need to verify length 10 for NPI.
    npi = Column(String, nullable=False, index=True)
    languages = Column(ARRAY(String))
    specialty = Column(String, index=True)
