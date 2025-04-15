import signal
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, websocket
from app.routes import search 

from app.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting up app...")
    # initialization here
    init_db()
    yield
    
    print("Shutting down app...")
    # resource cleanup here

app = FastAPI(
    title="User Management API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS (Allow all for dev, restrict in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(search.router, prefix="/api/v1", tags=["search"])
app.include_router(websocket.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI User Management System"}


def signal_handler(sig, frame):
    print(f"Received signal {signal.Signals(sig).name}. Shutting down gracefully...")
    loop = asyncio.get_event_loop()
    if loop.is_running():
        loop.stop()

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)