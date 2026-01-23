@echo off
echo Starting Motorbike Payment Tracker
echo ==================================

echo.
echo Starting Backend Server...
cd /d "%~dp0"
start "Backend" cmd /k "cd backend && npm start"

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Backend will be at: http://localhost:5000
echo Frontend will be at: http://localhost:3000
echo.
echo Both servers are starting in separate windows.
echo Close those windows to stop the servers.
echo.

pause