(() => {
  'use strict';
  const checkout = 'https://pay.hotmart.com/N107962532Y?checkoutMode=10';
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ttclid', 'xcod', 'sck', 'src'];
  const storageKey = 'encanto_es_attribution_v1';
  const current = new URLSearchParams(location.search);
  let attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem(storageKey) || '{}') || {}; } catch (_) {}
  if (keys.some(key => current.has(key))) attribution = {};
  for (const key of keys) if (current.get(key)) attribution[key] = current.get(key);
  try { sessionStorage.setItem(storageKey, JSON.stringify(attribution)); } catch (_) {}
  function checkoutUrl() {
    const url = new URL(checkout);
    for (const key of keys) if (attribution[key]) url.searchParams.set(key, attribution[key]);
    return url.href;
  }
  const links = document.querySelectorAll('[data-encanto-checkout]');
  links.forEach(link => { link.href = checkoutUrl(); });
  if (!window.fbq) {
    const fbq = window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
  }
  const details = {content_name: 'Muñecas Encantadas', content_ids: ['N107962532Y'], content_type: 'product', value: 12.90, currency: 'USD'};
  window.fbq('init', '1051422547811449');
  window.fbq('track', 'PageView');
  window.fbq('track', 'ViewContent', details);
  let loaded = false;
  function loadVendors() {
    if (loaded) return;
    loaded = true;
    const meta = document.createElement('script');
    meta.async = true;
    meta.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(meta);
    const utms = document.createElement('script');
    utms.id = 'utmify-utms';
    utms.async = true;
    utms.defer = true;
    utms.src = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
    utms.setAttribute('data-utmify-prevent-xcod-sck', '');
    utms.setAttribute('data-utmify-prevent-subids', '');
    document.head.appendChild(utms);
  }
  links.forEach(link => {
    link.addEventListener('pointerdown', loadVendors, {once: true});
    link.addEventListener('click', () => {
      loadVendors();
      window.fbq('track', 'InitiateCheckout', {...details, num_items: 1});
    });
  });
  // Keep vendor execution away from the first rendering, without delaying navigation.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(loadVendors, {timeout: 1000});
    else setTimeout(loadVendors, 150);
  }));
  setTimeout(loadVendors, 1500);
})();
