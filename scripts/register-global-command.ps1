$binPath = "C:\Users\Aryan\Desktop\Jarvis\bin"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($userPath -notlike "*$binPath*") {
    $newPath = if ($userPath.EndsWith(";")) { "$userPath$binPath" } else { "$userPath;$binPath" }
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "JARVIS CLI path added to User Environment PATH successfully!" -ForegroundColor Green
} else {
    Write-Host "JARVIS CLI path is already configured in User PATH." -ForegroundColor Cyan
}
