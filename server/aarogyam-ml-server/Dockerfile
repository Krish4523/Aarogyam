# Use the tiangolo/uvicorn-gunicorn-fastapi image
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# Set the working directory in the container
WORKDIR /app

# Copy the application code into the container
COPY ./app /app

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Set environment variables
ENV NVIDIA_API_KEY=your_nvidia_api_key
ENV PINECONE_API_KEY=your_pinecone_api_key

# Expose port 80
EXPOSE 80

# Command to run the FastAPI app with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
