# 🚀 START HERE - Complete Startup Guide

Follow these steps **exactly** to get your IDURAR ERP CRM running!

---

## ✅ Step 1: Prerequisites Check

### 1.1 Install Docker Desktop

**Windows:**
1. Download: https://www.docker.com/products/docker-desktop
2. Install Docker Desktop
3. Restart your computer
4. Open Docker Desktop (it will start automatically)

**Mac:**
```bash
# Install via Homebrew:
brew install --cask docker
```

**Linux:**
```bash
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker:
sudo systemctl start docker
sudo systemctl enable docker
```

### 1.2 Verify Installation

Open PowerShell (Windows) or Terminal (Mac/Linux):

```bash
# Check Docker
docker --version
# Should show: Docker version 24.x.x

# Check Docker Compose
docker-compose --version
# Should show: Docker Compose version v2.x.x

# Test Docker is running
docker ps
# Should show empty list or running containers (no error)
```

✅ **If all commands work, proceed to Step 2!**

---

## 🛑 Step 2: Stop Your Local MongoDB

Since you have MongoDB running locally on port 27017, we need to stop it first.

### Windows (Choose one method):

**Method A - Via Services:**
```
1. Press Win + R
2. Type: services.msc
3. Press Enter
4. Find "MongoDB" or "MongoDB Server"
5. Right-click → Stop
```

**Method B - Via Command:**
```powershell
# Run PowerShell as Administrator
net stop MongoDB
```

### Mac:
```bash
# If installed via Homebrew:
brew services stop mongodb-community

# OR:
sudo killall mongod
```

### Linux:
```bash
sudo systemctl stop mongod
```

### ✅ Verify Port is Free:

**Windows:**
```powershell
netstat -ano | findstr :27017
# Should show nothing
```

**Mac/Linux:**
```bash
lsof -i :27017
# Should show nothing
```

---

## 📁 Step 3: Navigate to Project Directory

```bash
# Open PowerShell/Terminal and navigate to your project:
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Verify you're in the right place:
dir   # Windows
ls    # Mac/Linux

# You should see:
# - backend/
# - frontend/
# - docker-compose.yml
# - Jenkinsfile
```

---

## 🔑 Step 4: Create Environment File

### Option A - Quick Setup (Good for testing):

**Windows (PowerShell):**
```powershell
# Create .env file with default values
@"
MONGO_USERNAME=admin
MONGO_PASSWORD=admin123
MONGO_DATABASE=idurar
JWT_SECRET=your-jwt-secret-key-change-this-in-production-make-it-very-long
COOKIE_SECRET=your-cookie-secret-key-change-this-also-make-it-very-long
OPENAI_API_KEY=
VITE_BACKEND_SERVER=http://localhost:8888/
"@ | Out-File -FilePath .env -Encoding utf8
```

**Mac/Linux:**
```bash
cat > .env << 'EOF'
MONGO_USERNAME=admin
MONGO_PASSWORD=admin123
MONGO_DATABASE=idurar
JWT_SECRET=your-jwt-secret-key-change-this-in-production-make-it-very-long
COOKIE_SECRET=your-cookie-secret-key-change-this-also-make-it-very-long
OPENAI_API_KEY=
VITE_BACKEND_SERVER=http://localhost:8888/
EOF
```

### Option B - Secure Setup (Recommended):

Use the quick start script that generates random secrets:

**Windows:**
```cmd
start.bat
# Choose option 2 if prompted about .env creation
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
# Choose option 2 if prompted about .env creation
```

### ✅ Verify .env was created:

```bash
# Windows:
type .env

# Mac/Linux:
cat .env
```

You should see your environment variables!

---

## 🐳 Step 5: Start Docker Containers

Now the exciting part! Let's start everything.

### 5.1 Pull Images (First Time - This Takes Time!)

```bash
# This downloads all the required images
docker-compose pull

# You'll see:
# [+] Pulling mongo (7.0)...
# [+] Pulling nginx (alpine)...
# This can take 5-10 minutes depending on your internet speed
```

### 5.2 Build Custom Images

```bash
# Build backend and frontend images
docker-compose build

# You'll see lots of output:
# - Installing npm packages
# - Building React app
# - Creating Docker images
# This takes 5-10 minutes first time
```

### 5.3 Start All Services

```bash
# Start in detached mode (runs in background)
docker-compose up -d

# You'll see:
# [+] Creating network "idurar-erp-crm_idurar-network"
# [+] Creating volume "idurar-erp-crm_mongodb_data"
# [+] Creating container idurar-mongodb
# [+] Creating container idurar-backend
# [+] Creating container idurar-frontend
```

### 5.4 Wait for Services to Start

```bash
# Watch the logs until everything is ready
docker-compose logs -f

# Look for these messages:
# mongodb  | Waiting for connections on port 27017
# backend  | Express running → On PORT : 8888
# frontend | Nginx started

# Press Ctrl+C to stop watching logs (containers keep running)
```

---

## 🎬 Step 6: Initialize Database (First Time Only)

```bash
# Wait 30 seconds for MongoDB to be fully ready
timeout /t 30    # Windows
sleep 30         # Mac/Linux

# Run the setup script
docker exec -it idurar-backend npm run setup
```

**You'll be prompted to enter:**
```
Enter admin name: Admin User
Enter admin email: admin@demo.com
Enter admin password: admin123
Enter country: US
```

