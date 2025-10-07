from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    contact = Column(String(20), nullable=False)  # phone number
    emergency_flag = Column(Boolean, default=False)  # True for emergency, False otherwise

    user = relationship("User")
