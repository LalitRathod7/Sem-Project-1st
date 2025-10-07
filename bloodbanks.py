from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from controllers.bloodbank_controller import (
    get_blood_banks, get_blood_bank, update_stock, update_alert_flag
)
from pydantic import BaseModel

router = APIRouter(prefix="/api/bloodbanks", tags=["bloodbanks"])

class StockUpdate(BaseModel):
    blood_group: str
    quantity: int

@router.get("/")
def read_blood_banks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    alert_only: bool = False,
    db: Session = Depends(get_db)
):
    return get_blood_banks(db, skip, limit, alert_only)

@router.get("/{bank_id}")
def read_blood_bank(bank_id: int, db: Session = Depends(get_db)):
    return get_blood_bank(bank_id, db)

@router.patch("/{bank_id}/stock")
def update_blood_stock(bank_id: int, stock_update: StockUpdate, db: Session = Depends(get_db)):
    return update_stock(bank_id, stock_update, db)

@router.patch("/{bank_id}/alert")
def update_blood_alert(bank_id: int, alert: bool, db: Session = Depends(get_db)):
    return update_alert_flag(bank_id, alert, db)
