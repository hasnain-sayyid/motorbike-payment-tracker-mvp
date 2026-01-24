@echo off
color 0E
echo.
echo ================================================================
echo   CREATE NEW SERVICE ON RENDER - STEP BY STEP GUIDE
echo ================================================================
echo.
echo You need to create the backend service on Render first!
echo.
echo FOLLOW THESE EXACT STEPS:
echo ================================================================
echo.
echo 1. Click the "+ New" button (top right on Render dashboard)
echo.
echo 2. Select "Web Service"
echo.
echo 3. CONNECT YOUR GITHUB REPOSITORY:
echo    - Click "Connect a repository"
echo    - Find: motorbike-payment-tracker-mvp
echo    - Click "Connect"
echo.
echo 4. CONFIGURE THE SERVICE:
echo    ----------------------------------------
echo    Name: motorbike-payment-tracker-api
echo.
echo    Region: Oregon (or any region you prefer)
echo.
echo    Branch: main
echo.
echo    Root Directory: backend
echo    (IMPORTANT: Type "backend" exactly)
echo.
echo    Runtime: Node
echo.
echo    Build Command: npm install
echo.
echo    Start Command: npm start
echo.
echo    Instance Type: Free
echo.
echo 5. ADD ENVIRONMENT VARIABLES (click "Add Environment Variable"):
echo    ----------------------------------------
echo    Key: NODE_ENV          Value: production
echo    Key: FRONTEND_URL      Value: https://frontend-blue-seven-42.vercel.app
echo.
echo    (Optional - for SMS reminders later):
echo    Key: TWILIO_ACCOUNT_SID     Value: (leave empty for now)
echo    Key: TWILIO_AUTH_TOKEN      Value: (leave empty for now)
echo    Key: TWILIO_PHONE_NUMBER    Value: (leave empty for now)
echo.
echo 6. ADVANCED SETTINGS (scroll down):
echo    ----------------------------------------
echo    Health Check Path: /api/health
echo.
echo 7. Click "Create Web Service" button at the bottom
echo.
echo 8. WAIT 2-5 MINUTES for first deployment
echo.
echo ================================================================
echo.
echo Once you see "Live" status, run VERIFY-DEPLOYMENT.bat to test!
echo.
echo Press any key when you've completed these steps...
pause
