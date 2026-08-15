@echo off
setlocal
cd /d "%~dp0\.."

echo.
echo ===================================================
echo   LAUNCHING JARVIS TACTICAL AI ENVIRONMENT...
echo ===================================================
echo.

REM Launch via the trusted Electron runner
npm start
