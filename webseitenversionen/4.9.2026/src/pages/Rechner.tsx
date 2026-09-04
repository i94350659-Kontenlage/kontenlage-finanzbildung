import { useState } from "react";

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

export default function Rechner() {
  const [activeCalc, setActiveCalc] = useState(0);

  const calcs = [
    { label: "Rürup §10 EStG", component: <RurupRechner /> },
    { label: "Sparerpauschbetrag", component: <SparerRechner /> },
    { label: "Immobilien-AfA §7", component: <ImmobilienRechner /> },
  ];

  return (
    <>
      <PageHeader />

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Selector */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
            {calcs.map((c, i) => (
              <button key={c.label} onClick={() => setActiveCalc(i)} style={{
                padding: "10px 20px", borderRadius: 6, border: "1px solid",
                borderColor: activeCalc === i ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
                background: activeCalc === i ? "rgba(201,168,76,0.1)" : "transparent",
                color: activeCalc === i ? "#e2c27d" : "#a89f94",
                fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
              }}>{c.label}</button>
            ))}
          </div>

          {calcs[activeCalc].component}
        </div>
      </section>

      <Disclaimer />
    </>
  );
}
