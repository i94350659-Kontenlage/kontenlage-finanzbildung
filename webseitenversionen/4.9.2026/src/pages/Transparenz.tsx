import { Link } from "react-router";

export default function Transparenz() {
  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 56px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Offenlegung</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>Transparenz</h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 600, lineHeight: 1.75 }}>
            Wir erklären offen, wie Kontolage finanziert wird, wer hinter der Plattform steht
            und welche Interessenkonflikte es nicht gibt.
          </p>
        </div>
      </section>

      <section style={{ padding: "64px 20px 88px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Finanzierungsmodell */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 700, color: "#f0ece4", marginBottom: 24, letterSpacing: "-0.02em" }}>
              Wie Kontolage finanziert wird
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }} className="transp-grid">
              {[
                { label: "Basis-Abo", value: "0 €/Monat", desc: "Kostenlos, keine Kreditkarte erforderlich", icon: "✓" },
                { label: "Pro Digital", value: "9 €/Monat", desc: "Unbegrenzter Zugang, alle Inhalte", icon: "✓" },
                { label: "Executive", value: "29 €/Monat", desc: "ELSTER-Vorlagen, B2B-Analyse", icon: "✓" },
                { label: "Provisionen von Produktanbietern", value: "0 €", desc: "Wir erhalten keine Provision", icon: "✗" },
              ].map(i => (
                <div key={i.label} style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.6), rgba(30,41,59,0.75))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "20px 22px", display: "flex", gap: 16 }}>
                  <div style={{ fontSize: 18, color: i.icon === "✓" ? "#c9a84c" : "#a89f94", flexShrink: 0, fontWeight: 700 }}>{i.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e2da", marginBottom: 4 }}>{i.label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "#c9a84c", marginBottom: 4 }}>{i.value}</div>
                    <div style={{ fontSize: 12, color: "#a89f94" }}>{i.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.85 }}>
              Kontolage finanziert sich ausschließlich durch Abonnements. Wir erhalten keine Vermittlungsprovisionen,
              keine Affiliate-Einnahmen und keine Zahlungen von Produktanbietern (Banken, Versicherungen, Fondsgesellschaften).
              Dieses Modell ist Voraussetzung für echte Unabhängigkeit.
            </p>
          </div>

          {/* Keine Anlageberatung */}
          <div style={{ marginBottom: 64, padding: "28px 32px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#f0ece4", marginBottom: 16 }}>
              Keine Anlageberatung — was das bedeutet
            </h2>
            <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.85, marginBottom: 16 }}>
              Kontolage ist keine Anlageberatung i.S.d. WpHG §2 Abs. 8 Nr. 10. Wir bieten:
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {[
                "Allgemeine steuerrechtliche Informationen — keine individuelle Steuerberatung i.S.d. StBerG",
                "Indikative Berechnungen auf Basis öffentlich verfügbarer Steuergesetze",
                "Erklärung von Anlagemechanismen ohne Empfehlung konkreter Produkte",
                "Redaktionelle Artikel ohne werblichen Charakter",
              ].map(l => (
                <li key={l} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" style={{ marginTop: 2, flexShrink: 0 }}><path d="M20 6L9 17l-5-5"/></svg>
                  <span style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.7 }}>{l}</span>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.8 }}>
              Rechtsgrundlagen: WpHG §2 Abs. 8 Nr. 10, MAR Art. 20 Abs. 1, StBerG §2.
              BaFin-konform.
            </p>
          </div>

          {/* Datenschutz */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#f0ece4", marginBottom: 20 }}>
              Datenschutz & Cookies
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }} className="cookie-grid">
              {[
                { name: "Tracking-Cookies", status: "Keine", color: "#c9a84c" },
                { name: "Analytics (Drittanbieter)", status: "Keine", color: "#c9a84c" },
                { name: "Werbeanzeigen", status: "Keine", color: "#c9a84c" },
              ].map(c => (
                <div key={c.name} style={{ background: "rgba(30,50,90,0.55)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.status}</div>
                  <div style={{ fontSize: 12, color: "#a89f94" }}>{c.name}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.85 }}>
              Kontolage setzt keine Tracking-Cookies ein. Berechnungen werden nicht gespeichert oder übermittelt.
              Alle Rechenoperationen laufen ausschließlich lokal im Browser.{" "}
              <Link to="/datenschutz" style={{ color: "#c9a84c", textDecoration: "none" }}>Vollständige Datenschutzerklärung →</Link>
            </p>
          </div>

          {/* Methodik */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#f0ece4", marginBottom: 20 }}>
              Methodik & Quellen
            </h2>
            <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.85, marginBottom: 20 }}>
              Alle Berechnungen und Inhalte basieren auf veröffentlichten Steuergesetzen und Verordnungen.
              Wir verlinken auf primäre Rechtsquellen:
            </p>
            {[
              { label: "Einkommensteuergesetz (EStG)", href: "https://www.gesetze-im-internet.de/estg/" },
              { label: "Körperschaftsteuergesetz (KStG)", href: "https://www.gesetze-im-internet.de/kstg_1977/" },
              { label: "Wertpapierhandelsgesetz (WpHG)", href: "https://www.gesetze-im-internet.de/wphg/" },
              { label: "BMF-Schreiben zur Abgeltungsteuer", href: "https://www.bundesfinanzministerium.de" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={e => (e.currentTarget.style.color = "")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                <span style={{ fontSize: 14, color: "#cdc6be" }}>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <style>{`@media(max-width:640px){.transp-grid{grid-template-columns:1fr !important;}.cookie-grid{grid-template-columns:1fr !important;}}`}</style>
    </>
  );
}
