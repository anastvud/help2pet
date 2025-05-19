from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    surname: str
    email: str
    phone_number: str


class UserLogin(BaseModel):
    username: str
    password: str

