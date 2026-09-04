import pathlib
import shutil
import json

root = pathlib.Path(r"g:\B2B steuer Business Ideee 6.8.2026")
built_dist = root / "webseitenversionen" / "4.9.2026" / "dist"
target_dist = root / "dist"

# 1. Copy dist to root
if target_dist.exists():
    shutil.rmtree(target_dist)
shutil.copytree(built_dist, target_dist)
print("Copied webseitenversionen/4.9.2026/dist to root /dist!")

# 2. Update root vercel.json
vercel = {
    "version": 2,
    "name": "kontenlage",
    "cleanUrls": True,
    "trailingSlash": False,
    "outputDirectory": "dist",
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {"key": "X-Content-Type-Options", "value": "nosniff"},
                {"key": "X-Frame-Options", "value": "SAMEORIGIN"},
                {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"}
            ]
        },
        {
            "source": "/assets/(.*)",
            "headers": [
                {"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}
            ]
        },
        {
            "source": "/index.html",
            "headers": [
                {"key": "Cache-Control", "value": "no-cache, no-store, must-revalidate"}
            ]
        }
    ],
    "rewrites": [
        {"source": "/api/create-checkout-session", "destination": "/api/create-checkout-session.js"},
        {"source": "/api/stripe-webhook", "destination": "/api/stripe-webhook.js"},
        {"source": "/((?!api/.*).*)", "destination": "/index.html"}
    ]
}

(root / "vercel.json").write_text(json.dumps(vercel, indent=2, ensure_ascii=False), encoding="utf-8")
print("Updated root vercel.json to serve pre-built React app with SPA rewrites!")

# 3. Update root package.json with build script
pkg_path = root / "package.json"
pkg = {
    "name": "kontenlage-web",
    "version": "1.0.0",
    "scripts": {
        "build": "npm run build --prefix webseitenversionen/4.9.2026"
    }
}
pkg_path.write_text(json.dumps(pkg, indent=2), encoding="utf-8")
print("Updated root package.json!")
