// app/main.js
// Rewritten main process for 824AI
// - Downloads model on first run (if configured)
// - Starts llama-server from resourcesPath
// - Reports progress and logs to renderer
// - Robust spawn, restart, and system monitor

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

let mainWindow = null;
let llamaProcess = null;
let monitorInterval = null;

/* ---------------------------
   Startup logging helper
   --------------------------- */
const logPath = (() => {
  try {
    return path.join(app.getPath ? app.getPath('userData') : process.env.APPDATA || '.', '824ai-startup.log');
  } catch (e) {
    return path.join('.', '824ai-startup.log');
  }
})();

function logStartup(msg) {
  const line = `${new Date().toISOString()} - ${msg}\n`;
  try {
    fs.appendFileSync(logPath, line);
  } catch (e) {
    try { console.log(line); } catch {}
  }
  // forward to renderer if available
  try {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('app-log', msg);
    }
  } catch (e) {}
}

process.on('uncaughtException', (err) => {
  logStartup(`uncaughtException: ${err && err.stack ? err.stack : err}`);
});
process.on('unhandledRejection', (reason) => {
  logStartup(`unhandledRejection: ${reason}`);
});

/* ---------------------------
   Downloader (optional)
   --------------------------- */
// If you added app/downloader.js, we will use it. If not present, we skip download logic.
let ensureModelDownloaded = null;
try {
  ensureModelDownloaded = require(path.join(__dirname, 'app', 'downloader')).ensureModelDownloaded;
  logStartup('Downloader module loaded.');
} catch (e) {
  logStartup('Downloader module not found; skipping auto-download logic.');
}

/* ---------------------------
   Config: model URL + checksum
   --------------------------- */
// If you want auto-download, set MODEL_URL and MODEL_SHA256 to valid values.
// Leave MODEL_URL empty to skip download and expect the model to be present in resources/llama/.
const MODEL_URL = ''; // e.g. 'https://your-host.example.com/Qwen2.5-Coder-7B-Instruct-abliterated-Q4_K_M.gguf'
const MODEL_SHA256 = ''; // e.g. 'abcdef1234...'

/* ---------------------------
   Resolve llama-server path robustly
   --------------------------- */
function getLlamaServerPath() {
  // In development vs production, paths are very different
  // Dev: c:\824AI\llama\llama-server.exe
  // Prod: resources/llama/llama-server.exe
  
  const candidates = [
    // Development mode (when running npm start)
    path.join(__dirname, '..', 'llama', 'llama-server.exe'),
    path.join(__dirname, '..', '..', 'llama', 'llama-server.exe'),
    // Production packaged
    path.join(process.resourcesPath, 'llama', 'llama-server.exe'),
    path.join(process.resourcesPath, 'app.asar.unpacked', 'llama', 'llama-server.exe'),
  ];

  logStartup(`Looking for llama-server.exe...`);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        logStartup(`✓ Found llama-server at: ${p}`);
        return p;
      }
    } catch (e) {}
  }

  logStartup(`✗ llama-server.exe not found in:`);
  candidates.forEach((p, i) => logStartup(`  ${i + 1}. ${p}`));
  return candidates[0];
}

function getModelPath() {
  const defaultModelName = 'Qwen2.5-Coder-7B-Instruct-abliterated-Q4_K_M.gguf';
  const candidates = [
    // Development (from app directory)
    path.join(__dirname, '..', 'llama', defaultModelName),
    path.join(__dirname, '..', '..', 'llama', defaultModelName),
    // Original development root (C:\824AI\llama\...)
    path.join('C:\\', '824AI', 'llama', defaultModelName),
    // Production bundled
    path.join(process.resourcesPath, 'llama', defaultModelName),
    path.join(process.resourcesPath, 'app.asar.unpacked', 'llama', defaultModelName),
    // User data directory fallback
    path.join(app.getPath ? app.getPath('userData') : '.', 'llama', defaultModelName),
  ];

  logStartup(`Looking for model: ${defaultModelName}`);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        logStartup(`✓ Found model at: ${p}`);
        return p;
      }
    } catch (e) {}
  }

  logStartup(`✗ Model file not found in any location`);
  candidates.forEach((p, i) => logStartup(`  ${i + 1}. ${p}`));
  return candidates[0];
}

/* ---------------------------
   Start llama server process
   --------------------------- */
