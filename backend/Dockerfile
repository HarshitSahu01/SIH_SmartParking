# Use an official Python 3.12 slim image as the base
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements file to the container
COPY requirements.txt /app/

# Install Python dependencies in a virtual environment
RUN python -m venv venv && \
    . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the backend code to the container
COPY . /app/

# Expose the backend port (default Django port)
EXPOSE 8000

# Command to run the backend (Django) app
CMD [ "sh", "-c", ". venv/bin/activate && python manage.py runserver 0.0.0.0:8000" ]
