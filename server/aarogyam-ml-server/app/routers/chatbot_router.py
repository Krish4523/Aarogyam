from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

from app.db.mongodb import db
from app.services.jwt_service import verify_jwt

router = APIRouter()
active_connections = {}


@router.websocket("/")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    payload = verify_jwt(token)
    user_id_from_payload = payload.get("id")
    await websocket.accept()
    active_connections[user_id_from_payload] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            db.messages.insert_one({"user_id": user_id_from_payload, "message": data})
            await websocket.send_text(payload.get("email"))
    except WebSocketDisconnect:
        del active_connections[user_id_from_payload]
