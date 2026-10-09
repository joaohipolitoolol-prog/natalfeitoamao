(() => {
'use strict';
const end=Date.parse('2026-10-10T05:00:00Z');
const links=document.querySelectorAll('[data-encanto-checkout]');
function close(){document.getElementById('promo-message').textContent='ESTA OFERTA HA TERMINADO';document.getElementById('closed-note').hidden=false;links.forEach(a=>{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.textContent='Oferta finalizada';});}
function check(){if(Date.now()>=end)close();}
links.forEach(a=>a.addEventListener('click',e=>{if(Date.now()>=end){e.preventDefault();e.stopImmediatePropagation();close();}},true));
check();
if(Date.now()<end)setTimeout(check,end-Date.now()+50);
document.addEventListener('visibilitychange',check);
window.addEventListener('pageshow',check);
})();