@echo off
echo.
echo ========================================
echo   BACKEND STATUS CHECKER
echo ========================================
echo.
echo Testing backend API connection...
echo.

echo 1. Checking Render backend...
curl -s https://motorbike-payment-tracker-api.onrender.com/api/health
echo.
echo.

echo 2. If you see "Not Found" or error above:
echo    - Backend is NOT deployed yet
echo    - Go to https://dashboard.render.com
echo    - Look for "motorbike-payment-tracker-api"
echo    - If exists: Click "Manual Deploy"
echo    - If not exists: Create new Web Service with your GitHub repo
echo.

echo 3. Expected response when working:
echo    {"status":"ok","timestamp":"...","service":"motorbike-payment-tracker-api"}
echo.

pause
