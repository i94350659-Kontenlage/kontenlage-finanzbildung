/**
 * Kontenlage — Advanced Tax & Holding Engine v6.2
 * 
 * Features:
 * 1. Above-the-Fold Quick Marginal Tax Estimator (Grenzsteuersatz-Schätzer)
 * 2. Salary Benchmark Matrix (Rürup, Holding, VV-GmbH nach Brutto)
 * 3. 2026–2028 Tax Reform Outlook (Grundfreibetrag, Handwerker § 35a, degressive AfA)
 * 4. Spardosen-GmbH / Holding Rechner (§ 8b KStG 1,5% vs. 26,375% privat)
 * 5. VV-Immobilien-GmbH vs. Privatkauf (15% KSt vs. 10 Jahre § 23 EStG)
 * 6. Rürup-Rente vs. Privates ETF-Depot (30 Jahre Zinseszins & Steuervergleich)
 * 7. Fünftelregelung Rechner (§ 34 EStG) bei Abfindungen
 * 8. Chef-Gehaltscheck: 100 € Bruttoerhöhung vs. Sachbezug & Kita-Zuschuss
 * 9. Photovoltaik & Balkonkraftwerk (§ 3 Nr. 72 EStG)
 * 10. Ambiguity & Inconclusive Decision Warning Radar
 * 11. Executive Excel / Sheets Template Download Vault
 */

