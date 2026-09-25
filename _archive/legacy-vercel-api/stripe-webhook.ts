import crypto from "node:crypto";
import { db, ensureSchema } from "./_db";

function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } }); }
function signature(header: string | null, payload: string, secret: string) {
  if (!header) return false;
  const parts = header.split(",").map(x => x.trim()).filter(x => x.startsWith("t=") || x.startsWith("v1="));
  const timestamp = parts.find(x => x.startsWith("t="))?.slice(2); const signatures = parts.filter(x => x.startsWith("v1=")).map(x => x.slice(3));
  if (!timestamp || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return signatures.some(value => crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(value)));
}
export default async function handler(request: Request) {
  if (request.method !== "POST") return json({ error: "Method Not Allowed" }, 405);
  const secret = process.env.STRIPE_WEBHOOK_SECRET; if (!secret) return json({ error: "Webhook nicht konfiguriert." }, 503);
  const payload = await request.text();
  if (!signature(request.headers.get("stripe-signature"), payload, secret)) return json({ error: "Invalid signature" }, 400);
  const event = JSON.parse(payload) as { id: string; type: string; data: { object: Record<string, unknown> } };
  try { await ensureSchema(); await db().query("INSERT INTO processed_events(id) VALUES($1) ON CONFLICT DO NOTHING", [event.id]); } catch { return json({ error: "Datenbank nicht verfügbar." }, 503); }
  const object = event.data.object; const customer = String(object.customer || ""); const subscription = String(object.subscription || object.id || "");
  if (["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted", "invoice.paid", "invoice.payment_failed"].includes(event.type)) {
    await db().query(`UPDATE subscriptions SET stripe_customer_id=$1, stripe_subscription_id=$2, status=$3, current_period_end=$4, updated_at=now() WHERE stripe_customer_id=$1 OR stripe_subscription_id=$2`, [customer, subscription, String(object.status || (event.type === "invoice.paid" ? "active" : "past_due")), object.current_period_end ? new Date(Number(object.current_period_end) * 1000).toISOString() : null]);
    await db().query("INSERT INTO audit_log(event,metadata) VALUES($1,$2)", [event.type, object]);
  }
  return json({ received: true });
}