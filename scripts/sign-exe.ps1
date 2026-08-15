$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=JARVIS-Developer" -CertStoreLocation "Cert:\CurrentUser\My"
$rootStore = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "CurrentUser")
$rootStore.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
$rootStore.Add($cert)
$rootStore.Close()

Set-AuthenticodeSignature -FilePath "release\JARVIS\JARVIS.exe" -Certificate $cert
Write-Host "JARVIS.exe has been digitally signed and trusted by CurrentUser Root CA!" -ForegroundColor Green