This creates:
- ✅ Database collections
- ✅ Admin user account
- ✅ Default settings
- ✅ Sample data

---

## 🌐 Step 7: Access Your Application

### 7.1 Open in Browser:

**Frontend (Main App):**
```
http://localhost
```
or
```
http://localhost:80
```

**Backend API (Test):**
```
http://localhost:8888/api
```

You should see API response!

### 7.2 Login to Application:

```
Email: admin@demo.com
Password: admin123
```

(Or whatever you entered during setup)

---

## 🗄️ Step 8: Connect MongoDB Compass

Now you can view your database in MongoDB Compass!

### Connection String:
```
mongodb://admin:admin123@localhost:27017/idurar?authSource=admin
```

### Step-by-step in Compass:
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste the connection string above
4. Click "Connect"
5. You should see the `idurar` database!

---

## ✅ Step 9: Verify Everything is Working

### 9.1 Check Container Status:
```bash
docker-compose ps
```

**Expected Output:**
```
NAME                STATUS          PORTS
idurar-mongodb      Up (healthy)    0.0.0.0:27017->27017/tcp
idurar-backend      Up (healthy)    0.0.0.0:8888->8888/tcp
idurar-frontend     Up (healthy)    0.0.0.0:80->80/tcp
```

All should show "Up (healthy)"! ✅

### 9.2 Check Logs (if needed):
```bash
# All services:
docker-compose logs

# Specific service:
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs in real-time:
docker-compose logs -f backend
```

### 9.3 Test Backend API:
```bash
# Windows (PowerShell):
Invoke-WebRequest http://localhost:8888/api

# Mac/Linux:
curl http://localhost:8888/api
```

Should return JSON response! ✅

---

## 🎯 Summary: What You Now Have Running

```
┌─────────────────────────────────────────────────┐
│  Your Computer                                  │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │  Docker Containers                    │    │
│  │                                        │    │
│  │  📱 Frontend (http://localhost)       │    │
│  │     └─ React App with Nginx           │    │
│  │                                        │    │
│  │  🔧 Backend (http://localhost:8888)   │    │
│  │     └─ Node.js API Server             │    │
│  │                                        │    │
│  │  🗄️  MongoDB (localhost:27017)        │    │
│  │     └─ Database: idurar               │    │
│  │                                        │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  📊 MongoDB Compass (Connected)                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎮 Common Commands You'll Use

### Daily Usage:

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# Restart everything
docker-compose restart

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### When You Change Code:

```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

### Database Operations:

```bash
# Access backend container
docker exec -it idurar-backend sh

# Access MongoDB shell
docker exec -it idurar-mongodb mongosh -u admin -p admin123

# Reset database
docker exec -it idurar-backend npm run reset
docker exec -it idurar-backend npm run setup
```

---

## 🔧 Troubleshooting

### Problem: Port 27017 already in use

**Solution:**
```bash
# Windows:
net stop MongoDB

# Mac:
brew services stop mongodb-community

# Verify:
netstat -ano | findstr :27017  # Windows
lsof -i :27017                  # Mac/Linux
```

### Problem: Port 80 already in use (Windows)

**Solution:**
```bash
# Stop IIS or other web server using port 80
net stop w3svc

# OR edit docker-compose.yml to use different port:
services:
  frontend:
    ports:
      - "3000:80"  # Change 80 to 3000

# Then access at http://localhost:3000
```

### Problem: Container won't start

**Solution:**
```bash
# Check logs:
docker-compose logs [service_name]

# Rebuild from scratch:
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problem: "Cannot connect to Docker daemon"

**Solution:**
- Make sure Docker Desktop is running
- Windows: Check system tray for Docker icon
- Restart Docker Desktop

### Problem: Backend can't connect to MongoDB

**Solution:**
```bash
# Check .env file has correct values
type .env  # Windows
cat .env   # Mac/Linux

# Verify MongoDB is healthy:
docker-compose ps mongodb

# Check backend logs:
docker-compose logs backend
```

---

## 📖 Next Steps

1. ✅ **Register New User**: http://localhost/register
2. ✅ **Explore the App**: Create clients, invoices, quotes
3. ✅ **Read Documentation**: See DOCKER_SETUP.md for advanced topics
4. ✅ **Set up Jenkins**: Follow Jenkinsfile documentation for CI/CD

---

## 🆘 Need Help?

If something isn't working:

1. **Check logs**: `docker-compose logs -f`
2. **Check status**: `docker-compose ps`
3. **Restart**: `docker-compose restart`
4. **Rebuild**: `docker-compose up -d --build`
5. **Start fresh**: 
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   docker exec -it idurar-backend npm run setup
   ```

---

## 🎉 Success!

If you can:
- ✅ See the login page at http://localhost
- ✅ Login with your credentials
- ✅ Connect MongoDB Compass
- ✅ See all containers as "healthy"

**You're all set! Your IDURAR ERP CRM is running!** 🚀

---

**Quick Reference Card:**

```
Start:        docker-compose up -d
Stop:         docker-compose down
Logs:         docker-compose logs -f
Status:       docker-compose ps
Restart:      docker-compose restart
Rebuild:      docker-compose up -d --build
Frontend:     http://localhost
Backend:      http://localhost:8888/api
MongoDB:      mongodb://admin:admin123@localhost:27017/idurar?authSource=admin
```

