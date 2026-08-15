# Stage 1: Build
FROM node:20-alpine as build

# Set build arguments
ARG VITE_BACKEND_SERVER=http://localhost:8888/

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Set environment variable for build
ENV VITE_BACKEND_SERVER=$VITE_BACKEND_SERVER

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Vite build output (dist) instead of build
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80
 

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
