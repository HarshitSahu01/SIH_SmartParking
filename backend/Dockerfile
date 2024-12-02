# Backend Dockerfile

# Use an official Python runtime as a base image
FROM python:3.12-slim

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the backend code and requirements.txt to the container
COPY backend/ /app/backend/
COPY requirements.txt /app/backend/

# Install Python dependencies
RUN python -m venv venv && \
    . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose the port the backend listens on (modify if needed)
EXPOSE 8000

# Command to run the Python backend server
CMD ["sh", "-c", ". venv/bin/activate && python manage.py runserver 0.0.0.0:8000"]
