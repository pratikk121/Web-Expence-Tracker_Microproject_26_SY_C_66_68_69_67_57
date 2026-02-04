@echo off
echo Importing Database...
"C:\xampp\mysql\bin\mysql.exe" -u root < setup.sql
if %errorlevel% neq 0 (
    echo.
    echo Error: Could not import database.
    echo Please ensure XAMPP is installed and MySQL is running.
    echo Default credentials - root, no password - assumed.
    pause
) else (
    echo Database imported successfully!
    timeout /t 3
)
