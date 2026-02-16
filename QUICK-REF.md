# 824AI Quick Reference Card

## Installation (First Time)

```
1. Right-click INSTALL.bat
2. Select "Run as administrator"  
3. Follow prompts (takes 5-10 minutes)
4. Double-click RUN.bat to start
```

## Running the App

- **Quick launch**: Double-click `RUN.bat`
- **Or from Start Menu**: Search for "824AI"
- **Or command line**: `npm start`

## If Server Won't Connect

**Problem**: App says "Loading model..." for more than 2 minutes

**Try this:**
1. **Wait 3 more minutes** - First startup is slow, this is normal
2. **Press F12** to see what's happening in console
3. **Restart the app** - Close completely, then open RUN.bat again
4. **Check RAM** - Need 4GB free RAM to run

**Still broken?** Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Using the App

| Action | How |
|--------|-----|
| Send message | Type + press Enter |
| Stop response | Click ⏹️ button |
| New chat | Click "New Chat" |
| Save chat | Click "💾 Save" |
| Settings | Click ⚙️ icon |
| Clear chat | Click "Clear History" |
| Dark mode | Click 🌙 button |
| Help | Click ❓ icon |

## Performance Tips

- **First response is slow** (30-60 seconds) - Normal. Subsequent ones are faster.
- **To make it faster**: Close other programs, use fewer tokens
- **Running on CPU only** - No GPU support by default
- **Why slow?** This is a CPU-optimized model, not GPU

## Common Settings

| Setting | What it does | Recommended |
|---------|-------------|-------------|
| Temperature | Randomness (0.1=focused, 0.7=creative) | 0.3 |
| Max Tokens | Response length (longer = slower) | 2048 |
| Thinking Mode | Presets for speed vs analysis | Normal |

## Getting Help

1. **Read TROUBLESHOOTING.md** - Most issues are there
2. **Press F12** - Check console for error messages
3. **Restart** - Fixes 80% of issues
4. **Check RAM/disk** - Need 4GB RAM, 10GB disk

## System Requirements

✓ Windows 10 or later  
✓ 4GB RAM (6GB+ better)  
✓ 10GB free disk space  
✓ Node.js v14+ (installer tells you if missing)

## Common Problems & Fixes

| Problem | Fix |
|---------|-----|
| "Node.js not found" | Install from nodejs.org, restart PC |
| App won't start | Run INSTALL.bat again as admin |
| Server won't connect | Wait 5 mins, restart app, check F12 console |
| Very slow responses | Normal on CPU. Close other programs |
| Takes lots of RAM | Expected with 7B model (~7GB) |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Send message |
| F12 | Open console (debugging) |
| Ctrl+L | Clear chat (usually) |

## File Locations

| What | Where |
|------|-------|
| App folder | `C:\824AI\` |
| Model file | `C:\824AI\llama\Qwen2.5-Coder-...gguf` |
| Logs | `%APPDATA%\824ai-startup.log` |
| Chat history | Browser storage (local) |

## When to Restart

- After changing settings
- If data looks wrong
- If "Server offline" persists
- After installing Windows updates

---

**Questions?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or [INSTALL-GUIDE.md](INSTALL-GUIDE.md)
