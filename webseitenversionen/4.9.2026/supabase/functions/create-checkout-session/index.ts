import { appOrigin, isOriginAllowed, preflight } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { AuthError, requireUser, serviceClient } from "../_shared/auth.ts";
import { consumeRateLimit } from "../_shared/rate-limit.ts";
import { StripeApiError, stripeRequest } from "../_shared/stripe.ts";

const PLAN_ENV = { starter: "STRIPE_PRICE_STARTER", pro: "STRIPE_PRICE_PRO", executive: "STRIPE_PRICE_EXECUTIVE" } as const;
type Plan = keyof typeof PLAN_ENV;
type Customer = { id: string };
type CheckoutSession = { id: string; url?: string };

function json(request: Request, body: unknown, status = 200) {
  return jsonResponse(request, body, status);
}

Deno.serve(async (request) => {
  const options = preflight(request);
  if (options) return options;
  if (!isOriginAllowed(request)) return json(request, { error: "Origin nicht erlaubt" }, 403);
  if (request.method !== "POST") return json(request, { error: "Method Not Allowed" }, 405);
  let userId: string | null = null;
  let db: ReturnType<typeof serviceClient> | null = null;
  const resetPending = async () => {
    if (!db || !userId) return;
    try {
      await db.from("subscriptions").update({ status: "inactive", updated_at: new Date().toISOString() })
        .eq("user_id", userId).is("stripe_subscription_id", null).eq("status", "pending");
    } catch (_resetError) { /* Status bleibt dann pending und ist im Kabinett sichtbar */ }
  };
  try {
    const { user } = await requireUser(request);
    userId = user.id;
    const origin = appOrigin(request);
    db = serviceClient();
    if (!(await consumeRateLimit(db, `checkout:${user.id}`, 8, 60))) return json(request, { error: "Zu viele Versuche. Bitte später erneut versuchen." }, 429);
    const body = await request.json().catch(() => ({})) as { plan?: string };
    if (!body.plan || !Object.hasOwn(PLAN_ENV, body.plan)) return json(request, { error: "Unbekannter Tarif." }, 400);
    const price = Deno.env.get(PLAN_ENV[body.plan as Plan]);
    if (!price) return json(request, { error: "Dieser Tarif ist noch nicht konfiguriert." }, 503);
    const { data: existing } = await db.from("subscriptions").select("stripe_customer_id,status").eq("user_id", user.id).maybeSingle();
    if (existing?.status === "active" || existing?.status === "trialing" || existing?.status === "canceling") return json(request, { error: "Für dieses Konto besteht bereits ein Abonnement." }, 409);
    let customerId = existing?.stripe_customer_id ?? "";
    if (!customerId) {
      const customer = await stripeRequest<Customer>("/customers", { ...(user.email ? { email: user.email } : {}), "metadata[supabase_user_id]": user.id });
      customerId = customer.id;
    }
    const { error: subscriptionError } = await db.from("subscriptions").upsert({ user_id: user.id, stripe_customer_id: customerId, plan: body.plan, status: "pending", updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (subscriptionError) throw subscriptionError;
    const params: Record<string, string> = {
      mode: "subscription",
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      customer: customerId,
      client_reference_id: user.id,
      success_url: `${origin}/konto?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/abo?checkout=cancelled`,
      "metadata[supabase_user_id]": user.id,
      "metadata[plan]": body.plan,
      "subscription_data[metadata][supabase_user_id]": user.id,
      "subscription_data[metadata][plan]": body.plan,
      "billing_address_collection": "required",
      "tax_id_collection[enabled]": "true",
      "customer_update[name]": "auto",
      "customer_update[address]": "auto",
      locale: "de",
      allow_promotion_codes: "true",
    };
    // Stripe Tax muss zusätzlich im Stripe-Dashboard für das Land DE aktiviert
    // und STRIPE_AUTOMATIC_TAX=true als Supabase-Secret gesetzt sein (P0-05).
    if (Deno.env.get("STRIPE_AUTOMATIC_TAX") === "true") params["automatic_tax[enabled]"] = "true";
    const session = await stripeRequest<CheckoutSession>("/checkout/sessions", params);
    if (!session.url) return json(request, { error: "Checkout konnte nicht gestartet werden." }, 502);
    return json(request, { url: session.url });
  } catch (error) {
    if (error instanceof AuthError) return json(request, { error: "Nicht angemeldet." }, error.status);
    await resetPending();
    if (error instanceof StripeApiError) {
      console.error("checkout_stripe_error", error.status, error.message);
      try {
        const audit = serviceClient();
        await audit.from("audit_log").insert({
          user_id: userId,
          event: "checkout.stripe_error",
          metadata: { stripe_status: error.status, message: error.message.slice(0, 400) },
        });
      } catch (_auditError) { /* Diagnose darf den Fehlerpfad nicht blockieren */ }
      return json(request, { error: "Checkout konnte nicht gestartet werden.", stripe_status: error.status, stripe_message: error.message }, 502);
    }
    console.error("checkout_error", error instanceof Error ? error.message : "unknown");
    return json(request, { error: "Checkout ist vorübergehend nicht verfügbar." }, 500);
  }
});
