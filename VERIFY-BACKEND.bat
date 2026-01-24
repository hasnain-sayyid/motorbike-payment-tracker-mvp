@echo off
color 0A
echo.
echo ========================================
echo   BACKEND VERIFICATION SCRIPT
echo ========================================
echo.
echo Testing backend deployment...
echo.

:LOOP
timeout /t 10 /nobreak >nul
echo [%TIME%] Checking backend health...

powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://motorbike-payment-tracker-mvp.onrender.com/api/health' -UseBasicParsing -TimeoutSec 10; Write-Host '✓ Backend Status: LIVE' -ForegroundColor Green; Write-Host '✓ Response:' $response.Content -ForegroundColor Green; exit 0 } catch { Write-Host '⚠ Backend not ready yet:' $_.Exception.Message -ForegroundColor Yellow; exit 1 }"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Your backend is now LIVE at:
    echo https://motorbike-payment-tracker-mvp.onrender.com
    echo.
    echo Testing frontend connection...
    start https://frontend-blue-seven-42.vercel.app
    echo.
    pause
    exit
) else (
    echo Will check again in 10 seconds...
    goto LOOP
)
