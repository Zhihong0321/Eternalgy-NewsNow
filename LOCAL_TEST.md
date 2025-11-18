# Local Testing Guide with Docker

Test your newsnow deployment locally before pushing to GitHub and Railway.

## Prerequisites

✅ Docker Desktop is running on your PC

## Quick Test (5 minutes)

### 1. Build and Run with PostgreSQL

```bash
cd newsnow
docker compose -f docker-compose.local.test.yml up --build
```

This will:
- Start a PostgreSQL container (simulating Railway's PostgreSQL)
- Build your newsnow app
- Connect to PostgreSQL with `TABLE_PREFIX=newsnow`
- Create tables: `newsnow_cache` and `newsnow_user`

### 2. Watch the Logs

Look for these success messages:
```
✓ init newsnow_cache table
✓ init newsnow_user table
```

### 3. Test the App

Open browser: http://localhost:4444

You should see the news aggregator working!

### 4. Verify Database Tables

Check what tables were created:

```bash
# Connect to PostgreSQL container
docker exec -it newsnow-postgres-test psql -U testuser -d testdb

# List all tables
\dt

# You should see:
# newsnow_cache
# newsnow_user

# Exit
\q
```

### 5. Stop and Clean Up

```bash
# Stop containers
docker compose -f docker-compose.local.test.yml down

# Remove volumes (optional - cleans database)
docker compose -f docker-compose.local.test.yml down -v
```

## Test Scenarios

### Test 1: Fresh Database (First Deploy)
```bash
docker compose -f docker-compose.local.test.yml up --build
```
- Should create tables successfully
- App should start and serve news

### Test 2: Existing Tables (Subsequent Deploy)
```bash
# Run again without removing volumes
docker compose -f docker-compose.local.test.yml down
docker compose -f docker-compose.local.test.yml up
```
- Should skip table creation (tables already exist)
- App should start faster
- No errors about existing tables

### Test 3: Verify Table Isolation
```bash
# Connect to database
docker exec -it newsnow-postgres-test psql -U testuser -d testdb

# Create a fake "existing" table
CREATE TABLE existing_data (id SERIAL PRIMARY KEY, name TEXT);
INSERT INTO existing_data (name) VALUES ('important data');

# Exit and restart newsnow
\q
docker compose -f docker-compose.local.test.yml restart newsnow

# Verify existing table is untouched
docker exec -it newsnow-postgres-test psql -U testuser -d testdb
SELECT * FROM existing_data;
# Should still show: important data
```

## Common Issues

### Port 5432 already in use
If you have PostgreSQL running locally:
```bash
# Stop local PostgreSQL or change port in docker-compose.local.test.yml
# Change: '5433:5432' instead of '5432:5432'
```

### Port 4444 already in use
```bash
# Change in docker-compose.local.test.yml
# Change: '4445:4444' instead of '4444:4444'
# Then access: http://localhost:4445
```

### Build fails
```bash
# Check Docker Desktop is running
# Check you're in the newsnow directory
# Try: docker compose -f docker-compose.local.test.yml build --no-cache
```

### Database connection fails
```bash
# Check PostgreSQL is healthy
docker compose -f docker-compose.local.test.yml ps

# Check logs
docker compose -f docker-compose.local.test.yml logs postgres
docker compose -f docker-compose.local.test.yml logs newsnow
```

## What This Tests

✅ PostgreSQL connection works  
✅ Tables are created with prefix  
✅ Existing data is safe  
✅ App builds successfully  
✅ App runs in production mode  
✅ Caching works  
✅ No OAuth errors (since it's disabled)  

## After Successful Test

Once everything works locally:
1. Commit to your GitHub
2. Link to Railway
3. Set same environment variables
4. Deploy with confidence!

## Environment Variables Used in Test

```
DATABASE_URL=postgresql://testuser:testpass@postgres:5432/testdb
NODE_ENV=production
INIT_TABLE=true
ENABLE_CACHE=true
TABLE_PREFIX=newsnow
```

These match what you'll use on Railway (except DATABASE_URL will be auto-set by Railway).
