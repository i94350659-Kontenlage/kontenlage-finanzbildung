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
    const origin = appOrigin(request);
    const db = serviceClient();
    if (!(await consumeRateLimit(db, `portal:${user.id}`, 6, 60))) return json(request, { error: "Zu viele Versuche. Bitte später erneut versuchen." }, 429);
    const { data: subscription, error } = await db.from("subscriptions").select("stripe_customer_id,status").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!subscription?.stripe_customer_id) return json(request, { error: "Für dieses Konto ist noch kein Stripe-Konto verknüpft." }, 409);
    const portal = await stripeRequest<{ url: string }>("/billing_portal/sessions", {
      customer: subscription.stripe_customer_id,
      return_url: `${origin}/kabinett`,
    });
    return json(request, { url: portal.url });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    if (status === 500) console.error("portal_error", error instanceof Error ? error.message : "unknown");
    return json(request, { error: status === 401 ? "Nicht angemeldet." : "Billing-Portal ist vorübergehend nicht verfügbar." }, status);
  }
});
