# Stage 1: The Builder
# Use an official Node.js runtime as the base image
FROM node:20.9.0-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first for layer caching
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Stage 2: The Production Image
# Use a minimal Node.js image to run the application.
FROM node:20.9.0-alpine

# Copy only the necessary files from the 'builder' stage.
COPY --from=builder /app/node_modules ./node_modules

# Copy the rest of the application source code
COPY . .

# Expose the application port
EXPOSE 8888

# Define the command to start the application
CMD ["npm", "run", "start"]
