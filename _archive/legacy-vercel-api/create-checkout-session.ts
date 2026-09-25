type Plan = "starter" | "pro" | "executive";

const PRICE_ENV: Record<Plan, string> = {
  starter: "STRIPE_PRICE_STARTER",
  pro: "STRIPE_PRICE_PRO",
  executive: "STRIPE_PRICE_EXECUTIVE",
};

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export default async function handler(request: Request) {
  if (request.method !== "POST") return json({ error: "Method Not Allowed" }, 405);
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return json({ error: "Checkout ist nicht konfiguriert." }, 503);

  let body: { plan?: string };
  try { body = await request.json(); } catch { return json({ error: "Ungültige Anfrage." }, 400); }
  if (!body.plan || !(body.plan in PRICE_ENV)) return json({ error: "Unbekannter Tarif." }, 400);
  const price = process.env[PRICE_ENV[body.plan as Plan]];
  if (!price) return json({ error: "Dieser Tarif ist vorübergehend nicht verfügbar." }, 503);

  const origin = request.headers.get("origin");
  const configuredOrigin = process.env.APP_ORIGIN;
  if (configuredOrigin && origin && origin !== configuredOrigin) return json({ error: "Ungültige Herkunft." }, 403);

  const params = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    success_url: `${configuredOrigin || origin || "https://www.kontolage.de"}/kabinett?checkout=success`,
    cancel_url: `${configuredOrigin || origin || "https://www.kontolage.de"}/abo?checkout=cancelled`,
    client_reference_id: crypto.randomUUID(),
  });
  const stripe = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" }, body: params,
  });
  const result = await stripe.json() as { url?: string; error?: { message?: string } };
  if (!stripe.ok || !result.url) return json({ error: result.error?.message || "Checkout konnte nicht gestartet werden." }, 502);
  return json({ url: result.url });
}