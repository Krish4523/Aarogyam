import numpy as np
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from app.services.jwt_service import verify_jwt

router = APIRouter(dependencies=[Depends(verify_jwt)])


class PredictionRequest(BaseModel):
    data: list


class PredictionResponse(BaseModel):
    prediction: dict


@router.post("/test", response_model=PredictionResponse)
async def predict(request: PredictionRequest, payload: dict = Depends(verify_jwt)):
    data = np.array(request.data)
    print(request)
    try:
        return PredictionResponse(prediction=payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
