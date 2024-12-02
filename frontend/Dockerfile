# Frontend Dockerfile

# Use a Node.js base image
FROM node:20.10.0-alpine

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the frontend code to the container
COPY frontend/ /app/frontend/

# Install npm dependencies
RUN npm install

# Expose the port the Vite frontend runs on
EXPOSE 5173

# Command to run the Vite development server
CMD ["npm", "run", "dev"]
