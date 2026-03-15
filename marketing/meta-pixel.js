/**
 * Moom Agency — Meta Pixel Integration
 * LGPD-aware: só dispara se o consentimento foi dado
 */

(function() {
  'use strict';

  const PIXEL_ID = 'YOUR_PIXEL_ID_HERE';

  function hasConsent() {
    try {
      const consent = localStorage.getItem('lgpd-consent');
      if (!consent) return false;
      const parsed = JSON.parse(consent);
      return parsed.marketing === true;
    } catch (e) {
      return false;
    }
  }

  function initPixel() {
    if (!hasConsent()) return;

    !function(f,b,e,v,n,t,s) {
      if(f.fbq) return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq) f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  // Eventos customizados
  window.MoomPixel = {
    trackLead: function(data) {
      if (!hasConsent() || !window.fbq) return;
      fbq('track', 'Lead', data || {});
    },

    trackContact: function(data) {
      if (!hasConsent() || !window.fbq) return;
      fbq('track', 'Contact', data || {});
    },

    trackViewContent: function(contentName, contentCategory) {
      if (!hasConsent() || !window.fbq) return;
      fbq('track', 'ViewContent', {
        content_name: contentName || '',
        content_category: contentCategory || ''
      });
    },

    trackPurchase: function(value, currency) {
      if (!hasConsent() || !window.fbq) return;
      fbq('track', 'Purchase', {
        value: value || 0,
        currency: currency || 'BRL'
      });
    },

    trackCustom: function(eventName, data) {
      if (!hasConsent() || !window.fbq) return;
      fbq('trackCustom', eventName, data || {});
    }
  };

  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPixel);
  } else {
    initPixel();
  }

  // Re-inicializar quando consentimento for dado
  window.addEventListener('lgpd-consent-updated', initPixel);
})();
