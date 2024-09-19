# Use the tiangolo/uvicorn-gunicorn-fastapi image
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# Set the working directory in the container
WORKDIR /app

# Copy the application code into the container
COPY ./app /app

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose port 80 (or the port you want to use)
EXPOSE 80

# Command to run the FastAPI app with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
