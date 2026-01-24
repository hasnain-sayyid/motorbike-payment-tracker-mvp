@echo off
color 0A
echo.
echo ========================================
echo   RENDER MANUAL DEPLOYMENT GUIDE
echo ========================================
echo.
echo Your code is ready on GitHub!
echo Now you need to deploy it on Render.
echo.
echo STEP 1: Open Render Dashboard
echo --------------------------------
start https://dashboard.render.com/
echo  Opening Render dashboard...
timeout /t 3 >nul
echo.
echo STEP 2: Find Your Service
echo --------------------------------
echo  Look for: motorbike-payment-tracker-api
echo  (It should be in your services list)
echo.
echo STEP 3: Deploy
echo --------------------------------
echo  Option A (Recommended):
echo    1. Click on the service name
echo    2. Look for the blue "Manual Deploy" button (top right)
echo    3. Click "Manual Deploy"
echo    4. Select "Deploy latest commit"
echo    5. Click "Deploy"
echo.
echo  Option B (Enable Auto-Deploy):
echo    1. Click on the service name
echo    2. Go to "Settings" tab
echo    3. Find "Auto-Deploy" section
echo    4. Set it to "Yes"
echo    5. Click "Save Changes"
echo    6. Your app will auto-deploy now and for all future pushes!
echo.
echo STEP 4: Wait for Deployment
echo --------------------------------
echo  Watch the logs on Render
echo  It will take 2-5 minutes
echo  Look for "Live" status
echo.
echo STEP 5: Verify Deployment
echo --------------------------------
echo  Once it says "Live", press any key here
echo  to run the verification script
echo.
pause
cls
echo.
echo Running verification...
echo.
call VERIFY-DEPLOYMENT.bat
