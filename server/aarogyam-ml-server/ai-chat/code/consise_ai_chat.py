import os
from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.indices.vector_store import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from pinecone import Pinecone
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.llms.nvidia import NVIDIA
from dotenv import load_dotenv
from transformers import GPT2Tokenizer
from llama_index.core.llms import ChatMessage

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


try:
    Settings.embed_model = NVIDIAEmbedding(api_key=nvidia_api_key)
    Settings.llm = NVIDIA(model='meta/llama3-70b-instruct', api_key=nvidia_api_key)
except Exception as e:
    print(f"Error setting up NVIDIA model: {str(e)}")
    exit(1)

# Initialize Pinecone vector store
# Initialize Pinecone
try:
    pc = Pinecone(api_key=pinecone_api_key)
    pinecone_index = pc.Index("aarogyam-chat-rag")
except Exception as e:
    print(f"Error initializing Pinecone: {str(e)}")
    exit(1)

vector_store = PineconeVectorStore(pinecone_index=pinecone_index)

# Create Vector Store Index
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
retriever = VectorIndexRetriever(index=index, similarity_top_k=5)

# Create Query Engine
query_engine = RetrieverQueryEngine(retriever=retriever)

# Define the context prompt template
DEFAULT_CONTEXT_PROMPT = """
You are an expert in Ayurveda, providing answers based on the context provided. Below is some relevant context that might help:

Context:
-----
{node_context}
-----

Based on this information, answer the following user question in a helpful and informative manner:
User Question: "{query_str}"

If the context doesn't fully answer the question, provide additional information based on general Ayurvedic knowledge, but ensure the response is relevant.
"""


# Function to handle user input and generate response
def chat_with_model(query):
    # Retrieve context nodes from the index
    query_result = query_engine.query(query)
    source_nodes = [node.get_content() for node in query_result.source_nodes]

    # Format context from retrieved nodes
    node_context = "\n".join([f"Context Chunk {i + 1}: {content}" for i, content in enumerate(source_nodes)])

    # Prepare the prompt with context
    prompt = DEFAULT_CONTEXT_PROMPT.format(node_context=node_context, query_str=query)

    # Use NVIDIA LLM to generate a response
    response = Settings.llm.chat([ChatMessage(role="user", content=prompt)])

    return response, source_nodes


# Example user inputs
user_inputs = [
    "Hello! Can you tell me about Ayurvedic practices?",
    "What are some common Ayurvedic remedies for headaches?",
]

# Loop through each user input, get response, and print
for user_input in user_inputs:
    response, source_nodes = chat_with_model(user_input)
    print(f"User: {user_input}")
    print(f"Response: {response}")
    print(f"Source Nodes: {source_nodes}\n")
