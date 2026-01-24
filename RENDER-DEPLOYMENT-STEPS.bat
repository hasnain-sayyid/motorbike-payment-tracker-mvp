@echo off
echo.
echo ========================================
echo   RENDER BACKEND DEPLOYMENT
echo ========================================
echo.
echo You're in the Render Dashboard!
echo.
echo STEP 1: Create New Service
echo ---------------------------
echo 1. Click "+ New service" button (bottom left of service list)
echo    OR click the "+ New" button (top right)
echo.
echo 2. Select "Web Service"
echo.
echo STEP 2: Connect GitHub Repository
echo -----------------------------------
echo 1. Click "Connect a repository" or "Connect account"
echo 2. Authorize GitHub if needed
echo 3. Search for: motorbike-payment-tracker-mvp
echo 4. Click "Connect" on that repository
echo.
echo STEP 3: Configure Service
echo --------------------------
echo Name: motorbike-payment-tracker-api
echo Region: Oregon (US West)
echo Branch: main
echo Root Directory: backend
echo Runtime: Node
echo Build Command: npm install
echo Start Command: npm start
echo.
echo STEP 4: Add Environment Variables
echo -----------------------------------
echo Click "Add Environment Variable" button twice:
echo.
echo Variable 1:
echo   Key: NODE_ENV
echo   Value: production
echo.
echo Variable 2:
echo   Key: FRONTEND_URL
echo   Value: https://frontend-blue-seven-42.vercel.app
echo.
echo STEP 5: Deploy
echo ----------------
echo 1. Scroll down
echo 2. Click "Create Web Service"
echo 3. Wait 2-5 minutes for deployment
echo.
echo Once you see "Live" status (green), your backend is ready!
echo URL: https://motorbike-payment-tracker-api.onrender.com
echo.
pause
