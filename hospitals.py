from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from controllers.hospital_controller import (
    get_hospitals, get_hospital, create_blood_request, get_blood_requests, update_emergency_flag
)
from pydantic import BaseModel

router = APIRouter(prefix="/api/hospitals", tags=["hospitals"])

class BloodRequestCreate(BaseModel):
    blood_group: str
    urgency_level: str

@router.get("/")
def read_hospitals(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    emergency_only: bool = False,
    db: Session = Depends(get_db)
):
    return get_hospitals(db, skip, limit, emergency_only)

@router.get("/{hospital_id}")
def read_hospital(hospital_id: int, db: Session = Depends(get_db)):
    return get_hospital(hospital_id, db)

@router.post("/blood-requests")
def create_blood_request_endpoint(request: BloodRequestCreate, db: Session = Depends(get_db)):
    return create_blood_request(request, db)

@router.get("/blood-requests/")
def read_blood_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    fulfilled: Optional[bool] = None,
    urgency: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_blood_requests(db, skip, limit, fulfilled, urgency)

@router.patch("/{hospital_id}/emergency")
def update_hospital_emergency(hospital_id: int, emergency: bool, db: Session = Depends(get_db)):
    return update_emergency_flag(hospital_id, emergency, db)
