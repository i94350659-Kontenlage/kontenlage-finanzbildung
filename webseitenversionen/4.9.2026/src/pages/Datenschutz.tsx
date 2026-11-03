import { Link } from "react-router";

export default function Datenschutz() {
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
          Datenschutz & Informationspflichten
        </span>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 700,
          color: "#f0ece4",
          letterSpacing: "-0.025em",
          marginBottom: 32,
        }}
      >
        Datenschutzerklärung
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
        <strong>Grundsatz der Datensparsamkeit:</strong> Kontolage erhebt und verarbeitet personenbezogene Daten ausschließlich im technisch und vertraglich zwingend erforderlichen Umfang. Alle Rechner und Steuerplaner-Simulationen laufen primär clientseitig in Ihrem Webbrowser — Eingaben werden ohne Ihre explizite Speicherung nicht an Server übertragen.
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
          1. Verantwortlicher & Datenschutz auf einen Blick
        </h2>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: "0 0 12px" }}>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze der Mitgliedstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen ist:
        </p>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0, whiteSpace: "pre-line" }}>
          Igor Shykhalyev (Kontolage){"\n"}
          Am Frankfurter Weg 13{"\n"}
          63150 Heusenstamm{"\n"}
          Deutschland{"\n"}
          Telefon: +49 176 70800809{"\n"}
          E-Mail: igor.studpad@gmail.com
        </p>
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
          2. Rechtsgrundlagen der Verarbeitung (Art. 6 DSGVO)
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Wir verarbeiten Ihre personenbezogenen Daten stets auf einer gesetzlichen Rechtsgrundlage:
        </p>
        <ul style={{ fontSize: 14, color: "#a89f94", paddingLeft: 20, margin: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung & vorvertragliche Maßnahmen):</strong> Zur Erbringung unserer vertraglichen Leistungen, insbesondere der Bereitstellung von Nutzerkonten im Kabinett und der Abwicklung von Abonnements.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung):</strong> Soweit die Verarbeitung zur Erfüllung gesetzlicher Vorgaben erforderlich ist (z. B. steuer- und handelsrechtliche Aufbewahrungsfristen).
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):</strong> Zur Gewährleistung eines sicheren, stabilen und performanten Plattformbetriebs, zur Abwehr von Cyberangriffen und zur Fehleranalyse.
          </li>
          <li>
            <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong> Sofern Sie uns eine ausdrückliche Einwilligung für spezifische Verarbeitungszwecke erteilt haben.
          </li>
        </ul>
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
          3. Hosting & Content Delivery Network (Vercel)
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Diese Plattform wird über den Hosting-Dienstleister Vercel gehostet: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Beim Aufruf unserer Seiten erfasst die Server-Infrastruktur automatisch Server-Logfiles (u. a. IP-Adresse in gekürzter/anonymisierter Form, Datum und Uhrzeit des Abrufs, übertragene Datenmenge, Referrer-URL, Browsertyp und Betriebssystem). Dies erfolgt auf Grundlage unseres berechtigten Interesses an der Stabilität und Ausfallsicherheit gemäß Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          <strong>Drittlandsübermittlung:</strong> Vercel Inc. ist nach dem EU-U.S. Data Privacy Framework (DPF) zertifiziert. Zudem besteht ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO unter Einbindung der Standardvertragsklauseln (SCC) der Europäischen Kommission (Art. 46 Abs. 2 lit. c DSGVO).
        </p>
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
          4. Cookies, LocalStorage und Rechner-Eingaben
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Kontolage setzt keine Werbe-Cookies, keine Analyse-Tracker Dritter und keine Profiling-Werkzeuge ein.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          <strong>Technisch notwendiger LocalStorage:</strong> Im lokalen Speicher Ihres Browsers (LocalStorage) werden ausschließlich technisch erforderliche Sitzungsdaten (wie Authentifizierungs-Token für eingeloggte Mitglieder) und lokale Eingaben für Rechner zwischengespeichert. Diese Daten verbleiben auf Ihrem Endgerät und werden nicht an Werbenetzwerke weitergegeben.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          <strong>Clientseitige Berechnungen:</strong> Alle Rechner (Rürup, AfA, Sparerpauschbetrag, Holding-Modelle, Steuerplaner) berechnen mathematische Ergebnisse direkt in Ihrem Browser. Es findet keine serverseitige Speicherung Ihrer Finanzwerte statt, es sei denn, Sie speichern als registriertes Mitglied ein Szenario explizit in Ihrem Konto ab.
        </p>
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
          5. Mitglieder-Konto & Datenbank (Supabase)
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Für die Authentifizierung und Datenbankverwaltung unseres geschützten Bereichs („Kabinett“) nutzen wir Supabase Inc. (Hosting-Standort: AWS-Rechenzentrum Frankfurt am Main, Deutschland, EU-Region).
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Hierbei werden erhoben und verarbeitet: E-Mail-Adresse, Passwort-Hash (Passwörter werden niemals im Klartext gespeichert, sondern mit modernen Hash-Verfahren wie Argon2/bcrypt gesichert), Kontostatus, Tarif- und Abonnementstufe sowie vom Nutzer explizit gespeicherte Berechnungs-Szenarien.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          <strong>Schutz durch Row-Level Security (RLS):</strong> Die PostgreSQL-Datenbank verwendet strikte Row-Level-Security-Regeln. Jeder authentifizierte Nutzer kann ausschließlich die eigenen Daten lesen und verändern. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
        </p>
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
          6. Zahlungsabwicklung via Stripe
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Die Zahlungsabwicklung für kostenpflichtige Abonnements (Starter 4,90 €, Pro Digital 9,00 €, Executive 29,00 €) erfolgt über den zertifizierten Zahlungsdienstleister Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Im Rahmen des Bezahlvorgangs werden die für die Transaktion erforderlichen Zahlungs- und Rechnungsdaten (z. B. Name, Adresse, Kreditkartendaten, IBAN) über gesicherte, verschlüsselte Verbindungen direkt von Stripe erhoben und nach dem höchsten Sicherheitsstandard (PCI-DSS Level 1) verarbeitet. Kontolage selbst erhält und speichert zu keinem Zeitpunkt vollständige Kreditkartennummern oder Bankdaten, sondern lediglich Transaktions-Referenzen, Zahlungsstatus und den Abrechnungszeitraum.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Zur Einhaltung steuerlicher Pflichten (Mehrwertsteuerberechnung nach PAngV und UStG) wird Stripe Tax genutzt. Rechtsgrundlage für die Zahlungsabwicklung ist Art. 6 Abs. 1 lit. b DSGVO sowie Art. 6 Abs. 1 lit. c DSGVO.
        </p>
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
          7. E-Mail-Kommunikation
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Wenn Sie uns per E-Mail kontaktieren (z. B. an igor.studpad@gmail.com), werden Ihre Angaben inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO.
        </p>
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
          8. Speicherdauer & Löschung
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Personenbezogene Daten werden gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt. Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch den europäischen oder nationalen Gesetzgeber in unionsrechtlichen Verordnungen, Gesetzen oder sonstigen Vorschriften, denen der Verantwortliche unterliegt, vorgesehen wurde (insbesondere handels- und steuerrechtliche Aufbewahrungspflichten gemäß § 257 HGB und § 147 AO, z. B. 6 bis 10 Jahre für Rechnungsbelege).
        </p>
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
          9. Ihre Rechte als betroffene Person (Art. 15–21 DSGVO)
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
        </p>
        <ul style={{ fontSize: 14, color: "#a89f94", paddingLeft: 20, margin: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie können jederzeit Auskunft über die von uns zu Ihrer Person verarbeiteten Daten verlangen.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben das Recht auf unverzügliche Berichtigung unrichtiger oder Vervollständigung unvollständiger personenbezogener Daten.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer Daten zu verlangen.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder zur Vertragserfüllung automatisiert verarbeiten, in einem gängigen, maschinenlesbaren Format an sich oder Dritte aushändigen zu lassen.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Recht auf Widerspruch (Art. 21 DSGVO):</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO erfolgt, Widerspruch einzulegen.
          </li>
          <li>
            <strong>Recht auf Beschwerde bei der Aufsichtsbehörde (Art. 77 DSGVO):</strong> Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die für unseren Sitz zuständige Behörde ist: Der Hessische Beauftragte für Datenschutz und Informationsfreiheit, Gustav-Stresemann-Ring 1, 65189 Wiesbaden (Postfach 3163, 65021 Wiesbaden), Webseite:{" "}
            <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a84c", textDecoration: "underline" }}>
              https://datenschutz.hessen.de
            </a>.
          </li>
        </ul>
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
          10. Datensicherheit & SSL/TLS-Verschlüsselung
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Diese Plattform nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine durchgehende TLS-Verschlüsselung (HTTPS). Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
        </p>
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "#7d766d" }}>
        Stand: November 2026 · Kontolage ·{" "}
        <Link to="/impressum" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Impressum
        </Link>{" "}
        ·{" "}
        <Link to="/agb" style={{ color: "#a89f94", textDecoration: "underline" }}>
          AGB
        </Link>{" "}
        ·{" "}
        <Link to="/toms" style={{ color: "#a89f94", textDecoration: "underline" }}>
          TOMs
        </Link>
      </div>
    </section>
  );
}
