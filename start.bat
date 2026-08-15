@echo off
REM IDURAR ERP CRM - Docker Quick Start Script for Windows

echo ==========================================
echo   IDURAR ERP CRM - Docker Setup
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed
    echo Please install Docker Desktop from https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose is not installed
    echo Please install Docker Desktop which includes Docker Compose
    pause
    exit /b 1
)

echo Docker is installed
echo Docker Compose is installed
echo.

REM Check if .env file exists
if not exist .env (
    echo .env file not found
    echo Creating .env file from template...
    
    (
        echo # MongoDB Configuration
        echo MONGO_USERNAME=admin
        echo MONGO_PASSWORD=admin123
        echo MONGO_DATABASE=idurar
        echo.
        echo # Backend Configuration
        echo JWT_SECRET=your-jwt-secret-key-change-this-in-production
        echo COOKIE_SECRET=your-cookie-secret-key-change-this
        echo OPENAI_API_KEY=
        echo.
        echo # Frontend Configuration
        echo VITE_BACKEND_SERVER=http://localhost:8888/
    ) > .env
    
    echo Created .env file
    echo WARNING: Please update the secrets in .env file before production use!
    echo.
) else (
    echo .env file exists
    echo.
)

REM Ask user what to do
echo What would you like to do?
echo 1) Start application (docker-compose up)
echo 2) Start application in background (docker-compose up -d)
echo 3) Build and start application (docker-compose up --build)
echo 4) Stop application (docker-compose down)
echo 5) View logs (docker-compose logs -f)
echo 6) Check status (docker-compose ps)
echo 7) Initialize database (first time setup)
echo 8) Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto start_bg
if "%choice%"=="3" goto build
if "%choice%"=="4" goto stop
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto status
if "%choice%"=="7" goto setup
if "%choice%"=="8" goto end
echo Invalid choice
pause
exit /b 1

:start
echo.
echo Starting application...
docker-compose up
goto end

:start_bg
echo.
echo Starting application in background...
docker-compose up -d
echo.
echo Application started!
echo Frontend: http://localhost:80
echo Backend: http://localhost:8888
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
pause
goto end

:build
echo.
echo Building and starting application...
docker-compose up --build -d
echo.
echo Application built and started!
echo Frontend: http://localhost:80
echo Backend: http://localhost:8888
pause
goto end

:stop
echo.
echo Stopping application...
docker-compose down
echo Application stopped
pause
goto end

:logs
echo.
echo Viewing logs (Press Ctrl+C to exit)...
docker-compose logs -f
goto end

:status
echo.
echo Service status:
docker-compose ps
pause
goto end

:setup
echo.
echo Initializing database...
echo Waiting for services to start...
docker-compose up -d
timeout /t 10 /nobreak
echo Running setup script...
docker exec -it idurar-backend npm run setup
echo Database initialized!
pause
goto end

:end
echo.
echo Goodbye!

