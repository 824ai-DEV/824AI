# Install 824AI Certificate on Target Machine
# Run this on machines where you want to run the signed executable
# Requires Administrator privileges

param(
    [Parameter(Mandatory=$true)]
    [string]$CertPath
)

if (-not (Test-Path $CertPath)) {
    Write-Error "Certificate file not found: $CertPath"
    exit 1
}

# Import certificate to Trusted Root Certification Authorities
Import-Certificate -FilePath $CertPath -CertStoreLocation Cert:\LocalMachine\Root

Write-Host "Certificate installed successfully!"
Write-Host "  Imported to: Cert:\LocalMachine\Root"
Write-Host "  The app signed with this certificate will now run without warnings."
