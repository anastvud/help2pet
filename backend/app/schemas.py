from pydantic import BaseModel, EmailStr, constr
from datetime import date

class UserBasicCreate(BaseModel):
    username: constr(max_length=40)
    password: str
    name: constr(max_length=30)
    surname: constr(max_length=30)
    email: constr(max_length=40)
    phone_number: constr(max_length=9)

class PetsitterAdditionalInfo(BaseModel):
    zipcode: constr(max_length=5)
    area: constr(max_length=40)
    gender: bool
    profession: constr(max_length=40)
    date_of_birth: date
    price_hour: int
    experience: constr(max_length=40)
    smoker: bool
    drives: bool
    pets: bool
    languages: constr(max_length=40)


class OwnerAdditionalInfo(BaseModel):
    zipcode: constr(max_length=5)
    area: constr(max_length=40)
    gender: bool
    pets: constr(max_length=255)

class UserLogin(BaseModel):
    username: str
    password: str