function startLlamaServer(modelPathOverride) {
  if (llamaProcess) {
    logStartup('llama-server already running');
    return;
  }

  const llamaPath = getLlamaServerPath();
  const llamaCwd = path.dirname(llamaPath);
  const modelPath = modelPathOverride || getModelPath();

  // Verify files exist before trying to spawn
  if (!fs.existsSync(llamaPath)) {
    logStartup(`CRITICAL: llama-server.exe not found at: ${llamaPath}`);
    try { if (mainWindow) mainWindow.webContents.send('llama-error', `File not found: ${llamaPath}`); } catch (e) {}
    return;
  }

  if (!fs.existsSync(modelPath)) {
    logStartup(`CRITICAL: Model file not found at: ${modelPath}`);
    try { if (mainWindow) mainWindow.webContents.send('llama-error', `Model file not found: ${modelPath}`); } catch (e) {}
    return;
  }

  logStartup(`Starting llama-server...`);
  logStartup(`  Executable: ${llamaPath}`);
  logStartup(`  Model: ${modelPath}`);
  logStartup(`  CPU cores: ${os.cpus().length}`);

  const args = [
    '--model', modelPath,
    '--port', '8080',
    '--host', '127.0.0.1',
    '--ctx-size', '8192',
    '--batch-size', '256',
    '--threads', String(Math.max(1, Math.floor(os.cpus().length / 2))),
    '--gpu-layers', '1',
    '--no-warmup',
    '-np', '1'
  ];

  try {
    logStartup(`Spawning: ${llamaPath}`);
    logStartup(`Working directory: ${llamaCwd}`);
    logStartup(`Model exists: ${fs.existsSync(modelPath)}`);
    logStartup(`Binary exists: ${fs.existsSync(llamaPath)}`);
    
    // Create environment with PATH that includes llama directory for DLLs
    const env = Object.assign({}, process.env);
    env.PATH = llamaCwd + path.delimiter + (env.PATH || '');
    
    llamaProcess = spawn(llamaPath, args, { 
      cwd: llamaCwd,
      env: env,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false
    });

    if (!llamaProcess) {
      logStartup(`CRITICAL: Failed to spawn process`);
      return;
    }

    logStartup(`Process spawned with PID: ${llamaProcess.pid}`);

    llamaProcess.stdout.on('data', (data) => {
      const s = data.toString().trim();
      if (s) {
        logStartup(`[llama] ${s}`);
        
        // Check for startup indicators
        if (s.includes('listening') || s.includes('server started') || s.includes('ready')) {
          logStartup(`✓✓✓ SERVER READY ✓✓✓`);
          try { if (mainWindow) mainWindow.webContents.send('llama-ready'); } catch (e) {}
        }
        
        try { if (mainWindow) mainWindow.webContents.send('llama-log', { text: s }); } catch (e) {}
      }
    });

    llamaProcess.stderr.on('data', (data) => {
      const s = data.toString().trim();
      if (s) {
        logStartup(`[llama ERR] ${s}`);
        try { if (mainWindow) mainWindow.webContents.send('llama-log', { text: s, error: true }); } catch (e) {}
      }
    });

    llamaProcess.on('close', (code) => {
      logStartup(`llama-server exited with code ${code}`);
      if (code !== 0) {
        logStartup(`ERROR: Process exited with non-zero code. Check DLLs and dependencies.`);
      }
      llamaProcess = null;
    });

    llamaProcess.on('error', (err) => {
      logStartup(`CRITICAL SPAWN ERROR: ${err.message}`);
      logStartup(`Path checked: ${llamaPath}`);
      logStartup(`Does file exist? ${fs.existsSync(llamaPath)}`);
      logStartup(`CWD: ${llamaCwd}`);
      logStartup(`CWD exists? ${fs.existsSync(llamaCwd)}`);
      llamaProcess = null;
    });

  } catch (err) {
    logStartup(`CRITICAL: Exception in startLlamaServer: ${err.message}`);
    logStartup(`Stack: ${err.stack}`);
    llamaProcess = null;
  }
}

/* ---------------------------
   Stop llama server process
   --------------------------- */
function stopLlamaServer() {
  if (!llamaProcess) return;
  try {
    logStartup('Stopping llama-server');
    try { llamaProcess.kill(); } catch (e) { logStartup(`kill error: ${e}`); }
    llamaProcess = null;
  } catch (e) {
    logStartup(`stopLlamaServer error: ${e}`);
  }
}

/* ---------------------------
   Create main window
   --------------------------- */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0f1a2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
}
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/* ---------------------------
   Pre-warm trigger (fire-and-forget)
   --------------------------- */
function prewarmModel() {
  setTimeout(() => {
    if (!mainWindow) return;
    try {
      mainWindow.webContents.send('prewarm');
      logStartup('Sent prewarm signal to renderer');
    } catch (e) {
      logStartup(`prewarm send error: ${e}`);
    }
  }, 1500);
}

/* ---------------------------
   System monitor (IPC)
   --------------------------- */

ipcMain.on('system-monitor-start', (event) => {
  const wc = event.sender;
  if (monitorInterval) return;

  logStartup('Starting system monitor');
  
  monitorInterval = setInterval(() => {
    try {
      const load = os.loadavg ? os.loadavg()[0] / Math.max(1, os.cpus().length) : 0;
      const cpuPercent = Math.min(100, Math.max(0, Math.round(load * 100)));

      const total = os.totalmem();
      const free = os.freemem();
      const used = total - free;
      const ramPercent = Math.round((used / total) * 100);

      wc.send('system-stats', {
        cpu: cpuPercent,
        ram: ramPercent,
        gpu: null,
        vram: null
      });
    } catch (e) {
      logStartup(`system-monitor error: ${e}`);
    }
  }, 1000);
});

