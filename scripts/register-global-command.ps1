$binPath = (Resolve-Path "$PSScriptRoot\..\bin").Path
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Remove any old stale paths if drive changed
$cleanPath = ($userPath -split ';' | Where-Object { $_ -and $_ -notmatch '(?i)[\\/]Jarvis[\\/]bin' }) -join ';'
$newPath = "$cleanPath;$binPath"

[Environment]::SetEnvironmentVariable("Path", $newPath, "User")
Write-Host "JARVIS CLI path updated to: $binPath in User Environment PATH!" -ForegroundColor Green
