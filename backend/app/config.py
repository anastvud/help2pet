import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Settings(BaseSettings):
    DATABASE_URL: str

    class Config:
        env_file = os.path.join(BASE_DIR, ".env")

settings = Settings()
