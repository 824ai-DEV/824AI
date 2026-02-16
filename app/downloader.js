// app/downloader.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function downloadFile(url, destPath, onProgress) {
  return new Promise((resolve, reject) => {
    const tmp = destPath + '.part';
    const file = fs.createWriteStream(tmp);
    let received = 0;
    let total = 0;

    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadFile(res.headers.location, destPath, onProgress));
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Download failed: ' + res.statusCode));
      }
      total = parseInt(res.headers['content-length'] || '0', 10);
      res.on('data', (chunk) => {
        received += chunk.length;
        if (onProgress && total) onProgress(received, total);
      });
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          fs.renameSync(tmp, destPath);
          resolve();
        });
      });
    });

    req.on('error', (err) => {
      try { fs.unlinkSync(tmp); } catch (e) {}
      reject(err);
    });
  });
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const rs = fs.createReadStream(filePath);
    rs.on('error', reject);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest('hex')));
  });
}

async function ensureModelDownloaded({ url, expectedSha256, onProgress }) {
  const modelDir = path.join(process.resourcesPath, 'llama');
  const modelName = 'Qwen2.5-Coder-7B-Instruct-abliterated-Q4_K_M.gguf';
  const modelPath = path.join(modelDir, modelName);

  ensureDir(modelDir);

  if (fs.existsSync(modelPath)) {
    if (expectedSha256) {
      try {
        const existingHash = await sha256File(modelPath);
        if (existingHash === expectedSha256) return modelPath;
        fs.unlinkSync(modelPath);
      } catch (e) { /* fall through to download */ }
    } else {
      return modelPath;
    }
  }

  await downloadFile(url, modelPath, onProgress);

  if (expectedSha256) {
    const hash = await sha256File(modelPath);
    if (hash !== expectedSha256) {
      fs.unlinkSync(modelPath);
      throw new Error('Checksum mismatch after download');
    }
  }

  try { fs.chmodSync(modelPath, 0o666); } catch (e) {}
  return modelPath;
}

module.exports = { ensureModelDownloaded };