ipcMain.on('system-monitor-stop', () => {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
    logStartup('Stopped system monitor');
  }
});

/* ---------------------------
   Download + start orchestration
   --------------------------- */
async function downloadAndStart() {
  // If downloader is not available or MODEL_URL is empty, just start server (expect model present)
  if (!ensureModelDownloaded || !MODEL_URL) {
    logStartup('Downloader not configured or MODEL_URL empty — starting llama-server assuming model exists.');
    startLlamaServer();
    return;
  }

  try {
    logStartup('Checking/downloading model...');
    // send UI that download started
    try { if (mainWindow) mainWindow.webContents.send('download-start'); } catch (e) {}

    const modelPath = await ensureModelDownloaded({
      url: MODEL_URL,
      expectedSha256: MODEL_SHA256,
      onProgress: (received, total) => {
        const pct = total ? Math.round((received / total) * 100) : null;
        try { if (mainWindow) mainWindow.webContents.send('download-progress', { received, total, pct }); } catch (e) {}
      }
    });

    logStartup(`Model ready at: ${modelPath}`);
    try { if (mainWindow) mainWindow.webContents.send('download-complete', { path: modelPath }); } catch (e) {}

    // start server with downloaded model
    startLlamaServer(modelPath);
  } catch (err) {
    logStartup(`Model download/start failed: ${err && err.stack ? err.stack : err}`);
    try { if (mainWindow) mainWindow.webContents.send('download-error', String(err)); } catch (e) {}
    // Optionally prompt user to retry or open settings
    try {
      dialog.showErrorBox('Model download failed', String(err));
    } catch (e) {}
    // fallback: attempt to start server anyway (if model already present)
    startLlamaServer();
  }
}

/* ---------------------------
   App lifecycle
   --------------------------- */
app.whenReady().then(() => {
  try {
    createWindow();

    // Start download + server in background (so UI can show progress)
    downloadAndStart();

    prewarmModel();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  } catch (e) {
    logStartup(`app.whenReady error: ${e && e.stack ? e.stack : e}`);
  }
});

app.on('before-quit', () => {
  logStartup('App before-quit: stopping services');
  if (monitorInterval) { clearInterval(monitorInterval); monitorInterval = null; }
  stopLlamaServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    try { stopLlamaServer(); } catch (e) { logStartup(`window-all-closed stop error: ${e}`); }
    app.quit();
  }
});

/* ---------------------------
   IPC: restart llama
   --------------------------- */
ipcMain.handle('restart-llama', async () => {
  try {
    stopLlamaServer();
    await new Promise((r) => setTimeout(r, 600));
    // If downloader is configured, re-run downloadAndStart to ensure model presence
    if (ensureModelDownloaded && MODEL_URL) {
      await downloadAndStart();
    } else {
      startLlamaServer();
    }
    return { ok: true };
  } catch (e) {
    logStartup(`restart-llama error: ${e}`);
    return { ok: false, error: String(e) };
  }
});

/* ---------------------------
   IPC: request logs or manual download trigger
   --------------------------- */
ipcMain.handle('get-startup-log', async () => {
  try {
    if (fs.existsSync(logPath)) {
      return { ok: true, text: fs.readFileSync(logPath, 'utf8') };
    }
    return { ok: true, text: '' };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
});

ipcMain.handle('trigger-download', async () => {
  try {
    if (!ensureModelDownloaded || !MODEL_URL) {
      return { ok: false, error: 'Downloader not configured' };
    }
    await downloadAndStart();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
});

/* ---------------------------
   IPC: save and load chat history
   --------------------------- */
const chatHistoryPath = (() => {
  try {
    return path.join(app.getPath('userData'), 'chat-history.json');
  } catch (e) {
    return path.join('.', 'chat-history.json');
  }
})();

ipcMain.handle('save-chat-history', async (event, chats) => {
  try {
    fs.writeFileSync(chatHistoryPath, JSON.stringify(chats, null, 2), 'utf8');
    return { ok: true };
  } catch (e) {
    logStartup(`save-chat-history error: ${e}`);
    return { ok: false, error: String(e) };
  }
});

ipcMain.handle('load-chat-history', async () => {
  try {
    if (!fs.existsSync(chatHistoryPath)) {
      return { ok: true, chats: [] };
    }
    const data = fs.readFileSync(chatHistoryPath, 'utf8');
    const chats = JSON.parse(data);
    return { ok: true, chats };
  } catch (e) {
    logStartup(`load-chat-history error: ${e}`);
    return { ok: true, chats: [] };
  }
});



