from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from controllers.auth_controller import register, login
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    blood_group: str = None
    city: str = None
    phone: str = None
    address: str = None
    contact: str = None
    stock: dict = None

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    return register(request, db)

@router.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    return login(request, db)
