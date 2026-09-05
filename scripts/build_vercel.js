const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const appDir = path.join(rootDir, 'webseitenversionen', '4.9.2026');
const distDir = path.join(rootDir, 'dist');
const appDistDir = path.join(appDir, 'dist');

console.log('[Build] Installing dependencies in', appDir);
execSync('npm install --include=dev', { cwd: appDir, stdio: 'inherit' });

console.log('[Build] Building React app in', appDir);
execSync('npm run build', { cwd: appDir, stdio: 'inherit' });

console.log('[Build] Syncing dist directory to root dist...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.cpSync(appDistDir, distDir, { recursive: true });

// Also copy index.html to root for fallback
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(rootDir, 'index.html'));

// Copy assets to root assets if needed
const rootAssetsDir = path.join(rootDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  if (!fs.existsSync(rootAssetsDir)) {
    fs.mkdirSync(rootAssetsDir, { recursive: true });
  }
  fs.cpSync(distAssetsDir, rootAssetsDir, { recursive: true });
}

console.log('[Build] Successfully built and synced Kontenlage v4 to root and dist!');
