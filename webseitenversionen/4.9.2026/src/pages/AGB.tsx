import { Link } from "react-router";

export default function AGB() {
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
          Vertragsbedingungen
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
        Allgemeine Geschäftsbedingungen (AGB)
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
        <strong>Gesetzlicher Hinweis zur Finanzbildung (§ 2 Abs. 8 Nr. 10 WpHG):</strong> Die bereitgestellten Inhalte dienen ausschließlich der allgemeinen Finanzbildung gemäß § 2 Abs. 8 Nr. 10 WpHG. Sie stellen keine individuelle Anlageberatung, keine Steuerberatung und keine Rechtsberatung dar.
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
          § 1 Geltungsbereich und Anbieter
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB“) gelten für alle Verträge über die Nutzung der Online-Plattform kontolage.de (nachfolgend „Kontolage“ oder „Angebot“) zwischen dem Betreiber:
        </p>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: "0 0 12px", whiteSpace: "pre-line" }}>
          Igor Shykhalyev (Kontolage){"\n"}
          Am Frankfurter Weg 13{"\n"}
          63150 Heusenstamm{"\n"}
          Deutschland{"\n"}
          E-Mail: igor.studpad@gmail.com
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (nachfolgend „Anbieter“) und den Nutzern bzw. Kunden der Plattform (nachfolgend „Kunde“ oder „Nutzer“), sowohl Verbrauchern im Sinne des § 13 BGB als auch Unternehmern im Sinne des § 14 BGB.
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
          § 2 Leistungsgegenstand und Finanzbildungshinweis
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Kontolage stellt interaktive Rechner für steuerliche und vermögensbezogene Modellrechnungen (z. B. Rürup-Basisrente, Sparerpauschbetrag, Gebäude-AfA, Holding-Szenarien), Fachanalysen, Marktausgaben sowie je nach Tarifstufe erweiterte Funktionen im geschützten Mitgliederbereich („Kabinett“) zur Verfügung.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) <strong>Keine Anlage- oder Steuerberatung:</strong> Sämtliche auf der Plattform bereitgestellten Berechnungen, Tabellen, Artikel und Auswertungen dienen ausschließlich der allgemeinen, neutralen Finanzbildung und Wissensvermittlung. Sie stellen weder eine individuelle Anlageberatung, Anlagevermittlung oder Finanzportfolioverwaltung im Sinne des Wertpapierhandelsgesetzes (WpHG) noch eine steuerliche Beratung im Sinne des Steuerberatungsgesetzes (StBerG) oder Rechtsberatung dar.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) Die Darstellungen basieren auf öffentlich zugänglichen Rechtsquellen und Gesetzesständen (EStG, KStG, GewStG etc.). Für konkrete Entscheidungen und verbindliche Abschlüsse wird die Konsultation qualifizierter Steuerberater oder Rechtsanwälte empfohlen.
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
          § 3 Vertragsschluss und Tarife
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) <strong>Kostenfreies Basiskonto:</strong> Die Nutzung des Basisangebots ist kostenlos und begründet kein Abonnement. Eine automatische Umwandlung in ein kostenpflichtiges Abonnement findet nicht statt.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) <strong>Kostenpflichtige Abonnements:</strong> Für erweiterte Funktionen stehen folgende monatliche Mitgliedschaften zur Auswahl:
        </p>
        <ul style={{ fontSize: 14, color: "#a89f94", paddingLeft: 20, margin: "0 0 12px" }}>
          <li>Starter: 4,90 € pro Monat brutto</li>
          <li>Pro Digital: 9,00 € pro Monat brutto</li>
          <li>Executive: 29,00 € pro Monat brutto</li>
        </ul>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) <strong>Button-Lösung (§ 312j Abs. 3 BGB):</strong> Die Präsentation der Tarife stellt eine Aufforderung zur Abgabe eines Angebots dar. Durch Klicken auf die Schaltfläche „Zahlungspflichtig bestellen“ (oder eine entsprechend eindeutige Formulierung) gibt der Kunde ein verbindliches Angebot zum Abschluss eines Abonnements ab. Der Vertrag kommt mit der Autorisierung der Zahlung durch den Zahlungsdienstleister Stripe und der Freischaltung des Zugangs zustande. Der Kunde erhält unverzüglich eine Vertragsbestätigung per E-Mail.
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
          § 4 Preise, Steuern und Zahlung
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Alle angegebenen Preise sind Endpreise in Euro inklusive der jeweils geltenden gesetzlichen Mehrwertsteuer (Umsatzsteuer) gemäß der Preisangabenverordnung (PAngV). Die zutreffende Steuer wird über Stripe Tax ermittelt und auf der Rechnung transparent ausgewiesen.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) Die Zahlungsabwicklung erfolgt über den lizenzierten Zahlungsdienstleister Stripe Payments Europe Ltd., Dublin, Irland. Unterstützt werden unter anderem Kreditkarten und SEPA-Lastschriften.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) Das Entgelt ist jeweils für den gewählten Abrechnungsmonat im Voraus zur Zahlung fällig. Rechnungen werden dem Kunden digital im Kontobereich („Kabinett“) bzw. per E-Mail bereitgestellt.
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
          § 5 Laufzeit, Verlängerung und Kündigung (§ 312k BGB)
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Kostenpflichtige Abonnements haben eine anfängliche Mindestlaufzeit von einem Monat. Sie verlängern sich jeweils stillschweigend um einen weiteren Monat, sofern sie nicht vor Ablauf des jeweiligen Abrechnungsmonats gekündigt werden.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) Das Abonnement kann jederzeit mit Wirkung zum Ende der aktuellen bezahlten Laufzeit gekündigt werden.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (3) <strong>Gesetzlicher Kündigungsbutton (§ 312k BGB):</strong> Der Kunde kann die Kündigung jederzeit und barrierefrei über den auf der Website und im Kontobereich eingerichteten Kündigungsbutton („Verträge hier kündigen“) erklären. Alternativ ist eine Kündigung in Textform (z. B. per E-Mail an igor.studpad@gmail.com) möglich.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (4) Der Eingang der Kündigung wird dem Kunden unverzüglich auf elektronischem Weg in Textform bestätigt (§ 312k Abs. 2 BGB). Nach Ablauf der Kündigungsfrist wird das Konto auf das kostenlose Basiskonto zurückgestuft; es erfolgt keine automatische Verlängerung oder Überführung in andere kostenpflichtige Produkte.
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
          § 6 Widerrufsrecht für Verbraucher
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Verbrauchern steht bei Abschluss eines Fernabsatzvertrages ein gesetzliches 14-tägiges Widerrufsrecht nach §§ 355, 356 BGB zu.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) <strong>Besondere Regelung für digitale Inhalte (§ 356 Abs. 5 BGB):</strong> Das Widerrufsrecht erlischt bei einem Vertrag über die Bereitstellung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten vorzeitig, sobald der Anbieter mit der Ausführung des Vertrags begonnen hat, nachdem der Verbraucher ausdrücklich zugestimmt hat, dass der Anbieter vor Ablauf der Widerrufsfrist mit der Ausführung beginnt, und seine Kenntnis davon bestätigt hat, dass er durch seine Zustimmung mit Beginn der Ausführung sein Widerrufsrecht verliert.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) Die vollständige Widerrufsbelehrung sowie das gesetzliche Muster-Widerrufsformular sind unter{" "}
          <Link to="/widerruf" style={{ color: "#c9a84c", textDecoration: "underline" }}>
            /widerruf
          </Link>{" "}
          jederzeit einsehbar.
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
          § 7 Nutzungsrechte und Pflichten
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Der Kunde erhält ein einfaches, nicht übertragbares, auf die Dauer des Abonnements beschränktes Recht, die bereitgestellten Inhalte, Rechner und Softwaremodule für eigene private bzw. interne betriebliche Zwecke zu nutzen.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) Die Zugangsdaten zum persönlichen Konto sind vertraulich zu behandeln und dürfen nicht an unbefugte Dritte weitergegeben werden.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) Eine automatisierte Auslesung (Scraping), systematische Vervielfältigung, öffentliche Zugänglichmachung oder Einspeisung in KI-Trainingsmodelle ohne vorherige schriftliche Zustimmung des Anbieters ist untersagt.
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
          § 8 Gewährleistung und Haftung
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Es gelten die gesetzlichen Bestimmungen der Mängelhaftung.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit sowie nach den Vorschriften des Produkthaftungsgesetzes.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (3) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist die Haftung der Höhe nach auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (4) Der Anbieter haftet nicht für wirtschaftliche, steuerliche oder anlagebezogene Entscheidungen, die der Kunde auf Grundlage der allgemeinen Modellrechnungen und Bildungsinhalte eigenverantwortlich trifft.
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
          § 9 Schlussbestimmungen
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Zwingende Bestimmungen des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, bleiben unberührt.
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: "0 0 12px" }}>
          (2) Sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist, ist Gerichtsstand für alle Streitigkeiten aus diesem Vertrag der Sitz des Anbieters (63150 Heusenstamm).
        </p>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          (3) Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
        </p>
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "#7d766d" }}>
        Stand: November 2026 · Kontolage ·{" "}
        <Link to="/impressum" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Impressum
        </Link>{" "}
        ·{" "}
        <Link to="/datenschutz" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Datenschutzerklärung
        </Link>{" "}
        ·{" "}
        <Link to="/widerruf" style={{ color: "#a89f94", textDecoration: "underline" }}>
          Widerrufsbelehrung
        </Link>
      </div>
    </section>
  );
}
