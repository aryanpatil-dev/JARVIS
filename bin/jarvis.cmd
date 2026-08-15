@echo off
setlocal
chcp 65001 >nul 2>&1

:: Dynamically determine root directory (independent of drive letter C:\, D:\, etc.)
set "JARVIS_ROOT=%~dp0.."

if "%~1"=="" (
    cls
    echo.
    echo       __   _   ___ __   __ ___ ____ 
    echo      ^|  ^| / \ ^| _ \\ \ / // _ \ __ \
    echo    __^|  ^|/ _ \^|   / \ V /^| ^| ^| ^|__\ \
    echo   ^|____//_/ \_\_^|_\  \_/ ^|_^|_^|_^|____/
    echo.
    echo   =======================================================
    echo     JARVIS // TACTICAL AI OPERATING ENVIRONMENT
    echo     STATUS: ONLINE  ^|  INITIALIZING HOLOGRAPHIC HUD...
    echo   =======================================================
    echo.
    call "%JARVIS_ROOT%\scripts\start-jarvis.cmd"
    exit /b 0
)

if "%~1"=="--version" (
    echo.
    echo       __   _   ___ __   __ ___ ____ 
    echo      ^|  ^| / \ ^| _ \\ \ / // _ \ __ \
    echo    __^|  ^|/ _ \^|   / \ V /^| ^| ^| ^|__\ \
    echo   ^|____//_/ \_\_^|_\  \_/ ^|_^|_^|_^|____/
    echo.
    echo JARVIS AI Desktop Environment v1.0.0 [Windows Native HUD]
    exit /b 0
)

if "%~1"=="--help" (
    echo =======================================================
    echo   JARVIS // TACTICAL AI ENVIRONMENT CLI LAUNCHER
    echo =======================================================
    echo.
    echo Available CLI Commands:
    echo   jarvis              Launch the Holographic HUD Desktop
    echo   jarvis --status     Inspect system CPU/RAM telemetry
    echo   jarvis --version    Show version banner
    echo   jarvis --help       Display this help manual
    exit /b 0
)

if "%~1"=="--status" (
    echo [JARVIS SYSTEM TELEMETRY]
    powershell -Command "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory"
    exit /b 0
)

call "%JARVIS_ROOT%\scripts\start-jarvis.cmd"
