import { Link } from "react-router";

function Hero() {
  return (
    <section style={{
      position: "relative", minHeight: "100svh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      overflow: "hidden", padding: "120px 20px 80px",
    }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(48,68,104,0.4) 0%, transparent 60%), #111827" }}/>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(240,236,228,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,236,228,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}/>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div className="hero-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: "#c9a84c" }}/>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a84c" }}>Keine Provisionen · Reine Mathematik</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 62px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#f0ece4", marginBottom: 24 }}>
              Was mit deinem<br/>
              <em style={{ color: "#c9a84c", fontStyle: "italic" }}>Gehalt rechnerisch</em><br/>
              möglich ist.
            </h1>

            <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.75, color: "#a89f94", maxWidth: 440, marginBottom: 40 }}>
              Rürup, Freibeträge, Abschreibungen — kein Verkauf, kein Druck.
              Nur Paragraphen und mathematische Klarheit nach §§ EStG.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/rechner" style={{
                padding: "14px 28px", borderRadius: 5,
                background: "linear-gradient(135deg, #c9a84c, #a8873a)",
                color: "#111827", fontWeight: 700, fontSize: 15, textDecoration: "none",
                boxShadow: "0 4px 24px rgba(201,168,76,0.28)",
              }}>Szenario berechnen</Link>
              <Link to="/artikel" style={{
                padding: "14px 28px", borderRadius: 5,
                border: "1px solid rgba(201,168,76,0.3)",
                color: "#e2c27d", fontWeight: 500, fontSize: 15, textDecoration: "none",
              }}>Artikel lesen</Link>
            </div>

            <div className="trust-row" style={{ marginTop: 52, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { value: "0 %", label: "Provision" },
                { value: "§§ EStG", label: "Rechtsgrundlage" },
                { value: "100 %", label: "Kein Tracking" },
              ].map(t => (
                <div key={t.label}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#c9a84c" }}>{t.value}</div>
                  <div style={{ fontSize: 12, color: "#a89f94", letterSpacing: "0.04em", marginTop: 4 }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard card */}
          <div className="hero-card-wrapper" style={{ position: "relative" }}>
            <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.88), rgba(30,41,59,0.97))", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 16, padding: 32, backdropFilter: "blur(16px)", boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#a89f94", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Steuerersparnis / Jahr</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "#e2c27d" }}>4.200 €</div>
                </div>
                <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}>
                  <span style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600 }}>↑ optimiert</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 72, marginBottom: 22 }}>
                {[30,48,42,65,55,80,72,88,76,95,85,100].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i >= 9 ? "linear-gradient(to top, #c9a84c, #e2c27d)" : "rgba(201,168,76,0.18)" }}/>
                ))}
              </div>
              {[
                { label: "Rürup (§10 EStG)", value: "2.460 €", pct: 62 },
                { label: "Sparerpauschbetrag", value: "1.000 €", pct: 25 },
                { label: "§35a Handwerker", value: "740 €", pct: 18 },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#a89f94" }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#e2c27d", fontFamily: "var(--font-mono)" }}>{item.value}</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, background: "linear-gradient(90deg, #c9a84c, #e2c27d)", borderRadius: 2 }}/>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-badge" style={{ position: "absolute", bottom: -18, left: -18, background: "linear-gradient(135deg, #1a2640, #111827)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 10, padding: "11px 15px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
              <div style={{ fontSize: 10, color: "#a89f94", marginBottom: 3 }}>BaFin-konform · WpHG §2</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#c9a84c" }}>Keine Anlageberatung</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: "⚖️", title: "Unabhängig", desc: "Keine Provisionen, keine Interessenkonflikte. Nur Paragraphen und Mathematik." },
    { icon: "🔐", title: "Datensicher", desc: "100% ohne Tracking-Cookies. Ihre Berechnungen bleiben bei Ihnen." },
    { icon: "📐", title: "Präzise", desc: "Alle Formeln basieren auf geltendem Steuerrecht: §§ EStG, KStG, WpHG." },
    { icon: "🎯", title: "Zugänglich", desc: "Komplexe Steueroptimierung verständlich — für Angestellte und Selbständige." },
  ];

  return (
    <section style={{ padding: "72px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="features-grid">
          {items.map(item => (
            <div key={item.title} style={{ padding: "28px 24px", borderTop: "1px solid rgba(201,168,76,0.15)", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderTopColor = "rgba(201,168,76,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.borderTopColor = "rgba(201,168,76,0.15)")}
            >
              <div style={{ fontSize: 26, marginBottom: 14 }}>{item.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#f0ece4", marginBottom: 10 }}>{item.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#a89f94" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickNav() {
  const cards = [
    { to: "/rechner", icon: "🧮", title: "Steuerrechner", desc: "Rürup, Sparerpauschbetrag und Immobilien-AfA interaktiv berechnen." },
    { to: "/holding", icon: "🏛️", title: "Holding & Steuern", desc: "VV-GmbH, Fünftelregelung und steuerfreie Benefits im Detail." },
    { to: "/anlageformen", icon: "📊", title: "Anlageformen", desc: "ETF, Tagesgeld, Immobilien und Rürup neutral verglichen." },
    { to: "/artikel", icon: "📄", title: "Artikel", desc: "Fundierte Analysen ohne Produktwerbung — sachlich und rechtssicher." },
    { to: "/transparenz", icon: "🔍", title: "Transparenz", desc: "Wie Kontolage finanziert wird und warum wir keine Provision nehmen." },
    { to: "/abo", icon: "🔑", title: "Mitgliedschaft", desc: "Basis kostenlos. Pro Digital 9 €/Monat. Executive 29 €/Monat." },
  ];

  return (
    <section style={{ padding: "88px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Navigation</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.02em" }}>
            Alle Bereiche im Überblick
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="quicknav-grid">
          {cards.map(c => (
            <Link key={c.to} to={c.to} style={{ textDecoration: "none" }}>
              <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.6), rgba(30,41,59,0.75))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "24px 22px", height: "100%", transition: "border-color 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{c.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "#f0ece4", marginBottom: 10 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7 }}>{c.desc}</div>
                <div style={{ marginTop: 16, fontSize: 12, color: "#c9a84c", fontWeight: 600 }}>Mehr erfahren →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:960px){.quicknav-grid{grid-template-columns:1fr 1fr !important;}}@media(max-width:560px){.quicknav-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}

function RecentArticles() {
  const articles = [
    { tag: "Immobilien", title: "Steuersparmodelle im Immobilienmarkt: was davon legal ist", date: "Juni 2026", slug: "steuersparmodelle-immobilien" },
    { tag: "Altersvorsorge", title: "Rürup für Angestellte: rechnet sich das wirklich?", date: "Mai 2026", slug: "ruerup-angestellte" },
    { tag: "Kapitalerträge", title: "Sparerpauschbetrag 2026 optimal ausschöpfen", date: "April 2026", slug: "sparerpauschbetrag-2026" },
  ];

  return (
    <section style={{ padding: "88px 20px", background: "rgba(6,9,18,0.8)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Aktuell</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.02em" }}>Neueste Artikel</h2>
          </div>
          <Link to="/artikel" style={{ fontSize: 13, color: "#c9a84c", textDecoration: "none", fontWeight: 500 }}>Alle Artikel →</Link>
        </div>

        <div className="articles-grid">
          {articles.map(a => (
            <Link key={a.slug} to={`/artikel/${a.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.6), rgba(30,41,59,0.75))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 24, height: "100%", transition: "border-color 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = ""; }}
              >
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: "#c9a84c", padding: "3px 10px", borderRadius: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 16 }}>{a.tag}</span>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "#f0ece4", lineHeight: 1.4, marginBottom: 16 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#a89f94" }}>{a.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCTA() {
  return (
    <section style={{ padding: "100px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#f0ece4", marginBottom: 20, letterSpacing: "-0.02em" }}>
          Bereit für <em style={{ color: "#c9a84c", fontStyle: "italic" }}>mathematische Klarheit</em>?
        </div>
        <p style={{ fontSize: 16, color: "#a89f94", lineHeight: 1.75, marginBottom: 40 }}>
          Kein Konto erforderlich. Kein Verkaufsgespräch. Beginnen Sie direkt mit dem Rechner.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/rechner" style={{ padding: "15px 32px", borderRadius: 5, background: "linear-gradient(135deg, #c9a84c, #a8873a)", color: "#111827", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 24px rgba(201,168,76,0.28)" }}>
            Rechner starten
          </Link>
          <Link to="/abo" style={{ padding: "15px 32px", borderRadius: 5, border: "1px solid rgba(201,168,76,0.3)", color: "#e2c27d", fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
            Mitgliedschaft ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <QuickNav />
      <RecentArticles />
      <HomeCTA />
    </>
  );
}
