# TODO: Emergency Blood Donation & Transfusion System - Python Backend

## Overview
Implement a complete FastAPI backend for the Emergency Blood Donation & Transfusion System with the following components:
- FastAPI for REST APIs
- SQLAlchemy for MySQL database
- PyJWT for authentication
- bcrypt for password hashing
- python-socketio for real-time notifications
- dotenv for environment variables

## Project Structure
```
backend/
├── main.py
├── config/database.py
├── models/*.py
├── controllers/*.py
├── routes/*.py
├── middleware/auth.py
└── .env
```

## Tasks

### 1. Setup Project Structure and Dependencies
- [x] Create backend/ directory
- [x] Create requirements.txt with all dependencies
- [x] Create .env file with environment variables

### 2. Database Configuration
- [x] Implement config/database.py with SQLAlchemy MySQL connection
- [x] Create database schema creation script (adapted from existing SQL)

### 3. Models Implementation
- [x] models/user.py: User model with id, name, email, password, role, status_flag, last_login
- [x] models/donor.py: Donor model with id, name, blood_group, city, phone, available_flag, last_donation
- [x] models/hospital.py: Hospital model with id, name, address, contact, emergency_flag
- [x] models/blood_request.py: BloodRequest model with id, hospital_id, blood_group, urgency_level, fulfilled_flag, created_at
- [x] models/blood_bank.py: BloodBank model with id, name, stock (JSON), alert_flag

### 4. Authentication Middleware
- [x] middleware/auth.py: JWT authentication middleware with PyJWT and bcrypt

### 5. Controllers Implementation
- [x] controllers/auth_controller.py: register, login, issue JWT
- [x] controllers/donor_controller.py: CRUD donors, update availability_flag
- [x] controllers/hospital_controller.py: create/view blood requests, update emergency_flag
- [x] controllers/bloodbank_controller.py: manage inventory, alert_flag updates

### 6. Routes Implementation
- [x] routes/auth.py: /api/auth endpoints
- [x] routes/donors.py: /api/donors endpoints
- [x] routes/hospitals.py: /api/hospitals endpoints
- [x] routes/bloodbanks.py: /api/bloodbanks endpoints

### 7. Main Application
- [x] main.py: FastAPI app with routers, Socket.IO integration for real-time alerts
- [x] Implement pagination and filtering for list endpoints
- [x] Add basic validation and error handling

### 8. Testing and Finalization
- [ ] Test all endpoints
- [ ] Ensure code is modular, clean, and optimized
- [ ] Verify database schema creation
- [ ] Confirm Socket.IO real-time functionality
- [ ] Integrate Socket.IO emissions in controllers for real-time alerts

## Flags/Feature Toggles
- Implement status flags on each model (active/inactive, available/unavailable, emergency, alerts)
- Include endpoints to update and query flags
- Use flags in API responses for filtering

## Real-time Features
- Broadcast alerts based on hospital emergency_flag or bloodbank alert_flag using Socket.IO

## Notes
- Adapt database schema from existing database_schema.sql
- Ensure compatibility with existing frontend
- Code should be ready to run with proper environment setup
