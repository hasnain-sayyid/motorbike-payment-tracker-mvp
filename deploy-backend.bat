@echo off
echo 🚀 Deploying Motorbike Payment Tracker Backend to Render
echo =====================================================

echo.
echo 📋 Deployment Instructions:
echo.
echo 1. Go to: https://render.com
echo 2. Sign up/Login with your GitHub account
echo 3. Click "New" → "Web Service"
echo 4. Connect your GitHub repository: motorbike-payment-tracker-mvp
echo 5. Render will automatically detect render.yaml
echo 6. Click "Create Web Service"
echo.
echo 🔧 Manual Setup (if render.yaml not detected):
echo   - Build Command: npm install
echo   - Start Command: npm start
echo   - Root Directory: ./backend
echo   - Environment: Node.js
echo   - Plan: Free
echo.
echo 🌐 Expected Backend URL: https://motorbike-payment-tracker-api.onrender.com
echo.
echo ⏳ Deployment typically takes 2-5 minutes
echo.

echo Opening Render.com...
start https://render.com

echo.
echo After deployment, test your backend at:
echo https://motorbike-payment-tracker-api.onrender.com/api/health
echo.

pause