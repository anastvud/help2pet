from sqlalchemy import Boolean, Column, Date, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Petsitter(Base):
    __tablename__ = "petsitters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # Required fields (not nullable)
    username = Column(String(40), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(30), nullable=False)
    surname = Column(String(30), nullable=False)
    email = Column(String(40), unique=True, nullable=False)
    phone_number = Column(String(9), nullable=False)

    # Optional fields (nullable)
    zipcode = Column(String(5), nullable=True)
    area = Column(String(40), nullable=True)
    gender = Column(Boolean, nullable=True)
    profession = Column(String(40), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    price_hour = Column(Integer, nullable=True)
    experience = Column(String(40), nullable=True)
    smoker = Column(Boolean, nullable=True)
    drives = Column(Boolean, nullable=True)
    pets = Column(Boolean, nullable=True)
    languages = Column(String(40), nullable=True)

class Owner(Base):
    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(40), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(30), nullable=False)
    surname = Column(String(30), nullable=False)
    email = Column(String(40), unique=True, nullable=False)
    phone_number = Column(String(9), nullable=False)

    zipcode = Column(String(5), nullable=True)
    area = Column(String(40), nullable=True)
    gender = Column(Boolean, nullable=True)
    pets = Column(String(255), nullable=True)

class TimeSlot(Base):
    __tablename__ = "timeslots"

    id = Column(Integer, primary_key=True, index=True)
    sitter_id = Column(Integer, ForeignKey("petsitters.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_booked = Column(Boolean, default=False)

    __table_args__ = (
        UniqueConstraint("sitter_id", "start_time", "end_time", name="unique_timeslot"),
    )