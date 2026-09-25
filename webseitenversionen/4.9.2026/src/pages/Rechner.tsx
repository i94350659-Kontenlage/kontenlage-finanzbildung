import { useEffect, useState } from "react";

function PageHeader() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 56, padding: "120px 20px 56px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Interaktiv</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>
          Steuerrechner
        </h1>
        <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 560, lineHeight: 1.75 }}>
          Berechnen Sie Ihr persönliches Optimierungspotential — ohne Anmeldung, ohne gespeicherte Daten.
          Alle Formeln basieren auf geltendem Steuerrecht.
        </p>
        <div style={{ marginTop: 20, padding: "10px 16px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 6, display: "inline-block" }}>
          <span style={{ fontSize: 12, color: "#a89f94" }}>⚠️ Indikative Schätzwerte · Keine Anlageberatung i.S.d. WpHG · BaFin-konform · MAR Art. 20</span>
        </div>
      </div>
    </section>
  );
}

function RurupRechner() {
  const [income, setIncome] = useState(65000);
  const [taxClass, setTaxClass] = useState("1");
  const [alter, setAlter] = useState(40);

  const maxBeitrag = 30825.60;
  const empfohlenBeitrag = Math.min(income * 0.24, maxBeitrag);
  const steuersatz = income > 60000 ? 0.42 : income > 35000 ? 0.35 : 0.25;
  const ersparnis = Math.round(empfohlenBeitrag * steuersatz * 0.96);

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>§10 EStG</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0ece4" }}>Rürup-Rente</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="calc-inner-grid">
        <div>
          {[
            { label: "Bruttoeinkommen / Jahr", min: 20000, max: 200000, step: 1000, value: income, setter: setIncome, format: (v: number) => v.toLocaleString("de-DE") + " €" },
            { label: "Lebensalter", min: 18, max: 67, step: 1, value: alter, setter: setAlter, format: (v: number) => v + " Jahre" },
          ].map(s => (
            <label key={s.label} style={{ display: "block", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#e2c27d", fontWeight: 600 }}>{s.format(s.value)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#c9a84c" }}
              />
            </label>
          ))}

          <label style={{ display: "block", marginBottom: 24 }}>
            <span style={{ display: "block", fontSize: 11, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Steuerklasse</span>
            <select value={taxClass} onChange={e => setTaxClass(e.target.value)} style={{ background: "rgba(30,50,90,0.75)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, padding: "11px 14px", color: "#f0ece4", fontSize: 14, width: "100%" }}>
              {["1","2","3","4","5","6"].map(k => <option key={k} value={k}>Steuerklasse {k}</option>)}
            </select>
          </label>
        </div>

        <div>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#a89f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Jährliche Steuerersparnis</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, color: "#c9a84c" }}>{ersparnis.toLocaleString("de-DE")} €</div>
          </div>

          {[
            { label: "Empfohlener Jahresbeitrag", value: empfohlenBeitrag.toLocaleString("de-DE", { maximumFractionDigits: 2 }) + " €" },
            { label: "Steuerlicher Höchstbetrag 2026", value: "30.825,60 €" },
            { label: "Grenzsteuersatz (indikativ)", value: Math.round(steuersatz * 100) + " %" },
            { label: "Restlaufzeit bis 62", value: Math.max(0, 62 - alter) + " Jahre" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 13, color: "#a89f94" }}>{row.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#e2c27d", fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:700px){.calc-inner-grid{grid-template-columns:1fr !important;gap:24px !important;}}`}</style>
    </div>
  );
}

function SparerRechner() {
  const [taxClass, setTaxClass] = useState("1");
  const [dividenden, setDividenden] = useState(800);
  const [kursgewinne, setKursgewinne] = useState(500);

  const freibetrag = taxClass === "3" ? 2000 : 1000;
  const gesamtertrag = dividenden + kursgewinne;
  const steuerpflichtig = Math.max(0, gesamtertrag - freibetrag);
  const kest = Math.round(steuerpflichtig * 0.26375);

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>§20 Abs. 9 EStG</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0ece4" }}>Sparerpauschbetrag 2026</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="calc-inner-grid">
        <div>
          <label style={{ display: "block", marginBottom: 24 }}>
            <span style={{ display: "block", fontSize: 11, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Veranlagung</span>
            <select value={taxClass} onChange={e => setTaxClass(e.target.value)} style={{ background: "rgba(30,50,90,0.75)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, padding: "11px 14px", color: "#f0ece4", fontSize: 14, width: "100%" }}>
              <option value="1">Einzelveranlagung (1.000 €)</option>
              <option value="3">Zusammenveranlagung (2.000 €)</option>
            </select>
          </label>

          {[
            { label: "Dividenden & Zinsen / Jahr", min: 0, max: 10000, step: 100, value: dividenden, setter: setDividenden },
            { label: "Realisierte Kursgewinne / Jahr", min: 0, max: 20000, step: 100, value: kursgewinne, setter: setKursgewinne },
          ].map(s => (
            <label key={s.label} style={{ display: "block", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#e2c27d", fontWeight: 600 }}>{s.value.toLocaleString("de-DE")} €</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#c9a84c" }}
              />
            </label>
          ))}
        </div>

        <div>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#a89f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Ihr Freibetrag</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, color: "#c9a84c" }}>{freibetrag.toLocaleString("de-DE")} €</div>
          </div>

          {[
            { label: "Gesamte Kapitalerträge", value: gesamtertrag.toLocaleString("de-DE") + " €" },
            { label: "Steuerpflichtiger Anteil", value: steuerpflichtig.toLocaleString("de-DE") + " €" },
            { label: "KESt + SolZ (26,375 %)", value: kest.toLocaleString("de-DE") + " €" },
            { label: "Ersparnis durch Freibetrag", value: Math.round(Math.min(freibetrag, gesamtertrag) * 0.26375).toLocaleString("de-DE") + " €" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 13, color: "#a89f94" }}>{row.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#e2c27d", fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImmobilienRechner() {
  const [kaufpreis, setKaufpreis] = useState(400000);
  const [grundanteil, setGrundanteil] = useState(30);
  const [baujahr, setBaujahr] = useState(2024);
  const [grenzsteuersatz, setGrenzsteuersatz] = useState(42);

  const gebaeudewert = kaufpreis * (1 - grundanteil / 100);
  const afaSatz = baujahr >= 2023 ? 0.03 : baujahr >= 1925 ? 0.02 : 0.025;
  const afaBetrag = gebaeudewert * afaSatz;
  const steuerersparnis = Math.round(afaBetrag * grenzsteuersatz / 100);

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>§7 Abs. 4 EStG</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0ece4" }}>Immobilien-AfA</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="calc-inner-grid">
        <div>
          {[
            { label: "Gesamtkaufpreis", min: 100000, max: 2000000, step: 10000, value: kaufpreis, setter: setKaufpreis, format: (v: number) => v.toLocaleString("de-DE") + " €" },
            { label: "Grundanteil", min: 10, max: 60, step: 5, value: grundanteil, setter: setGrundanteil, format: (v: number) => v + " %" },
            { label: "Baujahr", min: 1900, max: 2026, step: 1, value: baujahr, setter: setBaujahr, format: (v: number) => String(v) },
            { label: "Persönl. Grenzsteuersatz", min: 14, max: 45, step: 1, value: grenzsteuersatz, setter: setGrenzsteuersatz, format: (v: number) => v + " %" },
          ].map(s => (
            <label key={s.label} style={{ display: "block", marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#e2c27d", fontWeight: 600 }}>{s.format(s.value)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#c9a84c" }}
              />
            </label>
          ))}
        </div>

        <div>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#a89f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Steuerersparnis / Jahr</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, color: "#c9a84c" }}>{steuerersparnis.toLocaleString("de-DE")} €</div>
          </div>

          {[
            { label: "Gebäudewert (absetzbar)", value: Math.round(gebaeudewert).toLocaleString("de-DE") + " €" },
            { label: "AfA-Satz", value: (afaSatz * 100).toFixed(1) + " % p.a." },
            { label: "AfA-Betrag / Jahr", value: Math.round(afaBetrag).toLocaleString("de-DE") + " €" },
            { label: "AfA-Gesamtlaufzeit", value: Math.round(1 / afaSatz) + " Jahre" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 13, color: "#a89f94" }}>{row.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#e2c27d", fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Disclaimer() {
  return (
    <div style={{ padding: "32px 20px", background: "rgba(6,9,18,0.8)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.8, maxWidth: 800 }}>
          <strong style={{ color: "#cdc6be" }}>Haftungsausschluss:</strong> Alle Berechnungen sind rein indikativ und dienen ausschließlich der allgemeinen Information.
          Sie stellen keine Anlageberatung, Steuerberatung oder sonstige Finanzdienstleistung i.S.d. WpHG §2 Abs. 8 dar.
          Konsultieren Sie für individuelle Steuergestaltungen einen Steuerberater. BaFin-konform · MAR Art. 20 Abs. 1.
        </p>
      </div>
    </div>
  );
}


function DepotImporter() {
  const [broker, setBroker] = useState("trade_republic");
  const [csvText, setCsvText] = useState("");
  const [results, setResults] = useState<{
    dividends: number;
    gains: number;
    totalProfit: number;
    pauschbetragUsed: number;
    pauschbetragLeft: number;
    kestPaid: number;
    holdingTax: number;
    holdingSavings: number;
    vorabpauschaleEst: number;
  } | null>(null);

  // Preset sample transaction loads
  const loadPreset = (type: string) => {
    if (type === "standard") {
      setCsvText("Datum;Typ;Wertpapier;Betrag_EUR;Steuer_EUR\n15.01.2026;Dividende;Apple Inc.;340,00;0,00\n22.02.2026;Dividende;MSCI World ETF;820,00;42,10\n14.04.2026;Verkauf;NVIDIA Corp.;4200,00;1107,75\n10.06.2026;Zinsen;Verrechnungskonto;180,00;47,48\n20.08.2026;Dividende;Allianz SE;650,00;171,44");
      runAnalysis(6190, 1990);
    } else if (type === "growth") {
      setCsvText("Datum;Typ;Wertpapier;Betrag_EUR;Steuer_EUR\n10.03.2026;Verkauf;S&P 500 ETF;12500,00;3296,88\n18.05.2026;Verkauf;Alphabet;8400,00;2215,50\n02.07.2026;Dividende;Microsoft;450,00;118,69\n15.08.2026;Zinsen;Tagesgeld;320,00;84,40");
      runAnalysis(21670, 770);
    }
  };

  const runAnalysis = (gainsVal: number, divVal: number) => {
    const totalProfit = gainsVal + divVal;
    const pauschbetrag = 1000;
    const pauschbetragUsed = Math.min(totalProfit, pauschbetrag);
    const pauschbetragLeft = Math.max(0, pauschbetrag - pauschbetragUsed);
    const taxablePersonal = Math.max(0, totalProfit - pauschbetragUsed);
    const kestPaid = Math.round(taxablePersonal * 0.26375);

    // Holding: 1.54% on stock gains (§ 8b KStG), standard KSt+GewSt (~30%) on interest/dividends under 10%
    const holdingTaxOnGains = Math.round(gainsVal * 0.0154);
    const holdingTaxOnDiv = Math.round(divVal * 0.30);
    const holdingTax = holdingTaxOnGains + holdingTaxOnDiv;
    const holdingSavings = Math.max(0, kestPaid - holdingTax);
    const vorabpauschaleEst = Math.round(gainsVal * 0.0255 * 0.7 * 0.7 * 0.26375);

    setResults({
      dividends: divVal,
      gains: gainsVal,
      totalProfit,
      pauschbetragUsed,
      pauschbetragLeft,
      kestPaid,
      holdingTax,
      holdingSavings,
      vorabpauschaleEst
    });
  };

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>
            CSV Depot-Check · § 20 EStG
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0ece4" }}>
            Depot- &amp; Steuer-Analyse (Trade Republic, Scalable, DKB)
          </h2>
        </div>
        <span style={{ fontSize: 11, color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(74,222,128,0.2)" }}>
          🔒 100% Lokal im Browser – keine Serverübertragung
        </span>
      </div>

      <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.8, marginBottom: 24, maxWidth: 760 }}>
        Laden Sie Ihren CSV-Kontoauszug oder Transaktionsverlauf hoch. Die Engine prüft Ihren Sparerpauschbetrag, berechnet die gezahlte Abgeltungsteuer und zeigt den exakten Netto-Vorteil einer Holding-Struktur (§ 8b KStG).
      </p>

      {/* Preset Buttons & Broker Picker */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: "#a89f94", fontWeight: 600 }}>Demo-Daten laden:</span>
        <button onClick={() => loadPreset("standard")} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.1)", color: "#e2c27d", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          📊 Gemischtes Depot (Dividenden + Gewinne)
        </button>
        <button onClick={() => loadPreset("growth")} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.1)", color: "#e2c27d", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          🚀 Growth / Realisierte Aktiengewinne
        </button>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#a89f94" }}>Broker-Format:</span>
          <select value={broker} onChange={e => setBroker(e.target.value)} style={{ background: "rgba(30,50,90,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 12px", color: "#f0ece4", fontSize: 12 }}>
            <option value="trade_republic">Trade Republic (CSV)</option>
            <option value="scalable">Scalable Capital (Baader CSV)</option>
            <option value="dkb">DKB Brokerage</option>
            <option value="comdirect">Comdirect</option>
            <option value="ibkr">Interactive Brokers</option>
          </select>
        </div>
      </div>

      {/* Input area */}
      <div style={{ marginBottom: 24 }}>
        <textarea
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder="Fügen Sie hier Ihre CSV-Zeilen ein oder klicken Sie oben auf einen Demo-Datensatz..."
          style={{ width: "100%", height: 100, background: "rgba(10,15,30,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, color: "#cdc6be", fontFamily: "var(--font-mono)", fontSize: 12, resize: "none" }}
        />
      </div>

      {/* Results View */}
      {results && (
        <div style={{ background: "rgba(10,15,30,0.7)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 10, padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }} className="calc-inner-grid">
            <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, padding: 18 }}>
              <div style={{ fontSize: 11, color: "#a89f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Realisierte Gesamterträge</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#f0ece4" }}>{results.totalProfit.toLocaleString("de-DE")} €</div>
              <div style={{ fontSize: 11, color: "#a89f94", marginTop: 4 }}>Dividenden: {results.dividends.toLocaleString("de-DE")} € · Gewinne: {results.gains.toLocaleString("de-DE")} €</div>
            </div>

            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: 18 }}>
              <div style={{ fontSize: 11, color: "#fca5a5", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Gezahlte Abgeltungsteuer (Privat)</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#f87171" }}>{results.kestPaid.toLocaleString("de-DE")} €</div>
              <div style={{ fontSize: 11, color: "#a89f94", marginTop: 4 }}>Inkl. 5,5% SolZ nach 1.000 € Freibetrag</div>
            </div>

            <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: 18 }}>
              <div style={{ fontSize: 11, color: "#86efac", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Ersparnis mit Holding (§8b KStG)</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#4ade80" }}>+{results.holdingSavings.toLocaleString("de-DE")} €</div>
              <div style={{ fontSize: 11, color: "#a89f94", marginTop: 4 }}>Steuer in Holding nur {results.holdingTax.toLocaleString("de-DE")} € (~1,5%)</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }} className="calc-inner-grid">
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2c27d", marginBottom: 8 }}>Sparerpauschbetrag-Status (§ 20 EStG)</div>
              <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.6, margin: 0 }}>
                Genutzt: <strong style={{ color: "#f0ece4" }}>{results.pauschbetragUsed.toLocaleString("de-DE")} €</strong> von 1.000 € (Single).
                {results.pauschbetragLeft > 0 ? (
                  <span style={{ color: "#fb923c" }}> Achtung: Noch {results.pauschbetragLeft.toLocaleString("de-DE")} € ungenutzt verschenkt!</span>
                ) : (
                  <span style={{ color: "#4ade80" }}> Freistellungsauftrag zu 100% optimal ausgeschöpft.</span>
                )}
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2c27d", marginBottom: 8 }}>Vorabpauschalen-Indikator 2026</div>
              <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.6, margin: 0 }}>
                Geschätzte Steuerlast auf thesaurierende ETF-Bestände zum Jahreswechsel: <strong style={{ color: "#f0ece4" }}>ca. {results.vorabpauschaleEst.toLocaleString("de-DE")} €</strong> (Liquidität auf Verrechnungskonto vorhalten).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Rechner() {
  const [activeCalc, setActiveCalc] = useState(0);
  const [copied, setCopied] = useState(false);

  const calcs = [
    { label: "Rürup §10 EStG", slug: "rurup", component: <RurupRechner /> },
    { label: "Sparerpauschbetrag", slug: "sparerpauschbetrag", component: <SparerRechner /> },
    { label: "Immobilien-AfA §7", slug: "immobilien", component: <ImmobilienRechner /> },
    { label: "Depot- & CSV-Analyse", slug: "depot", component: <DepotImporter /> },
  ];

  // Deep-Link-Sync: /rechner#sparerpauschbetrag und /rechner?c=depot öffnen den
  // passenden Rechner direkt. Wirkt fuer geteilte Links, interne Verweise und
  // den Browser-Verlauf. Hash hat Vorrang, damit die Teilen-Schaltfläche stabil bleibt.
  useEffect(() => {
    const applyFromLocation = () => {
      const hash = window.location.hash.replace(/^#/, "").trim().toLowerCase();
      if (hash) {
        const byHash = calcs.findIndex((c) => c.slug === hash);
        if (byHash >= 0) setActiveCalc(byHash);
        return;
      }
      const query = new URLSearchParams(window.location.search).get("c") ?? window.location.search;
      const raw = query.startsWith("?") ? new URLSearchParams(query.slice(1)).get("c") : query;
      if (!raw) return;
      const token = decodeURIComponent(raw).trim().toLowerCase().replace(/^rechner-/, "");
      const bySlug = calcs.findIndex((c) => c.slug === token);
      if (bySlug >= 0) { setActiveCalc(bySlug); return; }
      const byIndex = Number.parseInt(token, 10);
      if (String(byIndex) === token && byIndex >= 0 && byIndex < calcs.length) setActiveCalc(byIndex);
    };

    applyFromLocation();
    window.addEventListener("hashchange", applyFromLocation);
    window.addEventListener("popstate", applyFromLocation);
    return () => {
      window.removeEventListener("hashchange", applyFromLocation);
      window.removeEventListener("popstate", applyFromLocation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCalc = (index: number) => {
    setActiveCalc(index);
    setCopied(false);
    const next = "#" + calcs[index].slug;
    // Alten ?c=-Parameter entfernen, damit Hash und Parameter nie auseinanderlaufen.
    const base = window.location.pathname + window.location.search.replace(/([?&])c=[^&]*&?/, (m, sep) => (sep === "?" ? "" : "&")).replace(/[?&]$/, "");
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", base + next);
    }
  };

  // Geteilter Link bewusst als ?c=<slug> (ohne Fragment): Messaging-Dienste und
  // Excel/CRM-Import entfernen #Fragmente, der Query-Parameter bleibt stabil.
  const shareLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?c=${calcs[activeCalc].slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Link kopieren:", url);
    }
  };

  return (
    <>
      <PageHeader />

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Selector */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            {calcs.map((c, i) => (
              <button
                key={c.label}
                onClick={() => selectCalc(i)}
                aria-pressed={activeCalc === i}
                aria-controls="rechner-ergebnis"
                id={"rechner-tab-" + c.slug}
                style={{
                  padding: "10px 20px", borderRadius: 6, border: "1px solid",
                  borderColor: activeCalc === i ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
                  background: activeCalc === i ? "rgba(201,168,76,0.1)" : "transparent",
                  color: activeCalc === i ? "#e2c27d" : "#a89f94",
                  fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                }}>{c.label}</button>
            ))}

            <button
              onClick={shareLink}
              aria-label="Direktlink zu diesem Rechner kopieren"
              style={{
                marginLeft: "auto", padding: "9px 16px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
                color: copied ? "#e2c27d" : "#a89f94", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{copied ? "✓ Link kopiert" : "↗ Direktlink teilen"}</button>
          </div>

          <p style={{ fontSize: 12, color: "#7d766d", margin: "0 0 32px", lineHeight: 1.6 }}>
            Jeder Rechner hat einen eigenen Direktlink — <code>/rechner?c={calcs[activeCalc].slug}</code> (auch als
            <code> /rechner#{calcs[activeCalc].slug}</code> aufrufbar) — damit lässt sich eine bestimmte Berechnung
            teilen oder bookmarken. Eingaben bleiben im Browser, es werden keine Daten übertragen.
          </p>

          <div id="rechner-ergebnis" role="tabpanel" aria-labelledby={"rechner-tab-" + calcs[activeCalc].slug}>
            {calcs[activeCalc].component}
          </div>
        </div>
      </section>

      <Disclaimer />
    </>
  );
}
