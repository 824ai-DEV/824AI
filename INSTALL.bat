@echo off
REM 824AI Easy Installer (Consumer Version)
REM This script installs 824AI for end users without requiring PowerShell

setlocal enabledelayedexpansion

title 824AI Installation

echo.
echo ========================================
echo    824AI - Easy Installation
echo ========================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This installer requires Administrator privileges.
    echo.
    echo Please right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo (Download LTS version and install normally)
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js found
echo [✓] Administrator privileges confirmed
echo.

REM Change to script directory
cd /d "%~dp0"

echo Installing dependencies... (this may take a few minutes)
call npm install
if %errorLevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies.
    echo Please try again or contact support.
    pause
    exit /b 1
)

echo.
echo [✓] Dependencies installed successfully
echo.

REM Prompt to build installer
echo Would you like to create a desktop installer (.exe) for easy distribution?
echo.
set /p choice="Build installer (Y/N)? "

if /i "%choice%"=="Y" (
    echo.
    echo Building installer... (this may take 2-5 minutes)
    call npm run dist:win
    
    if %errorLevel% neq 0 (
        echo.
        echo ERROR: Failed to build installer.
        echo You can still run the app with: npm start
        echo.
    ) else (
        echo.
        echo [✓] Installer created successfully!
        echo Location: dist/824AI Setup 1.0.0.exe
        echo.
        echo You can now:
        echo 1. Share the .exe file with others
        echo 2. Run "npm start" to test the app
        echo.
    )
) else (
    echo.
    echo Setup complete!
    echo To run the app now, use: npm start
    echo.
)

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo To run 824AI:
echo   Option 1: Double-click 824AI in Start Menu (if installed)
echo   Option 2: Run: npm start
echo.
echo For help or troubleshooting:
echo   - Check the README.md file
echo   - View console logs with F12 when running
echo.
pause
