@echo off
setlocal
set "JARVIS_ROOT=%~dp0\.."

if "%~1"=="" (
    echo =======================================================
    echo   JARVIS // TACTICAL AI ENVIRONMENT CLI LAUNCHER
    echo =======================================================
    echo.
    echo Usage:
    echo   jarvis              Launch the desktop environment
    echo   jarvis --prompt "..." Execute an AI query directly
    echo   jarvis --status     Show system telemetry metrics
    echo   jarvis --version    Display JARVIS OS version
    echo   jarvis --help       Display this help manual
    echo.
    call "%JARVIS_ROOT%\scripts\start-jarvis.cmd"
    exit /b 0
)

if "%~1"=="--version" (
    echo JARVIS AI Desktop Environment v0.7.0 [Windows Native]
    exit /b 0
)

if "%~1"=="--help" (
    echo =======================================================
    echo   JARVIS // TACTICAL AI ENVIRONMENT CLI LAUNCHER
    echo =======================================================
    echo.
    echo Available CLI Commands:
    echo   jarvis              Open JARVIS desktop UI
    echo   jarvis --prompt "..." Send query to Gemini AI Core
    echo   jarvis --status     Inspect CPU/RAM telemetry
    echo   jarvis --version    Show version
    exit /b 0
)

if "%~1"=="--status" (
    echo [JARVIS TELEMETRY]
    powershell -Command "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory"
    exit /b 0
)

call "%JARVIS_ROOT%\scripts\start-jarvis.cmd"
