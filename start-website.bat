@echo off
title Atiksh Pharma Local Web Server
cd /d "%~dp0"
echo ===================================================
echo   ATIKSH PHARMA - LOCAL WEB SERVER
echo ===================================================
echo.
echo Starting local web server on port 3000...
echo Opening http://localhost:3000 in your browser...
echo.
start http://localhost:3000
node server.js
pause
