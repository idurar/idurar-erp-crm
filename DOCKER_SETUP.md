# Docker Setup Guide for IDURAR ERP CRM

This guide will help you set up and run the IDURAR ERP CRM application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

## Project Structure

```
idurar-erp-crm/
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
├── Jenkinsfile
└── DOCKER_SETUP.md
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/idurar/idurar-erp-crm.git
cd idurar-erp-crm
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your configurations
nano .env  # or use your preferred editor
```

**Important:** Update the following values in `.env`:
- `MONGO_PASSWORD`: Use a strong password
- `JWT_SECRET`: Generate a secure random string
- `COOKIE_SECRET`: Generate a secure random string

### 3. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access the Application

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8888/api
- **MongoDB**: localhost:27017

### 5. Initialize the Database (First Time Only)

```bash
# Access the backend container
docker exec -it idurar-backend sh

# Run the setup script
npm run setup

# Exit the container
exit
```

## Docker Commands Reference

### Managing Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

### Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build without cache
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build
```

### Database Management

```bash
# Access MongoDB container
docker exec -it idurar-mongodb mongosh

# Backup MongoDB data
docker exec idurar-mongodb mongodump --out /data/backup

# Restore MongoDB data
docker exec idurar-mongodb mongorestore /data/backup

# View MongoDB logs
docker-compose logs mongodb
```

### Maintenance

```bash
# Remove stopped containers
docker-compose down

# Remove containers and volumes (⚠️ This will delete all data!)
docker-compose down -v

# Remove unused images
docker image prune -a

# View disk usage
docker system df
```

## Jenkins CI/CD Setup

### 1. Install Jenkins Plugins

Install the following plugins in Jenkins:
- Docker Pipeline
- Git Plugin
- Credentials Binding Plugin

### 2. Configure Jenkins Credentials

Add the following credentials in Jenkins:

1. **MongoDB Credentials**
   - ID: `mongo-credentials`
   - Type: Username with password
   - Username: Your MongoDB username
   - Password: Your MongoDB password

2. **Docker Registry Credentials** (if using private registry)
   - ID: `docker-registry-credentials`
   - Type: Username with password
   - Username: Your Docker registry username
   - Password: Your Docker registry password

3. **Environment Variables**
   Add these as secret text credentials:
   - `JWT_SECRET`
   - `COOKIE_SECRET`
   - `VITE_BACKEND_SERVER`

### 3. Create Jenkins Pipeline

1. Create a new Pipeline job in Jenkins
2. Configure the pipeline to use SCM (Git)
3. Point to your repository
4. Set the script path to `Jenkinsfile`
5. Save and run the pipeline

### 4. Webhook Configuration (Optional)

Set up a webhook in your Git repository to trigger Jenkins builds automatically:

1. Go to your repository settings
2. Add webhook: `http://your-jenkins-url/github-webhook/` (for GitHub)
3. Select "Just the push event"
4. Set content type to `application/json`

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE` | MongoDB connection string | - | Yes |
| `PORT` | Backend server port | 8888 | No |
| `NODE_ENV` | Node environment | development | No |
| `JWT_SECRET` | JWT token secret | - | Yes |
| `COOKIE_SECRET` | Cookie secret | - | Yes |
| `OPENAI_API_KEY` | OpenAI API key | - | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_BACKEND_SERVER` | Backend API URL | http://localhost:8888/ | Yes |

## Production Deployment

### Security Recommendations

1. **Change Default Passwords**: Update all default passwords in `.env`
2. **Use Strong Secrets**: Generate cryptographically secure random strings for JWT and Cookie secrets
3. **Enable HTTPS**: Use a reverse proxy (Nginx/Traefik) with SSL/TLS certificates
4. **Restrict MongoDB Access**: Don't expose MongoDB port (27017) publicly
5. **Use Docker Secrets**: For sensitive data in production
6. **Regular Backups**: Set up automated MongoDB backups
7. **Monitor Logs**: Implement log aggregation and monitoring

### Production Docker Compose

For production, consider using `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Scaling

To scale services horizontally:

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Use a load balancer (Nginx, HAProxy, Traefik)
# Add load balancer configuration
```

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild images
docker-compose up -d --build
```

### MongoDB connection issues

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify MongoDB is healthy
docker-compose ps

# Test connection
docker exec -it idurar-backend sh
nc -zv mongodb 27017
```

### Frontend can't connect to backend

1. Check backend is running: `docker-compose ps`
2. Verify backend URL in frontend container
3. Check network connectivity: `docker network ls`
4. Review CORS settings in backend

### Disk space issues

```bash
# Check disk usage
docker system df

# Clean up
docker system prune -a -f
docker volume prune -f
```

## Volumes

The following volumes are created for data persistence:

- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration
- `backend/src/public/uploads`: Uploaded files (mounted as bind mount)

## Networking

All services communicate through the `idurar-network` bridge network:

- **Frontend** → **Backend**: Internal network
- **Backend** → **MongoDB**: Internal network
- **External** → **Frontend**: Port 80
- **External** → **Backend**: Port 8888

## Support

For issues and questions:
- GitHub Issues: https://github.com/idurar/idurar-erp-crm/issues
- Email: hello@idurarapp.com

## License

This project is licensed under the Fair-code License.

