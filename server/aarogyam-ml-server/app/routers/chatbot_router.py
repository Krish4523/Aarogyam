from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException, status
from app.db.mongodb import db
from app.models import AarogyamChat  # Ensure AarogyamChat is correctly imported
from app.services.jwt_service import verify_jwt

router = APIRouter()
active_connections = {}

# Instantiate AarogyamChat
chat = AarogyamChat()

@router.websocket("/")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    # Verify JWT token to authenticate the user
    try:
        payload = verify_jwt(str(token))
        user_id_from_payload = payload.get("id")
        user_email = payload.get("email")

        if not user_id_from_payload:
            raise HTTPException(status_code=400, detail="Invalid token: User ID not found.")
    except Exception as e:
        print(f"JWT Verification Error: {str(e)}")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Accept WebSocket connection and register the user
    await websocket.accept()
    active_connections[user_id_from_payload] = websocket

    try:
        while True:
            # Receive user message
            user_message = await websocket.receive_text()

            print(user_message)

            # Save the user message in the database


            # Generate AI response using chat_with_model
            ai_response, source_nodes = await chat.chat_with_model(user_message)

            print(ai_response)

            db.message.insert_one({
                "user_id": user_id_from_payload,
                "message": user_message,
                "reply": str(ai_response),
                "source_nodes": source_nodes,
            })
            # Persist the AI response in the database

            # Send AI response back to the user
            await websocket.send_text(str(ai_response))

    except WebSocketDisconnect:
        # Remove the connection from the active connections on disconnect
        del active_connections[user_id_from_payload]

    except Exception as e:
        # Handle other exceptions and close the WebSocket connection
        print(f"Error during WebSocket communication: {str(e)}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
