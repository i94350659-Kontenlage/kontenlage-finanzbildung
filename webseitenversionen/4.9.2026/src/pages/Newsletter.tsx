import { Link } from "react-router";
import registry from "../../content/newsletter.json";

type Section = { heading: string; body: string };
type Source = { label: string; url: string; jurisdiction: string; asOf: string };
type Issue = {
  slug: string;
  category: string;
  title: string;
  teaser: string;
  description: string;
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

const issues = (registry.issues as Issue[]).slice().sort((a, b) => b.published.localeCompare(a.published));

const tierLabel: Record<string, string> = {
  free: "Kostenlos",
  pro: "Pro Digital",
  executive: "Executive B2B",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: 24,
};

export default function Newsletter() {
  return (
    <>
      <section style={{ padding: "120px 20px 56px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Ausgaben</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>
            Kontolage-Ausgaben
          </h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 640, lineHeight: 1.75, margin: 0 }}>
            Ausgaben zu Steuern, Anlageklassen und Unternehmensstruktur. Jede Zahl mit
            Quelle, Paragraph und Stichtag — Fakten, Modelle und Szenarien klar getrennt.
            Die Ausgaben erscheinen direkt auf dieser Seite, sie werden nicht per E-Mail versendet.
          </p>
          <p style={{ marginTop: 20, padding: "10px 16px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 6, display: "inline-block" }}>
            <span style={{ fontSize: 12, color: "#a89f94" }}>⚠️ Indikative Schätzwerte · Keine Anlageberatung i.S.d. WpHG · BaFin-konform · MAR Art. 20</span>
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {issues.map((issue) => (
              <li key={issue.slug}>
                <Link
                  to={`/newsletter/${issue.slug}`}
                  style={{ display: "block", textDecoration: "none", ...cardStyle }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c" }}>{issue.category}</span>
                    <span style={{ fontSize: 11, color: "#a89f94", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "2px 10px" }}>
                      {tierLabel[issue.tier] ?? issue.tier}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, color: "#f0ece4", margin: "0 0 10px", lineHeight: 1.35 }}>
                    {issue.title}
                  </h2>
                  <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.7, margin: "0 0 14px" }}>{issue.teaser}</p>
                  <p style={{ fontSize: 12, color: "#7d766c", margin: 0 }}>
                    {new Date(issue.published).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                    {" · "}
                    {issue.readTime}
                    {" · Stand "}
                    {new Date(issue.asOf).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 48, padding: 24, border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.05)", borderRadius: 10 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#f0ece4", margin: "0 0 10px" }}>
              Ausgaben für Pro und Executive
            </h2>
            <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.7, margin: "0 0 16px", maxWidth: 720 }}>
              Mitglieder erhalten zusätzlich exklusive Ausgaben, die ausschließlich im Kabinett
              unter <code style={{ color: "#e2c27d" }}>/konto</code> erscheinen. Der Text geschützter
              Ausgaben wird nur nach Prüfung der Mitgliedschaft ausgeliefert, nicht über das
              öffentliche Seiten-HTML.
            </p>
            <Link to="/abo" style={{ display: "inline-block", padding: "10px 20px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.5)", color: "#e2c27d", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Tarife ansehen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
