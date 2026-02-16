# 824AI Troubleshooting Guide

## Server Connection Issues

### Problem: "Server still loading" after downloading model

**Cause:** The llama-server takes time to initialize, especially on first run. The model needs to be loaded into memory.

**Solutions:**

1. **Wait Longer**: The app now waits up to 60 seconds on first startup. Be patient - this is normal.

2. **Check Console Logs**: 
   - Press `F12` to open Developer Tools
   - Look for messages starting with `[llama]`
   - These show what the server is doing

3. **Restart the App**: Sometimes a restart helps
   - Close the app completely
   - Wait 5 seconds
   - Run `RUN.bat` or double-click the Start Menu shortcut

4. **Check Resources**:
   - Ensure you have at least 4GB free RAM
   - Close other heavy applications
   - Try closing browsers and IDE

### Problem: App crashes or won't start

**Cause:** Missing dependencies, corrupted installation, or Windows Defender/antivirus blocking.

**Solutions:**

1. **Reinstall Dependencies**:
   ```
   Run INSTALL.bat as Administrator
   ```

2. **Check Antivirus**:
   - Windows Defender or antivirus may block the llama-server
   - Add the app folder to antivirus exclusions
   - `C:\824AI\llama\llama-server.exe`

3. **Verify Files Exist**:
   - Check that `llama/llama-server.exe` exists
   - Check that `llama/Qwen2.5-Coder-7B-Instruct-abliterated-Q4_K_M.gguf` exists
   - If missing, re-download them

### Problem: "Server error 502/503"

**Cause:** llama-server crashed or is still warming up model.

**Solutions:**

1. **Wait 10-30 seconds** and try again
2. **Check F12 console** for detailed error messages
3. **Restart** the app completely
4. If it keeps failing, check that you have:
   - 4GB+ free RAM
   - 10GB+ disk space
   - Windows 10 or later

## Installation Issues

### Problem: PowerShell scripts don't work

**Solution:** Use the new `.bat` installers instead:
- Run `INSTALL.bat` as Administrator
- Then run `RUN.bat` to launch the app

### Problem: "Node.js not found"

**Solution:**
1. Install Node.js: https://nodejs.org/ (get LTS version)
2. Restart your computer
3. Run `INSTALL.bat` again

### Problem: "npm install fails"

**Solution:**
1. Delete `node_modules` folder (if exists)
2. Delete `package-lock.json` file
3. Run `INSTALL.bat` again as Administrator

## Performance Tips

### Models are slow / taking forever

1. **First startup is slow** - The model loads once, then is cached
2. **CPU-only mode** - This version runs on CPU, not GPU
   - Slower than GPU (expected)
   - Works on any PC without special hardware
   - Takes 30-60 seconds per response on CPU
   - Normal 4-core CPU = ~45 seconds for 2048 tokens

3. **To speed up:**
   - Close other programs
   - Use fewer tokens (Settings → adjust Max Tokens slider)
   - Use simpler thinking modes ("Normal" instead of "Deep Thought")

### App is using too much RAM

- Normal usage: 6-8GB when running model
- This is expected with Qwen 7B model
- To reduce: Switch to smaller model (if available)

## Logs & Debugging

### View Detailed Logs

1. Press `F12` in the app to open Console
2. Look for messages starting with:
   - `[llama]` - Server messages
   - `[llama ERR]` - Server errors

### Find Log Files

- Win + R → `%APPDATA%\824ai-startup.log`
- This shows the full startup history

## Can't Find Something?

- **Model file huge?** (3.5GB) - Yes, that's normal
- **Installing takes forever?** - npm can be slow, be patient
- **First response takes 1 minute?** - Normal, model needs to warm up
- **App runs in background?** - Check taskbar or use Task Manager (Ctrl+Shift+Esc)

## Still Having Issues?

1. **Check README.md** - General setup instructions
2. **Read BUILD.md** - Building from source
3. **Check the log files** - F12 console or %APPDATA%\824ai-startup.log

---

**Last Updated:** February 2026
