@echo off
echo 🏃 Starting Motorbike Payment Tracker - Full Stack
echo ============================================

echo.
echo 🖥️ Starting Backend Server...
start "Backend Server" cmd /k "cd /d \"%~dp0\backend\" && npm start"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d \"%~dp0\frontend\" && npm start"

echo.
echo 📱 Your app will be available at:
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo 🔍 Both servers are starting in separate windows...
echo Close those windows to stop the servers.
echo.

pause