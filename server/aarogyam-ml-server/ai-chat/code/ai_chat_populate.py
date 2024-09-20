import os
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext, Settings
from pinecone import Pinecone
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.llms.nvidia import NVIDIA
from llama_index.core.node_parser import SentenceSplitter
from dotenv import load_dotenv
from transformers import GPT2Tokenizer

# Load environment variables
load_dotenv()

# Load API keys
nvidia_api_key = os.getenv("NVIDIA_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")

# Check if API keys are correctly loaded
if not nvidia_api_key or not pinecone_api_key:
    raise EnvironmentError("NVIDIA or Pinecone API key not found. Check your .env file.")

# Initialize tokenizer for text chunking
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")


# Function to truncate or split text into chunks of max 512 tokens
def truncate_text(text, max_tokens=500):
    tokens = tokenizer.tokenize(text)
    if len(tokens) > max_tokens:
        tokens = tokens[:max_tokens]
    return tokenizer.convert_tokens_to_string(tokens)


# Setup NVIDIA embedding and LLM with proper error handling
try:
    Settings.text_splitter = SentenceSplitter(chunk_size=400)
    Settings.embed_model = NVIDIAEmbedding(api_key=nvidia_api_key)
    Settings.llm = NVIDIA(model='meta/llama3-70b-instruct', api_key=nvidia_api_key)
except Exception as e:
    print(f"Error setting up NVIDIA model: {str(e)}")
    exit(1)

# Initialize Pinecone
try:
    pc = Pinecone(api_key=pinecone_api_key)
    pinecone_index = pc.Index("aarogyam-chat-rag")
except Exception as e:
    print(f"Error initializing Pinecone: {str(e)}")
    exit(1)

# Load documents and truncate text properly
documents = SimpleDirectoryReader("../rag_data/md").load_data()

# Modify the text content of document objects without breaking them
for doc in documents:
    doc.text = truncate_text(doc.text)  # Modify the document's text in place

# Set up Pinecone Vector Store and Storage Context
vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Create Vector Store Index from processed documents
try:
    index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
except Exception as e:
    print(f"Error creating index: {str(e)}")
    exit(1)

# Convert index to query engine
query_engine = index.as_query_engine()

# Example query
response = query_engine.query("What is ayurveda?")
print(response)
