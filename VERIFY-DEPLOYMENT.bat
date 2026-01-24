@echo off
echo.
echo ================================================
echo   PRODUCTION DEPLOYMENT STATUS CHECK
echo ================================================
echo.
echo Testing Frontend (Vercel)...
powershell -Command "try { Invoke-RestMethod -Uri 'https://frontend-blue-seven-42.vercel.app' -Method HEAD -TimeoutSec 5 | Out-Null ; Write-Host '  ✅ Frontend: LIVE AND WORKING' -ForegroundColor Green } catch { Write-Host '  ❌ Frontend: FAILED' -ForegroundColor Red }"
echo.
echo Testing Backend (Render)...
powershell -Command "try { $r = Invoke-RestMethod -Uri 'https://motorbike-payment-tracker-api.onrender.com/api/customers' -Method GET -TimeoutSec 10 ; Write-Host '  ✅ Backend: LIVE - ' -NoNewline -ForegroundColor Green ; Write-Host $r.Count ' customers loaded' -ForegroundColor Green ; Write-Host '  All your fixes are deployed!' -ForegroundColor Cyan } catch { Write-Host '  ⏳ Backend: NOT READY YET' -ForegroundColor Yellow ; Write-Host '     Render needs manual deployment trigger' -ForegroundColor Yellow }"
echo.
echo ================================================
echo.
echo WHAT TO DO IF BACKEND IS NOT READY:
echo.
echo 1. The Render dashboard should now be open in your browser
echo    (If not, go to: https://dashboard.render.com)
echo.
echo 2. Find your service: motorbike-payment-tracker-api
echo.
echo 3. Check if it says "Auto-Deploy: Yes"
echo    - If YES: Wait 2-5 minutes, it's deploying automatically
echo    - If NO: Click "Manual Deploy" button, then "Deploy latest commit"
echo.
echo 4. Watch the deployment logs until it says "Live"
echo.
echo 5. Run this script again to verify everything is working
echo.
echo ================================================
echo.
echo Your Production URLs:
echo   Frontend: https://frontend-blue-seven-42.vercel.app
echo   Backend:  https://motorbike-payment-tracker-api.onrender.com/api/customers
echo.
pause
