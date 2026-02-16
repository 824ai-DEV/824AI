# 824AI — Private, Offline AI Coding Assistant

> A fully offline AI assistant that runs on your PC. No internet required. No data leaves your machine. Ever.

![Platform](https://img.shields.io/badge/platform-Windows%2010%2B-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Model](https://img.shields.io/badge/model-Qwen%207B-orange)

---

## What is 824AI?

824AI is a **desktop AI chat application** (like ChatGPT) that runs **100% locally** on your computer. It uses the Qwen 2.5 Coder 7B model via llama.cpp — no API keys, no cloud, no subscriptions beyond initial setup.

### Features

- **Completely offline** — works without internet after setup
- **Private** — no data sent anywhere, ever
- **Chat interface** — familiar ChatGPT-style UI
- **Code-focused** — optimized for programming questions
- **Syntax highlighting** — code blocks with copy buttons
- **Multiple thinking modes** — Normal, Focused, Deep Thought, Creative
- **Chat history** — save, search, and organize conversations
- **Settings profiles** — save and switch between configurations
- **Dark mode** — easy on the eyes
- **System monitor** — see CPU/RAM usage in real-time
- **Folders** — organize chats into folders

---

## Quick Start (3 Steps)

### Prerequisites

- **Windows 10 or later** (64-bit)
- **[Node.js](https://nodejs.org/)** (v14+) — download the LTS version
- **4 GB RAM minimum** (8 GB recommended)
- **10 GB free disk space**

### Step 1: Download

**Option A — Download ZIP (easiest):**
1. Click the green **"Code"** button above
2. Click **"Download ZIP"**
3. Extract the ZIP to a folder (e.g. `C:\824AI`)

**Option B — Git clone:**
```bash
git clone https://github.com/824ai-DEV/824AI.git
cd 824AI
```

### Step 2: Download the Model & Server

You need two files that are too large for GitHub:

| File | Size | Download |
|------|------|----------|
| `llama-server.exe` | ~5 MB | [llama.cpp releases](https://github.com/ggml-org/llama.cpp/releases) — download the Windows build |
| `Qwen2.5-Coder-7B-Instruct-abliterated-Q4_K_M.gguf` | ~4.4 GB | [Hugging Face](https://huggingface.co/bartowski/Qwen2.5-Coder-7B-Instruct-abliterated-GGUF) |

Place both files in the `llama/` folder:
```
824AI/
  llama/
    llama-server.exe     ← put here
    Qwen2.5-Coder-...gguf  ← put here
    ggml.dll             ← already included
    ...other DLLs        ← already included
```

### Step 3: Install & Run

**Easy way (recommended):**
1. Right-click **`INSTALL.bat`** → **"Run as administrator"**
2. Follow the prompts
3. Double-click **`RUN.bat`** to launch

**Manual way:**
```bash
npm install
npm start
```

---

## Using the App

### First Launch

1. The app will show **"Loading model..."** — this takes **1–3 minutes** on first run (normal!)
2. Once you see **"Ready"**, you're good to go
3. Enter a license key when prompted (see [LICENSING.md](LICENSING.md))
4. Start chatting!

### Interface

| Action | How |
|--------|-----|
| Send message | Type + press **Enter** |
| Stop response | Click the **Stop** button |
| New chat | Click **"New Chat"** |
| Settings | Click **⚙️** icon |
| Dark mode | Click **🌙** button |
| System monitor | Click **📊** button |
| Help | Click **❓** button |

### Thinking Modes

| Mode | Temperature | Best For |
|------|-------------|----------|
| **Normal** | 0.3 | General coding help |
| **Focused** | 0.2 | Precise, analytical tasks |
| **Deep Thought** | 0.1 | Complex debugging, architecture |
| **Creative** | 0.7 | Brainstorming, naming, design |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `F12` | Open developer console (for debugging) |

---

## Troubleshooting

### "Server offline" or won't connect

- **Wait 1–3 minutes** — model loading is slow on first run, this is normal
- **Press F12** → check Console tab for error messages
- **Restart the app** — close completely, then reopen
- **Check RAM** — you need at least 4 GB free

### "Node.js not found"

- Install from [nodejs.org](https://nodejs.org/) (LTS version)
- Restart your computer
- Try again

### "llama-server.exe not found"

- Download from [llama.cpp releases](https://github.com/ggml-org/llama.cpp/releases)
- Place in the `llama/` folder

### "Model file not found"

- Download from [Hugging Face](https://huggingface.co/bartowski/Qwen2.5-Coder-7B-Instruct-abliterated-GGUF)
- Place the `.gguf` file in the `llama/` folder

### Slow responses

- **Normal** — CPU-only inference takes 30–60 seconds per response
- Close other programs to free RAM
- Use fewer tokens (Settings → Max Tokens slider)
- Uses ~7 GB RAM when running — that's expected

### More help

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

---

## Building the Installer

Want to create a `.exe` installer to share with others?

```bash
npm run dist:win
```

This creates:
- `dist/824AI Setup 1.0.0.exe` — NSIS installer
- `dist/824AI 1.0.0.exe` — Portable executable

See [BUILD.md](BUILD.md) for full build instructions.

---

## Project Structure

```
824AI/
├── app/
│   ├── main.js          # Electron main process (server management)
│   ├── renderer.js      # UI logic (chat, settings, history)
│   ├── preload.js       # API bridge (server communication)
│   ├── downloader.js    # Model downloader (optional)
│   ├── index.html       # Main app UI
│   └── styles.css       # App styling
├── llama/
│   ├── llama-server.exe # LLM inference server (not in repo — download separately)
│   ├── *.gguf           # Model file (not in repo — download separately)
│   └── *.dll            # Required DLLs (included)
├── config/
│   └── system-prompt.txt
├── INSTALL.bat          # Easy installer
├── RUN.bat              # Quick launcher
└── package.json
```

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Windows 10 (64-bit) | Windows 11 |
| RAM | 4 GB | 8 GB+ |
| Disk | 10 GB free | 15 GB free |
| CPU | Any x64 | 4+ cores |
| GPU | Not required | Not used (CPU only) |
| Node.js | v14+ | v18+ LTS |

---

## FAQ

**Q: Is it free?**
A: The app is free. You need a license key to chat (see [LICENSING.md](LICENSING.md)).

**Q: Is my data safe?**
A: Yes. Everything runs on your machine. No data is sent anywhere.

**Q: Can I use a different model?**
A: Yes — place any GGUF model in the `llama/` folder and update the model name in `main.js`.

**Q: Why is it slow?**
A: Runs on CPU only. GPU support is not included by default. 30–60 second responses are normal.

**Q: Can I share the installer with others?**
A: Yes! Build with `npm run dist:win` and share the `.exe` from the `dist/` folder.

**Q: Do I need internet?**
A: Only for initial setup (downloading Node.js, npm packages, model). After that, fully offline.

---

## Documentation

| Document | Description |
|----------|-------------|
| [INSTALL-GUIDE.md](INSTALL-GUIDE.md) | Detailed installation guide |
| [BUILD.md](BUILD.md) | Building from source |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues & fixes |
| [LICENSING.md](LICENSING.md) | License key information |
| [CODE_SIGNING.md](CODE_SIGNING.md) | Code signing for distribution |
| [QUICK-REF.md](QUICK-REF.md) | Quick reference card |

---

## License

ISC License. See [package.json](package.json).

---

**Made with ❤️ by 824AI-DEV**
