import { Link } from "react-router";

export default function Impressum() {
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
          Rechtliche Anbieterkennzeichnung
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
        Impressum
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
          Angaben gemäß § 5 DDG
        </h2>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0, whiteSpace: "pre-line" }}>
          Kontolage – Bildungsplattform für Finanzen & Steuern{"\n"}
          Betreiber / Inhaber: Igor Shykhalyev{"\n"}
          Am Frankfurter Weg 13{"\n"}
          63150 Heusenstamm{"\n"}
          Deutschland
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
          Kontakt
        </h2>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0, whiteSpace: "pre-line" }}>
          Telefon: +49 176 70800809{"\n"}
          E-Mail: igor.studpad@gmail.com{"\n"}
          Webseite: https://kontolage.de
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
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0, whiteSpace: "pre-line" }}>
          Igor Shykhalyev{"\n"}
          Am Frankfurter Weg 13{"\n"}
          63150 Heusenstamm{"\n"}
          Deutschland
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
          Umsatzsteuer
        </h2>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0 }}>
          Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung) bzw. eine Umsatzsteuer-Identifikationsnummer nach § 27a UStG wird nach amtlicher Zuteilung unverzüglich an dieser Stelle ergänzt.
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
          Aufsichtsbehörde & regulatorische Einordnung
        </h2>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0 }}>
          Kontolage erbringt ausschließlich neutrale, allgemeinbildende Informationen und Modellrechnungen. Wir erbringen keine regulierungspflichtigen Finanzdienstleistungen im Sinne des Kreditwesengesetzes (KWG) oder des Wertpapierhandelsgesetzes (WpHG). Es wird keine Anlageberatung, keine Anlagevermittlung, keine Abschlussvermittlung und keine Finanzportfolioverwaltung angeboten. Es besteht und bedarf daher keiner Zulassung der Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin).
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
          EU-Streitschlichtung & Verbraucherstreitbeilegung
        </h2>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0, marginBottom: 12 }}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#c9a84c", textDecoration: "underline" }}
          >
            https://ec.europa.eu/consumers/odr/
          </a>{" "}
          finden. Unsere E-Mail-Adresse lautet: igor.studpad@gmail.com.
        </p>
        <p style={{ fontSize: 14, color: "#cdc6be", margin: 0 }}>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
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
          Haftung für Inhalte
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
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
          Haftung für Links
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
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
          Urheberrecht
        </h2>
        <p style={{ fontSize: 14, color: "#a89f94", margin: 0 }}>
          Die durch die Seitenbetreiber erstellten Inhalte, Rechner und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
        </p>
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "#7d766d" }}>
        Stand: November 2026 · Kontolage ·{" "}
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
