import pathlib

app_dir = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation")
public_dir = app_dir / "public"
public_dir.mkdir(parents=True, exist_ok=True)

# 1. public/manifest.json
manifest_json = r"""{
  "name": "Scratch'n'Travel — Luxury Social Travel & Secret Spots",
  "short_name": "Scratch'n'Travel",
  "description": "Verifizierte Geheimtipps, 130-Hobby WanderBond DNA, 1–5 Schwierigkeitsskala & 460+ Sammler-Badges.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0C1825",
  "theme_color": "#0C1825",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "192x192 512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "categories": ["travel", "lifestyle", "navigation"]
}
"""
(public_dir / "manifest.json").write_text(manifest_json, encoding="utf-8")
print("public/manifest.json created")

# 2. public/favicon.svg (Gold Compass & Coin SVG Icon)
favicon_svg = r"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#0C1825" stroke="#C9A84C" stroke-width="3"/>
  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(201,168,76,0.3)" stroke-width="1" stroke-dasharray="2,3"/>
  <!-- Compass Points -->
  <polygon points="50,10 45,50 55,50" fill="#C9A84C"/>
  <polygon points="50,90 45,50 55,50" fill="#8A7040"/>
  <polygon points="90,50 50,45 50,55" fill="#8A7040"/>
  <polygon points="10,50 50,45 50,55" fill="#8A7040"/>
  <!-- Center Coin -->
  <circle cx="50" cy="50" r="10" fill="#C9A84C" stroke="#F4E4C1" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="4" fill="#0C1825"/>
</svg>
"""
(public_dir / "favicon.svg").write_text(favicon_svg, encoding="utf-8")
print("public/favicon.svg created")

# 3. public/sw.js (Service Worker)
sw_js = r"""const CACHE_NAME = 'snt-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/'));
    })
  );
});
"""
(public_dir / "sw.js").write_text(sw_js, encoding="utf-8")
print("public/sw.js created")

# 4. index.html with SEO & PWA headers
index_html = r"""<!doctype html>
<html lang="de" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Scratch'n'Travel — Luxury Social Travel &amp; Secret Spots</title>
    
    <!-- Meta & SEO -->
    <meta name="description" content="Verifizierte Geheimtipps, 130-Hobby WanderBond DNA, 1–5 Schwierigkeitsskala, barrierefreie Hunde- &amp; Kinderwagentrails und 460+ Sammler-Badges." />
    <meta name="keywords" content="Travel, Secret Spots, WanderBond, GPS, GPX, Hundereisen, Kinderwagen, Badges, Print on Demand, Portugal, Mallorca, Dolomiten" />
    <meta name="author" content="Scratch'n'Travel Team" />
    <meta name="theme-color" content="#0C1825" />
    
    <!-- OpenGraph / Social -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Scratch'n'Travel — Luxury Social Travel &amp; Secret Spots" />
    <meta property="og:description" content="Entdecke verborgene Schätze abseits des Massentourismus. Echte Secret Spots von Locals weltweit." />
    <meta property="og:image" content="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop&auto=format" />
    
    <!-- PWA & Mobile Web App -->
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/favicon.svg" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Scratch'n'Travel" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-[#0C1825] text-[#F4E4C1] antialiased overflow-x-hidden selection:bg-[#C9A84C] selection:text-[#0C1825]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    
    <!-- Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration error', err));
        });
      }
    </script>
  </body>
</html>
"""
(app_dir / "index.html").write_text(index_html, encoding="utf-8")
print("index.html upgraded with PWA & SEO headers")
