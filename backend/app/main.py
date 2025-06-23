from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.user import user_router

from app.timeslot import timeslot_router
from app.booking import booking_router
from app.pets import pet_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# include router
app.include_router(user_router, tags=["user"])
app.include_router(timeslot_router, tags=["timeslot"])
app.include_router(booking_router, tags=["booking"])
app.include_router(pet_router, tags=["pets"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}

