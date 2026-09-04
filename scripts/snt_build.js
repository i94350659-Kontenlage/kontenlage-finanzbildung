/**
 * Scratch'n'Travel — Root Build Script for Vercel
 * Builds the Vite sub-app and copies dist to root /dist
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const appDir = path.join(__dirname, '..', 'AusbauÜberlegungen', 'Website analysis and badge creation')
const distSrc = path.join(appDir, 'dist')
const distDest = path.join(__dirname, '..', 'dist')

// 1. Install deps if needed
console.log('Installing dependencies...')
execSync('npm install', { cwd: appDir, stdio: 'inherit' })

// 2. Build the Vite app
console.log('Building Vite app...')
execSync('npm run build', { cwd: appDir, stdio: 'inherit' })

// 3. Copy dist to root
console.log('Copying dist to root...')
if (fs.existsSync(distDest)) {
  fs.rmSync(distDest, { recursive: true, force: true })
}
fs.cpSync(distSrc, distDest, { recursive: true })
console.log('Build complete! dist/ is ready for Vercel.')
