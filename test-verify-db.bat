@echo off
echo ========================================
echo Verify Database Tables
echo ========================================
echo.

echo Connecting to PostgreSQL container...
echo.
echo Tables in database:
docker exec -it newsnow-postgres-test psql -U testuser -d testdb -c "\dt"

echo.
echo Checking newsnow tables specifically:
docker exec -it newsnow-postgres-test psql -U testuser -d testdb -c "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'newsnow%%' ORDER BY table_name;"

echo.
echo ========================================
echo If you see newsnow_cache and newsnow_user, 
echo the deployment is working correctly!
echo ========================================
pause
