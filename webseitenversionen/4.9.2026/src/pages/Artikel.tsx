import { useState } from "react";
import { Link } from "react-router";

const articles = [
  { slug: "steuersparmodelle-immobilien", tag: "Immobilien", title: "Steuersparmodelle im Immobilienmarkt: was davon legal ist", desc: "Eine sachliche Analyse der verbreiteten Modelle — AfA, Denkmalschutz, §6b EStG und Grunderwerbsteuer-Gestaltungen. Welche sind legal, welche riskant?", readTime: "8 Min.", date: "15. Juni 2026", featured: true },
  { slug: "ruerup-angestellte", tag: "Altersvorsorge", title: "Rürup für Angestellte: rechnet sich das wirklich?", desc: "Quantitativer Vergleich: Rürup vs. ETF-Depot vs. bAV — für unterschiedliche Einkommens- und Steuersituationen. Mit Rechenbeispiel.", readTime: "11 Min.", date: "28. Mai 2026", featured: true },
  { slug: "sparerpauschbetrag-2026", tag: "Kapitalerträge", title: "Sparerpauschbetrag 2026 optimal ausschöpfen", desc: "Freistellungsaufträge richtig aufteilen, Verlustverrechnungstöpfe verstehen und den Betrag auf Depots verteilen.", readTime: "6 Min.", date: "10. April 2026", featured: true },
  { slug: "holding-gruendung-kosten", tag: "Holding & GmbH", title: "VV-GmbH gründen: Kosten, Nutzen, Zeitpunkt", desc: "Wann lohnt sich eine vermögensverwaltende GmbH wirklich? Gründungskosten, laufende Kosten und Break-Even-Berechnung.", readTime: "9 Min.", date: "22. März 2026", featured: false },
  { slug: "etf-kosten-vergleich", tag: "ETF & Indexfonds", title: "TER, Trackingdifferenz, Spread: was ETFs wirklich kosten", desc: "Nicht nur die TER entscheidet über ETF-Kosten. Trackingdifferenz und Handelskosten werden oft unterschätzt.", readTime: "7 Min.", date: "8. März 2026", featured: false },
  { slug: "home-office-pauschale-2026", tag: "Arbeitnehmer", title: "Home-Office-Pauschale 2026: 6 € pro Tag — richtig nutzen", desc: "Die Home-Office-Pauschale ist seit 2023 dauerhaft 6 € pro Arbeitstag. So tragen Sie sie korrekt in die Steuererklärung ein.", readTime: "5 Min.", date: "1. Februar 2026", featured: false },
  { slug: "fuenftelregelung-abfindung", tag: "Abfindung", title: "Fünftelregelung: Abfindung steueroptimiert erhalten", desc: "§34 EStG erlaubt es, außerordentliche Einkünfte progressionsgemindert zu versteuern. Rechenbeispiel mit 80.000 € Abfindung.", readTime: "8 Min.", date: "15. Januar 2026", featured: false },
  { slug: "kirchensteuer-optimierung", tag: "Kirchensteuer", title: "Kirchensteuerpflicht bei Kapitalerträgen: Sperrvermerk setzen", desc: "Wer kirchensteuerpflichtig ist, zahlt auf Kapitalerträge automatisch Kirchensteuer — außer er setzt den Sperrvermerk.", readTime: "4 Min.", date: "5. Januar 2026", featured: false },
];

const tags = ["Alle", "Immobilien", "Altersvorsorge", "Kapitalerträge", "Holding & GmbH", "ETF & Indexfonds", "Arbeitnehmer", "Abfindung"];

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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Wissen</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>Artikel</h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 560, lineHeight: 1.75 }}>
            Fundierte Analysen zu Steuerrecht, Kapitalanlage und Altersvorsorge — ohne Produktwerbung,
            ohne Provision, mit klarem Rechtsbezug.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Tag filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
            {tags.map(t => (
              <button key={t} onClick={() => setTag(t)} style={{
                padding: "8px 16px", borderRadius: 20, border: "1px solid",
                borderColor: tag === t ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
                background: tag === t ? "rgba(201,168,76,0.1)" : "transparent",
                color: tag === t ? "#e2c27d" : "#a89f94",
                fontWeight: 500, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
              }}>{t}</button>
            ))}
          </div>

          {/* Featured */}
          {featured.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Empfohlen</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }} className="articles-grid">
                {featured.map(a => (
                  <Link key={a.slug} to={`/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 10, padding: 26, height: "100%", transition: "border-color 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)"; e.currentTarget.style.transform = ""; }}
                    >
                      <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: "#c9a84c", padding: "3px 10px", borderRadius: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 16 }}>{a.tag}</span>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "#f0ece4", lineHeight: 1.35, marginBottom: 12 }}>{a.title}</div>
                      <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.75, marginBottom: 20 }}>{a.desc}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#a89f94", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <span>{a.date}</span><span>{a.readTime} Lesezeit</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <>
              {featured.length > 0 && <div style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Weitere Artikel</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {rest.map(a => (
                  <Link key={a.slug} to={`/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      <div style={{ flexShrink: 0, width: 80, fontSize: 11, color: "#a89f94", marginTop: 4 }}>{a.date}</div>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: "#c9a84c", padding: "2px 8px", borderRadius: 20, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: 8 }}>{a.tag}</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "#f0ece4", lineHeight: 1.35, marginBottom: 6 }}>{a.title}</div>
                        <div style={{ fontSize: 13, color: "#a89f94" }}>{a.readTime} Lesezeit</div>
                      </div>
                      <div style={{ color: "#c9a84c", flexShrink: 0, marginTop: 4 }}>→</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
