import { useState } from "react";
import { Link } from "react-router";

const assetClasses = [
  { id: "etf", name: "ETF (MSCI World)", rendite: "7–9 % p.a.", renditeNum: 8, kosten: "0,07–0,20 % TER", kostenNum: 0.14, liquiditaet: "T+2", steuer: "§20 EStG", risiko: "mittel", horizont: "10–15+ J.", score: 90, detail: "Passiv verwaltete Indexfonds bilden einen breiten Marktindex ab. Niedrigste Kosten, maximale Diversifikation. Geeignet für langfristigen Vermögensaufbau." },
  { id: "tagesgeld", name: "Tagesgeld / Festgeld", rendite: "2,5–3,8 % p.a.", renditeNum: 3, kosten: "keine", kostenNum: 0, liquiditaet: "täglich / fix", steuer: "§20 EStG Zins", risiko: "sehr niedrig", horizont: "0–3 J.", score: 45, detail: "Einlagengesichertes Instrument (bis 100.000 € je Bank). Geeignet für kurzfristige Liquiditätshaltung und Notgroschen. Kein Kursrisiko." },
  { id: "immobilien", name: "Vermietete Immobilie", rendite: "3–5 % Nettomietrendite", renditeNum: 4, kosten: "5–15 % Kaufnebenkosten", kostenNum: 10, liquiditaet: "Monate", steuer: "§21 EStG · §23 EStG", risiko: "mittel-hoch", horizont: "10–20+ J.", score: 70, detail: "Direkte Immobilieninvestition mit Mieteinnahmen und Wertsteigerungspotenzial. Hohe Einstiegskosten, Klumpenrisiko, steuerliche AfA-Vorteile (§7 EStG)." },
  { id: "ruerup", name: "Rürup-Rente", rendite: "anlageabhängig", renditeNum: 5, kosten: "0,1–1,5 % p.a.", kostenNum: 0.8, liquiditaet: "ab 62 Jahre", steuer: "§10 EStG / §22 EStG", risiko: "variabel", horizont: "bis 62+ J.", score: 75, detail: "Staatlich gefördertes Basisrentenprodukt mit Steuerabzug in der Ansparphase (§10 EStG). Lebenslange Leibrente, nicht vererbbar, nicht kapitalisierbar." },
  { id: "anleihen", name: "Staatsanleihen (BRD)", rendite: "2–3,5 % p.a.", renditeNum: 2.8, kosten: "0–0,5 % TER", kostenNum: 0.25, liquiditaet: "börsengehandelt", steuer: "§20 EStG Zins", risiko: "niedrig", horizont: "1–10 J.", score: 55, detail: "Festverzinsliche Wertpapiere des Bundes. Höchste Bonität (AAA), niedriges Ausfallrisiko, begrenzte Rendite. Diversifikationsfunktion im Portfolio." },
  { id: "crypto", name: "Kryptowährungen", rendite: "sehr volatil", renditeNum: 15, kosten: "0,1–3,5 % Spread/Gebühr", kostenNum: 2, liquiditaet: "24/7", steuer: "§23 EStG (1-J.-Frist)", risiko: "sehr hoch", horizont: "spekulativ", score: 30, detail: "Hochspekulative Anlageklasse ohne inneren Wert und Regulierung. Nach §23 EStG: Gewinne nach 1 Jahr Haltedauer steuerfrei. Totalverlustrisiko beachten." },
];

const risikoColor: Record<string, string> = {
  "sehr niedrig": "#4ade80",
  "niedrig": "#86efac",
  "mittel": "#e2c27d",
  "mittel-hoch": "#fb923c",
  "hoch": "#f87171",
  "sehr hoch": "#ef4444",
  "variabel": "#a89f94",
};

