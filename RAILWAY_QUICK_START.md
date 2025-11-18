# Railway Quick Start - Existing PostgreSQL

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub
```bash
cd newsnow
git add .
git commit -m "Configure for Railway with existing PostgreSQL"
git push
```

### Step 2: Create Railway Service
1. Go to your Railway project (the one with existing PostgreSQL)
2. Click **"New"** → **"GitHub Repo"**
3. Select your newsnow repository

### Step 3: Link to Existing PostgreSQL
1. In the newsnow service, go to **"Variables"** tab
2. Click **"Add Reference"** → Select your PostgreSQL service
3. This automatically adds `DATABASE_URL`

### Step 4: Add Environment Variables
In the Variables tab, add:

```
NODE_ENV=production
INIT_TABLE=true
ENABLE_CACHE=true
TABLE_PREFIX=newsnow
```

### Step 5: Deploy
Railway will automatically build and deploy!

## 📊 What Gets Created in Your Database

Only 2 tables:
- `newsnow_cache` - stores news cache
- `newsnow_user` - stores user data (empty if no OAuth)

**Your existing data is 100% safe!**

## ✅ Verify Deployment

1. Check Railway logs for: `init newsnow_cache table` and `init newsnow_user table`
2. Visit your Railway URL
3. You should see the news aggregator working!

## 🔧 After First Successful Deploy

Optional: Set `INIT_TABLE=false` to skip table creation check on future deploys (slightly faster startup).

## 🛠️ Troubleshooting

**Build fails?**
- Check Railway build logs
- Ensure pnpm is detected (should be automatic)

**Database connection error?**
- Verify `DATABASE_URL` is set (should be automatic from PostgreSQL reference)
- Check PostgreSQL service is running

**Tables not created?**
- Ensure `INIT_TABLE=true`
- Check Railway logs for errors

## 📚 More Info

- Full guide: `RAILWAY_DEPLOYMENT.md`
- Safety details: `DATABASE_SAFETY.md`
- Environment variables: `.env.railway.example`

---

**Need OAuth later?** Just add `G_CLIENT_ID`, `G_CLIENT_SECRET`, and `JWT_SECRET` to enable GitHub login.
