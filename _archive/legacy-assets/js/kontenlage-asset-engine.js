/**
 * Kontenlage — Asset Classes, Archetype Profiler & Financial Simulator Engine v6.0
 * BaFin & WpHG § 2 compliant financial education layer
 */

(function () {
  'use strict';

  // 1. Asset Classes Taxonomy Database
  const ASSET_CLASSES = {
    tagesgeld: {
      id: 'tagesgeld',
      name: 'Tagesgeld & Festgeld',
      category: 'TradFi / Geldmarkt',
      icon: '🏦',
      color: '#2E6B48',
      yieldRange: '2,5% – 3,75% p.a.',
      riskLevel: 'Sehr Gering (Einlagensicherung 100.000 €)',
      liquidity: 'Tagesgeld: Täglich / Festgeld: 3–36 Monate',
      horizon: 'Kurzfristig (< 2 Jahre)',
      tax: '§ 20 EStG Abgeltungsteuer (26,375%) – 1.000 € Freibetrag anrechenbar',
      platforms: ['Trade Republic (Cash-Zins)', 'Scalable Capital', 'ING', 'WeltSparen / Raisin'],
      fees: '0 € Kontoführung / 0 € Gebühren',
      risks: 'Kaufkraftverlust bei Inflation > Zinssatz (Opportunitätskosten). Kein Kursschwankungsrisiko.',
      calcFormula: (amount, rate, years) => amount * Math.pow(1 + rate / 100, years)
    },
    etf_world: {
      id: 'etf_world',
      name: 'Welt-Aktien-ETFs (MSCI World / All-World)',
      category: 'TradFi / Eigenkapital',
      icon: '🌍',
      color: '#10B981',
      yieldRange: '6,0% – 9,0% p.a. (historischer Schnitt)',
      riskLevel: 'Mittel bis Erhöht (Kursschwankungen möglich)',
      liquidity: 'Börsentäglich handelbar',
      horizon: 'Langfristig (10–30+ Jahre)',
      tax: '§ 20 EStG mit 30% Teilfreistellung (nur 70% der Gewinne steuerpflichtig)',
      platforms: ['Trade Republic', 'Scalable Capital', 'ING', 'Interactive Brokers', 'Finanzen.net Zero'],
      fees: 'TER 0,07% – 0,22% p.a. / Sparplan 0 € bei Neobrokern',
      risks: 'Zwischenzeitliche Buchverluste bis -40% in Krisenjahren. Bei 15+ Jahren Haltedauer historisch nie mit Verlust.',
      calcFormula: (monthly, rate, years) => {
        const r = rate / 100 / 12;
        const n = years * 12;
        return monthly * ((Math.pow(1 + r, n) - 1) / r);
      }
    },
    anleihen: {
      id: 'anleihen',
      name: 'Staats- & Unternehmensanleihen',
      category: 'TradFi / Fremdkapital',
      icon: '📜',
      color: '#0284C7',
      yieldRange: '2,8% – 4,8% p.a.',
      riskLevel: 'Gering bis Mittel (Bonitätsabhängig AAA–BBB)',
      liquidity: 'Börsentäglich handelbar / Bis Endfälligkeit',
      horizon: 'Mittelfristig (3–7 Jahre)',
      tax: '§ 20 EStG Abgeltungsteuer auf Zinskupon und Kursgewinne',
      platforms: ['Trade Republic (Bundesanleihen & Corporate)', 'Scalable', 'Comdirect'],
      fees: '1 € pro Trade / TER 0,10% bei Anleihen-ETFs',
      risks: 'Zinsänderungsrisiko (Kurs sinkt bei steigenden Leitzinsen), Ausfallrisiko des Emittenten.',
      calcFormula: (amount, rate, years) => amount * (1 + (rate / 100) * years)
    },
    immobilien: {
      id: 'immobilien',
      name: 'Immobilien (Vermietung & Sachwert)',
      category: 'Sachwert / Real Estate',
      icon: '🏠',
      color: '#A9762F',
      yieldRange: '3,0% – 5,5% Bruttomietrendite + Wertentwicklung',
      riskLevel: 'Mittel bis Hoch (Klumpenrisiko & Zinshebel)',
      liquidity: 'Sehr Gering (Illiquide, Monate bis Verkauf)',
      horizon: 'Sehr Langfristig (10–25 Jahre)',
      tax: '§ 23 EStG: Nach 10 Jahren 100% steuerfreier Verkaufsgewinn! AfA 2–3% jährlich absetzbar.',
      platforms: ['Direktkauf (Notar/Grundbuch)', 'Immo-ETFs / REITs (liquide Alternative)'],
      fees: 'Kaufnebenkosten 8%–12% (Grunderwerbsteuer, Notar, Makler)',
      risks: 'Leerstand, Mietnomaden, Reparaturstau, Zinsänderung bei Anschlussfinanzierung.',
      calcFormula: (kaufpreis, mieteMonat, zinsSatz) => (mieteMonat * 12) / kaufpreis * 100
    },
    gold_edelmetalle: {
      id: 'gold_edelmetalle',
      name: 'Physisches Gold & Edelmetalle',
      category: 'Sachwert / Krisenschutz',
      icon: '🪙',
      color: '#D4AF37',
      yieldRange: 'Historischer Kaufkrafterhalt (keine Zinsen/Dividenden)',
      riskLevel: 'Mittel (Schwankt in USD, kein Zinseszins)',
      liquidity: 'Hoch bei Händlern / Börsen',
      horizon: 'Langfristig (> 5 Jahre)',
      tax: '§ 23 EStG: Nach 1 Jahr Haltedauer VOLLSTÄNDIG STEUERFREI!',
      platforms: ['Pro Aurum', 'Degussa', 'Xetra-Gold / Euwax Gold (Wertpapier mit Lieferanspruch)'],
      fees: 'Spread zwischen An- und Verkauf (2%–5%) / Tresorgebühren',
      risks: 'Kein Cashflow, Währungsrisiko (Gold notiert in USD), Verwahrrisiko zu Hause.',
      calcFormula: (amount, growth, years) => amount * Math.pow(1 + growth / 100, years)
    },
    krypto_cefi_defi: {
      id: 'krypto_cefi_defi',
      name: 'Krypto & DeFi (Bitcoin, Ethereum, Staking)',
      category: 'Digitale Assets / CeFi & DeFi',
      icon: '⚡',
      color: '#8B5CF6',
      yieldRange: 'Staking 3%–5% p.a. / Hohe asymmetrische Kurspotenziale',
      riskLevel: 'Sehr Hoch / Spekulativ (Volatilität, Smart Contract Risiko)',
      liquidity: '24/7 Weltweit sekundenschnell',
      horizon: 'Langfristig (> 3–5 Jahre)',
      tax: '§ 23 EStG: Nach 1 Jahr Haltedauer 100% STEUERFREI! Staking-Erträge nach § 22 Nr. 3 EStG.',
      platforms: ['Bitvavo (BaFin lizenziert)', 'Bison (Börse Stuttgart)', 'Kraken', 'Aave / Lido (DeFi)'],
      fees: 'Trading-Fee 0,15%–1,5% / Gas-Fees im Netzwerk',
      risks: 'Totalverlustrisiko, Krypto-Hack-Risiko von Bridges, Private Key Verlust, regulatorische Eingriffe.',
      calcFormula: (amount, growth, years) => amount * Math.pow(1 + growth / 100, years)
    }
  };

  // 2. Archetype Quiz Decision Tree
  const ARCHETYPES = {
    sicherheits_sparer: {
      title: '🛡️ Sicherheits-Pufferer & Notgroschen-Meister',
      description: 'Priorität: 100% Kapitalerhalt, Einlagensicherung und sofortige Verfügbarkeit für unvorhergesehene Ausgaben.',
      allocation: '70% Tagesgeld / 30% Festgeld (Treppenstrategie)',
      primaryAssets: ['tagesgeld', 'anleihen'],
      warning: 'Achte auf den realen Kaufkraftverlust bei Inflation.'
    },
    pantoffel_investor: {
      title: '⚖️ Ausgewogener Pantoffel-Investor',
      description: 'Priorität: Solider Vermögensaufbau mit moderatem Risiko nach Stiftung-Warentest-Vorbild.',
      allocation: '50% Welt-Aktien-ETF (MSCI World) / 50% Tages-/Festgeld',
      primaryAssets: ['etf_world', 'tagesgeld', 'gold_edelmetalle'],
      warning: 'Disziplinierter Sparplan schlägt Markt-Timing.'
    },
    dynamischer_chancenfinder: {
      title: '🚀 Dynamischer Zukunfts- & Multiclasse-Investor',
      description: 'Priorität: Maximaler Zinseszins über 15+ Jahre mit breiter Streuung über globale Produktivkraft und Sachwerte.',
      allocation: '75% Welt-ETF / 10% Gold / 10% Immobilien-REITs / 5% Krypto',
      primaryAssets: ['etf_world', 'immobilien', 'gold_edelmetalle', 'krypto_cefi_defi'],
      warning: 'Kursschwankungen in Krisen gelassen aussitzen.'
    }
  };

  function KontenlageAssetEngine() {
    this.currentAsset = 'etf_world';
  }

  // Render Asset Selector & Deep-Dive Hub
  KontenlageAssetEngine.prototype.renderAssetHub = function (containerId) {
    const el = document.getElementById(containerId || 'assetHubContainer');
    if (!el) return;

    const navButtons = Object.values(ASSET_CLASSES).map(a => `
      <button class="calc-tab ${a.id === this.currentAsset ? 'active' : ''}" onclick="window.assetEngine.selectAsset('${a.id}')">
        ${a.icon} ${a.name}
      </button>
    `).join('');

    const active = ASSET_CLASSES[this.currentAsset];

    el.innerHTML = `
      <div class="statement" style="margin-top: 24px;">
        <div class="calc-tabs" style="overflow-x: auto;">
          ${navButtons}
        </div>

        <div class="statement-head">
          <span><span class="dot"></span>Anlageklassen-Kompass: ${active.category}</span>
          <span style="color: ${active.color}; font-weight: 700;">${active.yieldRange}</span>
        </div>

        <div class="statement-body">
          <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 32px;">
            <!-- Left: Info & Matrix -->
            <div>
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 2.2rem;">${active.icon}</span>
                <div>
                  <h3 style="margin: 0; font-size: 1.4rem; color: var(--ink);">${active.name}</h3>
                  <span style="font-size: 0.78rem; font-family: 'IBM Plex Mono', monospace; color: var(--ink-soft);">${active.category}</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 16px;">
                <div class="posten"><span class="label">⚡ Risikoprofil:</span><span class="value" style="color: var(--ink);">${active.riskLevel}</span></div>
                <div class="posten"><span class="label">⏳ Optimaler Zeithorizont:</span><span class="value">${active.horizon}</span></div>
                <div class="posten"><span class="label">💧 Liquidität / Verfügbarkeit:</span><span class="value">${active.liquidity}</span></div>
                <div class="posten"><span class="label">💸 Typische Gebühren:</span><span class="value" style="color: var(--positive);">${active.fees}</span></div>
              </div>

              <!-- Tax & Legal Badge -->
              <div style="margin-top: 18px; padding: 14px; background: #F4F1EA; border-radius: var(--radius); border-left: 3px solid var(--gold);">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px;">⚖️ Steuerliche Einordnung (DACH):</div>
                <div style="font-size: 0.82rem; color: var(--ink-soft); line-height: 1.5;">${active.tax}</div>
              </div>

              <!-- Platforms -->
              <div style="margin-top: 14px;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--ink-soft); margin-bottom: 6px;">🏦 Etablierte Plattformen & Broker:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${active.platforms.map(p => `<span class="badge" style="background: var(--paper); border: 1px solid var(--line); color: var(--ink); padding: 3px 8px; font-size: 0.75rem; border-radius: 3px;">${p}</span>`).join('')}
                </div>
              </div>
            </div>

            <!-- Right: Interactive Simulator for this Asset -->
            <div style="background: #FAF8F3; border: 1px solid var(--line); border-radius: var(--radius); padding: 20px;">
              <h4 style="font-size: 1.1rem; margin-bottom: 14px; color: var(--ink);">📊 Dynamischer Zukunfts-Rechner</h4>
              
              <div class="calc-inputs" style="margin-bottom: 16px;">
                <label>Monatlicher Sparbetrag (€):</label>
                <input type="number" id="simMonthly" value="250" step="50" oninput="window.assetEngine.recalcSimulator()">

                <label>Laufzeit in Jahren:</label>
                <input type="number" id="simYears" value="15" min="1" max="40" oninput="window.assetEngine.recalcSimulator()">

                <label>Angenommene Rendite p.a. (%):</label>
                <input type="number" id="simRate" value="7.0" step="0.5" oninput="window.assetEngine.recalcSimulator()">
              </div>

              <div style="border-top: 1px solid var(--line); padding-top: 12px;">
                <div class="posten"><span class="label">Eingezahltes Eigenkapital:</span><span class="value" id="simInvested">45.000 €</span></div>
                <div class="posten"><span class="label">Reine Zins-/Kursgewinne:</span><span class="value" id="simGains" style="color: var(--positive);">+34.238 €</span></div>
                <div class="posten total"><span class="label">Gesamtvermögen nach Laufzeit:</span><span class="value" id="simTotal" style="color: var(--gold);">79.238 €</span></div>
              </div>

              <div style="font-size: 0.72rem; color: var(--ink-soft); margin-top: 12px; line-height: 1.4;">
                * Rechnerische Modellierung unter Annahme konstanter Wertentwicklung vor Steuern. Keine Renditegarantie.
              </div>
            </div>
          </div>

          <!-- Bottom Warning / Prevention Box -->
          <div style="margin-top: 24px; padding: 14px 18px; background: rgba(192, 86, 33, 0.08); border-radius: var(--radius); border-left: 3px solid var(--warning);">
            <strong style="color: var(--warning); font-size: 0.82rem;">🚨 Worauf man vorausschauend achten muss (Risikofaktoren):</strong>
            <p style="margin: 4px 0 0; font-size: 0.82rem; color: var(--ink-soft); line-height: 1.5;">${active.risks}</p>
          </div>
        </div>
      </div>
    `;

    this.recalcSimulator();
  };

  KontenlageAssetEngine.prototype.selectAsset = function (assetId) {
    this.currentAsset = assetId;
    this.renderAssetHub();
  };

  KontenlageAssetEngine.prototype.recalcSimulator = function () {
    const monthly = parseFloat(document.getElementById('simMonthly')?.value || 250);
    const years = parseFloat(document.getElementById('simYears')?.value || 15);
    const rate = parseFloat(document.getElementById('simRate')?.value || 7.0);

    const invested = monthly * 12 * years;
    const r = rate / 100 / 12;
    const n = years * 12;
    const total = monthly * ((Math.pow(1 + r, n) - 1) / r);
    const gains = total - invested;

    const elInvested = document.getElementById('simInvested');
    const elGains = document.getElementById('simGains');
    const elTotal = document.getElementById('simTotal');

    if (elInvested) elInvested.textContent = Math.round(invested).toLocaleString('de-DE') + ' €';
    if (elGains) elGains.textContent = '+' + Math.round(gains).toLocaleString('de-DE') + ' €';
    if (elTotal) elTotal.textContent = Math.round(total).toLocaleString('de-DE') + ' €';
  };

  // 3. Interactive Archetype Profiler Modal
  KontenlageAssetEngine.prototype.openArchetypeModal = function () {
    let modal = document.getElementById('archetypeModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'archetypeModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 600px;">
        <button class="modal-close" onclick="document.getElementById('archetypeModal').style.display='none'">×</button>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 2.2rem;">🧭</span>
          <h3 style="font-size: 1.4rem; color: var(--ink); margin: 6px 0 2px;">Finde dein Anlage-Profil (3 Dimensionen)</h3>
          <p style="font-size: 0.82rem; color: var(--ink-soft); margin: 0;">Objektives Matching nach Anlageziel, Horizont und Risikobereitschaft.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Dimension 1 -->
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px;">1. Dein primäres Anlageziel:</label>
            <select id="quizGoal" style="width: 100%; padding: 10px; border-radius: var(--radius); border: 1px solid var(--line); font-family: inherit;">
              <option value="notgroschen">🛡️ Notgroschen & Substanzerhalt (Sicherheit vor Rendite)</option>
              <option value="sparplan" selected>📈 Stetiger Vermögensaufbau mit monatlichem Sparplan</option>
              <option value="altersvorsorge">🏖️ Langfristige Altersvorsorge / Finanzielle Freiheit</option>
            </select>
          </div>

          <!-- Dimension 2 -->
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px;">2. Dein geplanter Anlagehorizont:</label>
            <select id="quizHorizon" style="width: 100%; padding: 10px; border-radius: var(--radius); border: 1px solid var(--line); font-family: inherit;">
              <option value="short">Kurzfristig (< 2 Jahre – Geld wird bald gebraucht)</option>
              <option value="mid">Mittelfristig (3–7 Jahre – z.B. Immobilieneigenkapital)</option>
              <option value="long" selected>Langfristig (10–30+ Jahre – Zeit arbeitet für mich)</option>
            </select>
          </div>

          <!-- Dimension 3 -->
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px;">3. Deine Risikobereitschaft bei Kursschwankungen:</label>
            <select id="quizRisk" style="width: 100%; padding: 10px; border-radius: var(--radius); border: 1px solid var(--line); font-family: inherit;">
              <option value="low">Niedrig: Buchverluste bereiten mir schlaflose Nächte</option>
              <option value="med" selected>Moderat: Vorübergehende Schwankungen von 10–20% sind in Ordnung</option>
              <option value="high">Hoch: Volatilität ist der Preis für hohe langfristige Renditen</option>
            </select>
          </div>
        </div>

        <button class="btn-primary" style="width: 100%; padding: 14px; margin-top: 24px; background: var(--gold); color: #FFF;" onclick="window.assetEngine.calculateArchetype()">
          🎯 Profil jetzt ermitteln & Struktur ansehen →
        </button>

        <div id="archetypeResult" style="display: none; margin-top: 20px; padding: 18px; background: #FAF8F3; border-radius: var(--radius); border: 1px solid var(--line);"></div>
      </div>
    `;

    modal.style.display = 'flex';
  };

  KontenlageAssetEngine.prototype.calculateArchetype = function () {
    const goal = document.getElementById('quizGoal')?.value;
    const horizon = document.getElementById('quizHorizon')?.value;
    const risk = document.getElementById('quizRisk')?.value;

    let profile = ARCHETYPES.pantoffel_investor;
    if (goal === 'notgroschen' || horizon === 'short' || risk === 'low') {
      profile = ARCHETYPES.sicherheits_sparer;
    } else if (horizon === 'long' && risk === 'high') {
      profile = ARCHETYPES.dynamischer_chancenfinder;
    }

    const res = document.getElementById('archetypeResult');
    if (!res) return;

    res.innerHTML = `
      <div style="border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 12px;">
        <span class="badge" style="background: var(--gold); color: #FFF; font-size: 0.72rem; padding: 2px 8px; border-radius: 2px;">ERGEBNIS</span>
        <h4 style="margin: 6px 0 4px; font-size: 1.15rem; color: var(--ink);">${profile.title}</h4>
        <p style="font-size: 0.84rem; color: var(--ink-soft); margin: 0;">${profile.description}</p>
      </div>

      <div class="posten"><span class="label">Empfohlene Grundstruktur:</span><span class="value" style="color: var(--positive);">${profile.allocation}</span></div>
      <div style="font-size: 0.78rem; color: var(--warning); margin-top: 8px;">💡 ${profile.warning}</div>

      <div style="margin-top: 14px; text-align: center;">
        <button class="btn-lead" style="width: 100%; padding: 10px;" onclick="document.getElementById('archetypeModal').style.display='none'; document.getElementById('assetHubContainer').scrollIntoView();">
          Zur passenden Anlageklassen-Analyse →
        </button>
      </div>
    `;
    res.style.display = 'block';
  };

  window.assetEngine = new KontenlageAssetEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.assetEngine.renderAssetHub();
  });

})();
