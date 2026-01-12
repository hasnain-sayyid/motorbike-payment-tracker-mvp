@echo off
echo 🚀 Starting automated deployment process...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install CLI tools if not present
echo 📋 Installing deployment tools...
call npm install -g vercel @railway/cli

REM Deploy backend to Railway
echo 🔧 Deploying backend to Railway...
cd backend
call railway login
call railway link --service motorbike-backend || call railway create --name motorbike-backend
call railway up --detach
cd ..

REM Wait for deployment
echo ⏳ Waiting for backend deployment...
timeout /t 30 /nobreak >nul

REM Deploy frontend to Vercel
echo 🎨 Deploying frontend to Vercel...
cd frontend
call vercel --prod --yes
cd ..

echo ✅ Deployment process completed!
echo 🌐 Check your Vercel dashboard for the live URL
echo 🔧 Check your Railway dashboard for the backend URL
pause