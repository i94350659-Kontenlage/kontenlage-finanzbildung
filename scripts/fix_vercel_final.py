import pathlib, json

root = pathlib.Path(r"G:\Scratch´nTravel")

# Since dist/ is now committed, simplest Vercel config:
# No build needed - just serve the pre-built dist directly
# This guarantees no 404 from build failures on Vercel

vercel = {
    "version": 2,
    "name": "scratch-n-travel",
    "cleanUrls": True,
    "trailingSlash": False,
    "outputDirectory": "dist",
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {"key": "X-Content-Type-Options", "value": "nosniff"},
                {"key": "X-Frame-Options", "value": "SAMEORIGIN"},
                {"key": "Cache-Control", "value": "public, max-age=31536000, immutable"},
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
        {"source": "/api/create-merch-checkout-session", "destination": "/api/create-merch-checkout-session.js"},
        {"source": "/api/stripe-webhook", "destination": "/api/stripe-webhook.js"},
        {"source": "/((?!api/.*).*)", "destination": "/index.html"}
    ]
}

(root / "vercel.json").write_text(
    json.dumps(vercel, indent=2, ensure_ascii=False),
    encoding="utf-8"
)
print("vercel.json set to serve pre-built dist/ directly (no build step needed)")
print("This guarantees zero 404s from Vercel build failures.")
