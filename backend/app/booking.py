from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from sqlalchemy import update
from fastapi import Query



from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.config import mail_conf

from app.models import TimeSlot, Owner, Petsitter



from app.models import Booking
from app.schemas import BookingUpdate, BookingCreate
from app.db import get_db

booking_router = APIRouter()

@booking_router.get("/bookings/{owner_id}")
async def get_bookings_for_owner(owner_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking).where(Booking.owner_id == owner_id))
    bookings = result.scalars().all()
    return bookings

@booking_router.post("/bookings")
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db)):
    new_booking = Booking(**booking.dict())
    db.add(new_booking)

    try:
        await db.commit()
        await db.refresh(new_booking)

        # Fetch related data (owner, sitter, timeslot)
        timeslot_result = await db.execute(select(TimeSlot).where(TimeSlot.id == new_booking.timeslot_id))
        timeslot = timeslot_result.scalar_one_or_none()

        owner_result = await db.execute(select(Owner).where(Owner.id == new_booking.owner_id))
        owner = owner_result.scalar_one_or_none()

        sitter_result = await db.execute(select(Petsitter).where(Petsitter.id == timeslot.sitter_id))
        sitter = sitter_result.scalar_one_or_none()

        if not all([owner, sitter, timeslot]):
            raise HTTPException(status_code=500, detail="Related data not found for email notification")

        # Format the email message
        subject = "Booking Confirmation"
        body = f"""
        Hello,

        A new booking has been confirmed.

        Time Slot: {timeslot.start_time} - {timeslot.end_time}
        Pet Owner: {owner.name} {owner.surname} ({owner.email})
        Pet Sitter: {sitter.name} {sitter.surname} ({sitter.email})

        Booking Status: {new_booking.status}
        """

        message = MessageSchema(
            subject=subject,
            recipients=[owner.email, sitter.email],
            body=body,
            subtype="plain"
        )

        fm = FastMail(mail_conf)
        await fm.send_message(message)

        return {"message": "Booking created and email sent", "id": new_booking.id}

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail="This timeslot is already booked or invalid owner/timeslot ID"
        )


@booking_router.put("/bookings/modify/{booking_id}")
async def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    update_data = {k: v for k, v in booking_data.dict().items() if v is not None}

    allowed_statuses = {"confirmed", "cancelled", "pending"}
    if "status" in update_data:
        if update_data["status"] not in allowed_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid booking status: {update_data['status']}")

    if update_data:
        stmt = (
            update(Booking)
            .where(Booking.id == booking_id)
            .values(**update_data)
        )
        await db.execute(stmt)
        await db.commit()

    return {"message": f"Booking {booking_id} updated successfully"}

@booking_router.delete("/bookings/modify/{booking_id}")
async def delete_booking(booking_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    await db.delete(booking)
    await db.commit()

    return {"message": f"Booking with ID {booking_id} deleted successfully"}

@booking_router.get("/bookings/modify/{booking_id}")
async def get_booking_by_id(booking_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {
        "id": booking.id,
        "timeslot_id": booking.timeslot_id,
        "owner_id": booking.owner_id,
        "status": booking.status,
        "created_at": booking.created_at,
    }
