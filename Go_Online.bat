@echo off
title Expense Tracker - Online Presentation Mode
echo ===========================================
echo   EXPENSE TRACKER - 1-CLICK ONLINE MODE
echo ===========================================
echo.

:: Step 1: Start the PHP Server if it's not running
echo [1/2] Starting local PHP server...
:: Since this file is inside the project folder, we call start_server.bat directly
start /min cmd /c "start_server.bat"

:: Step 2: Start the Tunnel with a FRESH Subdomain
echo [2/2] Creating public presentation link...
echo.
echo Your password is your Public IP:
powershell -Command "(Invoke-WebRequest -Uri 'https://icanhazip.com').Content.Trim()"
echo.
echo.

:: Using a completely fresh subdomain to avoid old settings
npx.cmd localtunnel --port 8000 --subdomain ex-tracker-presentation
pause
