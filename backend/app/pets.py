from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from sqlalchemy.exc import IntegrityError
from app.models import Pet
from app.schemas import PetUpdate, PetCreate      # Make sure you have a PetUpdate schema
from app.db import get_db

pet_router = APIRouter()



@pet_router.get("/pets/{owner_id}")
async def get_pets_for_owner(owner_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Pet).where(Pet.owner_id == owner_id)
    )
    pets = result.scalars().all()
    return pets

@pet_router.post("/pets")
async def create_pet(pet: PetCreate, db: AsyncSession = Depends(get_db)):
    new_pet = Pet(**pet.dict())
    db.add(new_pet)

    try:
        await db.commit()
        await db.refresh(new_pet)
        return {"message": "Pet created", "id": new_pet.id}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Invalid owner ID or duplicate pet")
@pet_router.get("/pets/{owner_id}")
async def get_pets_for_owner(owner_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Pet).where(Pet.owner_id == owner_id)
    )
    pets = result.scalars().all()
    return pets

@pet_router.post("/pets")
async def create_pet(pet: PetCreate, db: AsyncSession = Depends(get_db)):
    new_pet = Pet(**pet.dict())
    db.add(new_pet)

    try:
        await db.commit()
        await db.refresh(new_pet)
        return {"message": "Pet created", "id": new_pet.id}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Invalid owner ID or duplicate pet")


@pet_router.get("/pets/{pet_id}")
async def get_pet_by_id(pet_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pet).where(Pet.id == pet_id))
    pet = result.scalar_one_or_none()

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    return pet


@pet_router.put("/pets/{pet_id}")
async def update_pet(pet_id: int, pet_data: PetUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pet).where(Pet.id == pet_id))
    pet = result.scalar_one_or_none()

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    update_data = {k: v for k, v in pet_data.dict().items() if v is not None}

    if update_data:
        try:
            await db.execute(
                update(Pet)
                .where(Pet.id == pet_id)
                .values(**update_data)
            )
            await db.commit()
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=400, detail="Invalid data or constraint violation")

    return {"message": f"Pet with ID {pet_id} updated successfully"}


@pet_router.delete("/pets/{pet_id}")
async def delete_pet(pet_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pet).where(Pet.id == pet_id))
    pet = result.scalar_one_or_none()

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    await db.delete(pet)
    await db.commit()

    return {"message": f"Pet with ID {pet_id} deleted successfully"}