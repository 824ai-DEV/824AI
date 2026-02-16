// app/preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

/* -----------------------------------------
   EXPOSE API TO RENDERER
   ----------------------------------------- */
let checkServerStatus = async (maxRetries = 3) => {
  // Try the /health endpoint first, then fall back to /models
  const endpoints = [
    { url: 'http://127.0.0.1:8080/health', name: 'health' },
    { url: 'http://127.0.0.1:8080/v1/models', name: 'models' },
  ];
  
  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(endpoint.url, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return { ok: true, status: response.status, endpoint: endpoint.name };
      }
    } catch (err) {
      // Try next endpoint
    }
  }
  
  // All endpoints failed - server not ready
  return { ok: false, error: 'Server not responding on any endpoint' };
};

contextBridge.exposeInMainWorld('api', {
  /* ---------------------------
     CHECK SERVER STATUS
     --------------------------- */
  checkServerStatus: checkServerStatus,

  /* ---------------------------
     STREAMING PROMPT
     --------------------------- */
  streamPrompt: async (text, onToken, options = {}) => {
    const maxTokens = options.maxTokens || 2048;
    const temperature = options.temperature || 0.3;
    
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Qwen2.5-Coder-7B-Instruct-abliterated-Q4_K_M.gguf',
        messages: [{ role: 'user', content: text }],
        stream: true,
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: 0.95,
        top_k: 40,
        repeat_penalty: 1.0
      })
    };
    
    // Only add signal if it's a valid AbortSignal
    if (options.abortSignal && 
        typeof options.abortSignal === 'object' && 
        typeof options.abortSignal.abort === 'function') {
      fetchOptions.signal = options.abortSignal;
    }
    
    const response = await fetch('http://127.0.0.1:8080/v1/chat/completions', fetchOptions);

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        throw new Error(`Server starting up... (${response.status}). Please try again in 5-10 seconds.`);
      }
      throw new Error(`Server error: ${response.status} - llama-server not responding. Check console (F12) for details.`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n');
      buffer = parts.pop();

      for (const part of parts) {
        if (!part.trim().startsWith('data:')) continue;

        const json = part.replace('data:', '').trim();
        if (json === '[DONE]') continue;

        try {
          const parsed = JSON.parse(json);
          const token = parsed.choices?.[0]?.delta?.content;
          if (token) onToken(token);
        } catch (err) {
          console.error('stream parse error', err);
        }
      }
    }
  },

  /* ---------------------------
     CHAT HISTORY
     --------------------------- */
  saveChatHistory: async (chats) => {
    try {
      await ipcRenderer.invoke('save-chat-history', chats);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  loadChatHistory: async () => {
    try {
      const result = await ipcRenderer.invoke('load-chat-history');
      return result;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  /* ---------------------------
     PRE-WARM HOOK
     --------------------------- */
  onPrewarm: (handler) => {
    ipcRenderer.on('prewarm', handler);
  },

  /* ---------------------------
     SYSTEM MONITOR
     --------------------------- */
  startSystemMonitor: () => ipcRenderer.send('system-monitor-start'),
  stopSystemMonitor: () => ipcRenderer.send('system-monitor-stop'),
  onSystemStats: (handler) => {
    ipcRenderer.on('system-stats', (_event, stats) => handler(stats));
  }
});
