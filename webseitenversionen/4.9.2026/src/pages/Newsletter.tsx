import { useState } from "react";
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
  transition: "border-color 0.2s ease, transform 0.2s ease",
};

export default function Newsletter() {
  const [selectedTag, setSelectedTag] = useState("Alle");

  const filteredIssues =
    selectedTag === "Alle"
      ? issues
      : issues.filter((issue) => issue.category === selectedTag);

  return (
    <>
      <section
        style={{
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
              Ausgaben-Archiv
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
            Kontolage-Ausgaben
          </h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 680, lineHeight: 1.75, margin: 0 }}>
            Regelmäßige Ausgaben zu Geldpolitik, Steuerrecht, Anlageklassen und Unternehmensstruktur.
            Jede Zahl mit Primärquelle, Gesetzesparagraph und Stichtag — Fakten, Modelle und Szenarien
            strikt getrennt. Ausgaben erscheinen direkt hier auf der Website und werden nicht per E-Mail versendet.
          </p>
          <p
            style={{
              marginTop: 20,
              padding: "10px 16px",
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: 6,
              display: "inline-block",
            }}
          >
            <span style={{ fontSize: 12, color: "#a89f94" }}>
              ⚠️ Indikative Schätzwerte · Keine Anlageberatung i.S.d. WpHG (§ 2 Abs. 8 Nr. 10) · BaFin-konform · MAR Art. 20
            </span>
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Kategorie-Filter-Leiste */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 40,
              alignItems: "center",
            }}
          >
            {tags.map((t) => {
              const count = t === "Alle" ? issues.length : issues.filter((i) => i.category === t).length;
              const isActive = selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
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

          {/* Ausgaben-Raster */}
          {filteredIssues.length > 0 ? (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 20,
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              }}
            >
              {filteredIssues.map((issue) => (
                <li key={issue.slug}>
                  <Link
                    to={`/newsletter/${issue.slug}`}
                    style={{ display: "block", textDecoration: "none", ...cardStyle }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#c9a84c",
                        }}
                      >
                        {issue.category}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#a89f94",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 20,
                          padding: "2px 10px",
                        }}
                      >
                        {tierLabel[issue.tier] ?? issue.tier}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 21,
                        fontWeight: 700,
                        color: "#f0ece4",
                        margin: "0 0 10px",
                        lineHeight: 1.35,
                      }}
                    >
                      {issue.title}
                    </h2>
                    <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.7, margin: "0 0 14px" }}>
                      {issue.teaser}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 12,
                        color: "#7d766c",
                        paddingTop: 12,
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span>
                        {new Date(issue.published).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span>
                        {issue.readTime} · Stand{" "}
                        {new Date(issue.asOf).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div
              style={{
                padding: "48px 24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#f0ece4", marginBottom: 10 }}>
                Keine Ausgabe für "{selectedTag}" im aktuellen Archiv
              </h3>
              <p style={{ fontSize: 14, color: "#a89f94", maxWidth: 540, margin: "0 auto 20px", lineHeight: 1.7 }}>
                Hermes überwacht kontinuierlich die amtlichen Primärquellen (EZB, Bundesbank, BMF, Destatis, BFH) für diese
                Kategorie. Weiterführende Berechnungen und Artikel finden Sie in den Fachbereichen:
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  to="/artikel"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    background: "rgba(201,168,76,0.12)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    color: "#e2c27d",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Zu den Artikeln →
                </Link>
                <Link
                  to="/rechner"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f0ece4",
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  Zu den Steuerrechnern →
                </Link>
              </div>
            </div>
          )}

          {/* Bereich für Pro und Executive Ausgaben */}
          <div
            style={{
              marginTop: 56,
              padding: 28,
              border: "1px solid rgba(201,168,76,0.2)",
              background: "rgba(201,168,76,0.05)",
              borderRadius: 10,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#c9a84c",
                }}
              >
                Exklusiver Mitglieder-Zugang
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#f0ece4", margin: "0 0 10px" }}>
              Vertiefte Ausgaben für Pro und Executive Mitglieder
            </h2>
            <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.75, margin: "0 0 18px", maxWidth: 760 }}>
              Mitglieder mit aktivem Abo erhalten Zugang zu exklusiven Detailausgaben mit tiefen
              Berechnungsmodellen, B2B-Simulationen und Gesetzeskommentierungen, die im geschützten Kabinett
              unter <code style={{ color: "#e2c27d", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 4 }}>/konto</code> bereitgestellt
              werden.
            </p>
            <Link
              to="/abo"
              style={{
                display: "inline-block",
                padding: "10px 22px",
                borderRadius: 6,
                border: "1px solid rgba(201,168,76,0.5)",
                background: "rgba(201,168,76,0.1)",
                color: "#e2c27d",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Tarife & Mitgliedschaften ansehen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
