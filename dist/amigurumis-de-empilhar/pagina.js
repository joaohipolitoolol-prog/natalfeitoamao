(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); selectTab(tabs[next], true); }
    });
  });
  const dialog = document.getElementById('preview-dialog');
  const full = document.getElementById('preview-full');
  const value = document.getElementById('zoom-value');
  let zoom = 100, opener;
  function setZoom(next) {
    zoom = Math.max(100, Math.min(250, next));
    full.style.width = zoom + '%';
    value.textContent = zoom + '%';
    document.getElementById('zoom-out').disabled = zoom === 100;
    document.getElementById('zoom-in').disabled = zoom === 250;
  }
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      full.src = './imagens/' + button.dataset.preview + '.webp';
      full.alt = button.dataset.title;
      document.getElementById('preview-title').textContent = button.dataset.title;
      setZoom(100);
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      dialog.querySelector('.preview-scroll').scrollTop = 0;
    });
  });
  document.getElementById('close-preview').addEventListener('click', () => dialog.close());
  document.getElementById('zoom-out').addEventListener('click', () => setZoom(zoom - 25));
  document.getElementById('zoom-in').addEventListener('click', () => setZoom(zoom + 25));
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (opener) opener.focus(); });
  const sticky = document.querySelector('.sticky');
  const hero = document.querySelector('.hero');
  const offer = document.getElementById('oferta');
  let heroVisible = true, offerVisible = false;
  const updateSticky = () => sticky.classList.toggle('is-visible', !heroVisible && !offerVisible);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.target === hero) heroVisible = entry.isIntersecting; else offerVisible = entry.isIntersecting; });
      updateSticky();
    });
    observer.observe(hero); observer.observe(offer);
  }
})();
