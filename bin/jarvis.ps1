[CmdletBinding()]
param(
    [switch]$Help,
    [switch]$Version,
    [switch]$Status,
    [string]$Prompt
)

$JarvisRoot = Split-Path -Parent $PSScriptRoot

if ($Version) {
    Write-Host "JARVIS AI Desktop Environment v0.7.0 [Windows Native]" -ForegroundColor Cyan
    exit 0
}

if ($Help) {
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host "  JARVIS // TACTICAL AI ENVIRONMENT CLI LAUNCHER" -ForegroundColor Cyan
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host "Commands:"
    Write-Host "  jarvis.ps1               Launch full desktop environment"
    Write-Host "  jarvis.ps1 -Prompt '...' Send prompt to AI Core"
    Write-Host "  jarvis.ps1 -Status       Inspect system telemetry"
    Write-Host "  jarvis.ps1 -Version      Print version"
    exit 0
}

if ($Status) {
    Write-Host "[JARVIS SYSTEM TELEMETRY]" -ForegroundColor Green
    Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, MaxClockSpeed | Format-List
    exit 0
}

# Launch desktop app
& "$JarvisRoot\scripts\start-jarvis.cmd"
