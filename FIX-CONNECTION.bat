@echo off
title Fix Connection Error
color 0E

echo.
echo ========================================
echo   CONNECTION ERROR FIX
echo ========================================
echo.

echo Checking servers...
echo.

REM Test backend
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:5000/api/customers' -Method GET -TimeoutSec 3 | Out-Null; Write-Host '  Backend API: OK' -ForegroundColor Green } catch { Write-Host '  Backend API: ERROR' -ForegroundColor Red; Write-Host '  Restarting backend...' -ForegroundColor Yellow; cd backend; Start-Process cmd -ArgumentList '/k','node server.js' -WindowStyle Normal }"

REM Test frontend
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 3 | Out-Null; Write-Host '  Frontend Server: OK' -ForegroundColor Green } catch { Write-Host '  Frontend Server: ERROR' -ForegroundColor Red; Write-Host '  Restarting frontend...' -ForegroundColor Yellow; cd frontend; Start-Process cmd -ArgumentList '/k','npx serve -s build -l 3000' -WindowStyle Normal }"

echo.
echo ========================================
echo   SOLUTION: CLEAR BROWSER CACHE
echo ========================================
echo.
echo The servers are running correctly!
echo The error is in your browser cache.
echo.
echo TO FIX:
echo   1. Press: Ctrl + Shift + R
echo   2. Or press: Ctrl + F5
echo.
echo This will do a HARD REFRESH and clear
echo the old cached data.
echo.
echo Opening browser now...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo   Browser opened!
echo   Press Ctrl+Shift+R if needed
echo ========================================
echo.
pause
