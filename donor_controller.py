from fastapi import HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from models.donor import Donor
from models.user import User
from middleware.auth import get_current_user
from pydantic import BaseModel

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

def get_donors(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    blood_group: Optional[str] = None,
    city: Optional[str] = None,
    available_only: bool = False
):
    query = db.query(Donor)
    if blood_group:
        query = query.filter(Donor.blood_group == blood_group)
    if city:
        query = query.filter(Donor.city.ilike(f"%{city}%"))
    if available_only:
        query = query.filter(Donor.available_flag == True)
    donors = query.offset(skip).limit(limit).all()
    return donors

def get_donor(donor_id: int, db: Session = Depends(get_db)):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    return donor

def create_donor(donor: DonorCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "donor":
        raise HTTPException(status_code=403, detail="Only donors can create donor profiles")
    new_donor = Donor(
        user_id=current_user.id,
        name=donor.name,
        blood_group=donor.blood_group,
        city=donor.city,
        phone=donor.phone
    )
    db.add(new_donor)
    db.commit()
    db.refresh(new_donor)
    return new_donor

def update_donor(donor_id: int, donor_update: DonorUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    if donor.user_id != current_user.id and current_user.role not in ["hospital", "blood_bank"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    for key, value in donor_update.dict(exclude_unset=True).items():
        setattr(donor, key, value)
    db.commit()
    db.refresh(donor)
    return donor

def delete_donor(donor_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    if donor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(donor)
    db.commit()
    return {"message": "Donor deleted"}

def update_availability(donor_id: int, available: bool, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    if donor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    donor.available_flag = available
    db.commit()
    db.refresh(donor)
    return donor
