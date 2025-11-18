# Railway Deployment - Quick Setup Guide

## ✅ Code is now on GitHub!

Repository: https://github.com/Zhihong0321/Eternalgy-NewsNow

---

## 🚀 Deploy to Railway (5 Steps)

### Step 1: Go to Your Railway Project

1. Open your Railway dashboard
2. Go to the project that has your existing PostgreSQL database

### Step 2: Add New Service from GitHub

1. Click **"New"** button
2. Select **"GitHub Repo"**
3. If prompted, authorize Railway to access your GitHub
4. Select repository: **Zhihong0321/Eternalgy-NewsNow**
5. Click **"Deploy"**

### Step 3: Link to Existing PostgreSQL

1. In your new **Eternalgy-NewsNow** service, click on **"Variables"** tab
2. Click **"+ New Variable"** → **"Add Reference"**
3. Select your existing **PostgreSQL** service
4. Select variable: **DATABASE_URL**
5. Click **"Add"**

This automatically connects your app to the existing PostgreSQL without manual configuration.

### Step 4: Add Environment Variables

Still in the **"Variables"** tab, add these variables:

Click **"+ New Variable"** for each:

```
NODE_ENV=production
```

```
INIT_TABLE=true
```

```
ENABLE_CACHE=true
```

```
TABLE_PREFIX=newsnow
```

**Important:** `TABLE_PREFIX=newsnow` ensures your tables are named `newsnow_cache` and `newsnow_user`, keeping them separate from existing data.

### Step 5: Deploy!

Railway will automatically:
1. Detect it's a Node.js project
2. Use pnpm (from package.json)
3. Run build command: `pnpm install && pnpm run build`
4. Start with: `node dist/output/server/index.mjs`

Watch the deployment logs for:
```
✓ init newsnow_cache table
✓ init newsnow_user table
Listening on http://0.0.0.0:4444
```

---

## 🔍 Verify Deployment

### 1. Check Logs

In Railway dashboard:
- Go to your Eternalgy-NewsNow service
- Click **"Deployments"** tab
- Click on the latest deployment
- View logs for any errors

### 2. Access Your App

Railway will provide a URL like:
```
https://eternalgy-newsnow-production.up.railway.app
```

Click on **"Settings"** → **"Networking"** → **"Generate Domain"** if not auto-generated.

### 3. Verify Database Tables

Connect to your PostgreSQL and run:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'newsnow%'
ORDER BY table_name;
```

You should see:
- `newsnow_cache`
- `newsnow_user`

All your existing tables remain untouched!

---

## 🎯 Environment Variables Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | (auto-set) | PostgreSQL connection |
| `NODE_ENV` | `production` | Production mode |
| `INIT_TABLE` | `true` | Create tables on first run |
| `ENABLE_CACHE` | `true` | Enable 30-min cache |
| `TABLE_PREFIX` | `newsnow` | Namespace tables |

---

## 🔧 Troubleshooting

### Build Fails
- Check Railway build logs
- Verify pnpm is being used
- Ensure all files were pushed to GitHub

### Database Connection Error
- Verify `DATABASE_URL` reference is added
- Check PostgreSQL service is running
- Ensure both services are in same project

### Tables Not Created
- Check `INIT_TABLE=true` is set
- View deployment logs for errors
- Verify `DATABASE_URL` is correct

### App Not Accessible
- Generate domain in Settings → Networking
- Check deployment status is "Active"
- View logs for startup errors

---

## 📝 After First Successful Deploy

### Optional: Optimize Startup

After confirming everything works, you can set:
```
INIT_TABLE=false
```

This skips the table creation check on future deploys (slightly faster startup).

### Optional: Enable GitHub OAuth (Later)

If you want user login functionality:

1. Create GitHub OAuth App at: https://github.com/settings/applications/new
2. Set callback URL: `https://your-railway-url.up.railway.app/api/oauth/github`
3. Add to Railway variables:
   ```
   G_CLIENT_ID=your_client_id
   G_CLIENT_SECRET=your_client_secret
   JWT_SECRET=your_jwt_secret
   ```

---

## ✅ Success Checklist

- [ ] Service deployed on Railway
- [ ] DATABASE_URL reference added
- [ ] All environment variables set
- [ ] Deployment logs show table creation
- [ ] App is accessible via Railway URL
- [ ] News loads correctly
- [ ] Database tables created: `newsnow_cache`, `newsnow_user`
- [ ] Existing database data is untouched

---

## 🎉 You're Done!

Your NewsNow app is now running on Railway with your existing PostgreSQL database, safely isolated with the `newsnow_` prefix.

**Repository:** https://github.com/Zhihong0321/Eternalgy-NewsNow

**Need help?** Check the detailed guides:
- `RAILWAY_DEPLOYMENT.md` - Full deployment guide
- `DATABASE_SAFETY.md` - Safety guarantees
- `TEST_CHECKLIST.md` - Testing guide
