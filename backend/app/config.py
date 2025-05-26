import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Settings(BaseSettings):
    DATABASE_URL: str

    # MAIL_USERNAME: str
    # MAIL_PASSWORD: str
    # MAIL_FROM: str
    # MAIL_PORT: int
    # MAIL_SERVER: str
    # MAIL_TLS: bool
    # MAIL_SSL: bool

    class Config:
        env_file = os.path.join(BASE_DIR, ".env")

settings = Settings()
