from fastapi import HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from models.hospital import Hospital
from models.blood_request import BloodRequest
from models.user import User
from middleware.auth import get_current_user
from pydantic import BaseModel

class BloodRequestCreate(BaseModel):
    blood_group: str
    urgency_level: str

def get_hospitals(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    emergency_only: bool = False
):
    query = db.query(Hospital)
    if emergency_only:
        query = query.filter(Hospital.emergency_flag == True)
    hospitals = query.offset(skip).limit(limit).all()
    return hospitals

def get_hospital(hospital_id: int, db: Session = Depends(get_db)):
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return hospital

def create_blood_request(request: BloodRequestCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "hospital":
        raise HTTPException(status_code=403, detail="Only hospitals can create blood requests")
    # Get hospital for current user
    hospital = db.query(Hospital).filter(Hospital.user_id == current_user.id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital profile not found")
    new_request = BloodRequest(
        hospital_id=hospital.id,
        blood_group=request.blood_group,
        urgency_level=request.urgency_level
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

def get_blood_requests(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    fulfilled: Optional[bool] = None,
    urgency: Optional[str] = None
):
    query = db.query(BloodRequest)
    if fulfilled is not None:
        query = query.filter(BloodRequest.fulfilled_flag == fulfilled)
    if urgency:
        query = query.filter(BloodRequest.urgency_level == urgency)
    requests = query.offset(skip).limit(limit).all()
    return requests

def update_emergency_flag(hospital_id: int, emergency: bool, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    if hospital.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    hospital.emergency_flag = emergency
    db.commit()
    db.refresh(hospital)
    return hospital
