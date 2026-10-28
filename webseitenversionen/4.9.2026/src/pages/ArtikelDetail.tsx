import { useParams, Link } from "react-router";
import routesData from "../../content/routes.json";

interface RouteArticle {
  path: string;
  type: string;
  title: string;
  description: string;
  h1?: string;
  intro?: string;
  sections?: Array<{ heading: string; body: string }>;
  category?: string;
  tag?: string;
  as_of?: string;
  published_on?: string;
  readTime?: string;
  author?: string;
  fazit?: string;
  disclaimer?: string;
  draft?: boolean;
  sources?: Array<{ label: string; url: string; jurisdiction: string; asOf: string }>;
  keywords?: string[];
}

export default function ArtikelDetail() {
  const { slug } = useParams<{ slug: string }>();

  const route = (routesData.routes as RouteArticle[]).find(
    r => r.path === `/artikel/${slug}` && r.type === 'article' && r.draft !== true
  );

  if (!route) {
    return (
      <div style={{ padding: "56px 20px", maxWidth: 800, margin: "0 auto", color: "#f0ece4" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, marginBottom: 20 }}>Artikel nicht gefunden</h1>
        <p style={{ color: "#a89f94", lineHeight: 1.7 }}>Der angefragte Artikel existiert nicht oder ist noch nicht veröffentlicht.</p>
        <Link to="/artikel" style={{ color: "#c9a84c", textDecoration: "none", fontWeight: 600 }}>← Alle Artikel</Link>
      </div>
    );
  }

  const article = {
    tag: route.category || route.tag || 'Allgemein',
    title: route.title || route.h1 || '',
    date: route.published_on || route.as_of || '',
    readTime: route.readTime || '5 Min.',
    author: route.author || 'Hermes Autonomous Engine & Redaktion Kontolage',
    intro: route.intro || route.description || '',
    sections: (route.sections || []).map((s: { heading: string; body: string }) => ({ heading: s.heading, body: s.body })),
    fazit: route.fazit || '',
    disclaimer: route.disclaimer || routesData.disclaimer,
    sources: route.sources || [],
    keywords: route.keywords || []
  };

  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 48px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link to="/artikel" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#a89f94", textDecoration: "none", marginBottom: 28, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={e => (e.currentTarget.style.color = "#a89f94")}>← Alle Artikel</Link>

          <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: "#c9a84c", padding: "4px 12px", borderRadius: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 20 }}>{article.tag}</span>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, color: "#f0ece4", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.025em" }}>{article.title}</h1>

          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#a89f94", marginBottom: 16, flexWrap: "wrap" }}>
            <span>📅 {article.date}</span>
            {article.readTime && <span>⏱ {article.readTime} Lesezeit</span>}
            {article.author && <span>✍️ {article.author}</span>}
          </div>

          <p style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12, lineHeight: 1.7, color: "#8d857a", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "10px 14px", margin: "0 0 28px" }}>
            <span>Stand: {article.date}</span>
            <span>Redaktion: {article.author}</span>
            <span>Allgemeine Information, redaktionell geprüft – keine individuelle Steuer- oder Anlageberatung.{" "}<Link to="/transparenz" style={{ color: "#c9a84c" }}>Quellen und Methodik</Link></span>
          </p>

          {article.intro && (
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#cdc6be", lineHeight: 1.8, fontStyle: "italic", borderLeft: "3px solid #c9a84c", paddingLeft: 20 }}>{article.intro}</p>
          )}

          {article.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 44 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: "#f0ece4", marginBottom: 16, lineHeight: 1.3 }}>{s.heading}</h2>
              <p style={{ fontSize: 16, color: "#a89f94", lineHeight: 1.9 }}>{s.body}</p>
            </div>
          ))}

          {article.fazit && (
            <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: 28, marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#c9a84c", marginBottom: 10 }}>Fazit & Einordnung</div>
              <p style={{ fontSize: 15, color: "#e2c27d", lineHeight: 1.8, margin: 0 }}>{article.fazit}</p>
            </div>
          )}

          {article.disclaimer && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
              <strong>Rechtlicher Hinweis:</strong> {article.disclaimer}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
