export default function Impressum() {
  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Rechtliches</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.025em" }}>Impressum</h1>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {[
            {
              heading: "Angaben gemäß § 5 TMG",
              content: `Kontolage GmbH (Beispiel)
Musterstraße 12
10115 Berlin
Deutschland`,
            },
            {
              heading: "Kontakt",
              content: `E-Mail: kontakt@kontolage.de
Telefon: +49 30 000 000 00 (Mo–Fr 9–17 Uhr)`,
            },
            {
              heading: "Vertreten durch",
              content: "Max Mustermann (Geschäftsführer)",
            },
            {
              heading: "Registereintrag",
              content: `Eingetragen im Handelsregister
Registergericht: Amtsgericht Berlin-Charlottenburg
Registernummer: HRB 000000 B`,
            },
            {
              heading: "Umsatzsteuer-ID",
              content: "Umsatzsteuer-Identifikationsnummer gemäß §27a UStG: DE000000000",
            },
            {
              heading: "Aufsichtsbehörde",
              content: "Kontolage erbringt keine regulierungspflichtigen Finanzdienstleistungen i.S.d. WpHG oder KWG. Es besteht keine BaFin-Zulassung, da keine Anlageberatung, Anlagevermittlung oder Portfolioverwaltung angeboten wird.",
            },
            {
              heading: "Haftungsausschluss für Inhalte",
              content: "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr. Als Diensteanbieter sind wir gemäß §7 Abs. 1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Gemäß §§8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
            },
            {
              heading: "Urheberrecht",
              content: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
            },
          ].map(s => (
            <div key={s.heading} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#f0ece4", marginBottom: 14, letterSpacing: "-0.01em" }}>{s.heading}</h2>
              <div style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.9, whiteSpace: "pre-line" }}>{s.content}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
