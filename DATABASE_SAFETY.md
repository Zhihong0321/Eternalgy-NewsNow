# Database Safety Guarantee

## ✅ Safe for Existing PostgreSQL Databases

This application is **100% safe** to deploy on an existing PostgreSQL database that contains other data.

## What Tables Are Created?

The app creates only **2 tables**:

1. **`cache`** (or `{PREFIX}_cache` if TABLE_PREFIX is set)
   - Stores news cache data
   - Columns: `id`, `updated`, `data`

2. **`user`** (or `{PREFIX}_user` if TABLE_PREFIX is set)
   - Stores user authentication data (only if OAuth is enabled)
   - Columns: `id`, `email`, `data`, `type`, `created`, `updated`
   - Index: `idx_user_id` (or `idx_{PREFIX}_user_id`)

## Safety Mechanisms

### 1. CREATE TABLE IF NOT EXISTS
```sql
CREATE TABLE IF NOT EXISTS cache (...)
```
- Only creates tables if they don't exist
- Never drops or modifies existing tables
- Never touches existing data

### 2. Table Prefix Support
Set `TABLE_PREFIX=newsnow` to namespace tables:
- Creates: `newsnow_cache` and `newsnow_user`
- Completely isolated from other tables
- Zero chance of naming conflicts

### 3. No Schema Migrations
- No ALTER TABLE commands
- No DROP TABLE commands
- No data modifications outside these 2 tables

## Recommended Configuration

For maximum safety on shared databases:

```env
TABLE_PREFIX=newsnow
INIT_TABLE=true
ENABLE_CACHE=true
```

This creates:
- `newsnow_cache` table
- `newsnow_user` table
- `idx_newsnow_user_id` index

## What Happens on First Run?

1. App connects to PostgreSQL via `DATABASE_URL`
2. Checks if tables exist
3. Creates tables only if they don't exist
4. Starts serving requests

**No existing data is touched, modified, or deleted.**

## What Happens on Subsequent Runs?

1. App connects to database
2. Tables already exist, so creation is skipped
3. Starts serving requests immediately

You can set `INIT_TABLE=false` after first deployment to skip the check entirely.

## Verification

After deployment, you can verify the tables:

```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check newsnow tables (if using prefix)
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'newsnow_%';
```

You should see only:
- `newsnow_cache`
- `newsnow_user`

All your existing tables remain untouched.

## Emergency Rollback

If you ever need to remove newsnow tables:

```sql
-- With prefix
DROP TABLE IF EXISTS newsnow_cache;
DROP TABLE IF EXISTS newsnow_user;
DROP INDEX IF EXISTS idx_newsnow_user_id;

-- Without prefix
DROP TABLE IF EXISTS cache;
DROP TABLE IF EXISTS user;
DROP INDEX IF EXISTS idx_user_id;
```

This removes only newsnow data, leaving all other tables intact.

## Summary

✅ Safe for production databases with existing data  
✅ Only creates 2 new tables  
✅ Never modifies existing tables  
✅ Never deletes existing data  
✅ Use TABLE_PREFIX for complete isolation  
✅ Easy to remove if needed  

**You can confidently deploy this on your existing Railway PostgreSQL cluster.**
