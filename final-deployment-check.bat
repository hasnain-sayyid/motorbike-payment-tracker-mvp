@echo off
echo 🚀 Final Deployment Check - Motorbike Payment Tracker
echo ====================================================

set checks_passed=0
set total_checks=0

echo.
echo 🔧 Build Tests:

REM Test backend build
set /a total_checks+=1
echo [%total_checks%] Backend dependencies...
cd backend
npm install >nul 2>&1
if %errorlevel%==0 (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

REM Test frontend build
set /a total_checks+=1
echo [%total_checks%] Frontend production build...
cd ../frontend
npm run build >nul 2>&1
if %errorlevel%==0 (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

cd ..

echo.
echo 🌐 Deployment Configuration:

REM Check render.yaml
set /a total_checks+=1
echo [%total_checks%] Render configuration valid...
if exist "render.yaml" (
    findstr /i "motorbike-payment-tracker-api" render.yaml >nul
    if !errorlevel!==0 (
        echo ✓ PASS
        set /a checks_passed+=1
    ) else (
        echo ✗ FAIL - Service name not configured
    )
) else (
    echo ✗ FAIL - render.yaml missing
)

REM Check vercel.json
set /a total_checks+=1
echo [%total_checks%] Vercel configuration valid...
if exist "frontend\vercel.json" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

echo.
echo 📡 API Configuration:

REM Check API URL configuration
set /a total_checks+=1
echo [%total_checks%] API URL configuration...
findstr /i "motorbike-payment-tracker-api.onrender.com" frontend\src\api.js >nul
if %errorlevel%==0 (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL - API URL not configured
)

echo.
echo ====================================================

if %checks_passed%==%total_checks% (
    echo 🎉 ALL DEPLOYMENT CHECKS PASSED! ^(%checks_passed%/%total_checks%^)
    echo ✅ Project is ready for production deployment!
    echo.
    echo 📋 Deployment Steps:
    echo 1. Commit and push all changes to GitHub
    echo 2. Deploy backend on Render with current render.yaml
    echo 3. Frontend is already deployed at: https://frontend-blue-seven-42.vercel.app
    echo 4. Test the live application
    echo.
    echo 🌐 Expected Live URLs:
    echo Frontend: https://frontend-blue-seven-42.vercel.app
    echo Backend:  https://motorbike-payment-tracker-api.onrender.com
) else (
    echo ❌ SOME CHECKS FAILED ^(%checks_passed%/%total_checks% passed^)
    echo Please review the failures above.
)

echo.
pause