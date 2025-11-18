# Local Test Checklist

Before pushing to GitHub and deploying to Railway, verify everything works locally.

## Pre-Test Setup

- [ ] Docker Desktop is running
- [ ] You're in the `newsnow` directory
- [ ] No other services using port 4444 or 5432

## Test 1: Initial Build and Deploy

### Run Test
```bash
# Windows
test-local.bat

# Or manually
docker compose -f docker-compose.local.test.yml up --build
```

### Expected Results
- [ ] PostgreSQL container starts (newsnow-postgres-test)
- [ ] App builds successfully (may take 3-5 minutes first time)
- [ ] App container starts (newsnow-app-test)
- [ ] Logs show: `✓ init newsnow_cache table`
- [ ] Logs show: `✓ init newsnow_user table`
- [ ] No error messages in logs
- [ ] App is accessible at http://localhost:4444
- [ ] News items are displayed

### Verify Database
```bash
# Windows
test-verify-db.bat

# Or manually
docker exec -it newsnow-postgres-test psql -U testuser -d testdb -c "\dt"
```

### Expected Database State
- [ ] Table `newsnow_cache` exists
- [ ] Table `newsnow_user` exists
- [ ] No other tables affected

## Test 2: Restart (Simulating Redeploy)

### Stop and Restart
```bash
# Stop (keep database)
docker compose -f docker-compose.local.test.yml down

# Start again
docker compose -f docker-compose.local.test.yml up
```

### Expected Results
- [ ] Starts faster (no build needed)
- [ ] No "table already exists" errors
- [ ] App works immediately
- [ ] Previous cache data still exists (if any)

## Test 3: Database Safety

### Create Fake Existing Data
```bash
docker exec -it newsnow-postgres-test psql -U testuser -d testdb
```

In PostgreSQL shell:
```sql
CREATE TABLE existing_important_data (
    id SERIAL PRIMARY KEY,
    name TEXT,
    value TEXT
);

INSERT INTO existing_important_data (name, value) 
VALUES ('test', 'do not delete');

SELECT * FROM existing_important_data;
\q
```

### Restart App
```bash
docker compose -f docker-compose.local.test.yml restart newsnow
```

### Verify Existing Data Untouched
```bash
docker exec -it newsnow-postgres-test psql -U testuser -d testdb -c "SELECT * FROM existing_important_data;"
```

### Expected Results
- [ ] `existing_important_data` table still exists
- [ ] Data is intact: `test | do not delete`
- [ ] App still works
- [ ] Only `newsnow_cache` and `newsnow_user` tables exist from app

## Test 4: Cache Functionality

### Test Cache
1. [ ] Open http://localhost:4444
2. [ ] Note the news items and timestamps
3. [ ] Refresh page multiple times
4. [ ] News should load instantly (from cache)
5. [ ] Check logs for: `✓ get ... cache`

### Verify Cache in Database
```bash
docker exec -it newsnow-postgres-test psql -U testuser -d testdb -c "SELECT id, updated FROM newsnow_cache LIMIT 5;"
```

### Expected Results
- [ ] Cache entries exist in database
- [ ] Timestamps are recent
- [ ] Multiple page refreshes use cache (fast loading)

## Test 5: Environment Variables

### Check Current Config
```bash
docker compose -f docker-compose.local.test.yml config
```

### Verify
- [ ] `DATABASE_URL` is set correctly
- [ ] `TABLE_PREFIX=newsnow`
- [ ] `ENABLE_CACHE=true`
- [ ] `INIT_TABLE=true`
- [ ] `NODE_ENV=production`

## Test 6: Logs Review

### Check Logs
```bash
# All logs
docker compose -f docker-compose.local.test.yml logs

# Just app logs
docker compose -f docker-compose.local.test.yml logs newsnow

# Follow logs
docker compose -f docker-compose.local.test.yml logs -f newsnow
```

### Expected - No Errors For:
- [ ] Database connection
- [ ] Table creation
- [ ] OAuth (should be skipped/disabled)
- [ ] Cache operations
- [ ] News fetching

## Cleanup After Testing

```bash
# Windows
test-cleanup.bat

# Or manually
docker compose -f docker-compose.local.test.yml down -v
```

## If All Tests Pass ✅

You're ready to:
1. Commit to GitHub
2. Link to Railway
3. Deploy with confidence!

## If Tests Fail ❌

Check:
- Docker Desktop is running
- Ports 4444 and 5432 are available
- Review logs: `docker compose -f docker-compose.local.test.yml logs`
- Check build errors
- Verify PostgreSQL is healthy: `docker compose -f docker-compose.local.test.yml ps`

## Quick Commands Reference

```bash
# Start test
docker compose -f docker-compose.local.test.yml up --build

# Stop (keep data)
docker compose -f docker-compose.local.test.yml down

# Stop and remove data
docker compose -f docker-compose.local.test.yml down -v

# View logs
docker compose -f docker-compose.local.test.yml logs -f

# Check status
docker compose -f docker-compose.local.test.yml ps

# Rebuild
docker compose -f docker-compose.local.test.yml build --no-cache

# Connect to database
docker exec -it newsnow-postgres-test psql -U testuser -d testdb
```

---

**Once all tests pass, your Railway deployment will work smoothly!**
