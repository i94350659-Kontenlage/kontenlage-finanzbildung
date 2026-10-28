import { useState } from "react";
import { Link } from "react-router";
import routesData from "../../content/routes.json";

interface RouteArticle {
  path: string;
  type: string;
  title: string;
  description: string;
  h1?: string;
  intro?: string;
  sections?: Array<{ heading: string; body: string }>;
  tag?: string;
  as_of?: string;
  published_on?: string;
  readTime?: string;
  featured?: boolean;
  draft?: boolean;
  sources?: Array<{ label: string; url: string; jurisdiction: string; asOf: string }>;
  keywords?: string[];
}

const allArticles = (routesData.routes as RouteArticle[])
  .filter(r => r.type === 'article' && r.draft !== true)
  .map(r => ({
    slug: r.path.replace('/artikel/', ''),
    tag: r.tag || 'Allgemein',
    title: r.title || r.h1 || '',
    desc: r.description || r.intro || '',
    readTime: r.readTime || '5 Min.',
    date: r.published_on || r.as_of || '',
    featured: r.featured === true
  }));

const articles = allArticles;

const tags = [
  "Alle", "Makroökonomie & EZB", "Weltwirtschaft & Geopolitik",
  "Kapitalerträge", "Krypto & Digital Assets", "Holding & GmbH",
  "Immobilien", "Altersvorsorge", "ETF & Indexfonds", "Arbeitnehmer"
];

export default function Artikel() {
  const [tag, setTag] = useState("Alle");
  const filtered = tag === "Alle" ? articles : articles.filter(a => a.tag === tag);
  const featured = filtered.filter(a => a.featured);
  const rest = filtered.filter(a => !a.featured);

  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 56px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Wissen & Makroanalysen</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>Finanzbildungs-Bibliothek</h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 640, lineHeight: 1.75 }}>Fundierte Analysen zu Zinsentscheidungen der EZB, weltwirtschaftlichen Entwicklungen, Steuerrecht und institutionellem Vermögensaufbau — neutral, quellengestützt und 100% BaFin-konform.</p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
            {tags.map(t => (
              <button key={t} onClick={() => setTag(t)} style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid", borderColor: tag === t ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)", background: tag === t ? "rgba(201,168,76,0.1)" : "transparent", color: "#f0ece4", fontSize: 13, cursor: "pointer" }}>{t}</button>
            ))}
          </div>

          {featured.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, marginBottom: 56 }}>
                {featured.map(a => (
                  <article key={a.slug} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>
                    <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#c9a84c", marginBottom: 12 }}>{a.tag}</span>
                    <Link to={`/artikel/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#f0ece4", marginBottom: 10, lineHeight: 1.4 }}>{a.title}</h3>
                      <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.6, marginBottom: 16 }}>{a.desc}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: 12, color: "#8d857a" }}>{a.date}</span>
                        <span style={{ fontSize: 12, color: "#8d857a" }}>{a.readTime}</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}

          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#f0ece4", marginBottom: 28, marginTop: 40 }}>{featured.length > 0 ? "Weitere Artikel" : "Alle Artikel"}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {rest.map(a => (
              <article key={a.slug} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: 20 }}>
                <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", color: "#a89f94", marginBottom: 8 }}>{a.tag}</span>
                <Link to={`/artikel/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0ece4", marginBottom: 8, lineHeight: 1.4 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.5, marginBottom: 12 }}>{a.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 11, color: "#8d857a" }}>{a.date}</span>
                    <span style={{ fontSize: 11, color: "#8d857a" }}>{a.readTime}</span>
                  </div>
                </Link>
              </article>
            ))}
            {rest.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: 32, color: "#a89f94", textAlign: "center" }}>Keine weiteren Artikel in dieser Kategorie.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}