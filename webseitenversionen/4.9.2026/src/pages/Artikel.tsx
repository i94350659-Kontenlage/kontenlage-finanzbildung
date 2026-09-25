import { useState } from "react";
import { Link } from "react-router";

const articles = [
  {
    slug: "defi-lending-staking-liquidity-pools-guide",
    tag: "DeFi & Web3",
    title: "DeFi-Guide 2026: Lending, Staking & Liquidity Pools – Chancen, Risiken & Steuerpraxis",
    desc: "Vollständiger Leitfaden zu dezentraler Finanzinfrastruktur: Funktionsweise von Aave, Uniswap und Curve, Smart-Contract-Audits, Impermanent Loss sowie die steuerliche Handhabung nach § 23 EStG und § 22 Nr. 3 EStG.",
    readTime: "11 Min.",
    date: "12. September 2026",
    featured: true
  },

  {
    slug: "ezb-zinssenkungen-anleihen-tagesgeld",
    tag: "Makroökonomie & EZB",
    title: "EZB-Zinssenkungen: Was die Zinswende für Tagesgeld, Festgeld und Anleihen bedeutet",
    desc: "Die Europäische Zentralbank hat den Zinssenkungszyklus eingeleitet. Was bedeutet das für Sparer, Euro-Staatsanleihen und Immobilienfinanzierungen?",
    readTime: "9 Min.",
    date: "12. September 2026",
    featured: true
  },
  {
    slug: "us-schulden-dollar-gold-portfolio",
    tag: "Weltwirtschaft & Geopolitik",
    title: "US-Schuldenberg & BRICS-Dynamik: Warum Gold und Realwerte als Absicherung unverzichtbar sind",
    desc: "Über 35 Billionen USD US-Staatsschulden, Entdollarisierung und massive Zentralbankkäufe: Die strategische Rolle von Gold im Portfolio.",
    readTime: "10 Min.",
    date: "8. September 2026",
    featured: true
  },
  {
    slug: "etf-vorabpauschale-2026-steuern",
    tag: "Kapitalerträge",
    title: "Vorabpauschale 2026: Berechnung, Basiszins und Steuerabzug bei thesaurierenden ETFs",
    desc: "So berechnen Depotbanken die Vorabpauschale nach dem Basiszins des BMF. Teilfreistellung (30%), Freistellungsauftrag und Liquiditätsvorsorge auf dem Verrechnungskonto.",
    readTime: "7 Min.",
    date: "1. September 2026",
    featured: true
  },
  {
    slug: "bitcoin-steuer-holding-privat-2026",
    tag: "Krypto & Digital Assets",
    title: "Krypto-Besteuerung in Deutschland: 1-Jahres-Haltefrist nach § 23 EStG vs. Holding",
    desc: "Rechtssichere Besteuerung von Bitcoin & Krypto: Steuerfreiheit nach 12 Monaten Haltefrist, Staking-Rechtslage und warum eine GmbH für Krypto steuerlich meist nachteilig ist.",
    readTime: "8 Min.",
    date: "25. August 2026",
    featured: false
  },
  {
    slug: "steuersparmodelle-immobilien",
    tag: "Immobilien",
    title: "Steuersparmodelle im Immobilienmarkt: Was davon legal ist",
    desc: "Eine sachliche Analyse der verbreiteten Modelle – lineare vs. degressive AfA, Denkmalschutz, § 6b EStG und Grunderwerbsteuer-Gestaltungen. Welche sind legal, welche riskant?",
    readTime: "8 Min.",
    date: "15. Juni 2026",
    featured: false
  },
  {
    slug: "ruerup-angestellte",
    tag: "Altersvorsorge",
    title: "Rürup für Angestellte: Rechnet sich das wirklich?",
    desc: "Quantitativer Vergleich: Rürup vs. ETF-Depot vs. bAV – für unterschiedliche Einkommens- und Steuersituationen. Mit mathematischem Rechenbeispiel.",
    readTime: "11 Min.",
    date: "28. Mai 2026",
    featured: false
  },
  {
    slug: "sparerpauschbetrag-2026",
    tag: "Kapitalerträge",
    title: "Sparerpauschbetrag optimal ausschöpfen & Verlustverrechnung",
    desc: "Freistellungsaufträge richtig aufteilen, Verlustverrechnungstöpfe verstehen und den Pauschbetrag auf Depots verteilen.",
    readTime: "6 Min.",
    date: "10. April 2026",
    featured: false
  },
  {
    slug: "holding-gruendung-kosten",
    tag: "Holding & GmbH",
    title: "VV-GmbH gründen: Kosten, Nutzen, Zeitpunkt",
    desc: "Wann lohnt sich eine vermögensverwaltende GmbH wirklich? 1,5% Steuer auf Aktiengewinne nach § 8b KStG, Gründungskosten, laufende IHK/Steuerberaterkosten und Break-Even.",
    readTime: "9 Min.",
    date: "22. März 2026",
    featured: false
  },
  {
    slug: "etf-kosten-vergleich",
    tag: "ETF & Indexfonds",
    title: "TER, Trackingdifferenz, Spread: Was ETFs wirklich kosten",
    desc: "Nicht nur die TER entscheidet über ETF-Kosten. Trackingdifferenz und Handelskosten werden oft unterschätzt.",
    readTime: "7 Min.",
    date: "8. März 2026",
    featured: false
  },
  {
    slug: "home-office-pauschale-2026",
    tag: "Arbeitnehmer",
    title: "Home-Office-Pauschale: 6 € pro Tag richtig nutzen",
    desc: "Die Home-Office-Pauschale ist dauerhaft 6 € pro Arbeitstag (max. 1.260 €). So tragen Sie sie korrekt in die Steuererklärung ein.",
    readTime: "5 Min.",
    date: "1. Februar 2026",
    featured: false
  },
  {
    slug: "fuenftelregelung-abfindung",
    tag: "Abfindung",
    title: "Fünftelregelung: Abfindung steueroptimiert erhalten",
    desc: "§ 34 EStG erlaubt es, außerordentliche Einkünfte progressionsgemindert zu versteuern. Rechenbeispiel mit 80.000 € Abfindung.",
    readTime: "8 Min.",
    date: "15. Januar 2026",
    featured: false
  },
  {
    slug: "kirchensteuer-optimierung",
    tag: "Kirchensteuer",
    title: "Kirchensteuerpflicht bei Kapitalerträgen: Sperrvermerk setzen",
    desc: "Wer kirchensteuerpflichtig ist, zahlt auf Kapitalerträge automatisch Kirchensteuer – außer er setzt den Sperrvermerk beim BZSt.",
    readTime: "4 Min.",
    date: "5. Januar 2026",
    featured: false
  },
];

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
  "Arbeitnehmer"
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
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>
            Finanzbildungs-Bibliothek
          </h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 640, lineHeight: 1.75 }}>
            Fundierte Analysen zu Zinsentscheidungen der EZB, weltwirtschaftlichen Entwicklungen, Steuerrecht und institutionellem Vermögensaufbau – neutral, quellengestützt und 100% BaFin-konform.
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
              <div style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Top-Analysen zur aktuellen Lage</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 48 }} className="articles-grid">
                {featured.map(a => (
                  <Link key={a.slug} to={`/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, padding: 26, height: "100%", display: "flex", flexDirection: "column", transition: "border-color 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)"; e.currentTarget.style.transform = ""; }}
                    >
                      <span style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 600, color: "#c9a84c", padding: "3px 10px", borderRadius: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 16 }}>{a.tag}</span>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#f0ece4", lineHeight: 1.35, marginBottom: 12 }}>{a.title}</div>
                      <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.75, marginBottom: 20, flex: 1 }}>{a.desc}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#a89f94", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <span>{a.date}</span><span>⏱ {a.readTime} Lesezeit</span>
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
              <div style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Alle Fachartikel</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {rest.map(a => (
                  <Link key={a.slug} to={`/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: 24, alignItems: "center", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      <div style={{ flexShrink: 0, width: 90, fontSize: 11, color: "#a89f94" }}>{a.date}</div>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "2px 8px", borderRadius: 20, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: 6 }}>{a.tag}</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "#f0ece4", lineHeight: 1.35, marginBottom: 4 }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: "#a89f94" }}>⏱ {a.readTime} Lesezeit • {a.desc}</div>
                      </div>
                      <div style={{ color: "#c9a84c", flexShrink: 0, fontSize: 16 }}>→</div>
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