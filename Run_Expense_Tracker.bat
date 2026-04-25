@echo off
TITLE Expense Tracker Launcher
echo ===================================================
echo   Web Expense Tracker - Service Launcher
echo ===================================================
echo.

:: Start PHP Server in a new window
echo [1/3] Launching PHP Server on port 8080...
start "PHP-Server" "C:\xampp\php\php.exe" -S localhost:8080

:: Small delay to ensure server is ready
timeout /t 2 /nobreak > nul

:: Start LocalTunnels
echo [2/3] Launching Primary Tunnel (web-expense-tracker)...
start "LT-Primary" npx localtunnel --port 8080 --subdomain web-expense-tracker

echo [3/3] Launching Secondary Tunnel (web-expense-tracker123)...
start "LT-Secondary" npx localtunnel --port 8080 --subdomain web-expense-tracker123

echo.
echo ---------------------------------------------------
echo   All services are starting! 
echo   Keep the open windows running to maintain links.
echo.
echo   URL 1: https://web-expense-tracker.loca.lt
echo   URL 2: https://web-expense-tracker123.loca.lt
echo ---------------------------------------------------
echo.
pause
