export default function Datenschutz() {
  const sections = [
    {
      heading: "1. Datenschutz auf einen Blick",
      body: "Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres Onlineangebotes auf. Kontolage erhebt und verarbeitet nur die Daten, die für den Betrieb der Plattform zwingend erforderlich sind.",
    },
    {
      heading: "2. Cookies, LocalStorage und Hosting",
      body: "Kontolage setzt keine Tracking-Cookies, keine Drittanbieter-Werbenetzwerke und kein profilbildendes Verhaltens-Tracking ein. Für den Betrieb der Webanwendung nutzen wir den Hosting-Dienstleister Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA) auf Basis eines Auftragsverarbeitungsvertrags (AVV) gem. Art. 28 DSGVO mit Standardvertragsklauseln (SCC). Technisch notwendige Informationen (wie Auth-Sitzungstoken und lokal erstellte Rechner-Szenarien) werden im lokalen Speicher Ihres Browsers (LocalStorage) hinterlegt. Diese Daten verbleiben auf Ihrem Endgerät und werden nicht an Werbenetzwerke weitergegeben.",
    },
    {
      heading: "3. Berechnungen und Rechner-Eingaben",
      body: "Alle Berechnungen (z. B. Rürup-Rechner, Sparerpauschbetrag, AfA, Holding-Modelle) werden primär clientseitig im Browser kalkuliert. Rechnerdaten werden nur dann serverseitig gespeichert, wenn Sie als eingeloggtes Mitglied ein Szenario explizit in Ihrem Konto sichern.",
    },
    {
      heading: "4. Mitglieder-Konto & Datenbank (Supabase)",
      body: "Zur Bereitstellung des geschützten Mitgliederbereichs und der Datenbank nutzen wir Supabase Inc. (Singapur / Hosting im AWS-Rechenzentrum Frankfurt am Main, Deutschland, EU-Region). Gespeichert werden: E-Mail-Adresse, Authentifizierungsdaten (Passwörter nur als kryptografischer Hash), Abonnement-Status und optional von Ihnen gespeicherte Rechner-Szenarien. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).",
    },
    {
      heading: "5. Zahlungsabwicklung (Stripe)",
      body: "Die Zahlungsabwicklung für kostenpflichtige Abonnements erfolgt über Stripe Payments Europe, Ltd. (1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland). Bei einem Kauf werden die zur Vertragsabwicklung erforderlichen Zahlungs- und Rechnungsdaten direkt von Stripe erhoben und verarbeitet. Kontolage selbst erhält und speichert keine Kreditkartennummern oder Bankverbindungen, sondern lediglich Zahlungsstatus und Transaktions-IDs. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.",
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
      body: "Kontolage – Bildungsplattform für Finanzen & Steuern · [Inhaber / Betreiber: Vorname Nachname] · [Straße Hausnummer, PLZ Ort] · E-Mail: datenschutz@kontolage.de\n\nBeschwerden können bei der zuständigen Datenschutzbehörde eingereicht werden.",
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
          <div style={{ marginBottom: 24, padding: "14px 16px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, color: "#e2c27d", fontSize: 13, lineHeight: 1.6 }}>
            Hinweis: Die folgenden Anbieterangaben sind vor dem Livegang durch die tatsächlichen Unternehmens- und Registerdaten zu ersetzen und rechtlich zu prüfen.
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
