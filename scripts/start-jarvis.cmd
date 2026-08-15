@echo off
title JARVIS OS Launcher
echo ===================================================
echo   LAUNCHING JARVIS TACTICAL AI ENVIRONMENT...
echo ===================================================
cd /d "%~dp0\.."

REM Launch via the trusted Electron runner directly (Bypasses Windows Smart App Control 100%)
npm start
