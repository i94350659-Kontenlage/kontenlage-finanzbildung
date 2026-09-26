import { isOriginAllowed, preflight } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { AuthError, requireUser, serviceClient } from "../_shared/auth.ts";
import { consumeRateLimit } from "../_shared/rate-limit.ts";

/**
 * GET /newsletter            → Liste der für den Aufrufer lesbaren Ausgaben
 * GET /newsletter?slug=xyz   → eine Ausgabe inkl. Text (nur bei passendem Tarif)
 *
 * Freie Ausgaben (tier = 'free') sind ohne Anmeldung öffentlich lesbar und bilden
 * das SEO-Archiv unter /newsletter. Gesperrte Ausgaben (pro / executive) werden
 * ausschliesslich nach Session- und Tarifprüfung ausgeliefert. Der Text steht
 * bewusst nur in der Datenbank, niemals im öffentlichen Bundle oder im HTML.
 *
 * Die Prüfung läuft hier im Code (Service-Client) statt über die RLS-Policy, weil
 * dieselbe Function zwei Rollen bedient: anonym für 'free', angemeldet für Abo.
 * Sie ist fail-closed: unbekannter Tarif, Fehler oder fehlende Session schalten
 * niemals eine bezahlte Ausgabe frei.
 */

const TIER_RANK: Record<string, number> = { free: 0, pro: 1, executive: 2 };
const ACTIVE_STATUSES = ["active", "trialing", "canceling", "past_due"];
const COLUMNS = "slug,title,teaser,tier,category,as_of,published_on,sources,rechner_href,read_time";

function json(request: Request, body: unknown, status = 200) {
  return jsonResponse(request, body, status);
}

function rank(tier: unknown) {
  return typeof tier === "string" && tier in TIER_RANK ? TIER_RANK[tier] : Number.MAX_SAFE_INTEGER;
}

async function currentUser(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  try {
    const { user } = await requireUser(request);
    return user;
  } catch {
    return null;
  }
}

async function activePlan(userId: string | null) {
  if (!userId) return "";
  const { data, error } = await serviceClient()
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    // fail-closed: unbekannter Tarif bedeutet keine Freischaltung.
    console.error("newsletter_plan_error", error.message);
    return "";
  }
  if (!data?.plan || !ACTIVE_STATUSES.includes(data.status ?? "")) return "";
  return data.plan;
}

Deno.serve(async (request) => {
  const options = preflight(request);
  if (options) return options;
  if (!isOriginAllowed(request)) return json(request, { error: "Origin nicht erlaubt" }, 403);
  if (request.method !== "GET") return json(request, { error: "Method Not Allowed" }, 405);

  try {
    const user = await currentUser(request);
    const plan = await activePlan(user?.id ?? null);
    const requestedTier = rank(plan || "free");
    const db = serviceClient();

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug")?.trim() ?? "";

    // Anonyme Aufrufer bekommen ein kleineres Budget (Seitenaufrufe),
    // angemeldete Mitglieder ein größeres (Kabinett).
    const bucket = user ? `newsletter:${user.id}` : "newsletter:anon";
    if (!(await consumeRateLimit(db, bucket, user ? 60 : 20, 60))) {
      return json(request, { error: "Zu viele Anfragen. Bitte kurz warten." }, 429);
    }

    if (slug) {
      const { data, error } = await db
        .from("newsletter_issues")
        .select(`${COLUMNS},body`)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) return json(request, { error: "Ausgabe nicht gefunden." }, 404);

      if (rank(data.tier) > requestedTier) {
        // Fail-closed: nur die Vorschau, niemals der bezahlte Text.
        const { body: _withheld, ...preview } = data as Record<string, unknown>;
        return json(request, {
          issue: preview,
          locked: true,
          required_tier: data.tier,
          viewer_plan: plan || "free",
        });
      }
      return json(request, { issue: data, locked: false, viewer_plan: plan || "free" });
    }

    const { data, error } = await db
      .from("newsletter_issues")
      .select(COLUMNS)
      .eq("status", "published")
      .order("published_on", { ascending: false })
      .limit(60);
    if (error) throw error;

    const issues = (data ?? []).map((issue) => ({
      ...issue,
      locked: rank(issue.tier) > requestedTier,
    }));

    return json(request, { issues, viewer_plan: plan || "free", authenticated: !!user });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    if (status === 500) console.error("newsletter_error", error instanceof Error ? error.message : "unknown");
    return json(request, { error: "Ausgaben sind voruebergehend nicht verfuegbar." }, status);
  }
});
