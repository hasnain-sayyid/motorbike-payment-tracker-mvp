@echo off
title Frontend Server - DO NOT CLOSE
color 0B
cd /d "%~dp0"

echo.
echo ========================================
echo   FRONTEND SERVER STARTING...
echo ========================================
echo.

npx serve -s build -l 3000

echo.
echo ========================================
echo   FRONTEND SERVER STOPPED
echo ========================================
echo.
pause
