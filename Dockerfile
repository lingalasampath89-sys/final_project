# Use the official Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the backend requirements first (for better caching)
COPY backend/requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the backend folder content into the container
COPY backend/ ./

# Expose the port Hugging Face expects (7860)
EXPOSE 7860

# Command to run the FastAPI server
CMD ["uvicorn", "api_server:main", "--host", "0.0.0.0", "--port", "7860"]
