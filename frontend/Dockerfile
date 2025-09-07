# Stage 1: The Builder
# Use a Node.js image to install dependencies and build the app.
FROM node:20.9.0-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json first to leverage Docker's layer caching.
COPY package*.json ./

# Install project dependencies.
RUN npm ci

# Copy the rest of the application source code.
COPY . .

# Run the build command to generate static files.
RUN npm run build

# Stage 2: The Production Image
# Use a small Nginx image to serve the built files.
FROM nginx:1.25-alpine

# Copy the custom Nginx configuration file.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the 'builder' stage to Nginx's HTML directory.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80, the default HTTP port for web traffic.
EXPOSE 80

# Start Nginx in the foreground.
CMD [ "nginx", "-g", "daemon off;" ]
