## Project Structure and Setup

### Folder Structure

```
arrogyam-ml-server/
│
├── app/
│   ├── api/
│   │   ├── routes.py
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py
│   │   ├── jwt.py
│   │   └── __init__.py
│   ├── db/
│   │   ├── prisma_client.py
│   │   └── __init__.py
│   ├── models/
│   │   ├── ml_model.py
│   │   └── __init__.py
│   ├── main.py
│   └── __init__.py
├── prisma/
│   ├── schema.prisma
├── notebooks/
│   ├── data_exploration.ipynb
│   ├── model_training.ipynb
│   └── __init__.py
├── models/
│   ├── trained_model.pkl
│   └── __init__.py
├── data/
│   ├── raw/
│   │   └── raw_data.csv
│   ├── processed/
│   │   └── processed_data.csv
│   └── __init__.py
├── .env
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .gitignore
└── .dockerignore
```

### Step-by-Step Implementation

#### 1. **Environment Variables (.env)**

**.env**:
env

```
SECRET_KEY=your_secret_key
ALGORITHM=HS256
DATABASE_URL=postgresql://user:password@db:5432/database
MODEL_PATH=/app/models/trained_model.pkl
```

#### 2. **Configuration with dotenv**

**app/core/config.py**:

```python
from pydantic import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

class Settings(BaseSettings):
    secret_key: str = os.getenv("SECRET_KEY")
    algorithm: str = os.getenv("ALGORITHM")
    database_url: str = os.getenv("DATABASE_URL")
    model_path: str = os.getenv("MODEL_PATH")

settings = Settings()
```

#### 3. *JWT Authentication Utility*

**app/core/jwt.py**:

```python
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer
from jwt import PyJWTError
from app.core.config import settings

security = HTTPBearer()

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except PyJWTError:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

def get_current_user(token: str = Security(security)):
    return verify_token(token.credentials)
```

#### 4. *Database Interaction with Prisma*

**app/db/prisma_client.py**:

```python
from prisma import Prisma

prisma = Prisma()

async def connect_db():
    await prisma.connect()

async def disconnect_db():
    await prisma.disconnect()

async def get_data():
    return await prisma.your_model.find_many()
```

#### 5. *Machine Learning Model Handling*

**app/models/ml_model.py**:

```python
import joblib
from app.core.config import settings

class MLModel:
    def __init__(self):
        self.model = joblib.load(settings.model_path)

    def predict(self, data):
        return self.model.predict(data)

ml_model = MLModel()
```

#### 6. *API Routes*

**app/api/routes.py**:

```python
from fastapi import APIRouter, Depends
from app.core.jwt import get_current_user
from app.models.ml_model import ml_model
from app.db.prisma_client import get_data

router = APIRouter()

@router.get("/predict")
async def make_prediction(user=Depends(get_current_user)):
    # Fetch data from the database
    data = await get_data()
    
    # Make a prediction
    prediction = ml_model.predict(data)
    
    return {"prediction": prediction}

@router.get("/external-data-predict")
async def external_data_prediction(user=Depends(get_current_user)):
    # Fetch data from the database
    data = await get_data()
    
    # Make a prediction
    prediction = ml_model.predict(data)
    
    return {"prediction": prediction}
```

#### 7. *Main Application*

**app/main.py**:

```python
from fastapi import FastAPI
from app.api.routes import router
from app.db.prisma_client import connect_db, disconnect_db

app = FastAPI()

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 8. *Prisma Schema*

**prisma/schema.prisma**:

```prisma
generator client {
  provider = "prisma-client-py"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model YourModel {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 9. *Dockerization*

**Dockerfile**:

```Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY .. /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=${DATABASE_URL}

  db:
    image: postgres:13
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: database
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 10. *Version Control and Ignoring Files*

**.gitignore**:

```gitignore
# Python
__pycache__/
*.py[cod]
*.so
*.dylib
*.venv/
venv/

# Jupyter Notebooks
.ipynb_checkpoints/

# Data and Model Files
data/raw/
data/processed/
models/

# Environment Files
app/.env

# Logs
*.log

# Docker
docker-compose.override.yml
```

**.dockerignore**:

```dockerignore
# Ignore files not needed in the Docker image
.git
.gitignore
data/
notebooks/
models/
app/.env
__pycache__/
*.py[cod]
.ipynb_checkpoints/
```

### Final Steps

#### 1. *Prisma Setup*

After placing your Prisma schema, you need to initialize the Prisma Client and migrate your database:

```bash
# Generate the Prisma client
prisma generate

# Apply the schema to your database
prisma migrate dev --name init
```

#### 2. *Running the Application*

Use Docker Compose to build and run the application:

```bash
# Build and run using Docker Compose
docker-compose up --build
```

### Summary

This setup ensures a clean, modular, and scalable architecture for your machine learning service. The folder structure
clearly separates different components, making it easier to manage, develop, and deploy your project. The use of
.gitignore and .dockerignore helps keep your repository and Docker image clean by excluding unnecessary files.