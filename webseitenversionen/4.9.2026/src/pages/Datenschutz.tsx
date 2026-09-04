export default function Datenschutz() {
  const sections = [
    {
      heading: "1. Datenschutz auf einen Blick",
      body: "Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres Onlineangebotes auf. Kontolage erhebt und verarbeitet nur die Daten, die für den Betrieb der Plattform zwingend erforderlich sind.",
    },
    {
      heading: "2. Cookies und Tracking",
      body: "Kontolage setzt keine Tracking-Cookies, keine Drittanbieter-Analytics und keine Werbecookies ein. Technisch notwendige Session-Cookies (z.B. für den Login-Bereich) werden nur für die Dauer der Sitzung gespeichert und enthalten keine personenbezogenen Daten über den Sitzungstoken hinaus.",
    },
    {
      heading: "3. Berechnungen und eingegebene Daten",
      body: "Alle Berechnungen (Rürup-Rechner, Sparerpauschbetrag, AfA) werden ausschließlich lokal in Ihrem Browser durchgeführt. Es werden keine Eingabedaten (Einkommen, Steuerklasse, etc.) an unsere Server übertragen oder gespeichert.",
    },
    {
      heading: "4. Kontodaten (Mitglieder)",
      body: "Wenn Sie ein Konto anlegen, verarbeiten wir: E-Mail-Adresse (zur Authentifizierung und Kommunikation), verschlüsseltes Passwort (niemals im Klartext gespeichert), Abonnementstatus und Zahlungshistorie (ohne Zahlungsmittelinformationen). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).",
    },
    {
      heading: "5. Zahlungsdaten",
      body: "Zahlungen werden über einen zertifizierten Zahlungsdienstleister abgewickelt. Kartennummern, IBAN oder ähnliche Daten werden nie auf unseren Servern gespeichert. Wir erhalten lediglich eine Transaktionsbestätigung.",
    },
    {
      heading: "6. E-Mail-Kommunikation",
      body: "Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage und für Rückfragen gespeichert. Die Daten werden nach Abschluss der Bearbeitung gelöscht, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.",
    },
    {
      heading: "7. Ihre Rechte",
      body: "Sie haben das Recht auf: Auskunft über gespeicherte Daten (Art. 15 DSGVO), Berichtigung unrichtiger Daten (Art. 16 DSGVO), Löschung Ihrer Daten (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO), Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Kontakt für Datenschutzanfragen: datenschutz@kontolage.de",
    },
    {
      heading: "8. Verantwortlicher",
      body: "Kontolage GmbH · Musterstraße 12 · 10115 Berlin · datenschutz@kontolage.de\n\nBeschwerden können bei der zuständigen Datenschutzbehörde eingereicht werden: Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969 Berlin.",
    },
    {
      heading: "9. Aktualität",
      body: "Diese Datenschutzerklärung ist aktuell gültig (Stand: September 2026). Änderungen werden auf dieser Seite veröffentlicht.",
    },
  ];

  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Rechtliches</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.025em", marginBottom: 16 }}>
            Datenschutzerklärung
          </h1>
          <div style={{ padding: "12px 16px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 6, display: "inline-block" }}>
            <span style={{ fontSize: 13, color: "#a89f94" }}>Gemäß DSGVO, BDSG und TMG · Stand: September 2026</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {sections.map(s => (
            <div key={s.heading} style={{ marginBottom: 44, paddingBottom: 44, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#f0ece4", marginBottom: 16, letterSpacing: "-0.01em" }}>{s.heading}</h2>
              <div style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.9, whiteSpace: "pre-line" }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
