# bring in our LLAMA_CLOUD_API_KEY
from dotenv import load_dotenv
load_dotenv()

# bring in deps
from llama_parse import LlamaParse
from llama_index.core import SimpleDirectoryReader
import pickle

from dotenv import load_dotenv
import os
load_dotenv()

# set up parser
parser = LlamaParse(
    result_type="markdown",  # "markdown" and "text" are available
    lang="ja",
    api_key=os.environ["LLAMA_CLOUD_API_KEY"]
)

data_file = "./doc2/parsed_data.pkl"
llama_parse_documents = parser.load_data("./doc2/lt4670_j_v7_fw22.pdf")

# Save the parsed data to a file
with open(data_file, "wb") as f:
    pickle.dump(llama_parse_documents, f)

# Set the parsed data to the variable
parsed_data = llama_parse_documents
with open('data/output.md', 'a') as f:  # Open the file in append mode ('a')
    for doc in llama_parse_documents:
        f.write(doc.text + '\n')

# use SimpleDirectoryReader to parse our file