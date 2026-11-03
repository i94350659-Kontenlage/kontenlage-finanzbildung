import { Link } from "react-router";

export default function TOMs() {
  return (
    <section
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "120px 20px 80px",
        color: "#f0ece4",
        lineHeight: 1.7,
      }}
    >
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
          Datensicherheit & Compliance
        </span>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(26px, 4vw, 42px)",
          fontWeight: 700,
          color: "#f0ece4",
          letterSpacing: "-0.025em",
          marginBottom: 32,
        }}
      >
        Technische und Organisatorische Maßnahmen (TOMs)
      </h1>

      <div
        style={{
          padding: "16px 20px",
          background: "rgba(201,168,76,0.08)",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: 8,
          marginBottom: 44,
          fontSize: 13,
          color: "#e2c27d",
          lineHeight: 1.65,
        }}
      >
        <strong>Dokumentation gemäß Art. 32 DSGVO:</strong> Die nachfolgende Übersicht dokumentiert die von Kontolage implementierten technischen und organisatorischen Maßnahmen (TOMs) zum Schutz der Sicherheit der Verarbeitung personenbezogener Daten unter Berücksichtigung des Stands der Technik, der Implementierungskosten sowie der Art, des Umfangs und der Risiken der Verarbeitung.
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "#f0ece4",
            marginBottom: 12,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 8,
          }}
        >
          1. Vertraulichkeit (Art. 32 Abs. 1 lit. b DSGVO)
        </h2>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            a) Zutrittskontrolle
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Kontolage betreibt keine eigene lokale Server-Hardware, sondern nutzt hochsichere, nach ISO/IEC 27001 und SOC 2 Typ II zertifizierte Rechenzentren der Cloud-Infrastruktur-Provider Supabase (AWS-Rechenzentrum Frankfurt am Main, Deutschland, EU-Region) und Vercel Inc. Der Zutritt zu den Rechenzentren ist durch elektronische Schließsysteme, biometrische Identifikationskontrollen, ein 24/7-Sicherheitsüberwachungsteam und lückenlose Videoüberwachung gegen unbefugten physischen Zugang geschützt.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            b) Zugangskontrolle
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Der Zugang zu den Softwaresystemen wird durch kryptografisch abgesicherte Authentifizierungsverfahren gesteuert. Passwörter werden zu keinem Zeitpunkt im Klartext gespeichert, sondern mit modernen Einweg-Hash-Algorithmen (bcrypt / Argon2) unter Einsatz individueller kryptografischer Salts verarbeitet. Benutzer-Sessions werden über zeitlich befristete JSON Web Tokens (JWT) gesteuert. Alle administrativen Zugänge zu Cloud- und Produktionssystemen erfordern zwingend eine Multi-Faktor-Authentifizierung (MFA/2FA) und sichere Passwörter.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            c) Zugriffskontrolle (Mandantenisolierung & RLS)
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Die Datenbankarchitektur nutzt konsequent PostgreSQL Row-Level Security (RLS). Dies erzwingt serverseitig auf Datenbankebene, dass jede schreibende oder lesende Operation gegen die Identität des authentifizierten Nutzers (<code>auth.uid() = user_id</code>) geprüft wird. Ein unbefugter oder versehentlicher Zugriff auf Datensätze anderer Mandanten ist softwaretechnisch ausgeschlossen. Administrative Service-Role-Schlüssel werden ausschließlich in isolierten Edge-Function-Umgebungsvariablen vorgehalten und niemals im Client-Code exponiert.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            d) Trennungskontrolle
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Entwicklungs-, Staging- und Produktionsumgebungen sind technisch und organisatorisch strikt voneinander getrennt. Personenbezogene Echtdaten werden in Test- und Entwicklungsumgebungen nicht verwendet. Eine Daten-Firewall stellt sicher, dass private Recherchen und Betreiberdaten getrennt von öffentlichen Plattformdaten gehalten werden.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "#f0ece4",
            marginBottom: 12,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 8,
          }}
        >
          2. Integrität (Art. 32 Abs. 1 lit. b DSGVO)
        </h2>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            a) Weitergabekontrolle & Transportverschlüsselung
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Jeglicher Datentransfer zwischen Endgeräten der Nutzer und den Plattform-Servern erfolgt ausnahmslos über eine moderne Transportverschlüsselung mittels HTTPS / TLS 1.3 mit Perfect Forward Secrecy und HSTS. Datenbankverbindungen sind zwingend mit SSL-Verschlüsselung gesichert. Sensible Zahlungsdaten (Kreditkarten, Bankverbindungen) werden zu keinem Zeitpunkt im Klartext über unsere Server geleitet oder dort gespeichert; die Zahlungsabwicklung erfolgt über tokenisierte Schnittstellen des nach PCI-DSS Level 1 zertifizierten Anbieters Stripe.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            b) Eingabekontrolle & Protokollierung
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Sicherheitsrelevante Systemereignisse (wie Benutzerregistrierung, Login-Vorgänge, Änderungen von Tarif- und Abonnementstatus sowie administrative Aktionen) werden in einer revisionssicheren <code>audit_log</code>-Tabelle mit Zeitstempeln (UTC), Benutzer-Identifikatoren und Ereignistypen protokolliert. Alle Quellcode-Änderungen unterliegen einer lückenlosen Versionskontrolle über Git.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "#f0ece4",
            marginBottom: 12,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 8,
          }}
        >
          3. Verfügbarkeit und Belastbarkeit (Art. 32 Abs. 1 lit. b DSGVO)
        </h2>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            a) Verfügbarkeitskontrolle & Redundanz
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Die Plattform nutzt eine global skalierende Serverless-Edge-Architektur über das Vercel Edge Network mit automatischem Failover, intelligenter Lastverteilung und integrierter DDoS-Abwehr. Die PostgreSQL-Datenbank verfügt über automatisierte tägliche Backups mit Point-in-Time-Recovery (PITR) im europäischen AWS-Rechenzentrum Frankfurt am Main.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            b) Rasche Wiederherstellbarkeit (Disaster Recovery)
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Es existiert ein dokumentierter Notfallwiederherstellungsplan (Disaster Recovery Plan). Die angestrebte Wiederherstellungszeit (Recovery Time Objective – RTO) im Falle eines Gesamtausfalls liegt unter 4 Stunden; der maximale tolerable Datenverlust (Recovery Point Objective – RPO) liegt unter 24 Stunden.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "#f0ece4",
            marginBottom: 12,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 8,
          }}
        >
          4. Verfahren zur regelmäßigen Überprüfung, Bewertung und Evaluierung (Art. 32 Abs. 1 lit. d DSGVO)
        </h2>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            a) Datenschutz durch Technikgestaltung (Privacy by Design / Default)
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Berechnungen und Modellsimulationen (Rürup, AfA, Sparerpauschbetrag, Holding, Steuerplaner) sind nach dem Prinzip des Privacy by Design konstruiert: Sie werden vollständig im Webbrowser des Nutzers ausgeführt. Sensible Finanzdaten werden standardmäßig nicht an Server übertragen. Tracking- und Marketing-Cookies Dritter sind vollständig deaktiviert.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            b) Schwachstellenmanagement & Code-Qualität
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Alle Software-Abhängigkeiten werden kontinuierlich auf bekannte Sicherheitslücken (CVEs) überwacht (automatisierte Scans über npm audit und Dependabot). Der Quellcode wird vor jedem Deployment statischen Typprüfungen (TypeScript im Strict Mode) und Code-Analysen unterzogen.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2c27d", marginBottom: 6 }}>
            c) Incident-Response-Prozess & Meldepflichten
          </h3>
          <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
            Es besteht ein definierter Meldeprozess für potenzielle Datenschutz- und Sicherheitsvorfälle. Im Falle einer festgestellten Verletzung des Schutzes personenbezogener Daten erfolgt die gesetzlich vorgeschriebene Meldung an die zuständige Datenschutz-Aufsichtsbehörde unverzüglich und nach Möglichkeit binnen 72 Stunden (Art. 33 DSGVO) sowie gegebenenfalls an betroffene Personen (Art. 34 DSGVO).
          </p>
        </div>
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "#7d766d" }}>
        Stand: November 2026 · Kontolage ·{" "}
        <Link to="/datenschutz" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Datenschutzerklärung
        </Link>{" "}
        ·{" "}
        <Link to="/avv" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Auftragsverarbeitungsvertrag (AVV)
        </Link>{" "}
        ·{" "}
        <Link to="/impressum" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Impressum
        </Link>
      </div>
    </section>
  );
}
