import { jsonResponse } from "../_shared/http.ts";
import { serviceClient } from "../_shared/auth.ts";
import { stripeRequest, type StripeSubscription } from "../_shared/stripe.ts";

const encoder = new TextEncoder();

function hex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function verifyStripeSignature(payload: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = new Map(header.split(",").map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, value.join("=")] as const;
  }));
  const timestamp = parts.get("t");
  const signature = parts.get("v1");
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = hex(await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`)));
  if (expected.length !== signature.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
}

function json(request: Request, body: unknown, status = 200) {
  return jsonResponse(request, body, status);
}

type StripeEvent = { id: string; type: string; data?: { object?: Record<string, unknown> } };

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function metadataFrom(value: unknown) {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

async function findUserId(
  db: ReturnType<typeof serviceClient>,
  customerId: string,
  subscriptionId: string,
  explicitUserId: string,
) {
  if (explicitUserId) {
    const { data: profile } = await db.from("profiles").select("id").eq("id", explicitUserId).maybeSingle();
    if (profile?.id) return profile.id;
  }
  if (subscriptionId) {
    const { data: bySubscription } = await db.from("subscriptions").select("user_id").eq("stripe_subscription_id", subscriptionId).maybeSingle();
    if (bySubscription?.user_id) return bySubscription.user_id;
  }
  if (customerId) {
    const { data: byCustomer } = await db.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId).maybeSingle();
    if (byCustomer?.user_id) return byCustomer.user_id;
  }
  return null;
}

function subscriptionFrom(object: Record<string, unknown>): StripeSubscription {
  return {
    id: asString(object.id),
    customer: asString(object.customer),
    status: asString(object.status),
    current_period_end: typeof object.current_period_end === "number" ? object.current_period_end : undefined,
    cancel_at_period_end: object.cancel_at_period_end === true,
    metadata: typeof object.metadata === "object" && object.metadata ? object.metadata as Record<string, string> : undefined,
    items: object.items as StripeSubscription["items"],
  };
}

async function markEvent(db: ReturnType<typeof serviceClient>, eventId: string, status: "processed" | "failed", error?: string) {
  await db.from("stripe_events").update({ status, last_error: error?.slice(0, 500) ?? null, processed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("event_id", eventId);
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json(request, { error: "Method Not Allowed" }, 405);
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) return json(request, { error: "Webhook nicht konfiguriert." }, 503);
  const payload = await request.text();
  if (!(await verifyStripeSignature(payload, request.headers.get("stripe-signature"), secret))) return json(request, { error: "Invalid signature" }, 400);
  let event: StripeEvent;
  try { event = JSON.parse(payload) as StripeEvent; } catch { return json(request, { error: "Invalid JSON" }, 400); }
  if (!event.id || !event.type) return json(request, { error: "Invalid event" }, 400);
  const db = serviceClient();
  const { data: claimed, error: claimError } = await db.rpc("claim_stripe_event", { p_event_id: event.id, p_event_type: event.type });
  if (claimError) return json(request, { error: "Webhook processing unavailable" }, 503);
  if (!claimed) return json(request, { received: true, duplicate: true });
  try {
    const object = event.data?.object ?? {};
    const objectMetadata = metadataFrom(object.metadata);
    const objectSubscription = subscriptionFrom(object);
    const customerId = asString(object.customer);
    const subscriptionId = asString(object.subscription) || (event.type.startsWith("customer.subscription.") ? objectSubscription.id : "");
    const supported = ["checkout.session.completed", "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted", "invoice.paid", "invoice.payment_failed"].includes(event.type);
    if (supported && customerId) {
      const explicitUserId = asString(objectMetadata.supabase_user_id) || asString(object.client_reference_id);
      const userId = await findUserId(db, customerId, subscriptionId, explicitUserId);
      let subscription = event.type.startsWith("customer.subscription.") ? objectSubscription : null;
      if (!subscription && subscriptionId) subscription = await stripeRequest<StripeSubscription>(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {}, "GET");
      const status = event.type === "invoice.payment_failed" ? "past_due" : event.type === "invoice.paid" ? "active" : subscription?.cancel_at_period_end ? "canceling" : subscription?.status || "inactive";
      const currentPeriodEnd = subscription?.current_period_end;
      const plan = asString(subscription?.metadata?.plan) || asString(objectMetadata.plan) || null;
      if (userId) {
        const { error: updateError } = await db.from("subscriptions").upsert({ user_id: userId, stripe_customer_id: customerId, stripe_subscription_id: subscriptionId || null, plan, status, current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        if (updateError) throw updateError;
        if (event.type === "customer.subscription.deleted") {
          await db.from("subscriptions").update({ status: "canceled", updated_at: new Date().toISOString() }).eq("stripe_customer_id", customerId);
        }
        await db.from("audit_log").insert({ user_id: userId, event: event.type, metadata: { stripe_event_id: event.id, subscription_id: subscriptionId || null } });
      }
    }
    await markEvent(db, event.id, "processed");
    return json(request, { received: true });
  } catch (error) {
    await markEvent(db, event.id, "failed", error instanceof Error ? error.message : "unknown");
    return json(request, { error: "Webhook processing failed" }, 500);
  }
});
