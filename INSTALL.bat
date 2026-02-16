@echo off
REM ==========================================
REM   824AI - One-Click Installer
REM   Just double-click this file!
REM ==========================================

title 824AI - Installing...

echo.
echo ========================================
echo        824AI - Installing
echo ========================================
echo.

REM Change to the folder where this .bat file lives
cd /d "%~dp0"

REM ---- Check Node.js ----
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [X] Node.js is NOT installed!
    echo.
    echo You need to install Node.js first:
    echo.
    echo   1. Go to: https://nodejs.org/
    echo   2. Download the LTS version
    echo   3. Install it (click Next through everything)
    echo   4. RESTART your computer
    echo   5. Run this INSTALL.bat again
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js found: %NODE_VER%

REM ---- Check if llama-server.exe exists ----
if not exist "llama\llama-server.exe" (
    echo.
    echo [X] llama-server.exe is missing!
    echo.
    echo You need to download it:
    echo   1. Go to: https://github.com/ggml-org/llama.cpp/releases
    echo   2. Download the Windows build
    echo   3. Put llama-server.exe in the "llama" folder
    echo.
    echo Then run this INSTALL.bat again.
    echo.
    pause
    exit /b 1
)
echo [OK] llama-server.exe found

REM ---- Check if model file exists ----
set MODEL_FOUND=0
for %%f in (llama\*.gguf) do set MODEL_FOUND=1
if %MODEL_FOUND%==0 (
    echo.
    echo [X] Model file (.gguf) is missing!
    echo.
    echo You need to download the AI model:
    echo   1. Go to: https://huggingface.co/bartowski/Qwen2.5-Coder-7B-Instruct-abliterated-GGUF
    echo   2. Download the Q4_K_M version (~4.4 GB)
    echo   3. Put the .gguf file in the "llama" folder
    echo.
    echo Then run this INSTALL.bat again.
    echo.
    pause
    exit /b 1
)
echo [OK] Model file found

REM ---- Install npm dependencies (includes Electron) ----
echo.
echo Installing dependencies... (this takes 2-5 minutes)
echo Please wait, do NOT close this window!
echo.

call npm install
if %errorLevel% neq 0 (
    echo.
    echo [X] npm install failed!
    echo.
    echo Try this:
    echo   1. Delete the "node_modules" folder if it exists
    echo   2. Run this INSTALL.bat again
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed

REM ---- Verify Electron installed ----
if not exist "node_modules\.bin\electron.cmd" (
    echo.
    echo [X] Electron did not install correctly
    echo.
    echo Try:
    echo   1. Delete the "node_modules" folder
    echo   2. Run this INSTALL.bat again
    echo.
    pause
    exit /b 1
)
echo [OK] Electron installed

echo.
echo ========================================
echo    INSTALLATION COMPLETE!
echo ========================================
echo.
echo To start 824AI:
echo   Double-click RUN.bat
echo.
pause
