import pathlib
import shutil

root = pathlib.Path(r"G:\Scratch´nTravel")
app_dir = root / "AusbauÜberlegungen" / "Website analysis and badge creation"
dist_src = app_dir / "dist"
dist_dest = root / "dist"

# Copy dist from sub-app to root dist
if dist_src.exists():
    if dist_dest.exists():
        shutil.rmtree(dist_dest)
    shutil.copytree(dist_src, dist_dest)
    print("Copied compiled dist to root /dist directory!")

# Update root package.json
package_json = r"""{
  "name": "scratch-n-travel",
  "version": "1.0.0",
  "description": "Social Travel Platform for Families, Pets, Local Secrets & Digital Scratchbooks",
  "main": "dist/index.html",
  "scripts": {
    "dev": "npm --prefix \"AusbauÜberlegungen/Website analysis and badge creation\" run dev",
    "build": "node -e \"const { execSync } = require('child_process'); const fs = require('fs'); execSync('npm install', { cwd: 'AusbauÜberlegungen/Website analysis and badge creation', stdio: 'inherit' }); execSync('npm run build', { cwd: 'AusbauÜberlegungen/Website analysis and badge creation', stdio: 'inherit' }); fs.cpSync('AusbauÜberlegungen/Website analysis and badge creation/dist', 'dist', { recursive: true });\"",
    "preview": "npm --prefix \"AusbauÜberlegungen/Website analysis and badge creation\" run preview",
    "start": "npx serve dist",
    "seed": "node scripts/hermes_travel_seeder.js"
  },
  "keywords": [
    "social-travel",
    "family-travel",
    "pet-friendly-travel",
    "local-secrets",
    "travel-scratchbook"
  ],
  "author": "Scratch'n'Travel Team",
  "license": "MIT",
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0"
  }
}
"""
(root / "package.json").write_text(package_json, encoding="utf-8")
print("Updated root package.json with robust node build runner")

# Update vercel.json
vercel_json = r"""{
  "version": 2,
  "name": "scratch-n-travel",
  "cleanUrls": true,
  "trailingSlash": false,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "functions": {
    "api/create-checkout-session.js": {
      "maxDuration": 10
    },
    "api/create-merch-checkout-session.js": {
      "maxDuration": 10
    },
    "api/stripe-webhook.js": {
      "maxDuration": 30
    },
    "api/hermes-concierge.js": {
      "maxDuration": 20
    },
    "api/pod-orders.js": {
      "maxDuration": 15
    }
  },
  "rewrites": [
    {
      "source": "/api/create-checkout-session",
      "destination": "/api/create-checkout-session.js"
    },
    {
      "source": "/api/create-merch-checkout-session",
      "destination": "/api/create-merch-checkout-session.js"
    },
    {
      "source": "/api/stripe-webhook",
      "destination": "/api/stripe-webhook.js"
    },
    {
      "source": "/api/hermes-concierge",
      "destination": "/api/hermes-concierge.js"
    },
    {
      "source": "/api/pod-orders",
      "destination": "/api/pod-orders.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
"""
(root / "vercel.json").write_text(vercel_json, encoding="utf-8")
print("Updated vercel.json with outputDirectory: dist")
