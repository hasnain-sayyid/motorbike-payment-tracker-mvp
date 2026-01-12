@echo off
echo 🔍 Motorbike Payment Tracker - Deployment Readiness Check
echo ===========================================================

set checks_passed=0
set total_checks=0

echo.
echo 🔧 System Requirements:

REM Check Node.js
set /a total_checks+=1
echo [%total_checks%] Node.js installed...
node --version >nul 2>&1
if %errorlevel%==0 (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

REM Check npm
set /a total_checks+=1
echo [%total_checks%] npm installed...
npm --version >nul 2>&1
if %errorlevel%==0 (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

echo.
echo 📁 Project Structure:

REM Check backend package.json
set /a total_checks+=1
echo [%total_checks%] Backend package.json exists...
if exist "backend\package.json" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

REM Check frontend package.json
set /a total_checks+=1
echo [%total_checks%] Frontend package.json exists...
if exist "frontend\package.json" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

REM Check render.yaml
set /a total_checks+=1
echo [%total_checks%] Render config exists...
if exist "render.yaml" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

REM Check vercel.json
set /a total_checks+=1
echo [%total_checks%] Vercel config exists...
if exist "frontend\vercel.json" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL
)

echo.
echo 📦 Dependencies:

REM Check node_modules directories
set /a total_checks+=1
echo [%total_checks%] Root dependencies...
if exist "node_modules" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL - Run: npm install
)

set /a total_checks+=1
echo [%total_checks%] Backend dependencies...
if exist "backend\node_modules" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL - Run: cd backend ^&^& npm install
)

set /a total_checks+=1
echo [%total_checks%] Frontend dependencies...
if exist "frontend\node_modules" (
    echo ✓ PASS
    set /a checks_passed+=1
) else (
    echo ✗ FAIL - Run: cd frontend ^&^& npm install
)

echo.
echo ===========================================================

if %checks_passed%==%total_checks% (
    echo 🎉 ALL CHECKS PASSED! ^(%checks_passed%/%total_checks%^)
    echo ✅ Your project is ready for deployment!
    echo.
    echo Next steps:
    echo 1. Push your code to GitHub
    echo 2. Deploy backend on Render: https://render.com
    echo 3. Deploy frontend on Vercel: https://vercel.com
    echo 4. Configure environment variables
    echo 5. Update API URLs after deployment
    echo.
    echo 📖 See DEPLOYMENT.md for detailed instructions
) else (
    echo ❌ SOME CHECKS FAILED ^(%checks_passed%/%total_checks% passed^)
    echo.
    echo Please fix the issues above before deploying.
    echo Run this script again after fixing the issues.
)

pause