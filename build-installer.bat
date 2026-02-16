@echo off
REM Build 824AI Windows Installer Script

echo =========================================
echo 824AI Installer Builder
echo =========================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Checking dependencies...
if not exist node_modules (
    echo Installing npm packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Building 824AI installer...
echo This may take a few minutes...
echo.

call npm run dist:win

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================
    echo SUCCESS! Installer built!
    echo =========================================
    echo.
    echo Your installer is ready in: dist\
    echo.
    echo Files created:
    echo - 824AI Setup 1.0.0.exe (NSIS installer)
    echo - 824AI 1.0.0.exe (Portable version)
    echo.
    echo You can now distribute these files to others!
    echo.
    pause
) else (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above.
    echo.
    pause
    exit /b 1
)
