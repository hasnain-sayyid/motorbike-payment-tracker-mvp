# Deploy Backend to Render - Step by Step

## 🚀 Create Backend Web Service on Render

### Step 1: Connect Your Repository
1. The browser should open to: https://dashboard.render.com/create?type=web
2. Click **"Connect a repository"**
3. If asked, authorize Render to access your GitHub
4. Search for and select: **`motorbike-payment-tracker-mvp`**
5. Click **"Connect"**

### Step 2: Configure the Service
Fill in these details:

**Basic Settings:**
- **Name**: `motorbike-payment-tracker-api`
- **Region**: Oregon (US West) or closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings (click "Advanced"):**
- **Auto-Deploy**: Yes (recommended - auto-deploys on git push)

### Step 3: Environment Variables
Click **"Add Environment Variable"** and add these:

1. **NODE_ENV**
   - Value: `production`

2. **FRONTEND_URL**
   - Value: `https://frontend-blue-seven-42.vercel.app`

3. **PORT** (optional, Render sets this automatically)
   - Leave empty or set to: `5000`

**Optional (for SMS features):**
4. **TWILIO_ACCOUNT_SID** - Your Twilio Account SID
5. **TWILIO_AUTH_TOKEN** - Your Twilio Auth Token
6. **TWILIO_PHONE_NUMBER** - Your Twilio Phone Number

### Step 4: Create and Deploy
1. Scroll down and click **"Create Web Service"**
2. Wait 2-5 minutes for the deployment
3. Look for status: **● Live** (green dot)
4. Your backend URL will be: `https://motorbike-payment-tracker-api.onrender.com`

### Step 5: Verify Deployment
Once deployed, test it:
```bash
curl https://motorbike-payment-tracker-api.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","service":"motorbike-payment-tracker-api"}
```

---

## ⚠️ Important Notes

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds (cold start)
- This is normal for free tier

**After Deployment:**
- Payment deletion will work
- All database operations will persist
- Frontend can communicate with backend

---

## 🐛 Troubleshooting

**If deployment fails:**
1. Check the logs in Render dashboard
2. Verify `backend/package.json` has all dependencies
3. Ensure `backend/server.js` exists

**If backend returns errors:**
1. Check environment variables are set correctly
2. Review the deployment logs
3. Verify the database file permissions

---

## ✅ Once Deployed

Your application will be fully functional:
- Frontend: https://frontend-blue-seven-42.vercel.app
- Backend: https://motorbike-payment-tracker-api.onrender.com
- Database: SQLite (stored on Render disk)

Payment deletions and edits will work correctly!
