import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

load_dotenv()

# Get the MongoDB URI and database name from environment variables
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URI or not DB_NAME:
    raise EnvironmentError("Please ensure both MONGO_URI and DB_NAME are set in environment variables.")

try:
    # Create a MongoClient to the running MongoDB instance
    client = MongoClient(MONGO_URI)

    # Access the specified database
    db = client[DB_NAME]
    print(f"Successfully connected to the database: {DB_NAME}")

except ServerSelectionTimeoutError as e:
    print(f"Failed to connect to MongoDB: {e}")
