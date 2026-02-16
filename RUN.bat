@echo off
REM ==========================================
REM   824AI - Quick Launch
REM   Just double-click this file!
REM ==========================================

title 824AI

cd /d "%~dp0"

REM ---- Check if installed ----
if not exist "node_modules\.bin\electron.cmd" (
    echo.
    echo 824AI is not installed yet!
    echo.
    echo Please double-click INSTALL.bat first.
    echo.
    pause
    exit /b 1
)

echo Starting 824AI...
echo (First launch takes 1-3 minutes to load the model)
echo.

call npx electron .
if %errorLevel% neq 0 (
    echo.
    echo 824AI closed with an error.
    echo.
    echo Troubleshooting:
    echo   1. Run INSTALL.bat again
    echo   2. Make sure llama-server.exe is in the llama folder
    echo   3. Make sure the .gguf model file is in the llama folder
    echo.
    pause
)
