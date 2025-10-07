from sqlalchemy import Column, Integer, String, Enum, Boolean, DateTime
from sqlalchemy.sql import func
from config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum('donor', 'hospital', 'blood_bank'), nullable=False)
    status_flag = Column(Boolean, default=True)  # True for active, False for inactive
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
