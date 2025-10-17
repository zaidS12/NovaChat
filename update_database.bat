@echo off
echo ========================================
echo NovaChat Database Update Script
echo ========================================
echo.

echo Checking if XAMPP is running...
curl -s http://localhost/ > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: XAMPP Apache server is not running!
    echo Please start XAMPP Control Panel and start Apache + MySQL
    echo.
    pause
    exit /b 1
)

echo XAMPP is running. Updating database...
echo.

echo Running database update...
curl -s http://localhost/NovaChat/update_database.php

echo.
echo ========================================
echo Database update completed!
echo ========================================
echo.
echo Next steps:
echo 1. Start your React app: npm run dev
echo 2. Test the chatbot by sending a message
echo 3. Refresh the page to verify messages are saved
echo.
pause
