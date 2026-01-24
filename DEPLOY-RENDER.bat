@echo off
echo.
echo ============================================
echo   RENDER DEPLOYMENT INSTRUCTIONS
echo ============================================
echo.
echo Your changes have been pushed to GitHub!
echo.
echo To deploy on Render:
echo.
echo 1. Opening Render Dashboard...
echo.
start https://dashboard.render.com
echo.
echo 2. Find your service: motorbike-payment-tracker-api
echo.
echo 3. Click "Manual Deploy" -^> "Deploy latest commit"
echo.
echo    OR check if auto-deploy is enabled:
echo    - Go to Settings
echo    - Look for "Auto-Deploy"
echo    - Make sure it's set to "Yes"
echo.
echo 4. Wait 2-5 minutes for deployment to complete
echo.
echo 5. Your production URLs:
echo    Frontend: https://frontend-blue-seven-42.vercel.app
echo    Backend:  https://motorbike-payment-tracker-api.onrender.com
echo.
echo ============================================
echo.
pause
