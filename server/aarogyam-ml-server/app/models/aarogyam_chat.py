# aarogyam_chat.py

import os
import asyncio
from dotenv import load_dotenv
from transformers import GPT2Tokenizer
from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.indices.vector_store import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from pinecone import Pinecone
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.llms.nvidia import NVIDIA
from llama_index.core.llms import ChatMessage


class AarogyamChat:
    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Load API keys
        self.nvidia_api_key = os.getenv("NVIDIA_API_KEY")
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY")

        # Check if API keys are correctly loaded
        if not self.nvidia_api_key or not self.pinecone_api_key:
            raise EnvironmentError("NVIDIA or Pinecone API key not found. Check your .env file.")

        # Initialize tokenizer for text chunking
        self.tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

        # Set up NVIDIA embedding and LLM with proper error handling
        try:
            Settings.embed_model = NVIDIAEmbedding(api_key=self.nvidia_api_key)
            Settings.llm = NVIDIA(model='meta/llama3-70b-instruct', api_key=self.nvidia_api_key)
        except Exception as e:
            raise Exception(f"Error setting up NVIDIA model: {str(e)}")

        # Initialize Pinecone vector store
        try:
            self.pc = Pinecone(api_key=self.pinecone_api_key)
            self.pinecone_index = self.pc.Index("aarogyam-chat-rag")
        except Exception as e:
            raise Exception(f"Error initializing Pinecone: {str(e)}")

        self.vector_store = PineconeVectorStore(pinecone_index=self.pinecone_index)

        # Create Vector Store Index
        self.index = VectorStoreIndex.from_vector_store(vector_store=self.vector_store)
        self.retriever = VectorIndexRetriever(index=self.index, similarity_top_k=5)

        # Create Query Engine
        self.query_engine = RetrieverQueryEngine(retriever=self.retriever)

        # Define the context prompt template
        self.DEFAULT_CONTEXT_PROMPT = """
        You are an expert in Ayurveda, providing answers based on the context provided. Below is some relevant context that might help:

        Context:
        -----
        {node_context}
        -----

        Based on this information, answer the following user question in a helpful and informative manner:
        User Question: "{query_str}"

        If the context doesn't fully answer the question, provide additional information based on general Ayurvedic knowledge, but ensure the response is relevant.
        """

    # Function to truncate or split text into chunks of max 512 tokens
    def truncate_text(self, text, max_tokens=500):
        tokens = self.tokenizer.tokenize(text)
        if len(tokens) > max_tokens:
            tokens = tokens[:max_tokens]
        return self.tokenizer.convert_tokens_to_string(tokens)

    # Function to handle user input and generate response
    async def chat_with_model(self, query):
        query_result = self.query_engine.query(query)
        source_nodes = [node.get_content() for node in query_result.source_nodes]

        # Format context from retrieved nodes
        node_context = "\n".join([f"Context Chunk {i + 1}: {content}" for i, content in enumerate(source_nodes)])

        # Prepare the prompt with context
        prompt = self.DEFAULT_CONTEXT_PROMPT.format(node_context=node_context, query_str=query)

        # Use NVIDIA LLM to generate a response
        response = Settings.llm.chat([ChatMessage(role="user", content=prompt)])

        return response, source_nodes


# Example usage
if __name__ == "__main__":
    chat = AarogyamChat()


    async def main():
        # For testing purposes
        response, source_nodes = await chat.chat_with_model(
            "I have not slept in 4 days, is there any risk to my health?")
        print(response)
        print(source_nodes)


    asyncio.run(main())
