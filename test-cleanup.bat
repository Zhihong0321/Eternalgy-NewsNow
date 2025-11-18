@echo off
echo ========================================
echo Clean Up Test Environment
echo ========================================
echo.

echo Stopping containers...
docker compose -f docker-compose.local.test.yml down

echo.
echo Do you want to remove the database volume too?
echo This will delete all test data.
echo.
set /p cleanup="Remove database? (y/n): "

if /i "%cleanup%"=="y" (
    echo Removing volumes...
    docker compose -f docker-compose.local.test.yml down -v
    echo ✓ Everything cleaned up!
) else (
    echo Database volume kept. Containers stopped.
)

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
pause
