# 🚀 Automated Deployment Guide

## One-Click Deployment

### Windows Users:
```bash
./deploy.bat
```

### Mac/Linux Users:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment Steps

### 1. Install CLI Tools
```bash
npm run setup:cli
```

### 2. Deploy Backend (Railway)
- Visit: https://railway.app
- Login with GitHub
- Import repository
- Select 'backend' folder
- Deploy automatically

### 3. Deploy Frontend (Vercel) 
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