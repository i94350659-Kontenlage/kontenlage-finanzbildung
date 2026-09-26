import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";

type Section = { heading: string; body: string };
type Source = { label: string; url: string; jurisdiction: string; asOf: string };
type Issue = {
  slug: string;
  title: string;
  teaser: string;
  tier: string;
  category: string | null;
  as_of: string;
  published_on: string;
  read_time: string | null;
  rechner_href: string | null;
  sources: Source[];
  body: Section[] | null;
  locked: boolean;
};
type Response = {
  issue?: Issue;
  issues?: Issue[];
  locked?: boolean;
  required_tier?: string;
  error?: string;
};

const TIER_LABEL: Record<string, string> = { free: "Kostenlos", pro: "Pro Digital", executive: "Executive B2B" };
const TIER_RANK: Record<string, number> = { free: 0, pro: 1, executive: 2 };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Ruft die Edge Function "newsletter" direkt auf, weil der Slug als Query-Parameter
 * übergeben werden muss (supabase.functions.invoke unterstützt das nicht).
 * Der Text gesperrter Ausgaben verlässt das Backend nie: ohne passenden Tarif
 * liefert die Function nur Vorschau + locked (fail-closed im Code der Function).
 */
async function callNewsletter(slug?: string): Promise<Response> {
  const { data: sessionData } = await supabase.auth.getSession();
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  const url = slug
    ? `${base}/functions/v1/newsletter?slug=${encodeURIComponent(slug)}`
    : `${base}/functions/v1/newsletter`;
  const response = await fetch(url, {
    headers: sessionData.session?.access_token
      ? { authorization: `Bearer ${sessionData.session.access_token}` }
      : {},
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    return { error: body.error ?? "Ausgaben sind gerade nicht verfügbar." };
  }
  return (await response.json()) as Response;
}

export default function MemberAusgaben({ plan }: { plan: string }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [open, setOpen] = useState<Record<string, Response>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRank = TIER_RANK[plan] ?? 0;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callNewsletter();
      setIssues((data.issues ?? []).filter((issue) => issue.tier !== "free"));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Ausgaben nicht verfügbar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = async (slug: string) => {
    if (open[slug]) {
      setOpen((prev) => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
      return;
    }
    try {
      const detail = await callNewsletter(slug);
      if (!detail.issue && detail.error) throw new Error(detail.error);
      setOpen((prev) => ({ ...prev, [slug]: detail }));
    } catch (loadError) {
      setOpen((prev) => ({
        ...prev,
        [slug]: { error: loadError instanceof Error ? loadError.message : "Ausgabe nicht verfügbar." },
      }));
    }
  };

  if (loading) return <p style={{ fontSize: 13, color: "#a89f94", margin: 0 }}>Ausgaben werden geladen…</p>;

  if (error) {
    return (
      <p role="alert" style={{ fontSize: 13, color: "#fca5a5", margin: 0 }}>
        {error}
      </p>
    );
  }

  if (issues.length === 0) {
    return (
      <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, margin: 0 }}>
        Aktuell sind keine exklusiven Ausgaben verfügbar. Die kostenlosen Ausgaben stehen im{" "}
        <Link to="/newsletter" style={{ color: "#e2c27d" }}>Archiv</Link>.
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {issues.map((issue) => {
        const unlocked = (TIER_RANK[issue.tier] ?? 0) <= viewerRank;
        const detail = open[issue.slug];
        return (
          <article
            key={issue.slug}
            style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 20, background: "rgba(255,255,255,0.02)" }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c" }}>
                {issue.category ?? "Ausgabe"}
              </span>
              <span style={{ fontSize: 12, color: "#a89f94" }}>
                {formatDate(issue.published_on)} · Stand {formatDate(issue.as_of)} · {issue.read_time ?? "—"}
              </span>
              <span style={{ fontSize: 11, border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: "2px 10px", color: unlocked ? "#86efac" : "#a89f94" }}>
                {unlocked ? "Freigeschaltet" : `Ab ${TIER_LABEL[issue.tier] ?? issue.tier}`}
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#f0ece4", margin: "0 0 8px", lineHeight: 1.35 }}>
              {issue.title}
            </h3>
            <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, margin: "0 0 12px" }}>{issue.teaser}</p>

            <button
              type="button"
              onClick={() => void toggle(issue.slug)}
              aria-expanded={!!detail}
              style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.4)", background: "transparent", color: "#e2c27d", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              {detail ? "Schließen" : unlocked ? "Ausgabe lesen" : "Vorschau"}
            </button>

            {detail?.error && <p role="alert" style={{ fontSize: 13, color: "#fca5a5", margin: "12px 0 0" }}>{detail.error}</p>}

            {detail?.locked && (
              <div style={{ marginTop: 14, padding: 16, border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, background: "rgba(201,168,76,0.05)" }}>
                <p style={{ fontSize: 13, color: "#cdc6be", lineHeight: 1.7, margin: "0 0 10px" }}>
                  Diese Ausgabe ist Abonnenten ab {TIER_LABEL[detail.required_tier ?? issue.tier] ?? issue.tier} vorbehalten.
                  Der vollständige Text wird ausschließlich nach Prüfung der Mitgliedschaft ausgeliefert.
                </p>
                <Link to="/abo" style={{ fontSize: 13, color: "#e2c27d", fontWeight: 600 }}>Tarife vergleichen →</Link>
              </div>
            )}

            {detail?.issue?.body && detail.issue.body.length > 0 && (
              <div style={{ marginTop: 16 }}>
                {detail.issue.body.map((section) => (
                  <section key={section.heading} style={{ marginBottom: 18 }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f0ece4", margin: "0 0 6px" }}>{section.heading}</h4>
                    <p style={{ fontSize: 14, color: "#cdc6be", lineHeight: 1.8, margin: 0 }}>{section.body}</p>
                  </section>
                ))}
                {detail.issue.sources?.length > 0 && (
                  <details style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.7 }}>
                    <summary style={{ cursor: "pointer", color: "#e2c27d" }}>Quellen ({detail.issue.sources.length})</summary>
                    <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                      {detail.issue.sources.map((source) => (
                        <li key={source.url + source.label} style={{ marginBottom: 6 }}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "#e2c27d" }}>{source.label}</a>
                          {" — "}
                          {source.jurisdiction}, Stand {source.asOf}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                {detail.issue.rechner_href && (
                  <p style={{ margin: "14px 0 0" }}>
                    <Link to={detail.issue.rechner_href} style={{ fontSize: 13, color: "#e2c27d", fontWeight: 600 }}>Zum passenden Rechner →</Link>
                  </p>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
