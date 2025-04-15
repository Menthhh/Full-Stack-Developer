from fastapi import APIRouter, Query
from app.elastic.es_client import es

router = APIRouter()

@router.get("/search")
def search_chat(room: str, query: str = Query(...)):
    response = es.search(
        index="chat_logs",
        query={
            "bool": {
                "must": [
                    {"match": {"room": room}},
                    {"match": {"message": query}}
                ]
            }
        }
    )
    return [hit["_source"] for hit in response["hits"]["hits"]]
