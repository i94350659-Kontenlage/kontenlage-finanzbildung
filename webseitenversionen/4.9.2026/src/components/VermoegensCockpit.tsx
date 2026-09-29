import { useState, useMemo } from "react";
import { Link } from "react-router";
import { triggerCsvDownload } from "../lib/excelModelGenerator";

interface VermoegensCockpitProps {
  isUnlocked?: boolean;
}

export default function VermoegensCockpit({ isUnlocked = true }: VermoegensCockpitProps) {
  // 1. Operative Ebene (Unternehmen)
  const [gmbhGewinn, setGmbhGewinn] = useState(250000); // Gewinn vor GGF-Gehalt und Steuern
  const [ggfGehalt, setGgfGehalt] = useState(90000); // Angemessenes Geschäftsführergehalt

  // 2. Privatsphäre (Einkommen & Vorsorge)
  const [ruerupBeitrag, setRuerupBeitrag] = useState(20000); // § 10 EStG Sonderausgaben
  const [privatDepot, setPrivatDepot] = useState(50000); // Privates Depot
  const [kryptoPrivat, setKryptoPrivat] = useState(25000); // Krypto nach 1 Jahr § 23 EStG steuerfrei

  // 3. Holding & Vermögensallokation
  const [holdingDepotStart, setHoldingDepotStart] = useState(200000); // Start-Depot Holding
  const [aktienRendite, setAktienRendite] = useState(7.5); // Erwartete Aktien/ETF-Rendite p.a.
  const [holdingFixkosten, setHoldingFixkosten] = useState(1800); // StB, IHK, Bundesanzeiger

  // 4. Immobilien-Allokation
  const [immoWert, setImmoWert] = useState(350000); // Kaufpreis
  const [immoMietrendite, setImmoMietrendite] = useState(4.5); // Brutto-Mietrendite
  const [immoStruktur, setImmoStruktur] = useState<"privat" | "vvgmbh">("privat"); // Privat (§23 EStG) vs. VV-GmbH (§9 Nr.1 GewStG)

  // BERECHNUNGEN (Mathematisches Steuer-Modell)
  const simulation = useMemo(() => {
    // Operative GmbH
    const gmbhRestgewinnVorSteuern = Math.max(0, gmbhGewinn - ggfGehalt);
    const gmbhSteuerOperativ = gmbhRestgewinnVorSteuern * 0.30; // KSt (15%) + GewSt (~14-15%) + SolZ
    const ausschüttungAnHolding = Math.max(0, gmbhRestgewinnVorSteuern - gmbhSteuerOperativ);
    
    // Holding Besteuerung der Ausschüttung gem. § 8b Abs. 1 & 5 KStG:
    // 95% steuerfrei, 5% als nicht abzugsfähige BA mit 15,825% KSt+SolZ besteuert = 0,79% effektive Steuer
    const steuerInHolding = ausschüttungAnHolding * 0.0079;
    const nettoZuflussHolding = ausschüttungAnHolding - steuerInHolding;

    // Privates Einkommen (GGF)
    const zvE = Math.max(0, ggfGehalt - ruerupBeitrag);
    // Grenzsteuersatz näherungsweise für zvE (EStG 2026):
    const grenzsteuersatz = zvE > 66760 ? 0.42 : zvE > 17005 ? 0.30 : 0.14;
    const ruerupErsparnis = Math.round(ruerupBeitrag * grenzsteuersatz);
    const privateSteuerLast = Math.round(zvE * (grenzsteuersatz * 0.75)); // Durchschnittsteuersatz

    // Immobilien
    const jahresMieteBrutto = immoWert * (immoMietrendite / 100);
    const afa = immoWert * 0.8 * 0.03; // 3% lineare AfA auf Gebäudeanteil (80%)
    const steuerpflichtigeMiete = Math.max(0, jahresMieteBrutto - afa);
    const immoSteuer = immoStruktur === "vvgmbh"
      ? steuerpflichtigeMiete * 0.15825 // Nur KSt+SolZ (0% GewSt gem. § 9 Nr. 1 S. 2 GewStG)
      : steuerpflichtigeMiete * grenzsteuersatz; // Privat mit persönlichem Grenzsteuersatz

    // 20-Jahres-Projektion Gesamtsystem:
    let kapitalHolding = holdingDepotStart;
    let kapitalPrivat = privatDepot + kryptoPrivat;

    for (let yr = 1; yr <= 20; yr++) {
      // Holding: Thesaurierung von Aktienrendite + jährlicher Zufluss aus Tochter-GmbH
      const holdingErtrag = kapitalHolding * (aktienRendite / 100);
      const holdingSteuerAktien = holdingErtrag * 0.0154; // 1,54% auf Aktien gem. § 8b KStG
      kapitalHolding = kapitalHolding + holdingErtrag - holdingSteuerAktien - holdingFixkosten + nettoZuflussHolding;

      // Privat: Abgeltungsteuer 26,375% auf Erträge + Sparerpauschbetrag
      const privatErtrag = (kapitalPrivat - kryptoPrivat) * (aktienRendite / 100);
      const kryptoErtrag = kryptoPrivat * 0.08; // 8% Krypto-Rendite (nach 1 Jahr 0% Steuer gem. § 23 EStG)
      const steuerpflichtigPrivat = Math.max(0, privatErtrag - 1000); // 1.000 € Sparerpauschbetrag
      const privatAbgeltung = steuerpflichtigPrivat * 0.26375;
      kapitalPrivat = kapitalPrivat + privatErtrag + kryptoErtrag - privatAbgeltung;
    }

    // Unoptimierter Vergleich (Alles privat ohne Holding und ohne Rürup):
    let kapitalUnoptimiert = holdingDepotStart + privatDepot + kryptoPrivat;
    const nettoZuflussPrivatOhneHolding = ausschüttungAnHolding * (1 - 0.26375); // Private Abgeltungsteuer auf Vollausschüttung
    for (let yr = 1; yr <= 20; yr++) {
      const ertrag = kapitalUnoptimiert * (aktienRendite / 100);
      const steuer = Math.max(0, ertrag - 1000) * 0.26375;
      kapitalUnoptimiert = kapitalUnoptimiert + ertrag - steuer + nettoZuflussPrivatOhneHolding;
    }

    const holdingGesamtvermoegen20 = Math.round(kapitalHolding);
    const privatGesamtvermoegen20 = Math.round(kapitalPrivat);
    const optimiertGesamt20 = holdingGesamtvermoegen20 + privatGesamtvermoegen20 + immoWert;
    const unoptimiertGesamt20 = Math.round(kapitalUnoptimiert + immoWert);
    const gesamtvorteilStruktur = optimiertGesamt20 - unoptimiertGesamt20;

    return {
      ausschüttungAnHolding: Math.round(ausschüttungAnHolding),
      nettoZuflussHolding: Math.round(nettoZuflussHolding),
      steuerInHolding: Math.round(steuerInHolding),
      grenzsteuersatz: Math.round(grenzsteuersatz * 100),
      ruerupErsparnis,
      privateSteuerLast,
      immoSteuer: Math.round(immoSteuer),
      holdingGesamtvermoegen20,
      privatGesamtvermoegen20,
      optimiertGesamt20,
      unoptimiertGesamt20,
      gesamtvorteilStruktur,
    };
  }, [
    gmbhGewinn,
    ggfGehalt,
    ruerupBeitrag,
    privatDepot,
    kryptoPrivat,
    holdingDepotStart,
    aktienRendite,
    holdingFixkosten,
    immoWert,
    immoMietrendite,
    immoStruktur,
  ]);

  const downloadCockpitCsv = () => {
    const lines = [
      `"KONTOLAGE.DE — MULTI-ASSET STEUER- & VERMÖGENSCOCKPIT 2026"`,
      `"Rechtlicher Hinweis: Mathematische Modellrechnung gem. § 2 Abs. 8 Nr. 10 WpHG. Keine Steuer- oder Anlageberatung."`,
      `""`,
      `"1. UNTERNEHMENS- & HOLDINGEBENE";"WERT (EUR)";"RECHTSGRUNDLAGE"`,
      `"GmbH-Gewinn vor Steuern & GGF-Gehalt";${gmbhGewinn};"Handelsbilanz"`,
      `"Geschäftsführer-Gehalt (GGF)";${ggfGehalt};"Betriebsausgabe GmbH (§ 4 Abs. 4 EStG)"`,
      `"Ausschüttung an Holding GmbH";${simulation.ausschüttungAnHolding};"§ 8b Abs. 1 KStG (95% steuerfrei)"`,
      `"Steuerbelastung in Holding";${simulation.steuerInHolding};"§ 8b Abs. 5 KStG (~0,79% auf Ausschüttung)"`,
      `"Netto-Investitionszufluss Holding";${simulation.nettoZuflussHolding};"Zur freien Thesaurierung"`,
      `""`,
      `"2. PRIVATSPHÄRE & VORSORGE";"WERT (EUR)";"RECHTSGRUNDLAGE"`,
      `"GGF-Bruttoeinkommen";${ggfGehalt};"§ 19 EStG"`,
      `"Rürup-Basisrenten-Beitrag";${ruerupBeitrag};"§ 10 Abs. 1 Nr. 2 EStG (Sonderausgaben)"`,
      `"Jährliche Einkommensteuerersparnis Rürup";${simulation.ruerupErsparnis};"Minderung Spitzensteuersatz"`,
      `"Privates Wertpapierdepot";${privatDepot};"§ 20 EStG (1.000 € Sparerpauschbetrag)"`,
      `"Krypto-Bestand (Haltefrist > 1 Jahr)";${kryptoPrivat};"§ 23 Abs. 1 Satz 1 Nr. 2 EStG (100% steuerfrei)"`,
      `""`,
      `"3. IMMOBILIEN-ALLOKATION";"WERT (EUR)";"STRUKTUR & STEUER"`,
      `"Immobilien-Kaufpreis / Wert";${immoWert};"Gebäude-AfA 3% (§ 7 Abs. 4 EStG)"`,
      `"Mietertrag p.a.";${Math.round(immoWert * (immoMietrendite / 100))};"${immoStruktur === 'vvgmbh' ? 'VV-GmbH (15,8% KSt, 0% GewSt gem. § 9 Nr. 1 GewStG)' : 'Privat (steuerfrei nach 10 Jahren gem. § 23 EStG)'}"`,
      `"Steuerbelastung auf Miete p.a.";${simulation.immoSteuer};"Effektive Steuer"`,
      `""`,
      `"4. 20-JAHRES-VERMÖGENSVERGLEICH";"STRUKTURIERT (KONTOLAGE)";"UNSTRUKTURIERT (ALLES PRIVAT)"`,
      `"Holding-Endvermögen (nach Steuern)";${simulation.holdingGesamtvermoegen20};"0"`,
      `"Privat-Endvermögen (nach Steuern)";${simulation.privatGesamtvermoegen20};${simulation.unoptimiertGesamt20 - immoWert}`,
      `"Immobilienwert";${immoWert};${immoWert}`,
      `"GESAMTVERMÖGEN NACH 20 JAHREN";${simulation.optimiertGesamt20};${simulation.unoptimiertGesamt20}`,
      `"STRUKTUR-MEHRWERT DURCH KONTOLAGE";+${simulation.gesamtvorteilStruktur};"Zinseszinseffekt durch Steuer-Thesaurierung"`,
    ];

    triggerCsvDownload("kontolage-multi-asset-vermoegenscockpit-2026.csv", lines.join("\r\n"));
  };

  return (
    <div style={{ background: "linear-gradient(145deg, rgba(20,32,60,0.9), rgba(15,22,40,0.95))", border: "1px solid rgba(201,168,76,0.35)", borderRadius: 12, padding: "32px 28px", boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#0C1825", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>
              👑 Executive B2B Simulator
            </span>
            <span style={{ fontSize: 11, color: "#86efac", fontFamily: "var(--font-mono)" }}>
              Multi-Asset-Architektur
            </span>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0ece4", margin: "4px 0 6px" }}>
            Ganzheitliches Steuer- &amp; Vermögens-Cockpit
          </h3>
          <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
            Verknüpft alle Ebenen in Echtzeit: Operative GmbH, Holding-Thesaurierung (§ 8b KStG), Geschäftsführer-Gehalt, Rürup-Vorsorge (§ 10 EStG), Immobilien-AfA und Krypto-Haltefristen.
          </p>
        </div>

        {isUnlocked && (
          <button
            type="button"
            onClick={downloadCockpitCsv}
            style={{
              padding: "10px 18px",
              borderRadius: 6,
              background: "linear-gradient(135deg, #c9a84c, #e2c27d)",
              border: "none",
              color: "#0C1825",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(201,168,76,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>📊 Gesamtes Cockpit als Excel (.csv) herunterladen</span>
          </button>
        )}
      </div>

      {/* Regler-Grid (Ebene 1 bis 4) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 28 }}>
        {/* Spalte 1: Unternehmen & Holding */}
        <div style={{ background: "rgba(10,15,30,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2c27d", marginBottom: 14 }}>
            1. Unternehmen &amp; Holding (§ 8b KStG)
          </div>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>GmbH-Gewinn vor Steuern</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{gmbhGewinn.toLocaleString("de-DE")} €</span>
            </div>
            <input type="range" min={50000} max={1000000} step={25000} value={gmbhGewinn} onChange={e => setGmbhGewinn(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>Geschäftsführer-Gehalt (GGF)</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{ggfGehalt.toLocaleString("de-DE")} €</span>
            </div>
            <input type="range" min={30000} max={250000} step={5000} value={ggfGehalt} onChange={e => setGgfGehalt(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>

          <label style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>Holding Start-Depot</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{holdingDepotStart.toLocaleString("de-DE")} €</span>
            </div>
            <input type="range" min={25000} max={1500000} step={25000} value={holdingDepotStart} onChange={e => setHoldingDepotStart(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>
        </div>

        {/* Spalte 2: Privatsphäre & Vorsorge */}
        <div style={{ background: "rgba(10,15,30,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2c27d", marginBottom: 14 }}>
            2. Privatsphäre &amp; Vorsorge (EStG)
          </div>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>Rürup-Vorsorgebeitrag (§ 10)</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{ruerupBeitrag.toLocaleString("de-DE")} €</span>
            </div>
            <input type="range" min={0} max={30000} step={2500} value={ruerupBeitrag} onChange={e => setRuerupBeitrag(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>Privates Wertpapierdepot</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{privatDepot.toLocaleString("de-DE")} €</span>
            </div>
            <input type="range" min={10000} max={500000} step={10000} value={privatDepot} onChange={e => setPrivatDepot(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>

          <label style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>Krypto (Haltefrist &gt; 1 J. § 23)</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{kryptoPrivat.toLocaleString("de-DE")} €</span>
            </div>
            <input type="range" min={0} max={250000} step={5000} value={kryptoPrivat} onChange={e => setKryptoPrivat(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>
        </div>

        {/* Spalte 3: Rendite & Immobilien */}
        <div style={{ background: "rgba(10,15,30,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2c27d", marginBottom: 14 }}>
            3. Rendite &amp; Immobilien (§ 7 &amp; § 9 GewStG)
          </div>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>Aktien- / ETF-Rendite p.a.</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{aktienRendite.toFixed(1)} %</span>
            </div>
            <input type="range" min={3} max={12} step={0.5} value={aktienRendite} onChange={e => setAktienRendite(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
              <span>Immobilienwert</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#c9a84c", fontWeight: 600 }}>{immoWert.toLocaleString("de-DE")} €</span>
            </div>
            <input type="range" min={100000} max={1500000} step={50000} value={immoWert} onChange={e => setImmoWert(Number(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
          </label>

          <div>
            <div style={{ fontSize: 12, color: "#cdc6be", marginBottom: 6 }}>Immobilien-Haltestruktur:</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setImmoStruktur("privat")}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: immoStruktur === "privat" ? "#c9a84c" : "rgba(255,255,255,0.1)",
                  background: immoStruktur === "privat" ? "rgba(201,168,76,0.2)" : "transparent",
                  color: immoStruktur === "privat" ? "#e2c27d" : "#a89f94",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Privat (§ 23 EStG: 10 J. steuerfrei)
              </button>
              <button
                type="button"
                onClick={() => setImmoStruktur("vvgmbh")}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: immoStruktur === "vvgmbh" ? "#c9a84c" : "rgba(255,255,255,0.1)",
                  background: immoStruktur === "vvgmbh" ? "rgba(201,168,76,0.2)" : "transparent",
                  color: immoStruktur === "vvgmbh" ? "#e2c27d" : "#a89f94",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                VV-GmbH (15,8% KSt, 0% GewSt)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ergebnis-Cockpit Dashboard */}
      <div style={{ background: "rgba(10,18,36,0.85)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 10, padding: 22, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Live-Steueroptimierung &amp; Zinseszins-Ergebnis
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
          <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#a89f94" }}>Holding-Zufluss p.a.</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "#e2c27d", marginTop: 4 }}>
              {simulation.nettoZuflussHolding.toLocaleString("de-DE")} €
            </div>
            <div style={{ fontSize: 10, color: "#86efac", marginTop: 4 }}>
              Nur {simulation.steuerInHolding.toLocaleString("de-DE")} € Steuer (§ 8b KStG)
            </div>
          </div>

          <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#a89f94" }}>Rürup-Steuerersparnis p.a.</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "#4ade80", marginTop: 4 }}>
              +{simulation.ruerupErsparnis.toLocaleString("de-DE")} €
            </div>
            <div style={{ fontSize: 10, color: "#cdc6be", marginTop: 4 }}>
              Grenzsteuersatz: {simulation.grenzsteuersatz} %
            </div>
          </div>

          <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#a89f94" }}>Holding-Endvermögen (20 J.)</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "#e2c27d", marginTop: 4 }}>
              {simulation.holdingGesamtvermoegen20.toLocaleString("de-DE")} €
            </div>
            <div style={{ fontSize: 10, color: "#a89f94", marginTop: 4 }}>
              Thesauriert zu ~1,5 % Steuer
            </div>
          </div>

          <div style={{ padding: "12px 14px", background: "rgba(201,168,76,0.1)", borderRadius: 6, border: "1px solid rgba(201,168,76,0.3)" }}>
            <div style={{ fontSize: 11, color: "#e2c27d", fontWeight: 600 }}>Gesamt-Mehrwert Struktur (20 J.)</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 800, color: "#4ade80", marginTop: 4 }}>
              +{simulation.gesamtvorteilStruktur.toLocaleString("de-DE")} €
            </div>
            <div style={{ fontSize: 10, color: "#cdc6be", marginTop: 4 }}>
              Vorteil gegenüber rein privater Struktur
            </div>
          </div>
        </div>

        {/* 20-Jahres-Gegenüberstellung */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(6,10,20,0.6)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ fontSize: 12, color: "#a89f94" }}>Gesamtvermögen mit Kontolage-Architektur (nach 20 Jahren): </span>
            <strong style={{ fontFamily: "var(--font-mono)", color: "#e2c27d", fontSize: 14 }}>{simulation.optimiertGesamt20.toLocaleString("de-DE")} €</strong>
          </div>
          <div>
            <span style={{ fontSize: 12, color: "#a89f94" }}>Ohne Holding &amp; Optimierung: </span>
            <span style={{ fontFamily: "var(--font-mono)", color: "#a89f94", fontSize: 14 }}>{simulation.unoptimiertGesamt20.toLocaleString("de-DE")} €</span>
          </div>
        </div>
      </div>

      {/* Rechtlicher Absicherungs-Hinweis */}
      <div style={{ padding: "14px 18px", background: "rgba(6,9,18,0.7)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ fontSize: 11, color: "#a89f94", lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: "#cdc6be" }}>Rechtlicher Hinweis &amp; Compliance (WpHG § 2 Abs. 8 Nr. 10 &amp; StBerG):</strong> Dieses Simulator-Cockpit führt rein mathematische Modellrechnungen auf Basis geltender steuerrechtlicher Rahmenbedingungen (EStG, KStG, GewStG) durch. Es werden keine individuellen Kauf- oder Verkaufsempfehlungen abgegeben und keine persönliche Anlage- oder Steuerberatung erbracht. Alle Szenarien dienen der strukturellen Finanzbildung. Für individuelle Gestaltungsbeschlüsse konsultieren Sie bitte einen zugelassenen Steuerberater oder Rechtsanwalt.{" "}
          <Link to="/transparenz" style={{ color: "#c9a84c", textDecoration: "none" }}>Transparenz-Grundsätze →</Link>
        </p>
      </div>
    </div>
  );
}
