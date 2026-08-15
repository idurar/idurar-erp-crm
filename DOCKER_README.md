# Docker & CI/CD Setup - Quick Reference

Complete Docker and Jenkins CI/CD setup for IDURAR ERP CRM.

## 📁 Files Created

### Docker Configuration
- `docker-compose.yml` - Main Docker Compose configuration
- `docker-compose.prod.yml` - Production overrides
- `backend/Dockerfile` - Backend container definition
- `frontend/Dockerfile` - Frontend container definition
- `.dockerignore` - Files to exclude from Docker context
- `backend/.dockerignore` - Backend specific exclusions
- `frontend/.dockerignore` - Frontend specific exclusions

### Nginx Configuration
- `nginx/nginx.conf` - Nginx reverse proxy configuration

### CI/CD
- `Jenkinsfile` - Jenkins pipeline definition

### Scripts
- `start.sh` - Quick start script for Linux/Mac
- `start.bat` - Quick start script for Windows

### Documentation
- `DOCKER_SETUP.md` - Detailed setup guide
- `ENV_VARIABLES.md` - Environment variables reference
- `DOCKER_README.md` - This file

## 🚀 Quick Start

### Option 1: Using Quick Start Script

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```cmd
start.bat
```

### Option 2: Manual Setup

1. **Create environment file:**
```bash
# Create .env file (see ENV_VARIABLES.md for details)
cp .env.example .env
# Edit .env with your configurations
```

2. **Start the application:**
```bash
docker-compose up -d
```

3. **Initialize database (first time only):**
```bash
docker exec -it idurar-backend npm run setup
```

4. **Access the application:**
- Frontend: http://localhost:80
- Backend API: http://localhost:8888/api
- MongoDB: localhost:27017

## 📋 Common Commands

### Service Management
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Check service status
docker-compose ps
```

### Building
```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend

# Build and start
docker-compose up -d --build
```

### Database Operations
```bash
# Access MongoDB shell
docker exec -it idurar-mongodb mongosh

# Backup database
docker exec idurar-mongodb mongodump --out /data/backup

# Access backend container
docker exec -it idurar-backend sh

# Run backend commands
docker exec idurar-backend npm run setup
docker exec idurar-backend npm run reset
```

## 🔧 Configuration

### Environment Variables

Key variables in `.env`:

```env
# MongoDB
MONGO_USERNAME=admin
MONGO_PASSWORD=your-secure-password
MONGO_DATABASE=idurar

# Backend
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
OPENAI_API_KEY=optional

# Frontend
VITE_BACKEND_SERVER=http://localhost:8888/
```

See `ENV_VARIABLES.md` for complete reference.

### Ports

- **80** - Frontend (Nginx)
- **8888** - Backend API
- **27017** - MongoDB

To change ports, edit `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Change 80 to your desired port
```

## 🏭 Production Deployment

### Using Production Compose File
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### With Nginx Reverse Proxy
```bash
# Update nginx/nginx.conf with your domain
# Add SSL certificates to nginx/ssl/
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔄 Jenkins CI/CD Setup

### Prerequisites
1. Jenkins server installed
2. Docker and Docker Compose on Jenkins server
3. Required Jenkins plugins:
   - Docker Pipeline
   - Git Plugin
   - Credentials Binding Plugin

### Setup Steps

1. **Add Jenkins Credentials:**
   - MongoDB credentials (username/password)
   - Docker registry credentials (if using private registry)
   - Secret text credentials for JWT_SECRET, COOKIE_SECRET

2. **Create Pipeline Job:**
   - New Item → Pipeline
   - Configure SCM (Git)
   - Script Path: `Jenkinsfile`

3. **Configure Webhook (optional):**
   - GitHub/GitLab webhook pointing to Jenkins
   - Automatic builds on push

4. **First Run:**
   - Build manually first time
   - Verify all credentials work
   - Check deployment

### Jenkins Pipeline Stages

1. **Checkout** - Clone repository
2. **Environment Setup** - Create .env file
3. **Build Backend** - Build backend Docker image
4. **Build Frontend** - Build frontend Docker image
5. **Test** - Run tests (parallel)
6. **Push to Registry** - Push images (main branch only)
7. **Deploy** - Deploy with docker-compose (main branch only)
8. **Health Check** - Verify deployment

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100

# Since specific time
docker-compose logs --since 2024-01-01T00:00:00
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Detailed disk usage
docker system df -v
```

### Health Checks
```bash
# Check if services are healthy
docker-compose ps

# Test backend API
curl http://localhost:8888/api/

# Test frontend
curl http://localhost:80/
```

## 🛠️ Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache
docker-compose up -d

# Check Docker daemon
docker info
```

### MongoDB connection issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify connection string
docker exec -it idurar-backend sh
echo $DATABASE

# Test MongoDB connection
docker exec -it idurar-mongodb mongosh -u admin -p
```

### Frontend can't connect to backend
```bash
# Check backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Verify VITE_BACKEND_SERVER
docker inspect idurar-frontend | grep VITE_BACKEND_SERVER

# Test backend from frontend container
docker exec -it idurar-frontend sh
wget -O- http://backend:8888/api/
```

### Port already in use
```bash
# Find process using port
# Linux/Mac:
lsof -i :80
lsof -i :8888

# Windows:
netstat -ano | findstr :80
netstat -ano | findstr :8888

# Change port in docker-compose.yml
```

### Disk space issues
```bash
# Clean up
docker system prune -a -f
docker volume prune -f

# Remove unused images
docker image prune -a

# Remove stopped containers
docker container prune
```

## 🔒 Security Checklist

- [ ] Changed default MongoDB password
- [ ] Generated strong JWT_SECRET (64+ characters)
- [ ] Generated strong COOKIE_SECRET (64+ characters)
- [ ] Configured HTTPS for production
- [ ] Restricted MongoDB port (only localhost)
- [ ] Set up regular database backups
- [ ] Configured firewall rules
- [ ] Enabled Docker logging
- [ ] Set up monitoring/alerting
- [ ] Reviewed Nginx security headers
- [ ] Disabled unnecessary ports
- [ ] Updated all dependencies

## 📖 Additional Resources

- [DOCKER_SETUP.md](DOCKER_SETUP.md) - Detailed setup guide
- [ENV_VARIABLES.md](ENV_VARIABLES.md) - Environment variables reference
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)

## 💡 Tips

1. **Use Docker volumes for persistence** - MongoDB data is stored in volumes
2. **Regular backups** - Automate MongoDB backups
3. **Monitor resources** - Use `docker stats` to monitor resource usage
4. **Update images** - Regularly pull and rebuild images
5. **Use .dockerignore** - Reduces build context size
6. **Multi-stage builds** - Frontend uses multi-stage for smaller images
7. **Health checks** - All services have health checks configured
8. **Networks** - Services communicate via internal network

## 🆘 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub issues
4. Contact: hello@idurarapp.com

---

**Version:** 1.0  
**Last Updated:** 2025-01-01  
**Maintained by:** IDURAR Team

