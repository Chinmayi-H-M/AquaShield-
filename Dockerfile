# Use official Python 3.11 slim image for a lightweight and stable base
FROM python:3.11-slim

# Set environment variables
# Prevents Python from writing .pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr for better logging
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Install minimal system dependencies
# libgomp1 is often required by scikit-learn/numpy for multi-threading
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt first to take advantage of Docker's layer caching
# This ensures dependencies are only re-installed if the requirements file changes
COPY requirements.txt .

# Install Python dependencies
# --no-cache-dir keeps the image size small by not storing the download cache
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
# This includes main.py, model_handler.py, schemas.py, and the models/ directory
COPY . .

# Expose port 8000 to allow communication to the FastAPI server
EXPOSE 8000

# Command to run the FastAPI application using Uvicorn
# --host 0.0.0.0 is critical to make the app accessible from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
