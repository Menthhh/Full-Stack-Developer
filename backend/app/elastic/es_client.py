from elasticsearch import Elasticsearch
import os

es = Elasticsearch(
    hosts=[os.getenv("ELASTIC_URL", "http://127.0.0.1:9200")],
    verify_certs=False
)
