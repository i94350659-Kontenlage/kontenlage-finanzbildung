import { appOrigin, isOriginAllowed, preflight } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { AuthError, requireUser, serviceClient } from "../_shared/auth.ts";
import { consumeRateLimit } from "../_shared/rate-limit.ts";
import { stripeRequest } from "../_shared/stripe.ts";

function json(request: Request, body: unknown, status = 200) {
  return jsonResponse(request, body, status);
}

Deno.serve(async (request) => {
  const options = preflight(request);
  if (options) return options;
  if (!isOriginAllowed(request)) return json(request, { error: "Origin nicht erlaubt" }, 403);
  if (request.method !== "POST") return json(request, { error: "Method Not Allowed" }, 405);
  try {
    const { user } = await requireUser(request);
    appOrigin(request);
    const db = serviceClient();
    if (!(await consumeRateLimit(db, `cancel:${user.id}`, 4, 60))) return json(request, { error: "Zu viele Versuche. Bitte später erneut versuchen." }, 429);
    const { data: subscription, error } = await db.from("subscriptions").select("stripe_subscription_id,status").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!subscription?.stripe_subscription_id) return json(request, { error: "Für dieses Konto besteht keine kündbare Subscription." }, 409);
    if (["canceled", "inactive"].includes(subscription.status)) return json(request, { ok: true, status: subscription.status });
    await stripeRequest(`/subscriptions/${encodeURIComponent(subscription.stripe_subscription_id)}`, { cancel_at_period_end: "true" });
    const { error: updateError } = await db.from("subscriptions").update({ status: "canceling", updated_at: new Date().toISOString() }).eq("user_id", user.id);
    if (updateError) throw updateError;
    await db.from("audit_log").insert({ user_id: user.id, event: "subscription.cancel_requested", metadata: { source: "edge_function" } });
    return json(request, { ok: true, status: "canceling" });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    if (status === 500) console.error("cancel_error", error instanceof Error ? error.message : "unknown");
    return json(request, { error: status === 401 ? "Nicht angemeldet." : "Kündigung ist vorübergehend nicht verfügbar." }, status);
  }
});
