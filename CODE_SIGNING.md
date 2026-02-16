# Code Signing Setup for 824AI

## Overview

This setup uses a self-signed certificate to code-sign the 824AI executable. This prevents the "This app can't run on your PC" error that occurs when Windows blocks unsigned executables, particularly in VMs with strict security policies.

## Prerequisites

- Windows 10 or later
- PowerShell (Windows built-in)
- Windows SDK (for signtool.exe) - **REQUIRED for signing**
  - Download: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
  - Or install via: `winget install Microsoft.WindowsSDK`

## Setup Steps

### Step 1: Generate Self-Signed Certificate

Run this on your build machine (requires Administrator):

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\create-cert.ps1
```

This creates:
- `824AI-cert.pfx` - Certificate with private key (for signing)
- `824AI-cert.cer` - Public certificate (for distribution)

**Password:** `824AI2026`

### Step 2: Build the Signed Executable

```bash
npm run dist:win
```

The build process will:
1. Sign the NSIS installer
2. Sign the portable executable
3. Generate signed installers in the `dist/` folder

If signtool.exe is not found, the signing will be skipped with a warning, but the build will complete.

### Step 3: Install Certificate on Target Machines

On each VM or machine where you want to run the app, install the certificate:

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-cert.ps1 "path\to\824AI-cert.cer"
```

Example:
```powershell
.\install-cert.ps1 "C:\Downloads\824AI-cert.cer"
```

After installation, the signed executable will run without warnings.

## Distribution Steps

1. **For internal/private distribution:**
   - Share both the installer AND the `824AI-cert.cer` file
   - Have users run `install-cert.ps1 "path\to\824AI-cert.cer"` before running the app

2. **Alternative - Include cert in installer:**
   - Add certificate installation step to NSIS installer script
   - Users won't need to manually install the cert

3. **For public distribution:**
   - Purchase a code signing certificate from a provider (DigiCert, Sectigo, etc.)
   - Update `package.json` with your certificate details
   - No user intervention required for certificate installation

## Files

- `create-cert.ps1` - Generate self-signed certificate (run once on build machine)
- `install-cert.ps1` - Install certificate on target machine (run on each VM)
- `customSign.js` - Signing script used by electron-builder
- `824AI-cert.pfx` - Certificate file (keep secure, don't share)
- `824AI-cert.cer` - Public certificate (safe to share for installation)

## Troubleshooting

### "signtool.exe not found"
- Install Windows SDK: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
- Or add to PATH if already installed (usually in `C:\Program Files (x86)\Windows Kits\10\bin\x.x.xxxxx.0\x64\`)

### "This app can't run on your PC" still appears
- Verify certificate is installed: `certlm.msc` → Trusted Root Certification Authorities → view installed certs
- The certificate "CN=824AI Code Signing" should be visible
- Restart the system after installing the certificate
- Make sure you're using the signed executable from `dist/` folder

### Certificate password needed
- Default password: `824AI2026`
- Change in `create-cert.ps1` and `customSign.js` if needed

## Security Notes

⚠️ **Important:**
- Keep `824AI-cert.pfx` secure - it's the private key
- Don't commit it to public repositories
- Add to `.gitignore`:
  ```
  824AI-cert.pfx
  *.pfx
  ```
- Only share the `.cer` file for certificate installation

## Upgrading to Production Certificate

When ready for public distribution:
1. Purchase a code signing certificate (EV recommended for best user experience)
2. Update `package.json` with certificate path and password
3. Rebuild: `npm run dist:win`
4. Users can run the app directly without installing any certificates

## References
- [Windows Code Signing](https://docs.microsoft.com/en-us/windows/application-management/app-v/appv-signing-signing-overview)
- [Electron Builder Code Signing](https://www.electron.build/code-signing)
- [SignTool.exe Documentation](https://docs.microsoft.com/en-us/windows/win32/seccrypto/signtool)
