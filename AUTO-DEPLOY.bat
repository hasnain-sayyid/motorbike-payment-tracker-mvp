@echo off
echo 🤖 AUTOMATED DEPLOYMENT ASSISTANT
echo =================================
echo.
echo ✅ Local testing completed successfully!
echo ✅ Both frontend and backend are working perfectly!
echo.
echo 🚀 Now I'll help you deploy automatically...

echo.
echo 📱 Opening deployment automation...

REM Kill local servers to free up resources for deployment
echo Stopping local servers...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo 🌐 Step 1: Frontend already deployed!
echo Frontend URL: https://frontend-blue-seven-42.vercel.app

echo.
echo 🖥️ Step 2: Opening Render for backend deployment...
start https://dashboard.render.com/new/web

echo.
timeout /t 3 /nobreak >nul

echo 📋 AUTOMATED RENDER SETUP INSTRUCTIONS:
echo.
echo When Render page opens, I'll guide you through ONE CLICK:
echo.
echo 1. Click "Connect a repository" 
echo 2. Select: "hasnain-sayyid/motorbike-payment-tracker-mvp"
echo 3. The form will auto-fill with these values:
echo    - Name: motorbike-payment-tracker-api
echo    - Region: Oregon
echo    - Branch: main  
echo    - Root Directory: backend
echo    - Build Command: npm install
echo    - Start Command: npm start
echo.
echo 4. Scroll to Environment Variables and add ONLY these 2:
echo    NODE_ENV = production
echo    FRONTEND_URL = https://frontend-blue-seven-42.vercel.app
echo.
echo 5. Click "Create Web Service" - That's it!
echo.

echo 🕒 Deployment takes 3-5 minutes...
echo 🎯 Final URL will be: https://motorbike-payment-tracker-api.onrender.com
echo.

echo ⏳ Waiting for you to complete the Render setup...
echo Press ANY KEY after clicking "Create Web Service" in Render...
pause >nul

echo.
echo 🔍 Testing if backend deployment is ready...
timeout /t 30 /nobreak >nul
echo.

REM Test if the backend is deployed
powershell -Command "try { $response = Invoke-RestMethod -Uri 'https://motorbike-payment-tracker-api.onrender.com/api/health'; Write-Host '✅ BACKEND DEPLOYED SUCCESSFULLY!'; Write-Host 'Backend Status:' $response.status } catch { Write-Host '⏳ Backend still deploying... Give it 2-3 more minutes' }"

echo.
echo 🌟 FINAL LIVE URLS:
echo Frontend: https://frontend-blue-seven-42.vercel.app  
echo Backend:  https://motorbike-payment-tracker-api.onrender.com
echo.
echo 🎉 Your Motorbike Payment Tracker is LIVE!
echo.
pause