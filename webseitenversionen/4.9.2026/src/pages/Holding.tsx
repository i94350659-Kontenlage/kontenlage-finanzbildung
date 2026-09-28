import { useState } from "react";
import { Link } from "react-router";
import { useSubscription } from "../hooks/useSubscription";
import ExecutiveDownloads from "../components/ExecutiveDownloads";

function PageHeader() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 56, padding: "120px 20px 56px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Strukturierung</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>
          Holding & Steuern
        </h1>
        <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 600, lineHeight: 1.75 }}>
          Legale Steuergestaltung für Selbständige, Freiberufler und Angestellte mit Kapitaleinkünften —
          transparent dargestellt nach §§ EStG, KStG und GewStG.
        </p>
      </div>
    </section>
  );
}

function VVGmbH() {
  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 36, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>§8b KStG · §15 GewStG</div>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#f0ece4", marginBottom: 10 }}>VV-GmbH & Holdingstruktur</h2>
          <p style={{ fontSize: 14, color: "#a89f94", maxWidth: 600, lineHeight: 1.8 }}>
            Die vermögensverwaltende GmbH (VV-GmbH) ist eine der effektivsten legalen Steuergestaltungen für Kapitalanleger.
            Dividenden zwischen Kapitalgesellschaften sind nach §8b KStG zu 95 % steuerfrei.
          </p>
        </div>
        <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "20px 24px", textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "#a89f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Effektiver Steuersatz</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "#c9a84c" }}>~1,5 %</div>
          <div style={{ fontSize: 11, color: "#a89f94", marginTop: 4 }}>statt 26,375 % persönlich</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="holding-cards">
        {[
          { title: "Privatperson", steuersatz: "26,375 %", auf: "Kapitalerträge", detail: "KESt 25 % + SolZ 5,5 %", color: "#a89f94" },
          { title: "GmbH (§8b KStG)", steuersatz: "1,5 %", auf: "Beteiligungsdividenden", detail: "5 % fiktive Betriebsausgaben × 30 % KSt", color: "#c9a84c" },
          { title: "Ersparnis", steuersatz: "24,9 %", auf: "pro Jahr weniger", detail: "Thesaurierungseffekt verstärkt Kapital", color: "#e2c27d" },
        ].map(c => (
          <div key={c.title} style={{ background: "rgba(10,15,30,0.5)", borderRadius: 8, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, color: "#a89f94", marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.steuersatz}</div>
            <div style={{ fontSize: 12, color: "#a89f94" }}>{c.auf}</div>
            <div style={{ fontSize: 11, color: "#a89f94", marginTop: 8, opacity: 0.7 }}>{c.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(201,168,76,0.04)", borderRadius: 8, border: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.8 }}>
          <strong style={{ color: "#cdc6be" }}>Voraussetzung:</strong> Mindestbeteiligung von 10 % (§8b Abs. 4 KStG) · Kein Handelsgewerbe · Gründungskosten ca. 1.500–3.000 € ·
          Laufende Kosten (Buchführung, Jahresabschluss) ca. 1.200–2.500 €/Jahr. Wirtschaftlich sinnvoll ab ca. 100.000 € Kapitalvermögen.
        </div>
      </div>
      <style>{`@media(max-width:700px){.holding-cards{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function Fuenftelregelung() {
  const [abfindung, setAbfindung] = useState(80000);
  const [income, setIncome] = useState(55000);

  const ohneRegel = Math.round((abfindung + income) * 0.42 - income * 0.35);
  const mitRegel = Math.round((income + abfindung / 5) * 0.37 - income * 0.35) * 5;
  const ersparnis = Math.max(0, ohneRegel - mitRegel);

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 36, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>§34 EStG</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#f0ece4" }}>Fünftelregelung</h2>
      </div>
      <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
        Außerordentliche Einkünfte (Abfindungen, Einmalzahlungen, Nachzahlungen) können progressionsschonend
        versteuert werden: Als wären sie über 5 Jahre verteilt zugeflossen.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="calc-inner-grid">
        <div>
          {[
            { label: "Reguläres Jahresgehalt", min: 20000, max: 200000, step: 1000, value: income, setter: setIncome, fmt: (v: number) => v.toLocaleString("de-DE") + " €" },
            { label: "Abfindungsbetrag", min: 10000, max: 500000, step: 5000, value: abfindung, setter: setAbfindung, fmt: (v: number) => v.toLocaleString("de-DE") + " €" },
          ].map(s => (
            <label key={s.label} style={{ display: "block", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#e2c27d", fontWeight: 600 }}>{s.fmt(s.value)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#c9a84c" }}
              />
            </label>
          ))}
        </div>
        <div>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#a89f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Steuerersparnis (indikativ)</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, color: "#c9a84c" }}>{ersparnis.toLocaleString("de-DE")} €</div>
          </div>
          {[
            { label: "Steuer ohne Regelung", value: ohneRegel.toLocaleString("de-DE") + " €" },
            { label: "Steuer mit §34", value: Math.max(0, mitRegel).toLocaleString("de-DE") + " €" },
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

function SteuerfBenefits() {
  const benefits = [
    { para: "§3 Nr. 34 EStG", name: "Gesundheitsförderung", betrag: "600 €/Jahr", sv: "sv-frei", detail: "Fitness, Massagen, betriebliche Gesundheitskurse" },
    { para: "§3 Nr. 33 EStG", name: "Kindergartenzuschuss", betrag: "unbegrenzt", sv: "sv-frei", detail: "Für unter 6-Jährige, zusätzlich zum Gehalt" },
    { para: "§3 Nr. 15 EStG", name: "Jobticket / ÖPNV", betrag: "unbegrenzt", sv: "sv-pflichtig", detail: "Deutschland-Ticket steuer- und sv-frei möglich" },
    { para: "§3 Nr. 37 EStG", name: "Fahrradleasing", betrag: "~1.500 €/Jahr", sv: "sv-frei", detail: "Gehaltsumwandlung, auch E-Bike möglich" },
    { para: "§8 Abs. 2 EStG", name: "Sachbezüge", betrag: "50 €/Monat", sv: "sv-frei", detail: "Gutscheine, Tankkarten, etc. (seit 2022 verschärft)" },
    { para: "§40 Abs. 2 EStG", name: "Erholungsbeihilfe", betrag: "156 €/Jahr", sv: "sv-frei", detail: "Pauschalversteuerung 25 % durch AG" },
    { para: "§19 Abs. 1 EStG", name: "Belegschaftsrabatte", betrag: "1.080 €/Jahr", sv: "sv-frei", detail: "Vergünstigungen auf eigene Produkte/Leistungen" },
    { para: "§8 Abs. 2 EStG", name: "Mahlzeiten / Kantine", betrag: "3,17 €/Tag", sv: "sv-frei", detail: "Amtlicher Sachbezugswert für Mahlzeiten 2026" },
  ];

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>§3 EStG · §40 EStG</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#f0ece4" }}>Steuerfreie Benefits</h2>
      </div>
      <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
        Viele Arbeitgeber-Benefits sind steuer- und sozialversicherungsfrei — wenn sie korrekt strukturiert sind.
        Insgesamt bis zu 4.500 €/Jahr möglich, on top zum Gehalt.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr>
              {["Paragraph", "Benefit", "Betrag", "SV", "Details"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {benefits.map((b, i) => (
              <tr key={b.name} style={{ background: i % 2 ? "rgba(26,38,64,0.2)" : "transparent", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = i % 2 ? "rgba(26,38,64,0.2)" : "transparent")}
              >
                <td style={{ padding: "13px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#c9a84c" }}>{b.para}</td>
                <td style={{ padding: "13px 14px", fontSize: 14, fontWeight: 600, color: "#e8e2da" }}>{b.name}</td>
                <td style={{ padding: "13px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#e2c27d" }}>{b.betrag}</td>
                <td style={{ padding: "13px 14px" }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: b.sv === "sv-frei" ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.06)", color: b.sv === "sv-frei" ? "#c9a84c" : "#a89f94", border: `1px solid ${b.sv === "sv-frei" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.08)"}` }}>{b.sv}</span>
                </td>
                <td style={{ padding: "13px 14px", fontSize: 12, color: "#a89f94" }}>{b.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function ThesaurierungsRechner({ isUnlocked, planName }: { isUnlocked: boolean; planName: string }) {
  const [kapital, setKapital] = useState(250000);
  const [rendite, setRendite] = useState(8);
  const [jahre, setJahre] = useState(20);

  // Privat: Steuerabzug von 26,375% auf jährliche Umschichtungen / Erträge
  // Effektive Netto-Rendite privat (bei 100% Realisierung / Rebalancing): rendite * (1 - 0.26375)
  // VV-GmbH: 1,54% Steuer nach § 8b KStG -> rendite * (1 - 0.0154)
  const nettoRenditePrivat = (rendite * (1 - 0.26375)) / 100;
  const nettoRenditeGmbH = (rendite * (1 - 0.0154)) / 100;

  const endwertPrivat = Math.round(kapital * Math.pow(1 + nettoRenditePrivat, jahre));
  const endwertGmbH = Math.round(kapital * Math.pow(1 + nettoRenditeGmbH, jahre));
  const mehrwertGmbH = endwertGmbH - endwertPrivat;

  const downloadCashflowCsv = () => {
    const header = "Jahr;Holding_Bestand_EUR;Privat_Bestand_EUR;Steuersatz_Holding_pct;Steuersatz_Privat_pct;Vorteil_Holding_p_a_EUR;Kumulierter_Vorteil_Holding_EUR\n";
    const years = [1, 2, 3, 4, 5, 7, 10, 15, 20];
    const rows = years.map(yr => {
      const gmbh = Math.round(kapital * Math.pow(1 + nettoRenditeGmbH, yr));
      const priv = Math.round(kapital * Math.pow(1 + nettoRenditePrivat, yr));
      const diff = gmbh - priv;
      return `${yr};${gmbh};${priv};1.54;26.375;${diff};${diff}`;
    }).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kontolage-holding-matrix-${kapital}eur-${rendite}pct.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const yearsToDisplay = [1, 2, 3, 5, 10, 15, 20];

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#c9a84c", padding: "4px 8px", background: "rgba(201,168,76,0.1)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)" }}>§ 8b KStG · Thesaurierung</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#f0ece4" }}>Holding-Thesaurierungs-Rechner</h2>
      </div>
      <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.8, marginBottom: 28, maxWidth: 720 }}>
        Vergleichen Sie den Zinseszinseffekt bei Reinvestition: Die Holding versteuert Aktiengewinne mit nur ~1,5 %, während im Privatvermögen 26,375 % Abgeltungsteuer anfallen.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 32 }} className="calc-inner-grid">
        <div>
          {[
            { label: "Startkapital", min: 50000, max: 2000000, step: 25000, value: kapital, setter: setKapital, fmt: (v: number) => v.toLocaleString("de-DE") + " €" },
            { label: "Angenommene Brutto-Rendite p.a.", min: 4, max: 15, step: 0.5, value: rendite, setter: setRendite, fmt: (v: number) => v.toFixed(1) + " %" },
            { label: "Anlagehorizont", min: 5, max: 40, step: 1, value: jahre, setter: setJahre, fmt: (v: number) => v + " Jahre" },
          ].map(s => (
            <label key={s.label} style={{ display: "block", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#e2c27d", fontWeight: 600 }}>{s.fmt(s.value)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#c9a84c" }}
              />
            </label>
          ))}
        </div>

        <div>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#a89f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Zusätzliches Holding-Vermögen (Zinseszins-Vorteil)</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "#c9a84c" }}>+{mehrwertGmbH.toLocaleString("de-DE")} €</div>
          </div>
          {[
            { label: "Endvermögen Privat (26,375% Steuerabzug)", value: endwertPrivat.toLocaleString("de-DE") + " €", color: "#a89f94" },
            { label: "Endvermögen Holding (~1,5% Steuer §8b KStG)", value: endwertGmbH.toLocaleString("de-DE") + " €", color: "#e2c27d" },
            { label: "Steuerersparnis p.a. zur freien Wiederanlage", value: "~24,8 % Ertragsunterschied", color: "#4ade80" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 13, color: "#a89f94" }}>{row.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: row.color, fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pro & Executive Cashflow Matrix */}
      <div style={{ position: "relative", marginTop: 24, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(201,168,76,0.25)" }}>
        {isUnlocked && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "rgba(10,18,36,0.9)", borderBottom: "1px solid rgba(201,168,76,0.2)", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 13, color: "#cdc6be", fontWeight: 600 }}>
                Break-Even Matrix &amp; Bilanz freigeschaltet ({planName})
              </span>
            </div>
            <button
              type="button"
              onClick={downloadCashflowCsv}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: "linear-gradient(135deg, #c9a84c, #e2c27d)",
                color: "#0C1825",
                fontSize: 12,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(201,168,76,0.3)",
              }}
            >
              📊 CSV-Export für Excel herunterladen
            </button>
          </div>
        )}

        <div style={{
          filter: isUnlocked ? "none" : "blur(4px)",
          opacity: isUnlocked ? 1 : 0.3,
          pointerEvents: isUnlocked ? "auto" : "none",
          padding: 24,
          background: "rgba(10,15,30,0.85)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", color: "#c9a84c" }}>
                <th style={{ textAlign: "left", padding: "10px 8px" }}>Jahr</th>
                <th style={{ textAlign: "right", padding: "10px 8px" }}>GmbH-Bestand</th>
                <th style={{ textAlign: "right", padding: "10px 8px" }}>Privat-Bestand</th>
                <th style={{ textAlign: "right", padding: "10px 8px" }}>KSt &amp; GewSt (§9 Nr. 1)</th>
                <th style={{ textAlign: "right", padding: "10px 8px" }}>Holding-Vorteil</th>
              </tr>
            </thead>
            <tbody>
              {yearsToDisplay.map(yr => {
                const gmbh = Math.round(kapital * Math.pow(1 + nettoRenditeGmbH, yr));
                const priv = Math.round(kapital * Math.pow(1 + nettoRenditePrivat, yr));
                const diff = gmbh - priv;
                return (
                  <tr key={yr} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "10px 8px", color: "#cdc6be" }}>Jahr {yr}</td>
                    <td style={{ textAlign: "right", padding: "10px 8px", fontFamily: "var(--font-mono)", color: "#e2c27d" }}>{gmbh.toLocaleString("de-DE")} €</td>
                    <td style={{ textAlign: "right", padding: "10px 8px", fontFamily: "var(--font-mono)", color: "#a89f94" }}>{priv.toLocaleString("de-DE")} €</td>
                    <td style={{ textAlign: "right", padding: "10px 8px", fontFamily: "var(--font-mono)", color: "#86efac" }}>1,54 %</td>
                    <td style={{ textAlign: "right", padding: "10px 8px", fontFamily: "var(--font-mono)", color: "#4ade80", fontWeight: 600 }}>+{diff.toLocaleString("de-DE")} €</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isUnlocked && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(10,15,30,0.82)", backdropFilter: "blur(6px)", padding: 24, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#0C1825", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", padding: "3px 10px", borderRadius: 12, marginBottom: 8, textTransform: "uppercase" }}>PRO &amp; EXECUTIVE EXKLUSIV</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#f0ece4", marginBottom: 6 }}>Detaillierte Jahres-Steuerbilanz &amp; Break-Even-Matrix</div>
            <p style={{ fontSize: 12, color: "#a89f94", maxWidth: 480, marginBottom: 14 }}>
              Inklusive IHK-Freibetrag, laufender Steuerberatergebühren, erweiterter Gewerbesteuerkürzung bei Immobilien (§ 9 Nr. 1 Satz 2 GewStG) und CSV-Export.
            </p>
            <Link to="/abo" style={{ padding: "8px 20px", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", color: "#0C1825", fontWeight: 700, borderRadius: 6, textDecoration: "none", fontSize: 12 }}>
              Vollständige Matrix freischalten (ab 9 €) →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Holding() {
  const { isPro, isExecutive } = useSubscription();
  const [activeSection, setActiveSection] = useState(0);

  const planName = isExecutive ? "Executive B2B" : isPro ? "Pro Digital" : "";

  const sections = [
    { label: "VV-GmbH / Holding", component: <VVGmbH /> },
    { label: "Fünftelregelung §34", component: <Fuenftelregelung /> },
    { label: "Steuerfreie Benefits", component: <SteuerfBenefits /> },
    { label: "Thesaurierungs-Rechner", component: <ThesaurierungsRechner isUnlocked={isPro || isExecutive} planName={planName} /> },
  ];

  return (
    <>
      <PageHeader />

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
            {sections.map((s, i) => (
              <button key={s.label} onClick={() => setActiveSection(i)} style={{
                padding: "10px 20px", borderRadius: 6, border: "1px solid",
                borderColor: activeSection === i ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
                background: activeSection === i ? "rgba(201,168,76,0.1)" : "transparent",
                color: activeSection === i ? "#e2c27d" : "#a89f94",
                fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
              }}>{s.label}</button>
            ))}
          </div>

          {sections[activeSection].component}

          {/* Executive B2B Modell & Vorlagen-Hub */}
          {isExecutive ? (
            <div style={{ background: "linear-gradient(145deg, rgba(30,55,105,0.95), rgba(15,25,48,0.98))", border: "2px solid #c9a84c", borderRadius: 12, padding: "36px 32px", marginTop: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#0C1825", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" }}>
                    👑 Executive B2B · Vollzugriff Aktiv
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#f0ece4", marginTop: 12, marginBottom: 8 }}>
                    Holding-Vertragswerk &amp; B2B-Downloadtresor
                  </h3>
                  <p style={{ fontSize: 14, color: "#a89f94", maxWidth: 680, lineHeight: 1.7 }}>
                    Ihr Executive B2B Abonnement ist freigeschaltet. Sie haben direkten Zugriff auf alle notariellen Mustersatzungen,
                    Holding-Gewinnausschüttungsbeschlüsse, Excel-Rechenmodelle und ELSTER-Anleitungen.
                  </p>
                </div>
                <Link to="/konto" style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.5)", background: "rgba(201,168,76,0.1)", color: "#e2c27d", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                  Mein Konto &amp; Rechnungen →
                </Link>
              </div>

              <ExecutiveDownloads isUnlocked={true} />
            </div>
          ) : (
            <div style={{ background: "linear-gradient(145deg, rgba(30,55,105,0.9), rgba(15,25,48,0.95))", border: "2px solid #c9a84c", borderRadius: 12, padding: "36px 32px", marginTop: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#0C1825", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" }}>
                    👑 Executive B2B Modell
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#f0ece4", marginTop: 12, marginBottom: 8 }}>
                    Holding-Vertragswerk &amp; Vollständiges Excel-Berechnungsmodell
                  </h3>
                  <p style={{ fontSize: 14, color: "#a89f94", maxWidth: 640, lineHeight: 1.7 }}>
                    Schalten Sie das vollständige Modell frei: Inklusive notarieller Mustersatzung für die VV-GmbH,
                    Holding-Mustervertrag nach §8b KStG, Gewinnausschüttungs-Beschluss und dynamischer Excel-Kalkulation
                    für Steuerberater und Holding-Gründer.
                  </p>
                  <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 13, color: "#cdc6be" }}>
                    <span>✓ Sofortiger Excel-Download</span>
                    <span>·</span>
                    <span>✓ Satzung &amp; Notar-Muster</span>
                    <span>·</span>
                    <span>✓ Monatlich kündbar</span>
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 200 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "#c9a84c" }}>29 €</div>
                  <div style={{ fontSize: 12, color: "#a89f94", marginBottom: 14 }}>/ Monat (ohne Bindung)</div>
                  <Link to="/abo" style={{ display: "inline-block", width: "100%", padding: "12px 24px", borderRadius: 6, background: "linear-gradient(135deg, #c9a84c, #e2c27d)", color: "#0C1825", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 15px rgba(201,168,76,0.3)" }}>
                    Executive freischalten →
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 12, color: "#e2c27d", fontWeight: 600, marginBottom: 8 }}>
                  Enthaltene B2B-Vorlagen &amp; Dokumente (Vorschau verfügbar):
                </div>
                <ExecutiveDownloads isUnlocked={false} />
              </div>
            </div>
          )}

          <div style={{ marginTop: 40, padding: "24px", background: "rgba(6,9,18,0.6)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.8 }}>
              <strong style={{ color: "#cdc6be" }}>Haftungsausschluss:</strong> Alle Inhalte sind allgemeine steuerrechtliche Informationen ohne Anspruch auf Vollständigkeit.
              Keine Steuerberatung i.S.d. StBerG. Bitte konsultieren Sie einen zugelassenen Steuerberater für Ihre individuelle Situation.{" "}
              <Link to="/transparenz" style={{ color: "#c9a84c", textDecoration: "none" }}>Mehr zur Transparenz →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
