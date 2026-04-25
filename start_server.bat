@echo off
echo Starting PHP Server...
"C:\xampp\php\php.exe" -S 0.0.0.0:8000 -t .
if %errorlevel% neq 0 (
    echo.
    echo Error: Could not start PHP server.
    echo Please ensure XAMPP is installed at C:\xampp
    echo Or update this script with your PHP path.
    pause
)
