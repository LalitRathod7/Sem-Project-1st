from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from controllers.donor_controller import (
    get_donors, get_donor, create_donor, update_donor, delete_donor, update_availability
)
from pydantic import BaseModel

router = APIRouter(prefix="/api/donors", tags=["donors"])

class DonorCreate(BaseModel):
    name: str
    blood_group: str
    city: str
    phone: str

class DonorUpdate(BaseModel):
    name: Optional[str] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    available_flag: Optional[bool] = None

@router.get("/")
def read_donors(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    blood_group: Optional[str] = None,
    city: Optional[str] = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    return get_donors(db, skip, limit, blood_group, city, available_only)

@router.get("/{donor_id}")
def read_donor(donor_id: int, db: Session = Depends(get_db)):
    return get_donor(donor_id, db)

@router.post("/")
def create_donor_profile(donor: DonorCreate, db: Session = Depends(get_db)):
    return create_donor(donor, db)

@router.put("/{donor_id}")
def update_donor_profile(donor_id: int, donor_update: DonorUpdate, db: Session = Depends(get_db)):
    return update_donor(donor_id, donor_update, db)

@router.delete("/{donor_id}")
def delete_donor_profile(donor_id: int, db: Session = Depends(get_db)):
    return delete_donor(donor_id, db)

@router.patch("/{donor_id}/availability")
def update_donor_availability(donor_id: int, available: bool, db: Session = Depends(get_db)):
    return update_availability(donor_id, available, db)
