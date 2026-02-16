# 824AI - Build Instructions

## Building the Windows .exe Installer

### Prerequisites
- Node.js (v14+) installed
- npm installed
- All dependencies should already be installed from `package.json`

### Build Steps

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Build the .exe installer**:
```bash
npm run dist:win
```

This will create:
- `dist/824AI Setup 1.0.0.exe` - NSIS installer (recommended for most users)
- `dist/824AI 1.0.0.exe` - Portable executable (no installation needed)

3. **Find your installers** in the `dist/` folder

### What the Installer Does

- Downloads and installs 824AI to the user's Program Files
- Creates Start Menu shortcuts
- Creates Desktop shortcut
- Bundles the llama-server.exe and all required files
- Handles uninstallation cleanly

### Running the App During Development

```bash
npm start
```

This launches the Electron app without building an installer.

### Customization

To customize the installer:
- Edit `package.json` build settings
- Add your own icon: place `icon.ico` in the root directory
- Modify the productName for branding

### Troubleshooting

**Error: llama-server.exe not found**
- Ensure `llama/` directory contains `llama-server.exe`

**Build fails with dependency errors**
- Run `npm install` again
- Delete `node_modules/` and reinstall if needed

**Installer won't run**
- Check that you're on Windows 10 or later
- Ensure the build completed successfully
- Check the `dist/` folder for the .exe file

## Code Signing (Fix "Can't Run on This PC" Error)

If users get "This app can't run on your PC" when downloading on a different machine (especially VMs), the executable needs to be code-signed.

See [CODE_SIGNING.md](CODE_SIGNING.md) for complete setup instructions:
1. Generate a self-signed certificate with `create-cert.ps1`
2. Build with `npm run dist:win` (will automatically sign executables)
3. On target machines, install the certificate with `install-cert.ps1`

**Quick start:**
```powershell
# On build machine (Administrator)
.\create-cert.ps1
npm run dist:win

# On each target VM (Administrator)
.\install-cert.ps1 "path\to\824AI-cert.cer"
```
