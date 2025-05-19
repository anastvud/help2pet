from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.blueprint import router
from app.user import user_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# include router
app.include_router(user_router, prefix="/user", tags=["user"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}