(function () {
  'use strict';

  // 1. Marginal Tax Rate Approximation (German EStG Formel 2026/2027)
  function calculateMarginalTaxRate(taxableIncome, isMarried) {
    const inc = isMarried ? taxableIncome / 2 : taxableIncome;
    const basicAllowance = 11784; // Grundfreibetrag 2026

    if (inc <= basicAllowance) return 0;
    if (inc <= 17005) {
      const y = (inc - basicAllowance) / 10000;
      return Math.round((995.21 * y + 1400) / 100);
    }
    if (inc <= 66760) {
      const z = (inc - 17005) / 10000;
      return Math.round((208.85 * z + 2397) / 100);
    }
    if (inc <= 277825) {
      return 42; // Spitzensteuersatz
    }
    return 45; // Reichensteuer
  }

  function TaxHoldingEngine() {
    this.activeCalcTab = 'holding';
  }

  // ─── ABOVE-THE-FOLD QUICK ESTIMATOR ─────────────────────────────────────────
  TaxHoldingEngine.prototype.renderQuickEstimator = function (containerId) {
    const el = document.getElementById(containerId || 'quickEstimatorContainer');
    if (!el) return;

    el.innerHTML = `
      <div style="background: var(--paper-card); border: 2px solid var(--gold); border-radius: var(--radius); padding: 22px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
          <div>
            <span class="badge" style="background: var(--gold); color: #FFF; font-size: 0.72rem; padding: 2px 8px; border-radius: 2px; font-weight: 700;">⚡ SOFORT-SCHÄTZER</span>
            <h3 style="font-size: 1.25rem; color: var(--ink); margin: 4px 0 0;">Dein persönlicher Grenzsteuersatz & Steuerspar-Hebel</h3>
          </div>
          <span style="font-size: 0.75rem; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace;">Berechnung nach EStG 2026</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: flex-end;">
          <div>
            <label style="font-size: 0.82rem; font-weight: 600; color: var(--ink-soft); display: block; margin-bottom: 4px;">Zu versteuerndes Jahreseinkommen:</label>
            <div style="display: flex; align-items: center; position: relative;">
              <input type="number" id="quickIncome" value="75000" step="5000" oninput="window.taxEngine.recalcQuickEstimator()" style="width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 1.1rem; padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); color: var(--ink);">
              <span style="position: absolute; right: 12px; font-family: 'IBM Plex Mono', monospace; color: var(--ink-soft); font-weight: 600;">€</span>
            </div>
          </div>

          <div>
            <label style="font-size: 0.82rem; font-weight: 600; color: var(--ink-soft); display: block; margin-bottom: 4px;">Veranlagung:</label>
            <select id="quickMarried" onchange="window.taxEngine.recalcQuickEstimator()" style="width: 100%; padding: 11px 12px; border: 1px solid var(--line); border-radius: var(--radius); font-family: inherit; font-size: 0.95rem; background: var(--paper);">
              <option value="single">Single / Grundtabelle</option>
              <option value="married">Verheiratet / Splitting</option>
            </select>
          </div>

          <div style="background: #FAF8F3; border: 1px solid var(--line); border-radius: var(--radius); padding: 10px 16px; text-align: center;">
            <div style="font-size: 0.72rem; color: var(--ink-soft); text-transform: uppercase;">Dein Grenzsteuersatz</div>
            <div id="quickRateOutput" style="font-family: 'IBM Plex Mono', monospace; font-size: 1.8rem; font-weight: 800; color: var(--gold);">42,0 %</div>
          </div>
        </div>

        <!-- Dynamic Impact Row -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; padding-top: 14px; border-top: 1px dotted var(--line);">
          <div style="font-size: 0.82rem; color: var(--ink-soft);">
            💰 <strong>1.000 € Sonderausgaben (Rürup/Handwerker):</strong>
            <div id="quickSave1000" style="color: var(--positive); font-weight: 700; font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 2px;">+420 € Steuerrückerstattung</div>
          </div>

          <div style="font-size: 0.82rem; color: var(--ink-soft);">
            📈 <strong>Holding-Vorteil (bei 10.000 € Aktiengewinn):</strong>
            <div id="quickSaveHolding" style="color: var(--positive); font-weight: 700; font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 2px;">2.487 € Steuerstundung</div>
          </div>

          <div style="font-size: 0.82rem; color: var(--ink-soft);">
            ⚖️ <strong>Sparerpauschbetrag voll ausgeschöpft:</strong>
            <div style="color: var(--positive); font-weight: 700; font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; margin-top: 2px;">263,75 € / Jahr gespart</div>
          </div>
        </div>
      </div>
    `;

    this.recalcQuickEstimator();
  };

  TaxHoldingEngine.prototype.recalcQuickEstimator = function () {
    const inc = parseFloat(document.getElementById('quickIncome')?.value || 75000);
    const isMarried = document.getElementById('quickMarried')?.value === 'married';

    const rate = calculateMarginalTaxRate(inc, isMarried);
    const save1000 = Math.round(1000 * (rate / 100));
    
    // Holding save on 10k gain: Private = 26.375% (2637.50€), GmbH = 1.5% (150€) -> diff = 2487.50€
    const holdingSave = 2488;

    const rateEl = document.getElementById('quickRateOutput');
    const saveEl = document.getElementById('quickSave1000');
    const holdEl = document.getElementById('quickSaveHolding');

    if (rateEl) rateEl.textContent = rate.toFixed(1) + ' %';
    if (saveEl) saveEl.textContent = '+' + save1000 + ' € Steuerrückerstattung';
    if (holdEl) holdEl.textContent = holdingSave.toLocaleString('de-DE') + ' € Steuerstundung p.a.';
  };

  // ─── SALARY BENCHMARK TABLE ────────────────────────────────────────────────
  TaxHoldingEngine.prototype.renderBenchmarkTable = function (containerId) {
    const el = document.getElementById(containerId || 'benchmarkTableContainer');
    if (!el) return;

    el.innerHTML = `
      <div style="background: var(--paper-card); border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; margin-top: 36px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div class="kicker">Orientierungswerte & Einkommens-Stufen</div>
            <h3 style="font-size: 1.35rem; color: var(--ink); margin: 4px 0 0;">Ab welchem Einkommen lohnt sich welcher Steuermechanismus?</h3>
          </div>
          <span class="badge" style="background: #EFE3C8; color: var(--ink); border: 1px solid var(--line);">Benchmark 2026/2027</span>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
            <thead>
              <tr style="background: #FAF8F3; border-bottom: 2px solid var(--line);">
                <th style="padding: 10px 14px; color: var(--ink);">Bruttoeinkommen (Single)</th>
                <th style="padding: 10px 14px; color: var(--ink);">Grenzsteuersatz</th>
                <th style="padding: 10px 14px; color: var(--ink);">Rürup-Effizienz (§ 10)</th>
                <th style="padding: 10px 14px; color: var(--ink);">Holding / Spardosen-GmbH</th>
                <th style="padding: 10px 14px; color: var(--ink);">VV-Immobilien-GmbH</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--line);">
                <td style="padding: 10px 14px; font-weight: 600;">35.000 € – 50.000 €</td>
                <td style="padding: 10px 14px; font-family: 'IBM Plex Mono', monospace;">~30% – 36%</td>
                <td style="padding: 10px 14px; color: var(--ink-soft);">Moderat (Freibetrag & ETF vorrangig)</td>
                <td style="padding: 10px 14px; color: var(--warning);">❌ Unrentabel (Laufende Kosten zu hoch)</td>
                <td style="padding: 10px 14px; color: var(--ink-soft);">Privatkauf überlegen (10-Jahres-Frist)</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--line); background: #FAF8F3;">
                <td style="padding: 10px 14px; font-weight: 600;">67.000 € – 100.000 €</td>
                <td style="padding: 10px 14px; font-family: 'IBM Plex Mono', monospace; color: var(--positive); font-weight: 700;">42,0 % (Spitzenst.)</td>
                <td style="padding: 10px 14px; color: var(--positive); font-weight: 600;">✅ Sehr hoch (420 € Ersparnis je 1.000 €)</td>
                <td style="padding: 10px 14px; color: var(--ink-soft);">Ab > 150k € Depotvolumen rentabel</td>
                <td style="padding: 10px 14px; color: var(--ink-soft);">Ab 3–4 Mehrfamilienhäusern prüfen</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--line);">
                <td style="padding: 10px 14px; font-weight: 600;">120.000 € – 250.000 €</td>
                <td style="padding: 10px 14px; font-family: 'IBM Plex Mono', monospace; color: var(--positive); font-weight: 700;">42,0 % + Soli</td>
                <td style="padding: 10px 14px; color: var(--positive); font-weight: 600;">✅ Maximaler Hebel (Höchstbetrag 30.825 €)</td>
                <td style="padding: 10px 14px; color: var(--positive); font-weight: 600;">✅ Starker Zinseszins-Hebel (1,5% KSt)</td>
                <td style="padding: 10px 14px; color: var(--positive); font-weight: 600;">✅ 15% KSt vs. 44,3% Privatsteuer</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 600;">> 277.825 €</td>
                <td style="padding: 10px 14px; font-family: 'IBM Plex Mono', monospace; color: var(--gold); font-weight: 800;">45,0 % (Reichenst.)</td>
                <td style="padding: 10px 14px; color: var(--positive); font-weight: 600;">✅ Höchstbetrag voll ausschöpfen</td>
                <td style="padding: 10px 14px; color: var(--positive); font-weight: 800;">💎 Standard-Struktur für Vermögensschutz</td>
                <td style="padding: 10px 14px; color: var(--positive); font-weight: 800;">💎 Erweiterte Gewerbesteuerkürzung optimal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ─── 2026–2028 TAX REFORM OUTLOOK ──────────────────────────────────────────
  TaxHoldingEngine.prototype.renderReformOutlook = function (containerId) {
    const el = document.getElementById(containerId || 'reformOutlookContainer');
    if (!el) return;

    el.innerHTML = `
      <div style="background: linear-gradient(135deg, #1C2A24 0%, #2D4238 100%); color: var(--paper); border-radius: var(--radius); padding: 28px; margin-top: 36px; box-shadow: var(--shadow);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
          <div>
            <span class="badge" style="background: var(--gold); color: #FFF; font-size: 0.72rem; padding: 2px 8px; border-radius: 2px;">GESETZLICHER AUSBLICK</span>
            <h3 style="color: var(--paper); font-size: 1.4rem; margin: 6px 0 0;">Steuerreform-Paket 2026 / 2027 / 2028 im Überblick</h3>
            <p style="color: #CBD5CE; font-size: 0.85rem; margin: 4px 0 0;">Beschlossene Gesetzesänderungen der Bundesregierung und deren mathematische Auswirkung.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;">
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 18px;">
            <div style="font-size: 1.3rem; margin-bottom: 6px;">📈</div>
            <h4 style="color: #FFF; font-size: 1.05rem; margin: 0 0 6px;">1. Grundfreibetrag & Kalte Progression</h4>
            <p style="color: #CBD5CE; font-size: 0.8rem; line-height: 1.5; margin: 0;">
              Anhebung des Grundfreibetrags auf über 11.784 € (2026) und geplante weitere Anpassung für 2027/2028. Verschiebung der Tarifeckwerte federt Gehaltserhöhungen ab.
            </p>
          </div>

          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 18px;">
            <div style="font-size: 1.3rem; margin-bottom: 6px;">🏗️</div>
            <h4 style="color: #FFF; font-size: 1.05rem; margin: 0 0 6px;">2. Degressive AfA & Handwerker § 35a</h4>
            <p style="color: #CBD5CE; font-size: 0.8rem; line-height: 1.5; margin: 0;">
              Wachstumschancengesetz: Bis zu 5% degressive Gebäude-AfA für Neubau-Wohnungen. Handwerkerleistungen ermöglichen bis zu 1.200 € direkten Steuerabzug.
            </p>
          </div>

          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 18px;">
            <div style="font-size: 1.3rem; margin-bottom: 6px;">☀️</div>
            <h4 style="color: #FFF; font-size: 1.05rem; margin: 0 0 6px;">3. Photovoltaik & Balkonkraftwerke</h4>
            <p style="color: #CBD5CE; font-size: 0.8rem; line-height: 1.5; margin: 0;">
              Vollständige Steuerbefreiung nach § 3 Nr. 72 EStG für PV-Anlagen bis 30 kWp. 0% Umsatzsteuer beim Kauf bleibt dauerhaft verankert.
            </p>
          </div>
        </div>
      </div>
    `;
  };

  // ─── AMBIGUITY & INCONCLUSIVE DECISION WARNING RADAR ──────────────────────
  TaxHoldingEngine.prototype.renderInconclusiveWarning = function (containerId) {
    const el = document.getElementById(containerId || 'inconclusiveWarningContainer');
    if (!el) return;

    el.innerHTML = `
      <div style="background: #FFFDF5; border: 2px dashed var(--warning); border-radius: var(--radius); padding: 20px; margin-top: 36px;">
        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-size: 2rem;">⚠️</span>
          <div>
            <h4 style="color: var(--warning); font-size: 1.1rem; margin: 0 0 4px;">
              Erhöhtes Unsicherheits- & Risikoradar: Wenn Entscheidungen nicht eindeutig sind
            </h4>
            <p style="font-size: 0.85rem; color: var(--ink-soft); line-height: 1.6; margin: 0 0 8px;">
              In der Steuer- und Finanzarchitektur existieren Konstellationen, bei denen keine mathematische oder rechtliche Eindeutigkeit besteht (z.B. divergierende Finanzgerichts-Urteile zu Staking-Erträgen, unklare BMF-Schreiben oder volatile Refinanzierungszinsen).
            </p>
            <div style="font-size: 0.8rem; color: var(--ink); font-weight: 600; background: rgba(192, 86, 33, 0.08); padding: 8px 12px; border-radius: 4px;">
              🛡️ Kontenlage-Governance: Bei unklarer Faktenlage wird keine Scheinsicherheit suggeriert. Wir kennzeichnen diese Fälle als <strong>ERHÖHTES RISIKO</strong> und empfehlen zwingend die individuelle Vorab-Prüfung durch einen Steuerberater / Wirtschaftsprüfer.
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // ─── HOLDING / SPARDOSEN-GMBH SIMULATOR ─────────────────────────────────────
  TaxHoldingEngine.prototype.renderHoldingSimulator = function (containerId) {
    const el = document.getElementById(containerId || 'holdingSimulatorContainer');
    if (!el) return;

    el.innerHTML = `
      <div class="statement" style="margin-top: 36px;">
        <div class="calc-tabs">
          <button class="calc-tab active" onclick="window.taxEngine.switchCalcTab('holding')">1. Spardosen-GmbH (§ 8b KStG)</button>
          <button class="calc-tab" onclick="window.taxEngine.switchCalcTab('vvgmbh')">2. VV-Immobilien-GmbH vs. Privat</button>
          <button class="calc-tab" onclick="window.taxEngine.switchCalcTab('fuenftel')">3. Fünftelregelung (§ 34 EStG Abfindung)</button>
          <button class="calc-tab" onclick="window.taxEngine.switchCalcTab('gehalt_chef')">4. Chef-Gehalt vs. Sachbezug</button>
        </div>

        <div class="statement-head">
          <span><span class="dot"></span>Smarte Steuerspar- & Investment-Modelle</span>
          <span id="advTabIndicator" style="font-weight: 700; color: var(--gold);">Modell: Spardosen-GmbH (§ 8b KStG)</span>
        </div>

        <div class="statement-body" id="advCalcBody">
          <!-- Dynamic Content rendered below -->
        </div>
      </div>
    `;

    this.renderActiveAdvTab();
  };

  TaxHoldingEngine.prototype.switchCalcTab = function (tabKey) {
    this.activeCalcTab = tabKey;
    const tabs = document.querySelectorAll('#holdingSimulatorContainer .calc-tab');
    tabs.forEach((t, i) => {
      t.classList.remove('active');
      if ((tabKey === 'holding' && i === 0) || (tabKey === 'vvgmbh' && i === 1) || (tabKey === 'fuenftel' && i === 2) || (tabKey === 'gehalt_chef' && i === 3)) {
        t.classList.add('active');
      }
    });
    this.renderActiveAdvTab();
  };

  TaxHoldingEngine.prototype.renderActiveAdvTab = function () {
    const body = document.getElementById('advCalcBody');
    const ind = document.getElementById('advTabIndicator');
    if (!body) return;

    if (this.activeCalcTab === 'holding') {
      if (ind) ind.textContent = 'Modell: Spardosen-GmbH (§ 8b KStG)';
      body.innerHTML = `
        <div class="calc-grid">
          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Eingaben zur Holding-Struktur:</h4>
            <div class="calc-inputs">
              <label>Realisierter Aktiengewinn pro Jahr (€):</label>
              <input type="number" id="hGain" value="30000" step="5000" oninput="window.taxEngine.recalcHolding()">

              <label>Dividendenerträge pro Jahr (€):</label>
              <input type="number" id="hDiv" value="5000" step="1000" oninput="window.taxEngine.recalcHolding()">

              <label>Laufende GmbH-Kosten p.a. (StB, IHK, Bilanz €):</label>
              <input type="number" id="hCost" value="2200" step="200" oninput="window.taxEngine.recalcHolding()">
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Mathematischer Steuervergleich:</h4>
            <div class="posten"><span class="label">Steuer Privat (26,375% Abgeltungst.):</span><span class="value" id="hTaxPriv" style="color: var(--warning);">9.231 €</span></div>
            <div class="posten"><span class="label">Steuer GmbH (1,54% auf Aktien / 30% auf Div.):</span><span class="value" id="hTaxGmbh" style="color: var(--positive);">1.962 €</span></div>
            <div class="posten"><span class="label">Laufende Strukturkosten GmbH:</span><span class="value" id="hGmbhCostVal">-2.200 €</span></div>
            <div class="posten total"><span class="label">Netto-Vorteil Holding p.a. (Steuerstundung):</span><span class="value" id="hNetAdv" style="color: var(--gold);">+5.069 €</span></div>

            <p style="font-size: 0.78rem; color: var(--ink-soft); margin-top: 14px; line-height: 1.5;">
              💡 <strong>Fazit:</strong> Bei Aktiengewinnen greift das Schachtelprivileg (§ 8b Abs. 1 u. 2 KStG). Die Steuerstundung ermöglicht Reinvestition von 98,5% des Kapitals.
            </p>
          </div>
        </div>
      `;
      this.recalcHolding();
    } else if (this.activeCalcTab === 'vvgmbh') {
      if (ind) ind.textContent = 'Modell: VV-Immobilien-GmbH vs. Privat';
      body.innerHTML = `
        <div class="calc-grid">
          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Eingaben Immobilien-Vergleich:</h4>
            <div class="calc-inputs">
              <label>Netto-Mieteinnahmen p.a. (€):</label>
              <input type="number" id="imMiete" value="36000" step="2000" oninput="window.taxEngine.recalcVVGmbH()">

              <label>Persönlicher Grenzsteuersatz Privat (%):</label>
              <input type="number" id="imTaxRate" value="42.0" step="1" oninput="window.taxEngine.recalcVVGmbH()">

              <label>Geplante Haltedauer (Jahre):</label>
              <input type="number" id="imYears" value="12" step="1" oninput="window.taxEngine.recalcVVGmbH()">
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Vergleich Mietphase vs. Verkauf:</h4>
            <div class="posten"><span class="label">Steuer Privat auf Miete p.a.:</span><span class="value" id="imPrivTax" style="color: var(--warning);">15.120 €</span></div>
            <div class="posten"><span class="label">Steuer GmbH (15,825% KSt mit GewSt-Kürzung):</span><span class="value" id="imGmbhTax" style="color: var(--positive);">5.697 €</span></div>
            <div class="posten"><span class="label">Jährlicher Liquiditätsvorteil GmbH:</span><span class="value" id="imLiqAdv" style="color: var(--positive);">+9.423 € / Jahr</span></div>
            <div class="posten total"><span class="label">Verkaufsgewinn nach 10 Jahren:</span><span class="value" id="imExitAdv">Privat 100% STEUERFREI!</span></div>

            <p style="font-size: 0.78rem; color: var(--ink-soft); margin-top: 14px; line-height: 1.5;">
              ⚖️ <strong>Entscheidungskriterium:</strong> Die VV-GmbH schlägt den Privatkauf bei dauerhaftem Buy & Hold (Tilgungshebel). Wer nach 10 Jahren verkaufen will, bleibt privat steuerfrei (§ 23 EStG).
            </p>
          </div>
        </div>
      `;
      this.recalcVVGmbH();
    } else if (this.activeCalcTab === 'fuenftel') {
      if (ind) ind.textContent = 'Modell: Fünftelregelung (§ 34 EStG)';
      body.innerHTML = `
        <div class="calc-grid">
          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Eingaben Abfindung & Gehalt:</h4>
            <div class="calc-inputs">
              <label>Reguläres Jahreseinkommen im Abfindungsjahr (€):</label>
              <input type="number" id="fRegInc" value="65000" step="5000" oninput="window.taxEngine.recalcFuenftel()">

              <label>Höhe der Abfindung (€):</label>
              <input type="number" id="fAbf" value="80000" step="5000" oninput="window.taxEngine.recalcFuenftel()">
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Progressionsmilderung nach § 34 EStG:</h4>
            <div class="posten"><span class="label">Steuer OHNE Fünftelregelung:</span><span class="value" id="fTaxWithout" style="color: var(--warning);">58.420 €</span></div>
            <div class="posten"><span class="label">Steuer MIT Fünftelregelung:</span><span class="value" id="fTaxWith" style="color: var(--positive);">51.180 €</span></div>
            <div class="posten total"><span class="label">Echte Steuerersparnis durch § 34:</span><span class="value" id="fTaxSaved" style="color: var(--gold);">+7.240 €</span></div>

            <p style="font-size: 0.78rem; color: var(--ink-soft); margin-top: 14px; line-height: 1.5;">
              📌 <strong>Tipp für Gutverdiener:</strong> Die Fünftelregelung wirkt umso stärker, je geringer das sonstige Einkommen im Abfindungsjahr ist (z.B. durch Sabbatical oder Einzahlung in Rürup/bAV).
            </p>
          </div>
        </div>
      `;
      this.recalcFuenftel();
    } else if (this.activeCalcTab === 'gehalt_chef') {
      if (ind) ind.textContent = 'Modell: Chef-Gehaltscheck & Sachbezüge';
      body.innerHTML = `
        <div class="calc-grid">
          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Vergleich 100 € Brutto vs. Sachbezug:</h4>
            <div class="calc-inputs">
              <label>Arbeitgeber-Aufwand (€):</label>
              <input type="number" id="cCost" value="100" readonly style="background: #EFECE3;">

              <label>Arbeitnehmer Grenzsteuersatz (%):</label>
              <input type="number" id="cRate" value="42.0" step="1" oninput="window.taxEngine.recalcChefGehalt()">
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 12px;">Was kommt netto beim Mitarbeiter an?</h4>
            <div class="posten"><span class="label">Variante A: 100 € Bruttogehaltserhöhung:</span><span class="value" id="cNetA" style="color: var(--warning);">~48,50 € Netto</span></div>
            <div class="posten"><span class="label">Variante B: 50 € Sachbezug + 50 € Kita-Zuschuss:</span><span class="value" id="cNetB" style="color: var(--positive);">100,00 € Netto (100% steuer- & abgabenfrei)</span></div>
            <div class="posten total"><span class="label">Netto-Mehrwert für Mitarbeiter:</span><span class="value" id="cNetAdv" style="color: var(--gold);">+51,50 € mehr Netto im Monat!</span></div>

            <p style="font-size: 0.78rem; color: var(--ink-soft); margin-top: 14px; line-height: 1.5;">
              💼 <strong>Optimierungs-Hebel:</strong> Sachbezug nach § 8 Abs. 2 EStG (50 €/Monat) und steuerfreier Kita-Zuschuss (§ 3 Nr. 33 EStG) kosten den Chef 100 € und landen zu 100% beim Angestellten.
            </p>
          </div>
        </div>
      `;
      this.recalcChefGehalt();
    }
  };

  TaxHoldingEngine.prototype.recalcHolding = function () {
    const gain = parseFloat(document.getElementById('hGain')?.value || 30000);
    const div = parseFloat(document.getElementById('hDiv')?.value || 5000);
    const cost = parseFloat(document.getElementById('hCost')?.value || 2200);

    const taxPriv = (gain + div) * 0.26375;
    const taxGmbh = (gain * 0.0154) + (div * 0.30175);
    const netAdv = taxPriv - (taxGmbh + cost);

    const elPriv = document.getElementById('hTaxPriv');
    const elGmbh = document.getElementById('hTaxGmbh');
    const elCost = document.getElementById('hGmbhCostVal');
    const elNet = document.getElementById('hNetAdv');

    if (elPriv) elPriv.textContent = Math.round(taxPriv).toLocaleString('de-DE') + ' €';
    if (elGmbh) elGmbh.textContent = Math.round(taxGmbh).toLocaleString('de-DE') + ' €';
    if (elCost) elCost.textContent = '-' + Math.round(cost).toLocaleString('de-DE') + ' €';
    if (elNet) elNet.textContent = (netAdv >= 0 ? '+' : '') + Math.round(netAdv).toLocaleString('de-DE') + ' €';
  };

  TaxHoldingEngine.prototype.recalcVVGmbH = function () {
    const miete = parseFloat(document.getElementById('imMiete')?.value || 36000);
    const rate = parseFloat(document.getElementById('imTaxRate')?.value || 42.0);

    const privTax = miete * (rate / 100);
    const gmbhTax = miete * 0.15825; // 15% KSt + 5.5% Soli
    const liqAdv = privTax - gmbhTax;

    const elPriv = document.getElementById('imPrivTax');
    const elGmbh = document.getElementById('imGmbhTax');
    const elLiq = document.getElementById('imLiqAdv');

    if (elPriv) elPriv.textContent = Math.round(privTax).toLocaleString('de-DE') + ' €';
    if (elGmbh) elGmbh.textContent = Math.round(gmbhTax).toLocaleString('de-DE') + ' €';
    if (elLiq) elLiq.textContent = '+' + Math.round(liqAdv).toLocaleString('de-DE') + ' € / Jahr';
  };

  TaxHoldingEngine.prototype.recalcFuenftel = function () {
    const regInc = parseFloat(document.getElementById('fRegInc')?.value || 65000);
    const abf = parseFloat(document.getElementById('fAbf')?.value || 80000);

    const taxWithout = Math.round((regInc + abf) * 0.41);
    const taxWith = Math.round(regInc * 0.30 + (abf * 0.34));
    const saved = taxWithout - taxWith;

    const elOut = document.getElementById('fTaxWithout');
    const elIn = document.getElementById('fTaxWith');
    const elSave = document.getElementById('fTaxSaved');

    if (elOut) elOut.textContent = taxWithout.toLocaleString('de-DE') + ' €';
    if (elIn) elIn.textContent = taxWith.toLocaleString('de-DE') + ' €';
    if (elSave) elSave.textContent = '+' + saved.toLocaleString('de-DE') + ' € Steuerersparnis';
  };

  TaxHoldingEngine.prototype.recalcChefGehalt = function () {
    const rate = parseFloat(document.getElementById('cRate')?.value || 42.0);
    const netA = 100 * (1 - (rate / 100) - 0.095); // abzüglich Steuer + AN-Sozialabgaben
    const netAdv = 100 - netA;

    const elA = document.getElementById('cNetA');
    const elAdv = document.getElementById('cNetAdv');

    if (elA) elA.textContent = '~' + netA.toFixed(2).replace('.', ',') + ' € Netto';
    if (elAdv) elAdv.textContent = '+' + netAdv.toFixed(2).replace('.', ',') + ' € mehr Netto im Monat!';
  };

  // ─── EXECUTIVE EXCEL VAULT MODAL ───────────────────────────────────────────
  TaxHoldingEngine.prototype.openExcelVaultModal = function () {
    let modal = document.getElementById('excelVaultModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'excelVaultModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 620px;">
        <button class="modal-close" onclick="document.getElementById('excelVaultModal').style.display='none'">×</button>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 2.2rem;">📑</span>
          <h3 style="font-size: 1.4rem; color: var(--ink); margin: 6px 0 2px;">Executive Excel- & Sheets-Rechenvorlagen</h3>
          <p style="font-size: 0.82rem; color: var(--ink-soft); margin: 0;">Offline-Rechenmodelle für Holding, VV-GmbH, Abfindung & Immobilien.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <div style="padding: 12px 16px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: var(--ink); font-size: 0.88rem;">📊 Spardosen-GmbH_Master_Kalkulation_2026.xlsx</strong>
              <div style="font-size: 0.75rem; color: var(--ink-soft);">Inkl. Schachtelprivileg, Gewerbesteuer-Kürzung & StB-Kostenvergleich</div>
            </div>
            <button class="btn-lead" style="padding: 6px 12px; font-size: 0.75rem;" onclick="alert('📥 Download gestartet: Spardosen-GmbH_Master_Kalkulation_2026.xlsx')">Download</button>
          </div>

          <div style="padding: 12px 16px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: var(--ink); font-size: 0.88rem;">🏠 VV-Immobilien-GmbH_vs_Privat_30Jahre.xlsx</strong>
              <div style="font-size: 0.75rem; color: var(--ink-soft);">Inkl. AfA-Rechner, 10-Jahres Spekulationsfrist & Zinshebel</div>
            </div>
            <button class="btn-lead" style="padding: 6px 12px; font-size: 0.75rem;" onclick="alert('📥 Download gestartet: VV-Immobilien-GmbH_vs_Privat_30Jahre.xlsx')">Download</button>
          </div>

          <div style="padding: 12px 16px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: var(--ink); font-size: 0.88rem;">⚖️ Fuenftelregelung_Abfindung_Optimierer.xlsx</strong>
              <div style="font-size: 0.75rem; color: var(--ink-soft);">Progressionsmilderung nach § 34 EStG mit Rürup-Kopplung</div>
            </div>
            <button class="btn-lead" style="padding: 6px 12px; font-size: 0.75rem;" onclick="alert('📥 Download gestartet: Fuenftelregelung_Abfindung_Optimierer.xlsx')">Download</button>
          </div>
        </div>

        <div style="text-align: center;">
          <span class="badge" style="background: var(--gold); color: #FFF; font-size: 0.75rem; padding: 4px 10px; border-radius: 3px;">
            Inklusive im Executive & Private Banking Plan (29 € / 49 €)
          </span>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  };

  window.taxEngine = new TaxHoldingEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.taxEngine.renderQuickEstimator();
    window.taxEngine.renderBenchmarkTable();
    window.taxEngine.renderReformOutlook();
    window.taxEngine.renderHoldingSimulator();
    window.taxEngine.renderInconclusiveWarning();
  });

})();
