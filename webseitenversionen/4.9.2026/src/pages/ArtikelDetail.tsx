import { useParams, Link } from "react-router";

const articles: Record<string, {
  tag: string; title: string; date: string; readTime: string; author: string;
  intro: string; sections: { heading: string; body: string; }[];
  fazit: string; disclaimer: string;
}> = {
  "steuersparmodelle-immobilien": {
    tag: "Immobilien", title: "Steuersparmodelle im Immobilienmarkt: was davon legal ist",
    date: "15. Juni 2026", readTime: "8 Min.", author: "Redaktion Kontolage",
    intro: "Der Immobilienmarkt bietet zahlreiche steuerliche Gestaltungsmöglichkeiten. Nicht alle sind gleich sicher — einige bewegen sich in Grauzonen, andere sind klar rechtswidrig. Dieser Artikel gibt einen sachlichen Überblick.",
    sections: [
      { heading: "Lineare AfA nach §7 Abs. 4 EStG", body: "Die standardmäßige Abschreibung von Gebäuden ist vollständig legal und steuerlich anerkannt. Für Gebäude mit Baujahr ab 2023 gilt ein erhöhter AfA-Satz von 3 % p.a. (bis 2022: 2 %). Der Gebäudewert (ohne Grundanteil) wird gleichmäßig über die Nutzungsdauer abgeschrieben. Diese Abschreibung mindert die steuerpflichtigen Einkünfte aus Vermietung und Verpachtung (§21 EStG) direkt." },
      { heading: "Denkmalschutz-AfA (§7i EStG)", body: "Für denkmalgeschützte Immobilien gilt eine erhöhte AfA: 9 % in den ersten 8 Jahren, 7 % in den folgenden 4 Jahren. Voraussetzung ist eine Bescheinigung der Denkmalschutzbehörde. In der Praxis sind Denkmalimmobilien häufig teurer als der Markt hergibt — die Steuerersparnis muss gegen den Kaufpreisaufschlag abgewogen werden." },
      { heading: "§6b EStG: Reinvestitionsbegünstigung", body: "Gewinne aus dem Verkauf von Betriebsimmobilien können in eine Rücklage eingestellt und auf die Anschaffungskosten einer neuen Immobilie übertragen werden. Dies setzt voraus, dass die Immobilie im Betriebsvermögen gehalten wurde. Im Privatvermögen gilt §23 EStG: Gewinne aus dem Verkauf von Immobilien innerhalb von 10 Jahren sind steuerpflichtig." },
      { heading: "Modelle mit erhöhtem Risiko", body: "Strukturierte Verlustmodelle, bei denen Wertverluste künstlich generiert werden, sind steuerrechtlich heikel. Das Finanzgericht und der BFH haben in mehreren Urteilen festgestellt, dass sog. 'Liebhaberei' — also Vermietung ohne Gewinnerzielungsabsicht — die Steueranerkennung ausschließt. Auch überhöhte Kaufpreise, die rein zur AfA-Basis aufgeblasen werden, können als Gestaltungsmissbrauch (§42 AO) qualifiziert werden." },
    ],
    fazit: "Legale Steueroptimierung bei Immobilien ist durch konsequente Nutzung des Steuerrechts möglich — insbesondere durch AfA, Werbungskostenabzug und korrekte Abgrenzung von Privat- und Betriebsvermögen. Grauzonen und Modelle mit substanzlosem Verlustpotenzial sollten kritisch hinterfragt werden.",
    disclaimer: "Keine Steuerberatung i.S.d. StBerG. Alle Informationen ohne Gewähr. Konsultieren Sie einen zugelassenen Steuerberater.",
  },
  "ruerup-angestellte": {
    tag: "Altersvorsorge", title: "Rürup für Angestellte: rechnet sich das wirklich?",
    date: "28. Mai 2026", readTime: "11 Min.", author: "Redaktion Kontolage",
    intro: "Die Rürup-Rente (Basisrente) gilt als Instrument für Selbständige. Doch auch für gut verdienende Angestellte kann sie steuerlich interessant sein — insbesondere bei hohem Grenzsteuersatz und langem Anlagehorizont.",
    sections: [
      { heading: "Steuerlicher Abzug nach §10 EStG", body: "Beiträge zur Rürup-Rente sind als Sonderausgaben bis zum Höchstbetrag von 30.825,60 € (2026, Einzelveranlagung) abzugsfähig. Der absetzbare Anteil ist seit 2023 bei 100 % fixiert. Bei einem Grenzsteuersatz von 42 % bedeutet das: Jeder Euro Beitrag reduziert die Steuerlast um 42 Cent." },
      { heading: "Rechenbeispiel: 60.000 € Brutto, Steuerklasse 1", body: "Jahresbeitrag: 6.000 €. Steuerersparnis: ca. 2.520 € (42 %). Netto-Eigenaufwand: 3.480 €. Im Vergleich zum ETF-Depot ohne Förderung muss die Rürup-Rente im Alter nach §22 EStG als Leibrente versteuert werden — bei einem voraussichtlich niedrigeren Steuersatz im Rentenalter ergibt sich häufig ein positiver Steuerhebel." },
      { heading: "Wesentliche Einschränkungen", body: "Rürup-Renten sind nicht kapitalisierbar, nicht vererbbar (außer an Ehe-/Lebenspartner und Kinder im laufenden Bezug) und nicht beleihbar. Auszahlung nur als monatliche Leibrente ab 62 Jahren. Die Illiquidität ist der Hauptnachteil gegenüber einem ETF-Depot." },
      { heading: "Wann lohnt es sich?", body: "Faustregel: Rürup ist dann attraktiv, wenn (1) der aktuelle Grenzsteuersatz hoch ist (≥35 %), (2) der Renteneintritt noch mind. 10 Jahre entfernt ist, (3) die erwartete Rentensteuerbelastung deutlich niedriger als der aktuelle Steuersatz ist, und (4) keine akute Liquiditätsbindung nachteilig ist." },
    ],
    fazit: "Für Angestellte mit hohem Einkommen (>60.000 € Brutto) und langem Anlagehorizont kann Rürup als steueroptimierte Ergänzung zum ETF-Depot sinnvoll sein. Die Entscheidung hängt stark von individuellen Faktoren ab — eine pauschale Empfehlung gibt es nicht.",
    disclaimer: "Keine Anlageberatung. Indikative Rechenbeispiele ohne Gewähr. Steuerliche Situation ist individuell — Steuerberater konsultieren.",
  },
  "sparerpauschbetrag-2026": {
    tag: "Kapitalerträge", title: "Sparerpauschbetrag 2026 optimal ausschöpfen",
    date: "10. April 2026", readTime: "6 Min.", author: "Redaktion Kontolage",
    intro: "Seit 2023 beträgt der Sparerpauschbetrag 1.000 € (Einzelveranlagung) bzw. 2.000 € (Zusammenveranlagung). Wer ihn nicht voll ausschöpft, verschenkt bares Geld.",
    sections: [
      { heading: "Was ist der Sparerpauschbetrag?", body: "Der Sparerpauschbetrag (§20 Abs. 9 EStG) stellt Kapitalerträge bis zu 1.000 € (bzw. 2.000 € bei Zusammenveranlagung) von der Kapitalertragsteuer frei. Dazu zählen Dividenden, Zinsen, realisierte Kursgewinne und Fondserträge." },
      { heading: "Freistellungsauftrag korrekt verteilen", body: "Der Freistellungsauftrag muss bei jeder depotführenden Bank separat gestellt werden. Bei mehreren Depots (z.B. Broker A: 600 €, Bank B: 400 €) sollte die Verteilung den tatsächlichen Erträgen entsprechen. Eine Untervergabe ist möglich — eine Überschreitung des Gesamtbetrags wird durch die Steuerbescheinigung korrigiert." },
      { heading: "Verlustverrechnungstöpfe", body: "Banken führen automatisch Verlustverrechnungstöpfe. Aktien-Verluste dürfen jedoch nur mit Aktien-Gewinnen verrechnet werden (§20 Abs. 6 EStG). Nicht verrechnete Verluste werden vorgetragen. Am Jahresende: Verlustbescheinigung bei der Bank anfordern, um bankübergreifend zu verrechnen." },
      { heading: "Religionssteuerpflicht (Kirchensteuer)", body: "Kirchensteuerpflichtige Anleger sollten den Sperrvermerk beim Bundeszentralamt für Steuern (BZSt) prüfen. Ohne Sperrvermerk fragt die Bank die Kirchensteuerpflicht automatisch ab und führt Kirchensteuer ab. Mit Sperrvermerk muss die Kirchensteuer selbst über die Steuererklärung abgeführt werden." },
    ],
    fazit: "Der Sparerpauschbetrag ist ein einfaches, aber effektives Instrument. Wer mehrere Depots hat, sollte Freistellungsaufträge aktiv verwalten und Verlustverrechnungstöpfe zum Jahresende prüfen.",
    disclaimer: "Allgemeine steuerliche Information ohne Beratungscharakter. §20 EStG in der jeweils gültigen Fassung maßgeblich.",
  },
};

