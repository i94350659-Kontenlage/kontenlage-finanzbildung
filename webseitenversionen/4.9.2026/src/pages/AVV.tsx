import { Link } from "react-router";

export default function AVV() {
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
          Vertrag nach Art. 28 DSGVO
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
        Auftragsverarbeitungsvertrag (AVV)
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
        <strong>Mustervereinbarung zur Auftragsverarbeitung gemäß Art. 28 DSGVO:</strong> Diese Vereinbarung regelt die Rechte und Pflichten bei der Verarbeitung personenbezogener Daten im Auftrag für Geschäftskunden (insbesondere im Rahmen von Executive B2B-Mitgliedschaften) durch den Betreiber von Kontolage als Auftragsverarbeiter.
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
          Präambel & Vertragspartner
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          Dieser Auftragsverarbeitungsvertrag wird geschlossen zwischen dem Kunden des Dienstes (nachfolgend „Auftraggeber“) und dem Betreiber der Plattform:
        </p>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: "0 0 12px", whiteSpace: "pre-line" }}>
          Igor Shykhalyev (Kontolage){"\n"}
          Am Frankfurter Weg 13{"\n"}
          63150 Heusenstamm{"\n"}
          Deutschland{"\n"}
          E-Mail: igor.studpad@gmail.com
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (nachfolgend „Auftragsverarbeiter“). Auftraggeber und Auftragsverarbeiter werden nachfolgend gemeinsam als „Parteien“ bezeichnet.
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
          § 1 Gegenstand, Dauer und Zweck der Vereinbarung
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) <strong>Gegenstand:</strong> Der Auftragsverarbeiter stellt dem Auftraggeber die webbasierte Software- und Berechnungsplattform kontolage.de zur Verfügung. Hierbei verarbeitet der Auftragsverarbeiter personenbezogene Daten im Auftrag und nach Weisung des Auftraggebers im Sinne von Art. 4 Nr. 8 und Art. 28 DSGVO.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) <strong>Zweck:</strong> Bereitstellung von Rechenmodulen, Verwaltung von Nutzerkonten im geschützten Kabinett, sichere Speicherung individueller Steuer- und Vermögensszenarien sowie Rechnungsverwaltung.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) <strong>Dauer:</strong> Die Laufzeit dieser Vereinbarung richtet sich nach der Laufzeit des Hauptvertrages (Abonnement) über die Nutzung der Plattform und endet automatisch mit dessen Beendigung.
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
          § 2 Art der Daten und Kategorien betroffener Personen
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) <strong>Datenkategorien:</strong>
        </p>
        <ul style={{ fontSize: 14, color: "#a89f94", paddingLeft: 20, margin: "0 0 12px" }}>
          <li>Bestands- und Stammdaten (Name, Vorname, E-Mail-Adresse, ggf. Firmenname und Anschrift)</li>
          <li>Vertrags- und Abrechnungsdaten (Tarifwahl, Zahlungsstatus, Transaktions-Referenzen)</li>
          <li>Inhaltsdaten (gespeicherte Rechnerszenarien und Notizen des Mitglieds)</li>
          <li>Technische Protokolldaten (Login-Zeitstempel, IP-Adressen in Server-Logs)</li>
        </ul>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (2) <strong>Betroffene Personen:</strong> Mitarbeiter, gesetzliche Vertreter, Berater oder Mandanten des Auftraggebers, die auf die Plattform zugreifen.
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
          § 3 Pflichten des Auftragsverarbeiters
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) <strong>Weisungsgebundene Verarbeitung:</strong> Der Auftragsverarbeiter verarbeitet personenbezogene Daten ausschließlich im Rahmen der getroffenen Vereinbarungen und nach dokumentierten Weisungen des Auftraggebers (Art. 28 Abs. 3 lit. a DSGVO).
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) <strong>Vertraulichkeit:</strong> Alle mit der Datenverarbeitung betrauten Personen sind auf das Datengeheimnis und zur Wahrung der Vertraulichkeit nach Art. 28 Abs. 3 lit. b DSGVO verpflichtet worden.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (3) <strong>Sicherheit der Verarbeitung (TOMs):</strong> Der Auftragsverarbeiter trifft alle erforderlichen technischen und organisatorischen Maßnahmen gemäß Art. 32 DSGVO zur Gewährleistung eines angemessenen Schutzniveaus (siehe Anlage Technische und Organisatorische Maßnahmen unter{" "}
          <Link to="/toms" style={{ color: "#c9a84c", textDecoration: "underline" }}>
            /toms
          </Link>
          ).
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (4) <strong>Unterstützung bei Betroffenenrechten:</strong> Der Auftragsverarbeiter unterstützt den Auftraggeber nach Möglichkeit mit geeigneten technischen und organisatorischen Maßnahmen bei der Erfüllung der Pflichten zur Beantwortung von Anträgen auf Wahrnehmung von Betroffenenrechten (Art. 12 bis 22 DSGVO).
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (5) <strong>Meldung von Datenschutzverletzungen:</strong> Der Auftragsverarbeiter benachrichtigt den Auftraggeber unverzüglich, sobald ihm eine Verletzung des Schutzes personenbezogener Daten bekannt wird (Art. 33 Abs. 2 DSGVO).
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (6) <strong>Löschung nach Auftragsbeendigung:</strong> Nach Abschluss der Erbringung der Verarbeitungsleistungen löscht der Auftragsverarbeiter alle personenbezogenen Daten oder gibt sie dem Auftraggeber nach dessen Wahl zurück, sofern nicht eine gesetzliche Verpflichtung zur Aufbewahrung besteht.
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
          § 4 Unterauftragsverhältnisse (Art. 28 Abs. 2 und 4 DSGVO)
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Der Auftraggeber erteilt seine allgemeine schriftliche Genehmigung zur Einbindung der folgenden Unterauftragnehmer:
        </p>
        <ul style={{ fontSize: 14, color: "#a89f94", paddingLeft: 20, margin: "0 0 12px" }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Supabase Inc.</strong> – Bereitstellung der PostgreSQL-Datenbank und Authentifizierung (Hosting im AWS-Rechenzentrum Frankfurt am Main, Deutschland, EU-Region).
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Stripe Payments Europe, Ltd.</strong> – Zahlungsabwicklung und Rechnungsverwaltung (1 Grand Canal Street Lower, Dublin, D02 H210, Irland).
          </li>
          <li>
            <strong>Vercel Inc.</strong> – Web- und Edge-Hosting, CDN (440 N Barranca Ave #4133, Covina, CA 91723, USA; EU-U.S. Data Privacy Framework & Standardvertragsklauseln).
          </li>
        </ul>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (2) Der Auftragsverarbeiter informiert den Auftraggeber über jede beabsichtigte Änderung in Bezug auf die Hinzuziehung oder Ersetzung von Unterauftragnehmern. Dem Auftraggeber steht ein Widerspruchsrecht aus wichtigem datenschutzrechtlichen Grund binnen 14 Tagen nach Zugang der Mitteilung zu.
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
          § 5 Kontroll- und Prüfrechte
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Der Auftragsverarbeiter stellt dem Auftraggeber alle erforderlichen Informationen zum Nachweis der Einhaltung der in Art. 28 DSGVO niedergelegten Pflichten zur Verfügung und ermöglicht Überprüfungen (einschließlich Inspektionen), die vom Auftraggeber oder einem von diesem beauftragten Prüfer durchgeführt werden.
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
          § 6 Haftung und Schlussbestimmungen
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Für die Haftung der Parteien untereinander gilt Art. 82 DSGVO sowie die Regelungen des Hauptvertrages.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand für alle Streitigkeiten ist der Sitz des Auftragsverarbeiters (63150 Heusenstamm).
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) Sollten einzelne Bestimmungen dieser Vereinbarung unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "#7d766d" }}>
        Stand: November 2026 · Kontolage ·{" "}
        <Link to="/toms" style={{ color: "#a89f94", textDecoration: "underline" }}>
          TOMs
        </Link>{" "}
        ·{" "}
        <Link to="/datenschutz" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Datenschutzerklärung
        </Link>{" "}
        ·{" "}
        <Link to="/agb" style={{ color: "#a89f94", textDecoration: "underline" }}>
          AGB
        </Link>
      </div>
    </section>
  );
}
