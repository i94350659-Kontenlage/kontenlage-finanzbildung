import { db } from "./_db";

export default async function handler(request: Request) {
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  const auth = request.headers.get("authorization"); if (!auth || !process.env.STRIPE_SECRET_KEY) return new Response(JSON.stringify({ error: "Nicht autorisiert." }), { status: 401, headers: { "content-type": "application/json" } });
  const { subscriptionId } = await request.json() as { subscriptionId?: string }; if (!subscriptionId) return new Response(JSON.stringify({ error: "subscriptionId fehlt." }), { status: 400, headers: { "content-type": "application/json" } });
  const stripe = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`, { method: "DELETE", headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } });
  if (!stripe.ok) return new Response(JSON.stringify({ error: "Kündigung fehlgeschlagen." }), { status: 502, headers: { "content-type": "application/json" } });
  await db().query("UPDATE subscriptions SET status='canceled',updated_at=now() WHERE stripe_subscription_id=$1", [subscriptionId]);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
}