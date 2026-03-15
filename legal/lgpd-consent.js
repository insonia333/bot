/**
 * Moom Agency — LGPD Consent Banner
 * Consentimento granular conforme Lei 13.709/2018
 */

(function() {
  'use strict';

  const CONSENT_KEY = 'lgpd-consent';
  const CONSENT_VERSION = '1.0';

  function getConsent() {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }

  function saveConsent(analytics, marketing) {
    const consent = {
      version: CONSENT_VERSION,
      analytics: analytics,
      marketing: marketing,
      essential: true,
      timestamp: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent('lgpd-consent-updated', { detail: consent }));
    applyConsent(consent);
  }

  function applyConsent(consent) {
    if (consent.analytics) {
      // Habilitar Google Analytics, Hotjar, etc.
      console.log('[LGPD] Analytics habilitado');
    }
    if (consent.marketing) {
      // Habilitar Meta Pixel, Google Ads, etc.
      console.log('[LGPD] Marketing habilitado');
    }
  }

  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'lgpd-banner';
    banner.innerHTML = `
      <style>
        #lgpd-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          background: rgba(10, 10, 15, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem 2rem;
          font-family: 'Inter', sans-serif;
          color: #fff;
          animation: lgpd-slide-up 0.5s ease-out;
        }
        @keyframes lgpd-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .lgpd-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .lgpd-text {
          flex: 1;
          min-width: 300px;
        }
        .lgpd-text h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .lgpd-text p {
          font-size: 0.85rem;
          color: #a0a0b0;
          line-height: 1.6;
        }
        .lgpd-text a {
          color: #6c5ce7;
          text-decoration: underline;
        }
        .lgpd-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .lgpd-toggles {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .lgpd-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #a0a0b0;
        }
        .lgpd-toggle input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #6c5ce7;
          cursor: pointer;
        }
        .lgpd-toggle.disabled {
          opacity: 0.5;
        }
        .lgpd-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .lgpd-btn {
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: inherit;
          transition: 0.3s;
        }
        .lgpd-btn-accept {
          background: linear-gradient(135deg, #6c5ce7, #00cec9);
          color: white;
        }
        .lgpd-btn-reject {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .lgpd-btn-save {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .lgpd-btn:hover {
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .lgpd-container { flex-direction: column; gap: 1rem; }
          .lgpd-buttons { width: 100%; }
          .lgpd-btn { flex: 1; text-align: center; }
        }
      </style>
      <div class="lgpd-container">
        <div class="lgpd-text">
          <h4>Sua Privacidade Importa</h4>
          <p>Utilizamos cookies para melhorar sua experiência. Cookies essenciais são necessários para o funcionamento do site. Você pode escolher habilitar cookies de analytics e marketing separadamente. <a href="/legal/politica-privacidade.html">Política de Privacidade</a></p>
        </div>
        <div class="lgpd-options">
          <div class="lgpd-toggles">
            <label class="lgpd-toggle disabled">
              <input type="checkbox" checked disabled>
              Essenciais (obrigatório)
            </label>
            <label class="lgpd-toggle">
              <input type="checkbox" id="lgpd-analytics">
              Analytics
            </label>
            <label class="lgpd-toggle">
              <input type="checkbox" id="lgpd-marketing">
              Marketing
            </label>
          </div>
          <div class="lgpd-buttons">
            <button class="lgpd-btn lgpd-btn-accept" id="lgpd-accept-all">Aceitar Todos</button>
            <button class="lgpd-btn lgpd-btn-save" id="lgpd-save">Salvar Preferências</button>
            <button class="lgpd-btn lgpd-btn-reject" id="lgpd-reject">Rejeitar Opcionais</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('lgpd-accept-all').addEventListener('click', function() {
      saveConsent(true, true);
      banner.remove();
    });

    document.getElementById('lgpd-save').addEventListener('click', function() {
      const analytics = document.getElementById('lgpd-analytics').checked;
      const marketing = document.getElementById('lgpd-marketing').checked;
      saveConsent(analytics, marketing);
      banner.remove();
    });

    document.getElementById('lgpd-reject').addEventListener('click', function() {
      saveConsent(false, false);
      banner.remove();
    });
  }

  // Initialize
  function init() {
    const consent = getConsent();
    if (!consent || consent.version !== CONSENT_VERSION) {
      createBanner();
    } else {
      applyConsent(consent);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
