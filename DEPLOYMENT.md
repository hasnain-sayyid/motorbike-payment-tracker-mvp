# 🚀 Deployment Guide - Render & Vercel

This guide will help you deploy the Motorbike Payment Tracker to **Render** (backend) and **Vercel** (frontend).

## 🎯 Quick Start - One-Click Deployment

### Windows Users:
```bash
./deploy.bat
```

### Mac/Linux Users:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📋 Prerequisites

1. GitHub account
2. Render account (free): https://render.com
3. Vercel account (free): https://vercel.com
4. Twilio account (for SMS): https://twilio.com

## 🔧 Step-by-Step Manual Deployment

### 1. Install CLI Tools
```bash
npm run setup:cli
```

### 2. Deploy Backend on Render

#### Option A: Auto-Deploy (Recommended)
1. Push your code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `motorbike-payment-tracker-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Option B: Manual Render.yaml
1. The project includes a `render.yaml` file for automatic configuration
2. Connect your repository to Render
3. It will automatically detect and use the configuration

### 3. Configure Backend Environment Variables

Add these environment variables in your Render dashboard:

```bash
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 4. Deploy Frontend on Vercel

#### Option A: Auto-Deploy (Recommended)
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Option B: Using Vercel CLI
```bash
cd frontend
vercel --prod
```

### 5. Configure Frontend Environment Variables

Add these environment variables in your Vercel dashboard:

```bash
REACT_APP_API_URL=https://your-render-service.onrender.com
```

## 🔄 Update API URLs

### After Backend Deployment:
1. Copy your Render backend URL (e.g., `https://motorbike-payment-tracker-api.onrender.com`)
2. Update the frontend environment variable:
   - In Vercel dashboard: Set `REACT_APP_API_URL`
   - Trigger a new deployment

### After Frontend Deployment:
1. Copy your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
2. Update the backend environment variable:
   - In Render dashboard: Set `FRONTEND_URL`
   - Service will restart automatically

## ✅ Verification

### Backend Health Check:
```bash
curl https://your-backend.onrender.com/api/health
```

### Frontend:
Visit your Vercel URL and test the application

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Error**: Make sure `FRONTEND_URL` is set correctly in Render
2. **API Connection Failed**: Verify `REACT_APP_API_URL` in Vercel
3. **SMS Not Working**: Check Twilio credentials in Render
4. **Build Failed**: Check Node.js version (>=16.0.0)

### Checking Logs:
- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Project → Functions → View Function Logs

## 🚀 Automation

The project includes automated deployment scripts:

```bash
# Build everything
npm run build:frontend

# Deploy frontend to Vercel
npm run deploy:frontend

# Deploy everything
npm run deploy:all
```

## 📱 SMS Configuration

To enable SMS reminders:

1. Get Twilio credentials from https://twilio.com
2. Set environment variables in Render:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`  
   - `TWILIO_PHONE_NUMBER`

## 💡 Pro Tips

- Use Render's free tier for backend (750 hours/month)
- Use Vercel's free tier for frontend (unlimited)
- Set up branch previews for testing
- Monitor your deployments via dashboard notifications

---

🎉 **That's it!** Your Motorbike Payment Tracker is now live on the internet! 
- Visit: https://vercel.com
- Login with GitHub
- Import repository
- Select 'frontend' folder
- Deploy automatically

### 4. Configuration
After deployment:
1. Copy Railway backend URL
2. Update `frontend/.env.production` with backend URL
3. Update Railway `FRONTEND_URL` environment variable

## Environment Variables

### Backend (Railway):
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-app.vercel.app`

### Frontend (Vercel):
- `REACT_APP_API_URL=https://your-backend.railway.app`

## Live URLs
- Frontend: Will be provided after Vercel deployment
- Backend: Will be provided after Railway deployment