import pathlib, json

root = pathlib.Path(r"G:\Scratch´nTravel")

# The real root cause of 404: Vercel can't handle the Unicode "ü" in dir path on Linux.
# Solution: Use VERCEL_BUILD_STEP via a simpler node build.js at root + outputDirectory dist
# Step 1: write /build.js at root that Vercel can call
build_js = '''/**
 * Vercel Build Entry Point for Scratch'n'Travel
 * Runs inside the Linux Vercel build container
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const appDir = path.join(__dirname, 'AusbauUberlegungen', 'Website analysis and badge creation')
const distSrc = path.join(appDir, 'dist')
const distDest = path.join(__dirname, 'dist')

execSync('npm install', { cwd: appDir, stdio: 'inherit' })
execSync('npm run build', { cwd: appDir, stdio: 'inherit' })

if (fs.existsSync(distDest)) fs.rmSync(distDest, { recursive: true, force: true })
fs.cpSync(distSrc, distDest, { recursive: true })
console.log('Build complete!')
'''

# We can't write build.js to root (permission), let's update vercel.json to use
# a direct Vite output approach instead - skip the copy entirely
# Just tell Vercel where the built files are, and set buildCommand to cd into the app dir
# The key insight: Vercel on Linux supports Unicode in paths just fine via shell quoting

vercel = {
    "version": 2,
    "name": "scratch-n-travel",
    "cleanUrls": True,
    "trailingSlash": False,
    "installCommand": "npm install --prefix 'AusbauÜberlegungen/Website analysis and badge creation'",
    "buildCommand": "npm run build --prefix 'AusbauÜberlegungen/Website analysis and badge creation'",
    "outputDirectory": "AusbauÜberlegungen/Website analysis and badge creation/dist",
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {"key": "X-Content-Type-Options", "value": "nosniff"},
                {"key": "X-Frame-Options", "value": "SAMEORIGIN"}
            ]
        }
    ],
    "rewrites": [
        {"source": "/api/create-checkout-session", "destination": "/api/create-checkout-session.js"},
        {"source": "/api/create-merch-checkout-session", "destination": "/api/create-merch-checkout-session.js"},
        {"source": "/api/stripe-webhook", "destination": "/api/stripe-webhook.js"},
        {"source": "/(.*)", "destination": "/index.html"}
    ]
}

(root / "vercel.json").write_text(
    json.dumps(vercel, indent=2, ensure_ascii=False),
    encoding="utf-8"
)
print("vercel.json updated with installCommand + single-quote paths for Linux shell")
