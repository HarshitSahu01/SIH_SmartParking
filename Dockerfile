# Stage 1: Backend - Python 3.12
FROM python:3.12-slim as backend

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

# Stage 2: Frontend - Node.js v20.10.0
FROM node:20.10.0-alpine as frontend

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the frontend code to the container
COPY frontend/ /app/frontend/

# Install npm dependencies
RUN npm install

# Stage 3: Final image to combine both backend and frontend
FROM python:3.12-slim

# Set up backend again in the final image
WORKDIR /app/backend
COPY --from=backend /app/backend /app/backend
EXPOSE 8000

# Set up frontend in the final image
WORKDIR /app/frontend
COPY --from=frontend /app/frontend /app/frontend
EXPOSE 5173

# Command to run both the backend and frontend together
CMD ["sh", "-c", ". /app/backend/venv/bin/activate && python /app/backend/manage.py runserver 0.0.0.0:8000 & npm run --prefix /app/frontend dev"]
