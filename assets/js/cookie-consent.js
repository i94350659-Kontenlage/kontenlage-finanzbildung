/**
 * Kontenlage.de — DSGVO & TTDSG Konformes Cookie Consent Modul
 * 
 * Verhindert unbefugtes Tracking, speichert Benutzereinstellungen im LocalStorage
 * und stellt Event-Dispatcher für Drittanbieter-Skripte bereit.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'kontenlage_cookie_consent_v1';

  // Helper to read consent state
  window.getCookieConsent = function () {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('LocalStorage error reading consent:', e);
      return null;
    }
  };

  // Helper to save consent state and emit custom event
  function saveConsent(analytics, marketing) {
    const consent = {
      essential: true, // Always true
      analytics: Boolean(analytics),
      marketing: Boolean(marketing),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {
      console.warn('LocalStorage error saving consent:', e);
    }

    // Trigger global event for dynamic analytics/tracking scripts
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));

    closeConsentModal();
  }

  // Create DOM Elements
  function injectConsentUI() {
    if (document.getElementById('kl-cookie-banner')) return;

    // Relative path for privacy/imprint depending on page location
    const isSubdir = window.location.pathname.includes('/artikel/');
    const basePath = isSubdir ? '../' : './';

    const html = `
      <div id="kl-cookie-backdrop"></div>
      
      <!-- Floating Badge to reopen consent settings anytime -->
      <button id="kl-cookie-badge" aria-label="Cookie-Einstellungen öffnen" title="Cookie- & Datenschutz-Einstellungen">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.34-.02-.67-.05-1a3.5 3.5 0 0 1-4.45-4.45C16.83 5.4 14.6 3.55 12 2zm-2.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7.5 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm2.5-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
        </svg>
        <span>Cookies</span>
      </button>

      <!-- Main Banner Modal -->
      <div id="kl-cookie-banner" role="dialog" aria-labelledby="kl-cookie-title" aria-modal="true">
        <div class="kl-cookie-header">
          <h2 id="kl-cookie-title" class="kl-cookie-title">Datenschutz- & Cookie-Einstellungen</h2>
        </div>
        
        <p class="kl-cookie-desc">
          Wir nutzen Cookies und ähnliche Technologien, um Kontenlage rechtssicher, transparent und funktional bereitzustellen. Essenzielle Cookies sind für den Betrieb erforderlich. Zusatzfunktionen (z. B. anonyme Analyse zur Verbesserung unserer Rechner) aktivieren wir nur mit deiner Zustimmung.
        </p>

        <!-- Expandable Details -->
        <div id="kl-cookie-details" class="kl-cookie-details">
          
          <!-- Category: Essential -->
          <div class="kl-cookie-category">
            <div class="kl-cookie-cat-head">
              <span class="kl-cookie-cat-title">
                🔒 Essentiell (Technisch notwendig)
              </span>
              <label class="kl-switch">
                <input type="checkbox" checked disabled>
                <span class="kl-slider"></span>
              </label>
            </div>
            <div class="kl-cookie-cat-desc">
              Erforderlich für die grundlegende Nutzung der Webseite, Sicherheit und Speicherung deiner Cookie-Einwilligung. Kann nicht deaktiviert werden.
            </div>
          </div>

          <!-- Category: Analytics -->
          <div class="kl-cookie-category">
            <div class="kl-cookie-cat-head">
              <span class="kl-cookie-cat-title">
                📊 Analytik & Performancemessung
              </span>
              <label class="kl-switch">
                <input type="checkbox" id="kl-chk-analytics">
                <span class="kl-slider"></span>
              </label>
            </div>
            <div class="kl-cookie-cat-desc">
              Hilft uns zu verstehen, welche Rechner und Artikel am häufigsten genutzt werden, um unsere Inhalte datenbasiert zu optimieren (anonymisiert).
            </div>
          </div>

          <!-- Category: Marketing -->
          <div class="kl-cookie-category">
            <div class="kl-cookie-cat-head">
              <span class="kl-cookie-cat-title">
                🎯 Marketing & Externe Medien
              </span>
              <label class="kl-switch">
                <input type="checkbox" id="kl-chk-marketing">
                <span class="kl-slider"></span>
              </label>
            </div>
            <div class="kl-cookie-cat-desc">
              Ermöglicht die Einbindung von Zahlungsdienstleistern (z. B. Stripe Checkout) oder externen Visualisierungen.
            </div>
          </div>

        </div>

        <!-- Action Buttons -->
        <div class="kl-cookie-actions">
          <div class="kl-cookie-actions-main">
            <button type="button" id="kl-btn-accept-all" class="kl-btn kl-btn-accept">Alle akzeptieren</button>
            <button type="button" id="kl-btn-accept-essential" class="kl-btn kl-btn-essential">Nur essenzielle akzeptieren</button>
          </div>
          
          <button type="button" id="kl-btn-save-custom" class="kl-btn kl-btn-save" style="display: none;">Auswahl speichern</button>
          <button type="button" id="kl-btn-toggle-details" class="kl-btn-settings">Einstellungen anpassen &amp; Details</button>
        </div>

        <div class="kl-cookie-footer-links">
          <a href="${basePath}index.html#impressum">Impressum</a>
          <span>•</span>
          <a href="${basePath}index.html#datenschutz">Datenschutzerklärung</a>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);

    bindEvents();
  }

  function bindEvents() {
    const backdrop = document.getElementById('kl-cookie-backdrop');
    const badge = document.getElementById('kl-cookie-badge');
    const details = document.getElementById('kl-cookie-details');
    const btnToggleDetails = document.getElementById('kl-btn-toggle-details');
    const btnAcceptAll = document.getElementById('kl-btn-accept-all');
    const btnAcceptEssential = document.getElementById('kl-btn-accept-essential');
    const btnSaveCustom = document.getElementById('kl-btn-save-custom');
    const chkAnalytics = document.getElementById('kl-chk-analytics');
    const chkMarketing = document.getElementById('kl-chk-marketing');

    // Badge click
    if (badge) {
      badge.addEventListener('click', openConsentModal);
    }

    // Toggle Details
    if (btnToggleDetails) {
      btnToggleDetails.addEventListener('click', function () {
        const isOpen = details.classList.contains('open');
        if (isOpen) {
          details.classList.remove('open');
          btnSaveCustom.style.display = 'none';
          btnToggleDetails.textContent = 'Einstellungen anpassen & Details';
        } else {
          details.classList.add('open');
          btnSaveCustom.style.display = 'block';
          btnToggleDetails.textContent = 'Details verbergen';
        }
      });
    }

    // Accept All
    if (btnAcceptAll) {
      btnAcceptAll.addEventListener('click', function () {
        saveConsent(true, true);
      });
    }

    // Essential Only (Reject Optional)
    if (btnAcceptEssential) {
      btnAcceptEssential.addEventListener('click', function () {
        saveConsent(false, false);
      });
    }

    // Save Custom
    if (btnSaveCustom) {
      btnSaveCustom.addEventListener('click', function () {
        saveConsent(chkAnalytics ? chkAnalytics.checked : false, chkMarketing ? chkMarketing.checked : false);
      });
    }

    // Backdrop click re-closes if consent was already given in past
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        if (window.getCookieConsent() !== null) {
          closeConsentModal();
        }
      });
    }

    // Bind any element with data-open-cookie-settings
    document.querySelectorAll('[data-open-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openConsentModal();
      });
    });
  }

  function openConsentModal() {
    injectConsentUI();

    const consent = window.getCookieConsent();
    const banner = document.getElementById('kl-cookie-banner');
    const backdrop = document.getElementById('kl-cookie-backdrop');
    const chkAnalytics = document.getElementById('kl-chk-analytics');
    const chkMarketing = document.getElementById('kl-chk-marketing');

    if (consent) {
      if (chkAnalytics) chkAnalytics.checked = Boolean(consent.analytics);
      if (chkMarketing) chkMarketing.checked = Boolean(consent.marketing);
    } else {
      if (chkAnalytics) chkAnalytics.checked = false;
      if (chkMarketing) chkMarketing.checked = false;
    }

    if (backdrop) backdrop.classList.add('active');
    if (banner) banner.classList.add('active');
  }

  function closeConsentModal() {
    const banner = document.getElementById('kl-cookie-banner');
    const backdrop = document.getElementById('kl-cookie-backdrop');

    if (banner) banner.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }

  // Public API
  window.reopenCookieSettings = openConsentModal;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    injectConsentUI();
    const consent = window.getCookieConsent();
    if (!consent) {
      // Prompt modal if no consent stored yet
      setTimeout(openConsentModal, 300);
    }
  }

})();
