/* Back redirect de Almofadas Natalinas. Não intercepta o checkout. */
(() => {
  'use strict';
  const landing = '/almofadas-natalinas';
  const exitPage = '/almofadas-natalinas/voltar';
  const doneKey = 'almofadas_exit_shown_v2';
  const marker = 'almofadas-exit-v2';

  const checkoutKey = 'almofadas_checkout_departure_v3';
  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[data-checkout]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    try {
      const url = new URL(link.href);
      if (url.hostname === 'pay.cakto.com.br') sessionStorage.setItem(checkoutKey, String(Date.now()));
    } catch (_) {}
  });
  window.addEventListener('pageshow', event => {
    const navigation = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (!event.persisted && (!navigation || navigation.type !== 'back_forward')) return;
    try {
      const departed = Number(sessionStorage.getItem(checkoutKey));
      if (!departed || Date.now() - departed > 1800000 || sessionStorage.getItem(doneKey) === '1') return;
      sessionStorage.removeItem(checkoutKey);
      sessionStorage.setItem(doneKey, '1');
      location.replace(exitPage + location.search);
    } catch (_) {}
  });

  // CTAs internos apenas rolam até a oferta, sem gerar entradas no histórico.
  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href="#oferta"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const offer = document.getElementById('oferta');
    if (!offer) return;
    event.preventDefault();
    offer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Nunca tenta redirecionar quem já viu a página de recuperação nesta sessão.
  try {
    if (sessionStorage.getItem(doneKey) === '1') return;
  } catch (_) {}

  if (location.pathname.replace(/\/$/, '') !== landing ||
      !history.pushState || !history.replaceState) return;

  const originalHash = location.hash;
  const oldState = history.state;
  const base = (oldState && typeof oldState === 'object' && !Array.isArray(oldState))
    ? { ...oldState } : {};
  const baseState = { ...base, almofadasExitBase: marker };
  const guardState = { ...baseState, almofadasExitGuard: marker };

  try {
    history.replaceState(baseState, '', location.href);
    history.pushState(guardState, '', location.href);
  } catch (_) {
    return;
  }

  let exiting = false;
  window.addEventListener('popstate', event => {
    // Apenas quando o visitante REALMENTE volta da entrada-guarda à base.
    // Ignora alterações de âncora, cliques, retorno do checkout e states externos.
    const state = event.state;
    if (exiting ||
        !state ||
        state.almofadasExitBase !== marker ||
        state.almofadasExitGuard === marker ||
        location.pathname.replace(/\/$/, '') !== landing ||
        location.hash !== originalHash) return;

    try {
      if (sessionStorage.getItem(doneKey) === '1') return;
      sessionStorage.setItem(doneKey, '1');
    } catch (_) {}

    exiting = true;
    window.location.replace(exitPage + location.search);
  });
})();
