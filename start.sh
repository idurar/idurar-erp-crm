#!/bin/bash

# IDURAR ERP CRM - Docker Quick Start Script

echo "=========================================="
echo "  IDURAR ERP CRM - Docker Setup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed"
echo "✅ Docker Compose is installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "Creating .env file from template..."
    
    cat > .env << EOF
# MongoDB Configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
MONGO_DATABASE=idurar

# Backend Configuration
JWT_SECRET=$(openssl rand -base64 64 | tr -d /=+ | cut -c -64)
COOKIE_SECRET=$(openssl rand -base64 64 | tr -d /=+ | cut -c -64)
OPENAI_API_KEY=

# Frontend Configuration
VITE_BACKEND_SERVER=http://localhost:8888/
EOF
    
    echo "✅ Created .env file with secure random secrets"
    echo ""
else
    echo "✅ .env file exists"
    echo ""
fi

# Ask user what to do
echo "What would you like to do?"
echo "1) Start application (docker-compose up)"
echo "2) Start application in background (docker-compose up -d)"
echo "3) Build and start application (docker-compose up --build)"
echo "4) Stop application (docker-compose down)"
echo "5) View logs (docker-compose logs -f)"
echo "6) Check status (docker-compose ps)"
echo "7) Initialize database (first time setup)"
echo "8) Backup database"
echo "9) Exit"
echo ""

read -p "Enter your choice (1-9): " choice

case $choice in
    1)
        echo ""
        echo "Starting application..."
        docker-compose up
        ;;
    2)
        echo ""
        echo "Starting application in background..."
        docker-compose up -d
        echo ""
        echo "✅ Application started!"
        echo "Frontend: http://localhost:80"
        echo "Backend: http://localhost:8888"
        echo ""
        echo "To view logs: docker-compose logs -f"
        echo "To stop: docker-compose down"
        ;;
    3)
        echo ""
        echo "Building and starting application..."
        docker-compose up --build -d
        echo ""
        echo "✅ Application built and started!"
        echo "Frontend: http://localhost:80"
        echo "Backend: http://localhost:8888"
        ;;
    4)
        echo ""
        echo "Stopping application..."
        docker-compose down
        echo "✅ Application stopped"
        ;;
    5)
        echo ""
        echo "Viewing logs (Press Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    6)
        echo ""
        echo "Service status:"
        docker-compose ps
        ;;
    7)
        echo ""
        echo "Initializing database..."
        echo "Waiting for services to start..."
        docker-compose up -d
        sleep 10
        echo "Running setup script..."
        docker exec -it idurar-backend npm run setup
        echo "✅ Database initialized!"
        ;;
    8)
        echo ""
        echo "Creating database backup..."
        BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        docker exec idurar-mongodb mongodump --out /data/backup
        docker cp idurar-mongodb:/data/backup "$BACKUP_DIR"
        echo "✅ Backup created in $BACKUP_DIR"
        ;;
    9)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

