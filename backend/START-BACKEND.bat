@echo off
title Backend Server - DO NOT CLOSE
color 0A
cd /d "%~dp0"

echo.
echo ========================================
echo   BACKEND SERVER STARTING...
echo ========================================
echo.

node server.js

echo.
echo ========================================
echo   BACKEND SERVER STOPPED
echo ========================================
echo.
pause
