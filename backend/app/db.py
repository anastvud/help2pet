from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings

# Create the async engine
engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)

# Create the sessionmaker
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Dependency to get the db session in FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
