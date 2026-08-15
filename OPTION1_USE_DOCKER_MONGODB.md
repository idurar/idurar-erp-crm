# Option 1: Use Docker MongoDB (Separate from Local)

This option runs MongoDB inside Docker, separate from your local MongoDB.

## Step 1: Stop Your Local MongoDB

### Windows:
```powershell
# Open Services (Win + R, type: services.msc)
# Find "MongoDB" service
# Right-click → Stop

# OR via Command Prompt (as Administrator):
net stop MongoDB
```

### Linux/Mac:
```bash
# If installed via brew:
brew services stop mongodb-community

# OR:
sudo systemctl stop mongod

# OR find and kill the process:
ps aux | grep mongod
kill <process_id>
```

## Step 2: Verify Port 27017 is Free

```bash
# Windows (PowerShell):
netstat -ano | findstr :27017

# Linux/Mac:
lsof -i :27017

# If nothing shows up, port is free! ✅
```

## Step 3: Start Docker Containers

```bash
# Make sure you're in the project root directory
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

## Step 4: Connect MongoDB Compass to Docker MongoDB

Now you have TWO options for MongoDB Compass:

### Connection String 1: Access via Docker Port
```
mongodb://admin:admin123@localhost:27017/idurar?authSource=admin
```

**Details:**
- Host: `localhost`
- Port: `27017`
- Username: `admin` (from your .env file)
- Password: `admin123` (from your .env file)
- Auth Database: `admin`
- Database: `idurar`

### Connection String 2: Direct to Container
```bash
# First, get container IP:
docker inspect idurar-mongodb | grep IPAddress

# Then use in Compass:
mongodb://admin:admin123@172.20.0.2:27017/idurar?authSource=admin
```

## Step 5: Initialize the Database

```bash
# Wait for services to start (30 seconds)
timeout /t 30

# Run setup to create initial data
docker exec -it idurar-backend npm run setup
```

This creates:
- Admin user (email: admin@admin.com, password: admin123)
- Default settings
- Initial collections

## Step 6: Access the Application

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8888/api
- **MongoDB**: localhost:27017

## Managing Both MongoDB Instances

If you want to keep BOTH databases:

### Use Your Old Database (ERP-CRM):
1. Stop Docker: `docker-compose down`
2. Start local MongoDB
3. Connect Compass: `mongodb://localhost:27017/ERP-CRM`

### Use Docker Database (idurar):
1. Stop local MongoDB
2. Start Docker: `docker-compose up -d`
3. Connect Compass: `mongodb://admin:admin123@localhost:27017/idurar?authSource=admin`

## Migrating Your Old Data to Docker (Optional)

If you want to move your ERP-CRM data to Docker:

```bash
# 1. Export from local MongoDB
mongodump --db ERP-CRM --out ./backup

# 2. Start Docker MongoDB
docker-compose up -d mongodb

# 3. Copy backup into container
docker cp ./backup idurar-mongodb:/data/backup

# 4. Import into Docker MongoDB
docker exec idurar-mongodb mongorestore --db idurar /data/backup/ERP-CRM
```

## Troubleshooting

### Error: "Address already in use"
- Your local MongoDB is still running
- Stop it completely and try again

### MongoDB Compass won't connect
```bash
# Check container is running:
docker ps | grep mongo

# Check logs:
docker logs idurar-mongodb

# Verify username/password in .env file
```

### Can't access backend
```bash
# Check backend logs:
docker logs idurar-backend

# Common issue: Wrong DATABASE connection string
# Should be: mongodb://admin:password@mongodb:27017/idurar?authSource=admin
# Note: Uses "mongodb" (service name), not "localhost"
```

