import pathlib, json, os

root = pathlib.Path(r"G:\Scratch´nTravel")
app_rel = "AusbauÜberlegungen/Website analysis and badge creation"

vercel = {
    "version": 2,
    "name": "scratch-n-travel",
    "cleanUrls": True,
    "trailingSlash": False,
    "buildCommand": f"cd \"{app_rel}\" && npm install && npm run build",
    "outputDirectory": f"{app_rel}/dist",
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
print("vercel.json updated with correct paths")
