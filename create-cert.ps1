# Create Self-Signed Certificate for Code Signing
# Run this with Administrator privileges

$cert = New-SelfSignedCertificate `
    -Type CodeSigningCert `
    -Subject "CN=824AI Code Signing" `
    -KeyUsage DigitalSignature `
    -FriendlyName "824AI Code Signing Certificate" `
    -NotAfter (Get-Date).AddYears(5) `
    -CertStoreLocation Cert:\CurrentUser\My

# Export certificate to PFX file (with password)
$password = ConvertTo-SecureString -String "824AI2026" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "$PSScriptRoot\824AI-cert.pfx" -Password $password

# Also export the public certificate for distribution
Export-Certificate -Cert $cert -FilePath "$PSScriptRoot\824AI-cert.cer"

Write-Host "Certificate created successfully!"
Write-Host "  PFX file: $PSScriptRoot\824AI-cert.pfx (for signing)"
Write-Host "  CER file: $PSScriptRoot\824AI-cert.cer (for distribution)"
Write-Host ""
Write-Host "Password: 824AI2026"
Write-Host ""
Write-Host "Thumbprint: $($cert.Thumbprint)"
