@echo off
echo Starting Trust Calibration Layer Services...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker first.
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo .env file not found. Copying from .env.example...
    copy .env.example .env
    echo Please edit .env and add your OPENAI_API_KEY
    exit /b 1
)

REM Start services with Docker Compose
echo Starting Docker services...
docker-compose up -d

REM Wait for services
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Services are starting up!
echo.
echo Access the application:
echo   - Frontend: http://localhost:3000
echo   - Python API: http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo Stop services:
echo   docker-compose down
