@echo off
echo ========================================
echo NewsNow Local Test with PostgreSQL
echo ========================================
echo.

echo Checking Docker Desktop...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✓ Docker is running
echo.

echo Starting PostgreSQL and NewsNow...
echo This will take a few minutes on first run (building image)
echo.
docker compose -f docker-compose.local.test.yml up --build

echo.
echo ========================================
echo Test stopped. To clean up, run:
echo docker compose -f docker-compose.local.test.yml down -v
echo ========================================
pause
