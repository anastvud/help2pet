from fastapi import Query, Depends, APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update

from app.db import get_db
from app.auth import hash_password, verify_password
from app.models import Petsitter, Owner
from app.schemas import UserBasicCreate, PetsitterAdditionalInfo, OwnerAdditionalInfo, UserLogin, NearbySearchRequest, PetsitterPublic


user_router = APIRouter()


@user_router.post("/register/petsitter")
async def register_petsitter_basic(petsitter: UserBasicCreate, db: AsyncSession = Depends(get_db)):
    # Check if username already exists
    result = await db.execute(
        select(Petsitter).where(Petsitter.username == petsitter.username)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already registered")

    # Check if email already exists
    result = await db.execute(
        select(Petsitter).where(Petsitter.email == petsitter.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Prepare basic petsitter data
    petsitter_data = petsitter.dict()
    petsitter_data["password"] = hash_password(petsitter_data["password"])

    # Create new petsitter with basic info
    new_petsitter = Petsitter(**petsitter_data)
    db.add(new_petsitter)

    try:
        await db.commit()
        await db.refresh(new_petsitter)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Basic registration successful",
        "petsitter_id": new_petsitter.id
    }


@user_router.put("/register/petsitter/{petsitter_id}/complete")
async def complete_petsitter_registration(
        petsitter_id: int,
        additional_info: PetsitterAdditionalInfo,
        db: AsyncSession = Depends(get_db)
):
    # Check if petsitter exists
    result = await db.execute(
        select(Petsitter).where(Petsitter.id == petsitter_id)
    )
    petsitter = result.scalar_one_or_none()

    if not petsitter:
        raise HTTPException(status_code=404, detail="Petsitter not found")

    try:
        # Update petsitter with additional information
        await db.execute(
            update(Petsitter)
            .where(Petsitter.id == petsitter_id)
            .values(**additional_info.dict())
        )
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Petsitter registration completed successfully"}


@user_router.post("/register/owner")
async def register_owner_basic(owner: UserBasicCreate, db: AsyncSession = Depends(get_db)):
    # Check username
    result = await db.execute(select(Owner).where(Owner.username == owner.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already registered")

    # Check email
    result = await db.execute(select(Owner).where(Owner.email == owner.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    owner_data = owner.dict()
    owner_data["password"] = hash_password(owner_data["password"])

    new_owner = Owner(**owner_data)
    db.add(new_owner)

    try:
        await db.commit()
        await db.refresh(new_owner)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Basic owner registration successful", "owner_id": new_owner.id}


@user_router.put("/register/owner/{owner_id}/complete")
async def complete_owner_registration(owner_id: int, additional_info: OwnerAdditionalInfo, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Owner).where(Owner.id == owner_id))
    owner = result.scalar_one_or_none()

    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    try:
        await db.execute(
            update(Owner)
            .where(Owner.id == owner_id)
            .values(**additional_info.dict())
        )
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Owner registration completed successfully"}



@user_router.post("/login/owner")
async def login_owner(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Owner).where(Owner.username == user.username))
    user_db = result.scalar_one_or_none()

    if not user_db or not verify_password(user.password, user_db.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": f"Welcome owner, {user_db.name}!"}


@user_router.post("/login/petsitter")
async def login_petsitter(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Petsitter).where(Petsitter.username == user.username))
    user_db = result.scalar_one_or_none()

    if not user_db or not verify_password(user.password, user_db.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": f"Welcome petsitter, {user_db.name}!"}

@user_router.post("/login/owner")
async def login_petsitter(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Petsitter).where(Petsitter.username == user.username))
    user_db = result.scalar_one_or_none()

    if not user_db or not verify_password(user.password, user_db.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": f"Welcome petsitter, {user_db.name}!"}

@user_router.get("/petsitters/nearby")
async def get_nearby_petsitters(data: NearbySearchRequest, db: AsyncSession = Depends(get_db)):
    prefix = data.zipcode[:2]  # You can adjust the slicing logic based on your postcode structure
    like_pattern = f"{prefix}%"  # e.g., "30%" to find nearby postcodes like "30-001", "30-050", etc.

    result = await db.execute(
        select(Petsitter).where(Petsitter.zipcode.like(like_pattern))
    )
    sitters = result.scalars().all()

    return sitters

@user_router.get("/petsitters/{petsitter_id}", response_model=PetsitterPublic)
async def get_petsitter_profile(petsitter_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Petsitter).where(Petsitter.id == petsitter_id))
    petsitter = result.scalar_one_or_none()

    if not petsitter:
        raise HTTPException(status_code=404, detail="Petsitter not found")

    return petsitter
