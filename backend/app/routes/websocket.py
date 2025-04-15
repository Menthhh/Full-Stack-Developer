from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from app.services.chat_logger import ChatLogger  # import logger

router = APIRouter()
chat_logger = ChatLogger()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, room: str, websocket: WebSocket):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)

    def disconnect(self, room: str, websocket: WebSocket):
        self.active_connections[room].remove(websocket)
        if not self.active_connections[room]:
            del self.active_connections[room]

    async def broadcast(self, room: str, message: str):
        if room in self.active_connections:
            # Iterate over all active connections and send the message
            for connection in self.active_connections[room]:
                try:
                    # Only send message if the connection is still open
                    await connection.send_text(message)
                except WebSocketDisconnect:
                    # Handle the case where a WebSocket disconnects during broadcasting
                    self.disconnect(room, connection)
                    print(f"Connection {connection} closed during broadcast.")

manager = ConnectionManager()

@router.websocket("/ws/chat/{room}/{username}")
async def websocket_chat(websocket: WebSocket, room: str, username: str):
    await manager.connect(room, websocket)
    join_msg = f"🔵 {username} joined the room."
    await manager.broadcast(room, join_msg)
    chat_logger.save_message(room, username, "[JOINED]")

    try:
        while True:
            data = await websocket.receive_text()
            msg = f"{username}: {data}"
            await manager.broadcast(room, msg)
            chat_logger.save_message(room, username, data)

    except WebSocketDisconnect:
        manager.disconnect(room, websocket)
        leave_msg = f"🔴 {username} left the room."
        await manager.broadcast(room, leave_msg)
        chat_logger.save_message(room, username, "[LEFT]")
