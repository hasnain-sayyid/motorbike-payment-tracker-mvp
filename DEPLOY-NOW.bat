@echo off
color 0E
cls
echo.
echo ========================================
echo    ONE-CLICK DEPLOYMENT HELPER
echo ========================================
echo.
echo I will:
echo  1. Open your Render service page
echo  2. Guide you to click "Manual Deploy"
echo  3. Verify the deployment
echo.
echo Press any key to start...
pause >nul
cls

echo.
echo ========================================
echo    STEP 1: Opening Render...
echo ========================================
echo.
start https://dashboard.render.com/web/srv-d5q20n14tr6s73d4tulg
echo  Render dashboard opened in browser!
timeout /t 3 >nul

cls
echo.
echo ========================================
echo    STEP 2: Click "Manual Deploy"
echo ========================================
echo.
echo In your browser, you should see the service page.
echo.
echo ACTION NEEDED:
echo   1. Look at the TOP RIGHT corner
echo   2. Find the "Manual Deploy" button (blue button)
echo   3. Click it
echo   4. Select "Deploy latest commit"  
echo   5. Click "Deploy"
echo.
echo The deployment will start immediately!
echo You'll see logs scrolling - that's normal.
echo.
echo Press any key once you've clicked "Deploy"...
pause >nul

cls
echo.
echo ========================================
echo    STEP 3: Waiting for Deployment
echo ========================================
echo.
echo The backend is now being deployed...
echo This takes 2-5 minutes.
echo.
echo I'll check the status every 15 seconds.
echo.

:CHECK_LOOP
echo [%TIME%] Checking backend status...

powershell -Command "$ProgressPreference = 'SilentlyContinue'; try { $response = Invoke-WebRequest -Uri 'https://motorbike-payment-tracker-mvp.onrender.com/api/health' -UseBasicParsing -TimeoutSec 10; Write-Host '  SUCCESS! Backend is LIVE!' -ForegroundColor Green; exit 0 } catch { Write-Host '  Still deploying...' -ForegroundColor Yellow; exit 1 }"

if %ERRORLEVEL% EQU 0 goto SUCCESS

timeout /t 15 /nobreak >nul
goto CHECK_LOOP

:SUCCESS
cls
echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo  Backend: https://motorbike-payment-tracker-mvp.onrender.com
echo  Frontend: https://frontend-blue-seven-42.vercel.app
echo.
echo  Your application is now FULLY DEPLOYED!
echo.
echo Opening your application...
timeout /t 2 >nul
start https://frontend-blue-seven-42.vercel.app
echo.
echo ========================================
echo    TEST YOUR APPLICATION
echo ========================================
echo.
echo Try these actions:
echo   Add a customer
echo   Add a payment
echo   Delete a payment (this was the main fix!)
echo   Export to Excel
echo.
echo Everything should work perfectly now!
echo.
echo ========================================
echo.
pause
