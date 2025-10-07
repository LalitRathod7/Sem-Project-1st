from fastapi import HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from models.blood_bank import BloodBank
from models.user import User
from middleware.auth import get_current_user
from pydantic import BaseModel

class StockUpdate(BaseModel):
    blood_group: str
    quantity: int

def get_blood_banks(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    alert_only: bool = False
):
    query = db.query(BloodBank)
    if alert_only:
        query = query.filter(BloodBank.alert_flag == True)
    banks = query.offset(skip).limit(limit).all()
    return banks

def get_blood_bank(bank_id: int, db: Session = Depends(get_db)):
    bank = db.query(BloodBank).filter(BloodBank.id == bank_id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Blood bank not found")
    return bank

def update_stock(bank_id: int, stock_update: StockUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bank = db.query(BloodBank).filter(BloodBank.id == bank_id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Blood bank not found")
    if bank.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    stock = bank.stock or {}
    stock[stock_update.blood_group] = stock_update.quantity
    bank.stock = stock
    
    # Update alert_flag based on stock levels (e.g., if any group < 10)
    bank.alert_flag = any(q < 10 for q in stock.values())
    
    db.commit()
    db.refresh(bank)
    return bank

def update_alert_flag(bank_id: int, alert: bool, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bank = db.query(BloodBank).filter(BloodBank.id == bank_id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Blood bank not found")
    if bank.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    bank.alert_flag = alert
    db.commit()
    db.refresh(bank)
    return bank
