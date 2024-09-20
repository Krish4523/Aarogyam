from dotenv import load_dotenv
from fastapi import FastAPI

from app.routers import ml_router, chatbot_router

load_dotenv()  # Load environment variables from .env file

app = FastAPI()

app.include_router(ml_router.router, prefix="/api/ml_service/v1/predict")
app.include_router(chatbot_router.router, prefix="/chatbot")


@app.get("/api/ml_service/v1")
async def root():
    return {"message": "ML SERVER Working"}
