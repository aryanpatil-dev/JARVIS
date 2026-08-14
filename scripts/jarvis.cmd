@echo off
setlocal
:: Find JARVIS executable in common locations or current directory
if exist "%~dp0..\release\JARVIS\JARVIS.exe" (
    start "" "%~dp0..\release\JARVIS\JARVIS.exe" %*
    exit /b 0
)
if exist "%LOCALAPPDATA%\Programs\JARVIS\JARVIS.exe" (
    start "" "%LOCALAPPDATA%\Programs\JARVIS\JARVIS.exe" %*
    exit /b 0
)
if exist "C:\Program Files\JARVIS\JARVIS.exe" (
    start "" "C:\Program Files\JARVIS\JARVIS.exe" %*
    exit /b 0
)
if exist "%~dp0JARVIS.exe" (
    start "" "%~dp0JARVIS.exe" %*
    exit /b 0
)

echo [JARVIS] Error: Could not locate installed JARVIS.exe.
echo Please check your installation path or run JARVIS directly.
exit /b 1
