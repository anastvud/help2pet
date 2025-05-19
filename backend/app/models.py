from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(40), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    name = Column(String(40))
    surname = Column(String(40))
    email = Column(String(100), unique=True)
    phone_number = Column(String(20))

    # Relationship
    petsitter = relationship("Petsitter", back_populates="user", uselist=False, cascade="all, delete-orphan")
    owner = relationship("Owner", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Petsitter(Base):
    __tablename__ = 'petsitters'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    zipcode = Column(String(5))
    area = Column(String(40))
    gender = Column(Boolean)
    profession = Column(String(40))
    date_of_birth = Column(Date)
    price_hour = Column(Integer)
    experience = Column(String(40))
    smoker = Column(Boolean)
    drives = Column(Boolean)
    pets = Column(Boolean)
    languages = Column(String(40))

    # Relationship
    user = relationship("User", back_populates="petsitter")

class Owner(Base):
    __tablename__ = 'owners'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    zipcode = Column(String(5))
    area = Column(String(40))
    gender = Column(Boolean)
    pets = Column(String(40))

    # Relationship
    user = relationship("User", back_populates="owner")
