from fastapi import FastAPI, Depends, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import get_db

router = APIRouter()

@router.get("/test")
def test_route():
    return {"message": "This is a test route from router"}
