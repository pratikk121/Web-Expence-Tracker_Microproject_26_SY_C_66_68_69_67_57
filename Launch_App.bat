@echo off
title Expense Tracker - Launcher
echo ==========================================
echo       Starting Expense Tracker App
echo ==========================================

echo.
echo [1/4] Starting XAMPP MySQL Service...
:: Start MySQL hidden in the background so it doesn't block the script
start /MIN "" "C:\xampp\mysql_start.bat"

:: Give MySQL a few seconds to start up
timeout /t 3 /nobreak > NUL

echo.
echo [2/4] Initializing Database...
:: Run the database import
"C:\xampp\mysql\bin\mysql.exe" -u root < setup.sql
if %errorlevel% equ 0 (
    echo Database verified!
) else (
    echo [!] NOTE: Database import failed, or MySQL is not fully ready yet.
    echo If this is your first time, ensure XAMPP is installed at C:\xampp
)

echo.
echo [3/4] Opening Web App in Browser...
:: Open the browser right before starting the server
start http://localhost:8000

echo.
echo [4/4] Starting PHP Local Server...
echo ------------------------------------------
echo PRESS CTRL+C TO STOP THE SERVER
echo ------------------------------------------
"C:\xampp\php\php.exe" -S localhost:8000 -t .

pause
