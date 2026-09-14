"""FastAPI application entry point for ShelterOps / PawsMatch.

Run with: uvicorn app.main:app --port 8000 --reload
"""

from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import database as db
from app.api.routes import router as api_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the database on startup."""
    await db.init_db()
    yield


app = FastAPI(
    title="ShelterOps — PawsMatch API",
    description="Backend API for the PawsMatch foster/adopter matching agent",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow the Vite dev server and any localhost origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
