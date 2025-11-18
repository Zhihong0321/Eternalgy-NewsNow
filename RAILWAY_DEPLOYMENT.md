# Railway Deployment Guide

## Prerequisites
- Railway account
- This repository pushed to GitHub

## Step 1: Create New Project in Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your newsnow repository

## Step 2: Connect to Existing PostgreSQL Database

**IMPORTANT: This app is safe for existing databases!**

The app uses `CREATE TABLE IF NOT EXISTS` which means:
- ✅ Won't drop or modify existing tables
- ✅ Won't delete any existing data
- ✅ Only creates 2 new tables: `cache` and `user` (or with prefix if set)

### Option A: Use Existing PostgreSQL in Railway Cluster
1. Your existing PostgreSQL already has a `DATABASE_URL`
2. Simply reference it in your newsnow service
3. Optionally set `TABLE_PREFIX=newsnow` to namespace the tables

### Option B: Create New PostgreSQL (if preferred)
1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a `DATABASE_URL` environment variable

## Step 3: Configure Environment Variables

In Railway project settings, add these environment variables:

```
NODE_ENV=production
HOST=0.0.0.0
PORT=4444
INIT_TABLE=true
ENABLE_CACHE=true
TABLE_PREFIX=newsnow
```

**About TABLE_PREFIX:**
- **Recommended:** Set `TABLE_PREFIX=newsnow` to create tables like `newsnow_cache` and `newsnow_user`
- This keeps newsnow tables separate from your existing data
- **Optional:** Leave empty to use default table names `cache` and `user`

**Optional (only if you want GitHub OAuth later):**
```
G_CLIENT_ID=your_github_client_id
G_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret
```

**Note:** `DATABASE_URL` is automatically set by Railway's PostgreSQL plugin.

## Step 4: Configure Build Settings

Railway should auto-detect the build settings, but verify:

- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `node dist/output/server/index.mjs`
- **Root Directory:** `/` (leave as default)

## Step 5: Deploy

1. Railway will automatically deploy on push
2. First deployment will initialize database tables (INIT_TABLE=true)
3. After first successful deployment, you can set `INIT_TABLE=false` to skip table initialization

## Step 6: Access Your App

Railway will provide a public URL like: `https://your-app.up.railway.app`

## Important Notes

### Database Safety
- ✅ **100% Safe for existing databases** - uses `CREATE TABLE IF NOT EXISTS`
- ✅ **No data destruction** - only creates new tables, never drops or modifies existing ones
- ✅ **Isolated tables** - use `TABLE_PREFIX=newsnow` to namespace tables
- ✅ **Tables created:** Only 2 tables (`cache` and `user`, or with your prefix)

### Configuration
- **First deployment:** Keep `INIT_TABLE=true` to create database tables
- **Subsequent deployments:** Can set `INIT_TABLE=false` for faster startups
- **No OAuth:** The app will work without GitHub OAuth, just without user login features
- **Caching:** With PostgreSQL, news will be cached for 30 minutes by default
- **Database:** PostgreSQL connection is automatic via `DATABASE_URL`

## Troubleshooting

### Database connection issues
- Verify PostgreSQL plugin is added
- Check `DATABASE_URL` exists in environment variables
- Ensure `INIT_TABLE=true` on first run

### Build failures
- Check Railway build logs
- Ensure pnpm is being used (should be auto-detected)
- Verify all dependencies are in package.json

### App not starting
- Check start command: `node dist/output/server/index.mjs`
- Verify PORT environment variable is set
- Check Railway deployment logs

## Monitoring

- View logs in Railway dashboard
- Check database queries in PostgreSQL plugin
- Monitor cache hit rates in application logs
