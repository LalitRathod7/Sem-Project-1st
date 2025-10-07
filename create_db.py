from config.database import engine, Base
from models.user import User
from models.donor import Donor
from models.hospital import Hospital
from models.blood_request import BloodRequest
from models.blood_bank import BloodBank

# Create all tables
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")
