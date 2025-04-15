from datetime import datetime
from app.elastic.es_client import es

class ChatLogger:
    INDEX_NAME = "chat_logs"

    def save_message(self, room: str, user: str, message: str):
        doc = {
            "room": room,
            "user": user,
            "message": message,
            "timestamp": datetime.utcnow()
        }
        es.index(index=self.INDEX_NAME, document=doc)

    def get_logs_by_room(self, room: str, size: int = 100):
        body = {
            "query": {
                "match": {
                    "room": room
                }
            },
            "size": size,
            "sort": [{"timestamp": {"order": "asc"}}]
        }
        res = es.search(index=self.INDEX_NAME, body=body)
        return [hit["_source"] for hit in res["hits"]["hits"]]
