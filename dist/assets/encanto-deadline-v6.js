(() => {
'use strict';
const end = Date.parse('2026-10-10T05:00:00Z');
const clock=document.getElementById('offer-clock');
const checkoutLinks=document.querySelectorAll('[data-encanto-checkout]');
function close(){document.getElementById('promo-message').textContent='ESTA OFERTA HA TERMINADO';clock.textContent='00:00:00';document.getElementById('closed-note').hidden=false;checkoutLinks.forEach(a=>{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.textContent='Oferta finalizada';});}
function tick(){const remaining=end-Date.now();if(remaining<=0){close();return false;}const sec=Math.floor(remaining/1000);clock.textContent=[Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(n=>String(n).padStart(2,'0')).join(':');return true;}
checkoutLinks.forEach(a=>a.addEventListener('click',e=>{if(Date.now()>=end){e.preventDefault();e.stopImmediatePropagation();close();}},true));
if(tick()){const timer=setInterval(()=>{if(!tick())clearInterval(timer);},1000);}
})();