import { Link, useParams } from "react-router";
import registry from "../../content/newsletter.json";

type Section = { heading: string; body: string };
type Source = { label: string; url: string; jurisdiction: string; asOf: string };
type Issue = {
  slug: string;
  category: string;
  title: string;
  teaser: string;
  h1: string;
  published: string;
  asOf: string;
  readTime: string;
  tier: string;
  keywords: string[];
  rechnerHref: string;
  sections: Section[];
  sources: Source[];
};

const issues = registry.issues as Issue[];
const bySlug = new Map(issues.map((issue) => [issue.slug, issue]));

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export default function NewsletterIssue() {
  const { slug = "" } = useParams();
  const issue = bySlug.get(slug);

  if (!issue) {
    return (
      <section style={{ padding: "160px 20px 88px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#f0ece4", marginBottom: 14 }}>
            Ausgabe nicht gefunden
          </h1>
          <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.75, marginBottom: 24 }}>
            Diese Ausgabe existiert nicht oder wurde archiviert. Alle verfügbaren Ausgaben
            finden Sie im Archiv.
          </p>
          <Link to="/newsletter" style={{ color: "#e2c27d", fontWeight: 600 }}>Zum Ausgaben-Archiv</Link>
        </div>
      </section>
    );
  }

  const related = issues.filter((item) => item.slug !== issue.slug).slice(0, 3);

  return (
    <>
      <article style={{ padding: "120px 20px 40px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <nav aria-label="Brotkrumen" style={{ marginBottom: 24 }}>
            <Link to="/newsletter" style={{ fontSize: 13, color: "#a89f94", textDecoration: "none" }}>
              ← Alle Ausgaben
            </Link>
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c" }}>{issue.category}</span>
            <span style={{ fontSize: 12, color: "#a89f94" }}>
              {formatDate(issue.published)} · {issue.readTime} · Stand {formatDate(issue.asOf)}
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 700, color: "#f0ece4", lineHeight: 1.2, letterSpacing: "-0.025em", margin: "0 0 20px" }}>
            {issue.h1}
          </h1>
          <p style={{ fontSize: 17, color: "#cdc6be", lineHeight: 1.75, margin: "0 0 12px" }}>{issue.teaser}</p>

          {issue.rechnerHref && (
            <p style={{ margin: "0 0 32px" }}>
              <Link to={issue.rechnerHref} style={{ fontSize: 14, color: "#e2c27d", fontWeight: 600 }}>
                Zum passenden Rechner →
              </Link>
            </p>
          )}

          {issue.sections.map((section) => (
            <section key={section.heading} style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0ece4", margin: "0 0 10px" }}>
                {section.heading}
              </h2>
              <p style={{ fontSize: 15, color: "#cdc6be", lineHeight: 1.8, margin: 0 }}>{section.body}</p>
            </section>
          ))}

          <section style={{ marginTop: 40, padding: 22, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#f0ece4", margin: "0 0 14px" }}>
              Quellen und Stichtag
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              {issue.sources.map((source) => (
                <li key={source.url + source.label} style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7 }}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "#e2c27d", textDecoration: "none" }}>
                    {source.label}
                  </a>
                  {" — "}
                  {source.jurisdiction}, Stand {formatDate(source.asOf)}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 12, color: "#7d766c", lineHeight: 1.7, margin: "16px 0 0" }}>{registry.disclaimer}</p>
          </section>
        </div>
      </article>

      {related.length > 0 && (
        <section style={{ padding: "40px 20px 88px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#f0ece4", margin: "0 0 20px" }}>Weitere Ausgaben</h2>
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/newsletter/${item.slug}`}
                  style={{ display: "block", textDecoration: "none", padding: 20, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c" }}>{item.category}</span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "#f0ece4", margin: "8px 0 6px", lineHeight: 1.35 }}>{item.title}</h3>
                  <span style={{ fontSize: 12, color: "#7d766c" }}>{formatDate(item.published)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

