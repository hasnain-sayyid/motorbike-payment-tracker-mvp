@echo off
echo 🚀 Starting automated deployment process for Render + Vercel...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install CLI tools if not present
echo 📋 Installing deployment tools...
call npm install -g vercel

echo 📦 Installing dependencies...
call npm run install:all

echo 🔧 Building frontend...
call npm run build:frontend

REM Deploy frontend to Vercel
echo 🎨 Deploying frontend to Vercel...
cd frontend
call vercel login
echo 🚀 Deploying to production...
call vercel --prod
call vercel --prod --yes
cd ..

echo ✅ Deployment process completed!
echo 🌐 Check your Vercel dashboard for the live URL
echo 🔧 Check your Railway dashboard for the backend URL
pause