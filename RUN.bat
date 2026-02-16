@echo off
REM 824AI Quick Start
REM Double-click this file to run 824AI

setlocal enabledelayedexpansion

title 824AI - Starting...

cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed.
    echo Please run INSTALL.bat first.
    echo.
    pause
    exit /b 1
)

echo Starting 824AI...
echo.

call npm start
if %errorLevel% neq 0 (
    echo.
    echo ERROR: Failed to start 824AI
    echo Please run INSTALL.bat again
    echo.
    pause
)
