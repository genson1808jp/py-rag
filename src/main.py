from llama_index.core.node_parser import MarkdownNodeParser
from llama_index.readers.file import FlatReader
from pathlib import Path
from retrieval_graph.retrieval import make_text_encoder
from langchain_elasticsearch import ElasticsearchStore
from langchain_core.documents import Document
from dotenv import load_dotenv
import os
load_dotenv()


md_docs = FlatReader().load_data(Path("./embeddings/doc2/output.md"))

parser = MarkdownNodeParser()
md_nodes = parser.get_nodes_from_documents(md_docs)

embeddings = make_text_encoder("cohere/embed-multilingual-v3.0")

# Convert nodes to Langchain documents
documents = [
    Document(
        page_content=node.text,  # Assuming node has a 'text' attribute
        metadata=node.metadata if hasattr(node, 'metadata') else {}
    ) for node in md_nodes
]

# # Create Elasticsearch vector store
# elastic_vector_search = ElasticsearchStore(
#     es_url="http://localhost:9200",
#     es_api_key="MkNpVGVaTUIxVTJEZ0t1Z0txLVQ6VnRoNlVkdEhTTmVic1NTeFRSTzJidw==",
#     index_name="langchain_index",  # Explicit index name
#     embedding=embeddings,
#     # es_user="elastic",
#     # es_password="changeme",
# )

# # Add documents to the vector store
# elastic_vector_search.add_documents(documents)

# print(md_nodes)

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams



client = QdrantClient(url=os.environ["QDRANT_URL"], api_key=os.environ["QDRANT_API_KEY"])

# client.create_collection(
#     collection_name="ndi-checker",
#     vectors_config=VectorParams(size=4, distance=Distance.DOT),
# )

collection_name = "lt4670"

# if not client.collection_exists(collection_name):
#     client.create_collection(
#         collection_name=collection_name,
#         vectors_config={
#             "text-dense":VectorParams(
#                 size=128,  # Example vector size, adjust as needed
#                 distance=Distance.COSINE  # Example distance metric, adjust as needed
#             )
#         }
#     )

# vstore = QdrantVectorStore(
#     client=client,
#     collection_name=collection_name,
#     embedding=embeddings,
# )

qdrant = QdrantVectorStore.from_documents(documents, 
                               embeddings, 
                               url=os.environ["QDRANT_URL"], collection_name=collection_name, 
                               prefer_grpc=True, api_key=os.environ["QDRANT_API_KEY"])


# vstore.add_documents(documents)