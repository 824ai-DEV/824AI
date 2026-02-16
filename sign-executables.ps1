# Post-build script to sign executables with the 824AI certificate
# Run after: npm run dist:win

param(
    [string]$DistPath = "./dist"
)

Write-Host "======================================"
Write-Host "Code Signing Post-Build Script"
Write-Host "======================================"
Write-Host ""

# Check if certificate exists
if (-not (Test-Path ".\824AI-cert.pfx")) {
    Write-Host "ERROR: Certificate not found: 824AI-cert.pfx"
    Write-Host "Run create-cert.ps1 first to generate it."
    exit 1
}

# Try to find signtool.exe
$signtoolPath = $null

# Common locations for signtool.exe
$searchPaths = @(
    "C:\Program Files (x86)\Windows Kits\10\bin\x64",
    "C:\Program Files (x86)\Windows Kits\11\bin\x64",
    "C:\Program Files\Windows Kits\10\bin\x64"
)

foreach ($path in $searchPaths) {
    $toolPath = Join-Path $path "signtool.exe"
    if (Test-Path $toolPath) {
        $signtoolPath = $toolPath
        break
    }
}

# Check PATH environment variable
if (-not $signtoolPath) {
    try {
        $signtoolPath = (Get-Command signtool.exe -ErrorAction Stop).Source
    } catch {
        $signtoolPath = $null
    }
}

if (-not $signtoolPath) {
    Write-Host "WARNING: signtool.exe not found"
    Write-Host "Install Windows SDK to enable code signing"
    Write-Host ""
    exit 1
}

Write-Host "Found signtool.exe at: $signtoolPath"
Write-Host ""

# Find all .exe files in dist folder
$exeFiles = Get-ChildItem -Path $DistPath -Filter "*.exe" -Recurse

if ($exeFiles.Count -eq 0) {
    Write-Host "No .exe files found in $DistPath"
    exit 1
}

Write-Host "Signing $($exeFiles.Count) executable(s)..."
Write-Host ""

$certPassword = "824AI2026"
$certFile = (Resolve-Path ".\824AI-cert.pfx").Path

$signedCount = 0
$failedCount = 0

foreach ($exe in $exeFiles) {
    Write-Host "Signing: $($exe.Name)"
    
    $cmd = "`"$signtoolPath`" sign /f `"$certFile`" /p `"$certPassword`" /t http://timestamp.digicert.com /fd SHA256 `"$($exe.FullName)`""
    
    try {
        $output = Invoke-Expression $cmd 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Signed successfully"
            $signedCount++
        } else {
            Write-Host "  Signing failed: $output"
            $failedCount++
        }
    } catch {
        Write-Host "  Error: $_"
        $failedCount++
    }
}

Write-Host ""
Write-Host "======================================"
Write-Host "Signing Complete"
Write-Host "======================================"
Write-Host "Signed: $signedCount"
Write-Host "Failed: $failedCount"

if ($failedCount -gt 0) {
    exit 1
}