// Fallback für nicht vorhandene Artikel
const defaultArticle = {
  tag: "Allgemein", title: "Artikel nicht gefunden",
  date: "", readTime: "", author: "Kontolage",
  intro: "Dieser Artikel ist noch nicht verfügbar oder wurde verschoben.",
  sections: [], fazit: "", disclaimer: "",
};

export default function ArtikelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? (articles[slug] || defaultArticle) : defaultArticle;

  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 48px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link to="/artikel" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#a89f94", textDecoration: "none", marginBottom: 28, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={e => (e.currentTarget.style.color = "#a89f94")}
          >← Alle Artikel</Link>

          <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: "#c9a84c", padding: "4px 12px", borderRadius: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 20 }}>{article.tag}</span>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, color: "#f0ece4", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.025em" }}>
            {article.title}
          </h1>

          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#a89f94", marginBottom: 32, flexWrap: "wrap" }}>
            <span>{article.date}</span>
            {article.readTime && <span>{article.readTime} Lesezeit</span>}
            {article.author && <span>{article.author}</span>}
          </div>

          {article.intro && (
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#cdc6be", lineHeight: 1.8, fontStyle: "italic", borderLeft: "3px solid #c9a84c", paddingLeft: 20 }}>
              {article.intro}
            </p>
          )}
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {article.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 44 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: "#f0ece4", marginBottom: 16, lineHeight: 1.3 }}>{s.heading}</h2>
              <p style={{ fontSize: 16, color: "#a89f94", lineHeight: 1.9 }}>{s.body}</p>
            </div>
          ))}

          {article.fazit && (
            <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 28, marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "#c9a84c", marginBottom: 12 }}>Fazit</div>
              <p style={{ fontSize: 15, color: "#cdc6be", lineHeight: 1.8 }}>{article.fazit}</p>
            </div>
          )}

          {article.disclaimer && (
            <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.7 }}><strong style={{ color: "#cdc6be" }}>Hinweis:</strong> {article.disclaimer}</p>
            </div>
          )}

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Link to="/artikel" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 4, border: "1px solid rgba(201,168,76,0.3)", color: "#e2c27d", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >← Alle Artikel ansehen</Link>
          </div>
        </div>
      </section>
    </>
  );
}
