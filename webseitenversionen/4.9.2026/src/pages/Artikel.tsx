import { useState } from "react";
import { Link } from "react-router";
import routesData from "../../content/routes.json";

interface RouteArticle {
  path: string;
  type: string;
  title: string;
  description: string;
  category?: string;
  h1?: string;
  intro?: string;
  sections?: Array<{ heading: string; body: string }>;
  tag?: string;
  as_of?: string;
  published_on?: string;
  published?: string;
  updated?: string;
  readTime?: string;
  featured?: boolean;
  draft?: boolean;
  sources?: Array<{ label: string; url: string; jurisdiction: string; asOf: string }>;
  keywords?: string[];
}

const CANONICAL_MAP: Record<string, string> = {
  "DeFi & Web3": "Krypto & Digital Assets",
  Abfindung: "Arbeitnehmer",
  Kirchensteuer: "Arbeitnehmer",
  Unternehmen: "Holding & GmbH",
  Steuerrecht: "Immobilien",
};

function resolveTag(item: RouteArticle): string {
  const raw = item.tag || item.category || "";
  return CANONICAL_MAP[raw] || raw || "Allgemein";
}

const allItems = (routesData.routes as RouteArticle[])
  .filter((r) => (r.type === "article" || r.type === "newsletter") && r.draft !== true)
  .map((r) => ({
    slug: r.path.replace(/^\/(artikel|newsletter)\//, ""),
    path: r.path,
    type: r.type,
    tag: resolveTag(r),
    title: r.title || r.h1 || "",
    desc: r.description || r.intro || "",
    readTime: r.readTime || "5 Min.",
    date: r.published_on || r.published || r.updated || r.as_of || "",
    featured: r.featured === true,
  }));

const tags = [
  "Alle",
  "Makroökonomie & EZB",
  "Weltwirtschaft & Geopolitik",
  "Kapitalerträge",
  "Krypto & Digital Assets",
  "Holding & GmbH",
  "Immobilien",
  "Altersvorsorge",
  "ETF & Indexfonds",
  "Arbeitnehmer",
];

export default function Artikel() {
  const [tag, setTag] = useState("Alle");
  const filtered = tag === "Alle" ? allItems : allItems.filter((a) => a.tag === tag);
  const featured = filtered.filter((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured);

  return (
    <>
      <section
        style={{
          paddingTop: 120,
          padding: "120px 20px 56px",
          background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#c9a84c",
              }}
            >
              Wissen & Makroanalysen
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 700,
              color: "#f0ece4",
              marginBottom: 18,
              letterSpacing: "-0.025em",
            }}
          >
            Finanzbildungs-Bibliothek
          </h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 680, lineHeight: 1.75, margin: 0 }}>
            Fundierte Analysen zu Zinsentscheidungen der EZB, weltwirtschaftlichen Entwicklungen, Steuerrecht
            und institutionellem Vermögensaufbau — neutral, quellengestützt und 100% BaFin-konform.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Kategorie-Filter-Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40, alignItems: "center" }}>
            {tags.map((t) => {
              const count = t === "Alle" ? allItems.length : allItems.filter((a) => a.tag === t).length;
              const isActive = tag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: isActive ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.08)",
                    background: isActive ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.02)",
                    color: isActive ? "#f0ece4" : "#a89f94",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{t}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: isActive ? "#c9a84c" : "#6e675f",
                    }}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Featured Artikel (falls vorhanden) */}
          {featured.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 28,
                marginBottom: 56,
              }}
            >
              {featured.map((a) => (
                <article
                  key={a.path}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: 28,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#c9a84c" }}>
                      {a.tag}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#a89f94",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        padding: "2px 8px",
                      }}
                    >
                      {a.type === "newsletter" ? "Ausgabe" : "Fachartikel"}
                    </span>
                  </div>
                  <Link to={a.path} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 19,
                        fontWeight: 700,
                        color: "#f0ece4",
                        marginBottom: 10,
                        lineHeight: 1.4,
                      }}
                    >
                      {a.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.6, marginBottom: 16 }}>{a.desc}</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#8d857a" }}>{a.date}</span>
                      <span style={{ fontSize: 12, color: "#8d857a" }}>{a.readTime}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Überschrift für Artikel-Liste */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 3.5vw, 28px)",
              fontWeight: 700,
              color: "#f0ece4",
              marginBottom: 24,
            }}
          >
            {tag === "Alle" ? `Alle Beiträge (${filtered.length})` : `${tag} (${filtered.length})`}
          </h2>

          {/* Raster aller Artikel */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {rest.map((a) => (
              <article
                key={a.path}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s ease, transform 0.2s ease",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#c9a84c",
                      }}
                    >
                      {a.tag}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#a89f94",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        padding: "2px 8px",
                      }}
                    >
                      {a.type === "newsletter" ? "Ausgabe" : "Fachartikel"}
                    </span>
                  </div>
                  <Link to={a.path} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: "#f0ece4",
                        marginBottom: 10,
                        lineHeight: 1.4,
                      }}
                    >
                      {a.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.6, marginBottom: 16 }}>{a.desc}</p>
                  </Link>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#7d766c" }}>{a.date}</span>
                  <span style={{ fontSize: 11, color: "#7d766c" }}>{a.readTime}</span>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "48px 24px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  textAlign: "center",
                  color: "#a89f94",
                }}
              >
                Keine Beiträge in dieser Kategorie gefunden.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}