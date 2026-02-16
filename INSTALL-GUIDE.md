# 824AI - Consumer Installation Guide

## Quick Start (Easiest Way)

### For End Users (Just Want to Use It)

1. **Download and extract** the 824AI folder
2. **Right-click `INSTALL.bat`** → Select **"Run as administrator"**
3. Follow the prompts
4. When done, **double-click `RUN.bat`** or find "824AI" in Start Menu

That's it! The app will handle everything else.

---

## What You Need

- **Windows 10 or later** (64-bit)
- **4GB RAM minimum** (6GB+ recommended)
- **10GB free disk space** (for the model file)
- **Node.js** (don't have it? The installer will tell you - download from https://nodejs.org/)

---

## Installation Methods

### Method 1: Easy installer (Recommended for most people)

```
1. Right-click INSTALL.bat → Run as administrator
2. Answer the prompts
3. The installer is ready to use
```

### Method 2: Command line (For advanced users)

```
npm install
npm run dist:win
```

### Method 3: Just run it temporarily (No install)

```
1. Right-click INSTALL.bat → Run as administrator
2. After done, double-click RUN.bat to play around
3. App closes when you close the window
```

---

## First Time Setup

**First startup is slow** - This is normal:

1. Model needs to load into memory (1-3 minutes)
2. Status bar shows "Loading model..."
3. Be patient - subsequent startups are faster

---

## Using the App

- **Send a message** - Type and press Enter
- **Stop response** - Click the red stop button
- **Adjust settings** - Click ⚙️ icon (settings slider, temperature)
- **Save chat** - Use "Save Chat" button
- **Dark mode** - Click 🌙 button

---

## Key Differences from ChatGPT

- **Runs locally** - No internet needed, completely private
- **Slower** - Uses CPU only, not GPU (30-60 seconds per response)
- **Free to use** - No API charges
- **Smaller model** - Not as powerful as GPT-4, but still very capable
- **License required** - You need to enter a license key to chat

---

## Common Questions

**Q: Is it safe?**  
A: Yes. Runs completely offline on your computer. No data sent anywhere.

**Q: Why is it so slow?**  
A: Uses CPU only. If you need GPU support, manually install GPU drivers. See TROUBLESHOOTING.md

**Q: Can I share the installer?**  
A: Yes! Share `dist/824AI Setup 1.0.0.exe` - others can run it directly.

**Q: How do I uninstall?**  
A: Use Windows Add/Remove Programs. Or delete the 824AI folder.

**Q: Where are my chats saved?**  
A: Locally in your user data folder - never sent anywhere.

---

## Need Help?

1. **Having issues?** → Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Want to build from source?** → Read [BUILD.md](BUILD.md)
3. **Need code signing?** → Read [CODE_SIGNING.md](CODE_SIGNING.md)

---

## For Developers

If you're setting up for development:

```
git clone <repo>
cd 824AI
npm install
npm start
```

See BUILD.md for detailed build instructions.

---

**Happy coding!** 🚀