function ProfilTest() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    {
      q: "Was ist Ihr primäres Anlageziel?",
      opts: ["Kapitalerhalt / Sicherheit", "Stabiles Einkommen (Dividenden, Zinsen)", "Langfristiger Vermögensaufbau", "Maximale Rendite (höheres Risiko akzeptabel)"],
    },
    {
      q: "Wie lange möchten Sie anlegen?",
      opts: ["Unter 3 Jahre", "3–5 Jahre", "5–15 Jahre", "Über 15 Jahre"],
    },
    {
      q: "Wie reagieren Sie auf einen kurzfristigen Wertverlust von 25 %?",
      opts: ["Sofortige Panikreaktion, alles verkaufen", "Beunruhigt, aber abwarten", "Gelassen — langfristig denken", "Kaufgelegenheit nutzen"],
    },
  ];

  const getEmpfehlung = () => {
    const score = answers.reduce((a, b) => a + b, 0);
    if (score <= 2) return { typ: "Konservativ", empfehlung: "Tagesgeld, Festgeld, Staatsanleihen", risiko: "sehr niedrig bis niedrig" };
    if (score <= 5) return { typ: "Ausgewogen", empfehlung: "Anleihen-ETF + Aktien-ETF (60/40)", risiko: "niedrig bis mittel" };
    if (score <= 8) return { typ: "Wachstumsorientiert", empfehlung: "Aktien-ETF (MSCI World), Rürup", risiko: "mittel" };
    return { typ: "Renditeorientiert", empfehlung: "Aktien-ETF (100 %), ggf. Hebel", risiko: "hoch" };
  };

  if (step === questions.length) {
    const res = getEmpfehlung();
    return (
      <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.7), rgba(30,41,59,0.85))", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 12, padding: 32, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#c9a84c", marginBottom: 12 }}>Ihr Anlage-Profil</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, color: "#f0ece4", marginBottom: 20 }}>{res.typ}</div>
        <div style={{ fontSize: 15, color: "#cdc6be", marginBottom: 12 }}>Passende Anlageklassen: <strong style={{ color: "#e2c27d" }}>{res.empfehlung}</strong></div>
        <div style={{ fontSize: 13, color: "#a89f94", marginBottom: 28 }}>Risikoprofil: {res.risiko}</div>
        <div style={{ fontSize: 12, color: "#a89f94", marginBottom: 24, fontStyle: "italic" }}>Keine Anlageberatung i.S.d. WpHG · Nur indikativ</div>
        <button onClick={() => { setStep(0); setAnswers([]); }} style={{ padding: "11px 24px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.3)", background: "transparent", color: "#e2c27d", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Neu starten
        </button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32 }}>
      <div style={{ fontSize: 12, color: "#a89f94", marginBottom: 12 }}>Frage {step + 1} von {questions.length}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#f0ece4", marginBottom: 28, lineHeight: 1.4 }}>{q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.opts.map((opt, i) => (
          <button key={opt} onClick={() => { setAnswers([...answers, i]); setStep(step + 1); }} style={{
            padding: "14px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(30,50,90,0.6)", color: "#cdc6be", fontWeight: 500, fontSize: 14,
            cursor: "pointer", textAlign: "left", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.color = "#e2c27d"; e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#cdc6be"; e.currentTarget.style.background = "rgba(30,50,90,0.6)"; }}
          >{opt}</button>
        ))}
      </div>
    </div>
  );
}

