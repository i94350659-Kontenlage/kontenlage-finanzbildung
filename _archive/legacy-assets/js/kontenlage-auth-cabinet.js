/**
 * Kontenlage — Customer Cabinet, Auth & Subscription Engine v6.3
 * 4-Tier Subscription Architecture (0 € / 9 € / 29 € / 49 €)
 */

(function () {
  'use strict';

  const KONTENLAGE_PLANS = {
    free: {
      id: 'free',
      label: 'Free Starter 🌱',
      price: 0,
      priceLabel: 'Kostenlos',
      color: '#2E6B48',
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: 3,
        proSimulations: false,
        advancedSliders: false,
        taxMatrices: false,
        excelVault: false,
        deepResearch: false
      }
    },
    pro_investor: {
      id: 'pro_investor',
      label: 'Pro Investor 📈',
      price: 9,
      priceLabel: '9 € / Monat',
      color: '#10B981',
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: null,
        proSimulations: true,
        advancedSliders: true,
        taxMatrices: true,
        interestRadar: true,
        taxAlerts: true,
        excelVault: false,
        deepResearch: false
      }
    },
    executive_b2b: {
      id: 'executive_b2b',
      label: 'Executive & B2B 📑',
      price: 29,
      priceLabel: '29 € / Monat',
      color: '#0284C7',
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: null,
        proSimulations: true,
        advancedSliders: true,
        taxMatrices: true,
        interestRadar: true,
        taxAlerts: true,
        excelVault: true,
        holdingModels: true,
        deepResearch: false
      }
    },
    private_owner: {
      id: 'private_owner',
      label: 'Private Banking & Research 👑',
      price: 49,
      priceLabel: '49 € / Monat',
      color: '#D4AF37',
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: null,
        proSimulations: true,
        advancedSliders: true,
        taxMatrices: true,
        interestRadar: true,
        taxAlerts: true,
        excelVault: true,
        holdingModels: true,
        deepResearch: true,
        decisionJournal: true,
        protocolAudit: true
      }
    }
  };

  class KontenlageAuthCabinet {
    constructor() {
      this.currentUser = JSON.parse(localStorage.getItem('kontenlage_user') || 'null');
      this.notifications = JSON.parse(localStorage.getItem('kontenlage_notifs') || '[]');
      if (this.notifications.length === 0) {
        this.seedDemoNotifications();
      }
    }

    seedDemoNotifications() {
      this.notifications = [
        {
          id: 'n_ezb_rate',
          icon: '🏦',
          title: 'EZB Leitzins & Festgeld-Radar',
          body: 'Tagesgeld-Spitzenzinsen im EWR liegen stabil bei 3,50%–3,75% p.a. Gesetzliche Einlagensicherung bis 100.000 € beachten.',
          date: 'Heute',
          read: false
        },
        {
          id: 'n_tax_freibetrag',
          icon: '⚖️',
          title: 'Sparerpauschbetrag Erinnerung',
          body: 'Freistellungsaufträge bei Neobrokern und Banken bis 1.000 € (Single) / 2.000 € (Ehepaar) einrichten.',
          date: 'Gestern',
          read: false
        }
      ];
      localStorage.setItem('kontenlage_notifs', JSON.stringify(this.notifications));
    }

    isLoggedIn() {
      return !!this.currentUser;
    }

    showLoginModal() {
      this.renderModal('authModal', `
        <div class="modal-card" style="max-width: 440px;">
          <button class="modal-close" onclick="document.getElementById('authModal').style.display='none'">×</button>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 2.2rem;">🔐</span>
            <h3 style="font-size: 1.4rem; color: var(--ink); margin: 6px 0 2px;">Kunden-Kabinett Anmelden</h3>
            <p style="font-size: 0.82rem; color: var(--ink-soft); margin: 0;">Zugang zu deinen gespeicherten Steuer- & Anlage-Szenarien.</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
            <input type="email" id="klLoginEmail" placeholder="E-Mail Adresse" style="padding: 12px; border: 1px solid var(--line); border-radius: var(--radius); font-size: 0.95rem;">
            <input type="password" id="klLoginPass" placeholder="Passwort" style="padding: 12px; border: 1px solid var(--line); border-radius: var(--radius); font-size: 0.95rem;">
          </div>

          <button class="btn-primary" style="width: 100%; padding: 13px; background: var(--ink); color: var(--paper); font-weight: 600;" onclick="window.klCabinet.handleLogin()">
            🔓 Einloggen
          </button>

          <div style="text-align: center; margin-top: 14px; font-size: 0.82rem; color: var(--ink-soft);">
            Noch kein Kabinett? <a href="#" onclick="window.klCabinet.showRegisterModal()" style="color: var(--gold); font-weight: 700;">Jetzt kostenlos anlegen</a>
          </div>
        </div>
      `);
    }

    showRegisterModal(preselectedPlan) {
      const plan = preselectedPlan || 'free';
      this.renderModal('authModal', `
        <div class="modal-card" style="max-width: 500px;">
          <button class="modal-close" onclick="document.getElementById('authModal').style.display='none'">×</button>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 2.2rem;">🏛️</span>
            <h3 style="font-size: 1.4rem; color: var(--ink); margin: 6px 0 2px;">Kunden-Kabinett Anlegen</h3>
            <p style="font-size: 0.82rem; color: var(--ink-soft); margin: 0;">Wähle deinen passenden Kontenlage-Tarif.</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
            <input type="text" id="klRegName" placeholder="Dein Name" style="padding: 12px; border: 1px solid var(--line); border-radius: var(--radius); font-size: 0.95rem;">
            <input type="email" id="klRegEmail" placeholder="E-Mail Adresse" style="padding: 12px; border: 1px solid var(--line); border-radius: var(--radius); font-size: 0.95rem;">
            <input type="password" id="klRegPass" placeholder="Passwort (min. 8 Zeichen)" style="padding: 12px; border: 1px solid var(--line); border-radius: var(--radius); font-size: 0.95rem;">
            
            <label style="font-size: 0.82rem; font-weight: 600; color: var(--ink-soft); margin-top: 4px; display: block;">Gewünschter Tarif:</label>
            <select id="klRegPlan" style="padding: 12px; border: 1px solid var(--line); border-radius: var(--radius); font-size: 0.92rem; font-family: inherit; background: var(--paper);">
              <option value="free" ${plan === 'free' ? 'selected' : ''}>🌱 Free Starter (0 € – 3 Rechner-Nutzungen / Monat)</option>
              <option value="pro_investor" ${plan === 'pro_investor' ? 'selected' : ''}>📈 Pro Investor (9 € / Monat – Unbegrenzt, alle Schieberegler)</option>
              <option value="executive_b2b" ${plan === 'executive_b2b' ? 'selected' : ''}>📑 Executive & B2B (29 € / Monat – Inkl. Excel-Vault & Holding)</option>
              <option value="private_owner" ${plan === 'private_owner' ? 'selected' : ''}>👑 Private Banking & Research (49 € / Monat – Deep Research)</option>
            </select>
          </div>

          <button class="btn-primary" style="width: 100%; padding: 13px; background: var(--gold); color: #FFF; font-weight: 600;" onclick="window.klCabinet.handleRegister()">
            🚀 Kabinett jetzt freischalten →
          </button>
        </div>
      `);
    }

    showCabinetDashboard() {
      if (!this.isLoggedIn()) {
        this.showLoginModal();
        return;
      }

      const u = this.currentUser;
      const p = KONTENLAGE_PLANS[u.plan] || KONTENLAGE_PLANS.free;

      let upgradeHtml = '';
      if (u.plan === 'free') {
        upgradeHtml = `<button class="btn-lead" onclick="window.klCabinet.showRegisterModal('pro_investor')">⬆️ Auf Pro (9 €) upgraden</button>`;
      } else if (u.plan === 'pro_investor') {
        upgradeHtml = `<button class="btn-lead" onclick="window.klCabinet.showRegisterModal('executive_b2b')">⬆️ Auf Executive (29 €) upgraden</button>`;
      } else {
        upgradeHtml = `<span style="color: var(--positive); font-size: 0.82rem; font-weight: 700;">✓ Vollzugriff aktiv</span>`;
      }

      this.renderModal('cabinetModal', `
        <div class="modal-card" style="max-width: 640px;">
          <button class="modal-close" onclick="document.getElementById('cabinetModal').style.display='none'">×</button>
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 16px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 2.2rem;">🏛️</span>
              <div>
                <h3 style="margin: 0; font-size: 1.3rem; color: var(--ink);">Mein Kontenlage Kabinett</h3>
                <div style="font-size: 0.8rem; color: var(--ink-soft);">Angemeldet als: <strong>${u.email}</strong></div>
              </div>
            </div>
            <button class="btn-lead" style="padding: 6px 12px; font-size: 0.78rem;" onclick="window.klCabinet.logout()">Abmelden</button>
          </div>

          <!-- Active Plan Status -->
          <div style="background: #FAF8F3; border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <span class="badge" style="background: ${p.color}; color: #FFF; font-size: 0.75rem; padding: 3px 8px; border-radius: 2px;">${p.label}</span>
                <div style="font-size: 0.84rem; color: var(--ink-soft); margin-top: 4px;">Status: <strong>Aktiv (${p.priceLabel})</strong></div>
              </div>
              ${upgradeHtml}
            </div>
          </div>

          <!-- Notifications -->
          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 1rem; color: var(--ink); margin-bottom: 10px;">🔔 Markt- & Zins-Benachrichtigungen:</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${this.notifications.map(n => `
                <div style="padding: 12px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); border-left: 3px solid var(--gold);">
                  <div style="font-size: 0.82rem; font-weight: 700; color: var(--ink);">${n.icon} ${n.title} <span style="font-size: 0.7rem; color: var(--ink-soft); font-weight: normal;">(${n.date})</span></div>
                  <div style="font-size: 0.78rem; color: var(--ink-soft); margin-top: 2px;">${n.body}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Saved Tools -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="btn-primary" style="padding: 10px; font-size: 0.85rem;" onclick="document.getElementById('cabinetModal').style.display='none'; document.getElementById('holding-modelle').scrollIntoView();">
              📑 Zu den Steuerspar-Modellen
            </button>
            <button class="btn-lead" style="padding: 10px; font-size: 0.85rem;" onclick="document.getElementById('cabinetModal').style.display='none'; window.taxEngine.openExcelVaultModal();">
              📥 Excel-Vault öffnen
            </button>
          </div>
        </div>
      `);
    }

    handleLogin() {
      const email = document.getElementById('klLoginEmail')?.value?.trim();
      const pass = document.getElementById('klLoginPass')?.value;
      if (!email || !pass) {
        alert('Bitte E-Mail und Passwort eingeben.');
        return;
      }
      this.currentUser = { email, name: email.split('@')[0], plan: 'pro_investor' };
      localStorage.setItem('kontenlage_user', JSON.stringify(this.currentUser));
      document.getElementById('authModal').style.display = 'none';
      this.updateNavState();
      this.showCabinetDashboard();
      window.location.reload();
    }

    handleRegister() {
      const email = document.getElementById('klRegEmail')?.value?.trim();
      const pass = document.getElementById('klRegPass')?.value;
      const name = document.getElementById('klRegName')?.value?.trim();
      const plan = document.getElementById('klRegPlan')?.value || 'free';

      if (!email || !pass) {
        alert('Bitte Pflichtfelder ausfüllen.');
        return;
      }

      this.currentUser = { email, name: name || email.split('@')[0], plan };
      localStorage.setItem('kontenlage_user', JSON.stringify(this.currentUser));
      document.getElementById('authModal').style.display = 'none';
      this.updateNavState();
      this.showCabinetDashboard();
      window.location.reload();
    }

    logout() {
      this.currentUser = null;
      localStorage.removeItem('kontenlage_user');
      document.getElementById('cabinetModal') && (document.getElementById('cabinetModal').style.display = 'none');
      this.updateNavState();
      alert('Erfolgreich abgemeldet.');
      window.location.reload();
    }

    updateNavState() {
      const btn = document.getElementById('navCabinetBtn');
      if (!btn) return;
      if (this.currentUser) {
        btn.textContent = '🏛️ ' + (this.currentUser.name || 'Mein Kabinett');
        btn.onclick = () => window.klCabinet.showCabinetDashboard();
      } else {
        btn.textContent = '🔐 Kabinett Login';
        btn.onclick = () => window.klCabinet.showLoginModal();
      }
    }

    renderModal(id, html) {
      let m = document.getElementById(id);
      if (!m) {
        m = document.createElement('div');
        m.id = id;
        m.className = 'modal-overlay';
        document.body.appendChild(m);
      }
      m.innerHTML = html;
      m.style.display = 'flex';
    }
  }

  window.klCabinet = new KontenlageAuthCabinet();

  document.addEventListener('DOMContentLoaded', () => {
    window.klCabinet.updateNavState();
  });

})();
