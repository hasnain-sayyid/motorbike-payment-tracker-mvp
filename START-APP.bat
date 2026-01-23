@echo off
title Motorbike Payment Tracker - Startup
color 0A

echo.
echo ========================================
echo   MOTORBIKE PAYMENT TRACKER
echo   Starting Application...
echo ========================================
echo.

REM Kill any existing node processes
echo [1/4] Stopping any existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend
echo [2/4] Starting Backend Server on port 5000...
cd /d "%~dp0backend"
start "Backend Server - DO NOT CLOSE" cmd /k "START-BACKEND.bat"
cd /d "%~dp0"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [3/4] Starting Frontend Server on port 3000...
cd /d "%~dp0frontend"
start "Frontend Server - DO NOT CLOSE" cmd /k "START-FRONTEND.bat"
cd /d "%~dp0"
timeout /t 8 /nobreak >nul

REM Open Browser
echo [4/4] Opening application in browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo   APPLICATION STARTED SUCCESSFULLY!
echo ========================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo   The app is now running in separate windows.
echo   Close those windows to stop the servers.
echo.
pause
