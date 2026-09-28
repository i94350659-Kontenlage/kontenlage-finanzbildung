import { isOriginAllowed, preflight } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { AuthError, requireUser, serviceClient } from "../_shared/auth.ts";

function json(request: Request, body: unknown, status = 200) {
  return jsonResponse(request, body, status);
}

Deno.serve(async (request) => {
  const options = preflight(request);
  if (options) return options;
  if (!isOriginAllowed(request)) return json(request, { error: "Origin nicht erlaubt" }, 403);
  if (request.method !== "GET" && request.method !== "POST") return json(request, { error: "Method Not Allowed" }, 405);
  try {
    const { user } = await requireUser(request);
    const db = serviceClient();
    const [profileResult, subscriptionResult] = await Promise.all([
      db.from("profiles").select("id,email,display_name,created_at").eq("id", user.id).maybeSingle(),
      db.from("subscriptions").select("plan,status,current_period_end,updated_at,stripe_customer_id,stripe_subscription_id").eq("user_id", user.id).maybeSingle(),
    ]);
    if (profileResult.error) console.error("account_profile_error", profileResult.error.message);
    if (subscriptionResult.error) console.error("account_subscription_error", subscriptionResult.error.message);
    const subscription = subscriptionResult.data;
    const diagnostics = profileResult.error || subscriptionResult.error
      ? {
        profile_error: profileResult.error?.message ?? null,
        subscription_error: subscriptionResult.error?.message ?? null,
      }
      : undefined;
    return json(request, {
      user: { id: user.id, email: user.email },
      profile: profileResult.data ?? { id: user.id, email: user.email ?? null, display_name: null, created_at: null },
      subscription: subscription
        ? {
          plan: subscription.plan,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          updated_at: subscription.updated_at,
        }
        : null,
      billing: {
        has_customer: !!subscription?.stripe_customer_id,
        has_subscription: !!subscription?.stripe_subscription_id,
      },
      diagnostics,
    });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    if (status === 500) console.error("account_error", error instanceof Error ? error.message : "unknown");
    return json(request, { error: status === 401 ? "Nicht angemeldet." : "Account konnte nicht geladen werden." }, status);
  }
});
