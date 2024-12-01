from llama_index.core.node_parser import MarkdownNodeParser
from llama_index.readers.file import FlatReader
from pathlib import Path
from retrieval_graph.retrieval import make_text_encoder
from langchain_elasticsearch import ElasticsearchStore
from langchain_core.documents import Document 


md_docs = FlatReader().load_data(Path("./embeddings/docs/output.md"))

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

# Create Elasticsearch vector store
elastic_vector_search = ElasticsearchStore(
    es_url="http://localhost:9200",
    es_api_key="MkNpVGVaTUIxVTJEZ0t1Z0txLVQ6VnRoNlVkdEhTTmVic1NTeFRSTzJidw==",
    index_name="langchain_index",  # Explicit index name
    embedding=embeddings,
    # es_user="elastic",
    # es_password="changeme",
)

# Add documents to the vector store
elastic_vector_search.add_documents(documents)

print(md_nodes)