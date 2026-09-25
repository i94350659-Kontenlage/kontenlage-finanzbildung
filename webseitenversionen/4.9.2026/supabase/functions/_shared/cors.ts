const defaultOrigins = [
  "https://kontolage.de",
  "https://www.kontolage.de",
  "https://kontolage-finanzbildung.vercel.app",
  "http://localhost:5173",
  "http://localhost:8443",
];

const configuredOrigins = () => {
  const raw = Deno.env.get("APP_ORIGINS") ?? Deno.env.get("APP_ORIGIN") ?? "";
  const origins = raw.split(",").map((value) => value.trim().replace(/\/$/, "")).filter(Boolean);
  for (const origin of defaultOrigins) if (!origins.includes(origin)) origins.push(origin);
  return origins;
};

function matchesPattern(origin: string, pattern: string) {
  if (!pattern.includes("*")) return origin === pattern;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
  return new RegExp(`^${escaped}$`).test(origin);
}

function isLocalDev(origin: string) {
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

export function allowedOrigins() {
  return configuredOrigins();
}

export function normalizeOrigin(request: Request) {
  return request.headers.get("origin")?.trim().replace(/\/$/, "") ?? "";
}

export function isOriginAllowed(request: Request) {
  const origin = normalizeOrigin(request);
  if (!origin) return true;
  if (isLocalDev(origin)) return true;
  if (/^https:\/\/([a-z0-9-]+\.)*kontolage\.de$/.test(origin)) return true;
  if (/^https:\/\/kontolage-finanzbildung[a-z0-9-]*\.vercel\.app$/.test(origin)) return true;
  return configuredOrigins().some((pattern) => matchesPattern(origin, pattern));
}

export function appOrigin(request: Request) {
  const origin = normalizeOrigin(request);
  if (origin && isOriginAllowed(request)) return origin;
  const configured = configuredOrigins();
  if (!origin && configured.length >= 1) return configured[0];
  throw new Error("Origin is not allowed");
}

export function corsHeaders(request: Request) {
  const origin = normalizeOrigin(request);
  const allowed = !!origin && isOriginAllowed(request);
  return {
    ...(allowed ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

export function preflight(request: Request) {
  if (request.method !== "OPTIONS") return null;
  return new Response(null, { status: isOriginAllowed(request) ? 204 : 403, headers: corsHeaders(request) });
}
