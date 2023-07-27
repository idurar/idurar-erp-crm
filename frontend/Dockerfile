# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the working environment
COPY . .

# Run the setup script
RUN node ./setup/setup.js

# Start the backend server
CMD [ "npm", "start" ]

# Set the working directory in the container to /app/frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY frontend/package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the working environment
COPY frontend/ .

# Start the frontend server
CMD [ "npm", "start" ]
