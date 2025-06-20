from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from sqlalchemy import update
from fastapi import Query

from app.models import TimeSlot
from app.schemas import TimeSlotCreate, TimeSlotUpdate
from app.db import get_db


timeslot_router = APIRouter()


@timeslot_router.post("/timeslots")
async def create_timeslot(timeslot: TimeSlotCreate, db: AsyncSession = Depends(get_db)):
    new_slot = TimeSlot(**timeslot.dict())
    db.add(new_slot)

    try:
        await db.commit()
        await db.refresh(new_slot)
        return {"message": "Time slot created", "id": new_slot.id}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Overlapping time slot or invalid sitter ID")

@timeslot_router.get("/timeslots/{sitter_id}")
async def get_timeslots_for_sitter(sitter_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TimeSlot).where(
            TimeSlot.sitter_id == sitter_id,
            TimeSlot.is_booked == False
        )
    )
    timeslots = result.scalars().all()
    return timeslots

@timeslot_router.delete("/timeslots/modify/{timeslot_id}")
async def delete_timeslot(timeslot_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TimeSlot).where(TimeSlot.id == timeslot_id))
    timeslot = result.scalar_one_or_none()

    if not timeslot:
        raise HTTPException(status_code=404, detail="Timeslot not found")

    await db.delete(timeslot)
    await db.commit()

    return {"message": f"Timeslot with ID {timeslot_id} deleted successfully"}

@timeslot_router.put("/timeslots/modify/{timeslot_id}")
async def update_timeslot(
    timeslot_id: int,
    timeslot_data: TimeSlotUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(TimeSlot).where(TimeSlot.id == timeslot_id))
    timeslot = result.scalar_one_or_none()

    if not timeslot:
        raise HTTPException(status_code=404, detail="Timeslot not found")

    # Update only provided fields
    update_data = {k: v for k, v in timeslot_data.dict().items() if v is not None}
    if update_data:
        await db.execute(
            update(TimeSlot)
            .where(TimeSlot.id == timeslot_id)
            .values(**update_data)
        )
        await db.commit()

    return {"message": f"Timeslot {timeslot_id} updated successfully"}

@timeslot_router.get("/timeslots/modify/{timeslot_id}")
async def get_timeslot_by_id(timeslot_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TimeSlot).where(TimeSlot.id == timeslot_id))
    timeslot = result.scalar_one_or_none()

    if not timeslot:
        raise HTTPException(status_code=404, detail="Timeslot not found")

    return {
        "id": timeslot.id,
        "sitter_id": timeslot.sitter_id,
        "start_time": timeslot.start_time,
        "end_time": timeslot.end_time,
        "is_booked": timeslot.is_booked
    }