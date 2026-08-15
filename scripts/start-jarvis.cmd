@echo off
title JARVIS OS Launcher
echo ===================================================
echo   LAUNCHING JARVIS TACTICAL AI ENVIRONMENT...
echo ===================================================
cd /d "%~dp0\.."

REM First attempt running the standalone portable binary
if exist "release\JARVIS\JARVIS.exe" (
    powershell -ExecutionPolicy Bypass -Command "Unblock-File -Path 'release\JARVIS\JARVIS.exe' -ErrorAction SilentlyContinue"
    start "" "release\JARVIS\JARVIS.exe"
    exit /b 0
)

REM Fallback to running via development environment
npm run dev
