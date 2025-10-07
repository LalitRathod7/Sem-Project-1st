from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from models.donor import Donor
from models.hospital import Hospital
from models.blood_bank import BloodBank
from middleware.auth import hash_password, verify_password, create_access_token
from pydantic import BaseModel
from typing import Optional

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str  # donor, hospital, blood_bank
    # Additional fields based on role
    blood_group: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    contact: Optional[str] = None
    stock: Optional[dict] = None

class LoginRequest(BaseModel):
    email: str
    password: str

def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = hash_password(request.password)

    # Create user
    user = User(
        name=request.name,
        email=request.email,
        password=hashed_password,
        role=request.role,
        status_flag=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create related model based on role
    if request.role == "donor":
        if not all([request.blood_group, request.city, request.phone]):
            raise HTTPException(status_code=400, detail="Missing donor details")
        donor = Donor(
            user_id=user.id,
            name=request.name,
            blood_group=request.blood_group,
            city=request.city,
            phone=request.phone
        )
        db.add(donor)
    elif request.role == "hospital":
        if not all([request.address, request.contact]):
            raise HTTPException(status_code=400, detail="Missing hospital details")
        hospital = Hospital(
            user_id=user.id,
            name=request.name,
            address=request.address,
            contact=request.contact
        )
        db.add(hospital)
    elif request.role == "blood_bank":
        blood_bank = BloodBank(
            user_id=user.id,
            name=request.name,
            stock=request.stock or {}
        )
        db.add(blood_bank)
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.commit()
    return {"message": "User registered successfully", "user_id": user.id}

def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.status_flag:
        raise HTTPException(status_code=403, detail="Account is inactive")

    # Update last_login
    from datetime import datetime
    user.last_login = datetime.utcnow()
    db.commit()

    # Create token
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}
