import os
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext, Settings
from llama_index.core.indices.vector_store import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from pinecone import Pinecone
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.llms.nvidia import NVIDIA
from llama_index.core.node_parser import SentenceSplitter
from dotenv import load_dotenv
from transformers import GPT2Tokenizer
from llama_index.core.query_pipeline import (
    QueryPipeline,
    InputComponent,
    ArgPackComponent,
)
from llama_index.core.prompts import PromptTemplate
from llama_index.postprocessor.colbert_rerank import ColbertRerank
from typing import Any, Dict, List, Optional
from llama_index.core.bridge.pydantic import Field
from llama_index.core.llms import ChatMessage
from llama_index.core.query_pipeline import CustomQueryComponent
from llama_index.core.schema import NodeWithScore

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

try:
    pc = Pinecone(api_key=pinecone_api_key)
    pinecone_index = pc.Index("aarogyam-chat-rag")
except Exception as e:
    print(f"Error initializing Pinecone: {str(e)}")
    exit(1)

vector_store = PineconeVectorStore(pinecone_index=pinecone_index)

index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

input_component = InputComponent()

rewrite = (
    "Please generate a query for a semantic search engine based on the current conversation related to Ayurveda.\n"
    "\n"
    "\n"
    "{chat_history_str}"
    "\n"
    "\n"
    "Latest message: {query_str}\n"
    'Query:"""\n'
)

rewrite_template = PromptTemplate(rewrite)

argpack_component = ArgPackComponent()

retriever = VectorIndexRetriever(index=index, similarity_top_k=5)

# then postprocess/rerank with Colbert
reranker = ColbertRerank(top_n=3)

query_engine = RetrieverQueryEngine(retriever=retriever)

llm_query = query_engine.query('I have a headache which medicine i can take?')

print(llm_query.response)

llm_response_source_nodes = [i.get_content() for i in llm_query.source_nodes]

print(llm_response_source_nodes)

DEFAULT_CONTEXT_PROMPT = (
    "Here is some Ayurvedic context that might be helpful:\n"
    "-----\n"
    "{node_context}\n"
    "-----\n"
    "Please formulate a response to the following question using the provided Ayurvedic context. You may include additional knowledge, "
    "but ensure that it is related to Ayurveda:\n"
    "{query_str}\n"
)


class ResponseWithChatHistory(CustomQueryComponent):
    llm: NVIDIA = Field(..., description="NVIDIA LLM")
    system_prompt: Optional[str] = Field(
        default=None, description="System prompt to use for the LLM"
    )
    context_prompt: str = Field(
        default=DEFAULT_CONTEXT_PROMPT,
        description="Context prompt to use for the LLM",
    )

    def _validate_component_inputs(
            self, input: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate component inputs during run_component."""
        return input

    @property
    def _input_keys(self) -> set:
        """Input keys dict."""
        return {"chat_history", "nodes", "query_str"}

    @property
    def _output_keys(self) -> set:
        return {"response"}

    def _prepare_context(
            self,
            chat_history: List[ChatMessage],
            nodes: List[NodeWithScore],
            query_str: str,
    ) -> List[ChatMessage]:
        node_context = ""
        for idx, node in enumerate(nodes):
            node_text = node.get_content(metadata_mode="llm")
            node_context += f"Context Chunk {idx}:\n{node_text}\n\n"

        formatted_context = self.context_prompt.format(
            node_context=node_context, query_str=query_str
        )
        user_message = ChatMessage(role="user", content=formatted_context)

        chat_history.append(user_message)

        if self.system_prompt is not None:
            chat_history = [
                               ChatMessage(role="system", content=self.system_prompt)
                           ] + chat_history

        return chat_history

    def _run_component(self, **kwargs) -> Dict[str, Any]:
        """Run the component."""
        chat_history = kwargs["chat_history"]
        nodes = kwargs["nodes"]
        query_str = kwargs["query_str"]

        prepared_context = self._prepare_context(
            chat_history, nodes, query_str
        )

        # Convert chat history to the format expected by NVIDIA model
        response = self.llm.chat(prepared_context)

        return {"response": response}

    async def _arun_component(self, **kwargs: Any) -> Dict[str, Any]:
        """Run the component asynchronously."""
        chat_history = kwargs["chat_history"]
        nodes = kwargs["nodes"]
        query_str = kwargs["query_str"]

        prepared_context = self._prepare_context(
            chat_history, nodes, query_str
        )

        # Convert chat history to the format expected by NVIDIA model
        response = await self.llm.achat(prepared_context)

        return {"response": response}


# Example usage
response_component = ResponseWithChatHistory(
    llm=NVIDIA(api_key=nvidia_api_key),  # Initialize with your NVIDIA API key
    system_prompt=(
        "You are a Q&A system specializing in Ayurveda. You will be provided with previous chat history and relevant context "
        "to help in answering user queries related to Ayurvedic practices, remedies, and wellness."
    ),
)

pipeline = QueryPipeline(
    modules={
        "input": input_component,
        "rewrite_template": rewrite_template,
        "llm": Settings.llm,
        "rewrite_retriever": retriever,
        "query_retriever": retriever,
        "join": argpack_component,
        "reranker": reranker,
        "response_component": response_component,
    },
    verbose=False,
)

# run both retrievers -- once with the hallucinated query, once with the real query
pipeline.add_link(
    "input", "rewrite_template", src_key="query_str", dest_key="query_str"
)
pipeline.add_link(
    "input",
    "rewrite_template",
    src_key="chat_history_str",
    dest_key="chat_history_str",
)
pipeline.add_link("rewrite_template", "llm")
pipeline.add_link("llm", "rewrite_retriever")
pipeline.add_link("input", "query_retriever", src_key="query_str")

# each input to the argpack component needs a dest key -- it can be anything
# then, the argpack component will pack all the inputs into a single list
pipeline.add_link("rewrite_retriever", "join", dest_key="rewrite_nodes")
pipeline.add_link("query_retriever", "join", dest_key="query_nodes")

# reranker needs the packed nodes and the query string
pipeline.add_link("join", "reranker", dest_key="nodes")
pipeline.add_link(
    "input", "reranker", src_key="query_str", dest_key="query_str"
)

# synthesizer needs the reranked nodes and query str
pipeline.add_link("reranker", "response_component", dest_key="nodes")
pipeline.add_link(
    "input", "response_component", src_key="query_str", dest_key="query_str"
)
pipeline.add_link(
    "input",
    "response_component",
    src_key="chat_history",
    dest_key="chat_history",
)

from llama_index.core.memory import ChatMemoryBuffer

pipeline_memory = ChatMemoryBuffer.from_defaults(token_limit=8000)

user_inputs = [
    "Hello! Can you tell me about Ayurvedic practices?",
    "What are some common Ayurvedic remedies for headaches?",
    "How does Ayurveda approach digestive health?",
    "Can you suggest some Ayurvedic treatments for stress relief?",
    "Thanks for the information! What is the role of diet in Ayurveda?",
]

for msg in user_inputs:
    # get memory
    chat_history = pipeline_memory.get()

    # prepare inputs
    chat_history_str = "\n".join([str(x) for x in chat_history])

    # run pipeline
    response = pipeline.run(
        query_str=msg,
        chat_history=chat_history,
        chat_history_str=chat_history_str,
    )

    # update memory
    user_msg = ChatMessage(role="user", content=msg)
    pipeline_memory.put(user_msg)
    print(str(user_msg))

    pipeline_memory.put(response.message)
    print(str(response.message))
    print()