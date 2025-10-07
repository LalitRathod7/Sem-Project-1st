from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.database import Base

class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    blood_group = Column(String(10), nullable=False)
    urgency_level = Column(String(20), nullable=False)  # e.g., low, medium, high, critical
    fulfilled_flag = Column(Boolean, default=False)  # True for fulfilled, False otherwise
    created_at = Column(DateTime, server_default=func.now())

    hospital = relationship("Hospital")
