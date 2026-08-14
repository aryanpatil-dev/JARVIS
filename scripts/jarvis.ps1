# JARVIS CLI Launcher for PowerShell
param (
    [switch]$SafeMode,
    [string]$Workspace
)

$candidates = @(
    "$PSScriptRoot\..\release\JARVIS\JARVIS.exe",
    "$env:LOCALAPPDATA\Programs\JARVIS\JARVIS.exe",
    "C:\Program Files\JARVIS\JARVIS.exe",
    "$PSScriptRoot\JARVIS.exe"
)

$target = $null
foreach ($path in $candidates) {
    if (Test-Path $path) {
        $target = $path
        break
    }
}

if ($null -ne $target) {
    $argsList = @()
    if ($SafeMode) { $argsList += "--safe-mode" }
    if ($Workspace) { $argsList += "--workspace", "`"$Workspace`"" }
    
    Start-Process -FilePath $target -ArgumentList $argsList
    Write-Host "[JARVIS] Launching AI Desktop Environment..." -ForegroundColor Cyan
} else {
    Write-Error "[JARVIS] Executable not found. Ensure JARVIS is built or installed."
}