export default function Anlageformen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"tabelle" | "profil">("tabelle");

  const selectedAsset = assetClasses.find(a => a.id === selected);

  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 56px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Vergleich</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>Anlageformen</h1>
          <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 600, lineHeight: 1.75 }}>
            Neutrale Gegenüberstellung von Rendite, Kosten, Liquidität und steuerlicher Behandlung —
            ohne Produktempfehlung und ohne Provision.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            {[{ k: "tabelle" as const, l: "Vergleichstabelle" }, { k: "profil" as const, l: "Anlage-Profil Test" }].map(t => (
              <button key={t.k} onClick={() => setView(t.k)} style={{ padding: "10px 20px", borderRadius: 6, border: "1px solid", borderColor: view === t.k ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)", background: view === t.k ? "rgba(201,168,76,0.1)" : "transparent", color: view === t.k ? "#e2c27d" : "#a89f94", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>{t.l}</button>
            ))}
          </div>

          {view === "tabelle" && (
            <>
              <div style={{ overflowX: "auto", marginBottom: 32 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr>
                      {["Anlageform", "Rendite (hist.)", "Kosten", "Liquidität", "Steuer", "Risiko", "Score"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assetClasses.map((row, i) => (
                      <tr key={row.id}
                        onClick={() => setSelected(selected === row.id ? null : row.id)}
                        style={{ background: selected === row.id ? "rgba(201,168,76,0.07)" : i % 2 ? "rgba(26,38,64,0.2)" : "transparent", cursor: "pointer", transition: "background 0.15s", borderLeft: selected === row.id ? "2px solid #c9a84c" : "2px solid transparent" }}
                        onMouseEnter={e => { if (selected !== row.id) e.currentTarget.style.background = "rgba(201,168,76,0.04)"; }}
                        onMouseLeave={e => { if (selected !== row.id) e.currentTarget.style.background = i % 2 ? "rgba(26,38,64,0.2)" : "transparent"; }}
                      >
                        <td style={{ padding: "15px 14px", fontSize: 14, fontWeight: 600, color: "#e8e2da" }}>{row.name}</td>
                        <td style={{ padding: "15px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#c9a84c" }}>{row.rendite}</td>
                        <td style={{ padding: "15px 14px", fontSize: 12, color: "#a89f94" }}>{row.kosten}</td>
                        <td style={{ padding: "15px 14px", fontSize: 12, color: "#a89f94" }}>{row.liquiditaet}</td>
                        <td style={{ padding: "15px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: "#a89f94" }}>{row.steuer}</td>
                        <td style={{ padding: "15px 14px" }}><span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "rgba(255,255,255,0.05)", color: risikoColor[row.risiko] || "#a89f94" }}>{row.risiko}</span></td>
                        <td style={{ padding: "15px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, minWidth: 40 }}>
                              <div style={{ height: "100%", width: `${row.score}%`, background: "linear-gradient(90deg, #304468, #c9a84c)", borderRadius: 2 }}/>
                            </div>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#c9a84c", fontWeight: 600 }}>{row.score}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedAsset && (
                <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.7), rgba(30,41,59,0.85))", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 10, padding: "24px 28px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#f0ece4", marginBottom: 12 }}>{selectedAsset.name}</div>
                  <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.8, marginBottom: 20 }}>{selectedAsset.detail}</p>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[
                      { l: "Zeithorizont", v: selectedAsset.horizont },
                      { l: "Steuerrecht", v: selectedAsset.steuer },
                      { l: "Risikoprofil", v: selectedAsset.risiko },
                    ].map(r => (
                      <div key={r.l}>
                        <div style={{ fontSize: 11, color: "#a89f94", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.l}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#e2c27d" }}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 16, fontSize: 12, color: "#a89f94" }}>* Keine Anlageberatung · Historische Renditen sind keine Garantie · BaFin-konform · MAR Art. 20</div>
            </>
          )}

          {view === "profil" && (
            <div style={{ maxWidth: 640 }}>
              <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.8, marginBottom: 32 }}>
                Beantworten Sie 3 Fragen und erhalten Sie eine indikative Einschätzung, welche Anlageklassen zu Ihrer Situation passen könnten.
                Keine Anlageberatung — nur ein Orientierungsrahmen.
              </p>
              <ProfilTest />
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "0 20px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="principles-grid">
            {[
              { icon: "🎯", title: "Anlageziel", desc: "Bestimmt Ihre Risikotoleranz und damit den Investitionshorizont. Kapitalerhalt vs. Vermögensaufbau sind fundamental verschiedene Strategien." },
              { icon: "⏳", title: "Zeithorizont", desc: "Unter 3 Jahre: nur Tagesgeld. 3–10 Jahre: konservative Mischung. 10–15+ Jahre: Aktien-ETFs überlegen — historisch." },
              { icon: "⚡", title: "Risikotoleranz", desc: "Emotionale Belastbarkeit ist entscheidend: Wer bei -25 % verkauft, realisiert Verluste und hebelt den Zinseszins aus." },
            ].map(p => (
              <div key={p.title} style={{ background: "rgba(30,50,90,0.55)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#f0ece4", marginBottom: 10 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.75 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:700px){.principles-grid{grid-template-columns:1fr !important;}}`}</style>
        </div>
      </section>
    </>
  );
}
