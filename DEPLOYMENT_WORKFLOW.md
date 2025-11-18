# Complete Deployment Workflow

Your deployment route: Local Test → GitHub → Railway → Production

## Phase 1: Local Testing (NOW)

### Quick Start
```bash
# Windows - Double click or run:
test-local.bat
```

Or manually:
```bash
docker compose -f docker-compose.local.test.yml up --build
```

### What to Check
1. ✅ App builds successfully
2. ✅ PostgreSQL connects
3. ✅ Tables created: `newsnow_cache`, `newsnow_user`
4. ✅ App accessible at http://localhost:4444
5. ✅ News loads correctly
6. ✅ No errors in logs

**See:** `TEST_CHECKLIST.md` for detailed testing steps

### Verify Database Safety
```bash
test-verify-db.bat
```

Should show only 2 newsnow tables, no other data affected.

### Cleanup After Testing
```bash
test-cleanup.bat
```

---

## Phase 2: GitHub (AFTER LOCAL TEST PASSES)

### 1. Create New GitHub Repository
- Go to https://github.com/new
- Create a new repository (e.g., `my-newsnow`)
- Don't initialize with README (you already have one)

### 2. Push Your Code
```bash
cd newsnow

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: NewsNow with PostgreSQL support"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git branch -M main
git push -u origin main
```

---

## Phase 3: Railway Setup

### 1. Create New Service in Your Railway Project

1. Go to your Railway project (the one with existing PostgreSQL)
2. Click **"New"**
3. Select **"GitHub Repo"**
4. Authorize GitHub if needed
5. Select your newsnow repository

### 2. Link to Existing PostgreSQL

In your newsnow service:
1. Go to **"Variables"** tab
2. Click **"Add Reference"**
3. Select your existing PostgreSQL service
4. Select variable: `DATABASE_URL`
5. Click **"Add"**

This automatically sets `DATABASE_URL` for your newsnow service.

### 3. Add Environment Variables

In the **"Variables"** tab, add these:

```
NODE_ENV=production
INIT_TABLE=true
ENABLE_CACHE=true
TABLE_PREFIX=newsnow
```

**Optional (only if you want GitHub OAuth later):**
```
G_CLIENT_ID=your_client_id
G_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
```

### 4. Verify Build Settings

Railway should auto-detect, but verify in **"Settings"** tab:
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `node dist/output/server/index.mjs`

### 5. Deploy

Railway will automatically deploy on push. Watch the logs!

---

## Phase 4: Verify Production Deployment

### 1. Check Railway Logs

Look for:
```
✓ init newsnow_cache table
✓ init newsnow_user table
```

### 2. Access Your App

Railway provides a URL like: `https://your-app.up.railway.app`

### 3. Verify Database Tables

Connect to your Railway PostgreSQL:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'newsnow%';
```

Should show:
- `newsnow_cache`
- `newsnow_user`

### 4. Test Functionality

- [ ] News loads correctly
- [ ] Cache works (fast page refreshes)
- [ ] No errors in Railway logs
- [ ] Existing database data is untouched

---

## Phase 5: Post-Deployment (Optional)

### Optimize Startup

After first successful deploy, you can set:
```
INIT_TABLE=false
```

This skips table creation check on future deploys (slightly faster startup).

### Enable GitHub OAuth (Optional)

If you want user login:
1. Create GitHub OAuth App
2. Set callback URL: `https://your-railway-url.up.railway.app/api/oauth/github`
3. Add to Railway variables:
   ```
   G_CLIENT_ID=...
   G_CLIENT_SECRET=...
   JWT_SECRET=...
   ```

---

## Troubleshooting

### Local Test Fails
- Check Docker Desktop is running
- Check ports 4444, 5432 are available
- Review: `docker compose -f docker-compose.local.test.yml logs`
- See: `TEST_CHECKLIST.md`

### Railway Build Fails
- Check Railway build logs
- Verify pnpm is detected
- Check package.json is valid
- Ensure all dependencies are listed

### Railway Database Connection Fails
- Verify `DATABASE_URL` is set (should be automatic)
- Check PostgreSQL service is running
- Verify reference is correctly linked

### Tables Not Created
- Ensure `INIT_TABLE=true`
- Check Railway logs for errors
- Verify `DATABASE_URL` is correct

### Existing Data Affected
- This shouldn't happen! Tables use `CREATE TABLE IF NOT EXISTS`
- Check `TABLE_PREFIX=newsnow` is set
- Review `DATABASE_SAFETY.md`

---

## Quick Reference

### Local Test Commands
```bash
# Start test
test-local.bat

# Verify database
test-verify-db.bat

# Cleanup
test-cleanup.bat
```

### Railway Environment Variables
```
DATABASE_URL=<auto-set-by-railway>
NODE_ENV=production
INIT_TABLE=true
ENABLE_CACHE=true
TABLE_PREFIX=newsnow
```

### Files Created for You
- `docker-compose.local.test.yml` - Local test setup
- `LOCAL_TEST.md` - Local testing guide
- `TEST_CHECKLIST.md` - Testing checklist
- `RAILWAY_DEPLOYMENT.md` - Full Railway guide
- `RAILWAY_QUICK_START.md` - Quick Railway setup
- `DATABASE_SAFETY.md` - Safety guarantees
- `test-local.bat` - Quick test script
- `test-verify-db.bat` - Verify database script
- `test-cleanup.bat` - Cleanup script

---

## Current Status

✅ Code is ready  
✅ PostgreSQL support added  
✅ Table prefix for safety  
✅ Local test environment ready  
⏳ **Next: Run local test**  
⏳ Then: Push to GitHub  
⏳ Then: Deploy to Railway  

**Start with: `test-local.bat`**
