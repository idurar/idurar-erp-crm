# Environment Variables Guide

This document lists all environment variables used in the IDURAR ERP CRM application.

## Overview

Environment variables are configured in the `.env` file in the root directory. Copy `.env.example` to `.env` and update the values according to your setup.

## MongoDB Configuration

### MONGO_USERNAME
- **Description**: MongoDB root username
- **Default**: `admin`
- **Required**: Yes
- **Example**: `admin`

### MONGO_PASSWORD
- **Description**: MongoDB root password
- **Default**: `admin123`
- **Required**: Yes
- **Security**: Use a strong password in production
- **Example**: `your-strong-password-here`

### MONGO_DATABASE
- **Description**: MongoDB database name
- **Default**: `idurar`
- **Required**: Yes
- **Example**: `idurar`

## Backend Configuration

### DATABASE
- **Description**: Full MongoDB connection string
- **Format**: `mongodb://username:password@host:port/database?authSource=admin`
- **Required**: Yes
- **Example**: `mongodb://admin:admin123@mongodb:27017/idurar?authSource=admin`
- **Note**: In Docker Compose, use the service name (mongodb) as the host

### PORT
- **Description**: Backend server port
- **Default**: `8888`
- **Required**: No
- **Example**: `8888`

### NODE_ENV
- **Description**: Node.js environment
- **Options**: `development`, `production`, `test`
- **Default**: `development`
- **Required**: No
- **Example**: `production`

### JWT_SECRET
- **Description**: Secret key for JWT token generation
- **Required**: Yes
- **Security**: Must be a long, random, and secure string
- **Generation**: Use `openssl rand -base64 64`
- **Example**: `your-jwt-secret-key-change-this-in-production`

### COOKIE_SECRET
- **Description**: Secret key for cookie encryption
- **Required**: Yes
- **Security**: Must be a long, random, and secure string
- **Generation**: Use `openssl rand -base64 64`
- **Example**: `your-cookie-secret-key-change-this`

### OPENAI_API_KEY
- **Description**: OpenAI API key for AI features
- **Required**: No (optional feature)
- **Example**: `sk-...`
- **Note**: Leave empty if not using OpenAI features

## Frontend Configuration

### VITE_BACKEND_SERVER
- **Description**: Backend API server URL
- **Required**: Yes
- **Format**: Must end with a forward slash `/`
- **Development**: `http://localhost:8888/`
- **Production**: `https://your-domain.com/` or `http://your-server-ip:8888/`
- **Docker**: `http://backend:8888/` (using service name)
- **Example**: `http://localhost:8888/`

### VITE_DEV_REMOTE
- **Description**: Flag to use remote backend in development
- **Required**: No
- **Options**: `remote` or leave empty
- **Example**: `remote`

### VITE_FILE_BASE_URL
- **Description**: Base URL for file uploads/downloads
- **Required**: No
- **Example**: `http://localhost:8888/uploads/`

## Email Configuration (Optional)

### EMAIL_HOST
- **Description**: SMTP server host
- **Required**: No (if email features are used)
- **Example**: `smtp.gmail.com`

### EMAIL_PORT
- **Description**: SMTP server port
- **Default**: `587` (TLS) or `465` (SSL)
- **Required**: No
- **Example**: `587`

### EMAIL_USER
- **Description**: SMTP authentication username
- **Required**: No
- **Example**: `your-email@gmail.com`

### EMAIL_PASSWORD
- **Description**: SMTP authentication password
- **Required**: No
- **Security**: Use app-specific passwords for Gmail
- **Example**: `your-app-password`

### EMAIL_FROM
- **Description**: Default sender email address
- **Required**: No
- **Example**: `noreply@yourdomain.com`

## AWS S3 Configuration (Optional)

### AWS_ACCESS_KEY_ID
- **Description**: AWS access key for S3
- **Required**: No (if using S3 for file storage)
- **Example**: `AKIAIOSFODNN7EXAMPLE`

### AWS_SECRET_ACCESS_KEY
- **Description**: AWS secret key for S3
- **Required**: No
- **Security**: Keep this secret
- **Example**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

### AWS_REGION
- **Description**: AWS region for S3 bucket
- **Required**: No
- **Example**: `us-east-1`

### AWS_BUCKET_NAME
- **Description**: S3 bucket name
- **Required**: No
- **Example**: `your-bucket-name`

## Docker Compose Specific Variables

### COMPOSE_PROJECT_NAME
- **Description**: Docker Compose project name
- **Default**: Directory name
- **Required**: No
- **Example**: `idurar-erp-crm`

## Generating Secure Secrets

### Using OpenSSL (Linux/Mac)

```bash
# Generate JWT secret
openssl rand -base64 64

# Generate Cookie secret
openssl rand -base64 64

# Generate MongoDB password
openssl rand -base64 32
```

### Using PowerShell (Windows)

```powershell
# Generate random secret
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Using Node.js

```javascript
// Generate random secret
require('crypto').randomBytes(64).toString('base64')
```

## Environment Files Structure

### Development (.env)
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=dev_password
MONGO_DATABASE=idurar_dev
JWT_SECRET=dev-jwt-secret
COOKIE_SECRET=dev-cookie-secret
VITE_BACKEND_SERVER=http://localhost:8888/
```

### Production (.env.production)
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=<strong-random-password>
MONGO_DATABASE=idurar
JWT_SECRET=<strong-random-jwt-secret>
COOKIE_SECRET=<strong-random-cookie-secret>
VITE_BACKEND_SERVER=https://api.yourdomain.com/
```

## Security Best Practices

1. **Never commit `.env` files to version control**
   - Add `.env` to `.gitignore`
   - Use `.env.example` as a template

2. **Use strong, random secrets in production**
   - Minimum 32 characters for passwords
   - Minimum 64 characters for JWT and Cookie secrets

3. **Rotate secrets regularly**
   - Change passwords every 90 days
   - Update JWT secrets if compromised

4. **Limit access to environment variables**
   - Use Docker secrets in production
   - Use environment variable management tools

5. **Use different values for different environments**
   - Development, staging, and production should have different secrets

## Troubleshooting

### Backend can't connect to MongoDB
- Check `DATABASE` connection string
- Verify MongoDB container is running
- Ensure MongoDB credentials are correct

### Frontend can't reach backend
- Verify `VITE_BACKEND_SERVER` URL
- Check backend is running and accessible
- Ensure CORS is configured correctly

### JWT authentication errors
- Verify `JWT_SECRET` is set
- Ensure same JWT_SECRET on all backend instances
- Check JWT token expiration settings

## References

- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Node.js Environment Variables](https://nodejs.org/api/process.html#process_process_env)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

