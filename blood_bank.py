from sqlalchemy import Column, Integer, String, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class BloodBank(Base):
    __tablename__ = "blood_banks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    stock = Column(JSON, nullable=True)  # JSON object with blood group stocks, e.g., {"A+": 10, "O-": 5}
    alert_flag = Column(Boolean, default=False)  # True for alert (low stock), False otherwise

    user = relationship("User")
