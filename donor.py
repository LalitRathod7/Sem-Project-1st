from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    blood_group = Column(String(10), nullable=False)  # e.g., A+, O-
    city = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    available_flag = Column(Boolean, default=True)  # True for available, False for unavailable
    last_donation = Column(Date, nullable=True)

    user = relationship("User")
