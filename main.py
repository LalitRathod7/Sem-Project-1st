import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
import os
from dotenv import load_dotenv

from routes.auth import router as auth_router
from routes.donors import router as donors_router
from routes.hospitals import router as hospitals_router
from routes.bloodbanks import router as bloodbanks_router

load_dotenv()

# Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins=os.getenv("SOCKET_IO_CORS_ALLOWED_ORIGINS", "*"), async_mode='asgi')

# FastAPI app
app = FastAPI(title="Emergency Blood Donation & Transfusion System")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(donors_router)
app.include_router(hospitals_router)
app.include_router(bloodbanks_router)

# Socket.IO events
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def emergency_alert(sid, data):
    # Broadcast emergency alert
    await sio.emit('emergency_alert', data)

@sio.event
async def blood_alert(sid, data):
    # Broadcast blood stock alert
    await sio.emit('blood_alert', data)

# ASGI app
socket_app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)
