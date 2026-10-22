(()=>{'use strict';
const cfg=window.CUSCINI_IT_CONFIG||{};
const product={content_name:cfg.productName||'Cuscini Natalizi',content_ids:[String(cfg.productId||'cuscini-natalizi-it')],content_type:'product',value:Number(cfg.price)||12,currency:cfg.currency||'EUR',num_items:1};
// Contagem até 25 de dezembro segundo o calendário da Itália.
try{
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Rome',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());
 const d=Object.fromEntries(parts.map(x=>[x.type,x.value]));
 const today=Date.UTC(+d.year,+d.month-1,+d.day);
 let christmas=Date.UTC(+d.year,11,25);
 if(today>christmas)christmas=Date.UTC(+d.year+1,11,25);
 const days=Math.max(0,Math.ceil((christmas-today)/86400000));
 document.querySelectorAll('[data-days]').forEach(e=>e.textContent=String(days));
}catch(_){}
// UTM e click IDs: passados para checkout sem scripts de terceiros.
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src','src_id'];
const params=new URLSearchParams(location.search),store='cuscini_it_attr_v1';
let saved={};try{saved=JSON.parse(sessionStorage.getItem(store)||'{}')||{}}catch(_){}
if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
const incoming=keys.some(k=>params.has(k));
let attr=(!incoming&&saved.at&&Date.now()-saved.at<86400000&&saved.values)?saved.values:{};
attr={...attr};for(const k of keys){const val=params.get(k);if(val&&val.length<=1000)attr[k]=val}
try{sessionStorage.setItem(store,JSON.stringify({at:Date.now(),values:attr}))}catch(_){}
let dest=null;
try{
 const u=new URL(String(cfg.checkout||''));
 if(u.protocol==='https:'&&['pay.hotmart.com','pay.cakto.com.br'].includes(u.hostname)){
   for(const k of keys){if(attr[k])u.searchParams.set(k,attr[k])}
   dest=u.toString();
 }
}catch(_){}
if(dest){
 document.querySelectorAll('[data-checkout]').forEach(btn=>{
  const a=document.createElement('a');a.className=btn.className;a.href=dest;a.dataset.checkout='';a.rel='noopener noreferrer';
  a.textContent=btn.textContent;a.setAttribute('aria-label','Vai al pagamento della collezione Cuscini di Natale');btn.replaceWith(a);
 });
}
// Consentimento antes de usar Meta Pixel e UTMify.
const prefs=document.querySelector('.it-privacy-preferences'),status=document.querySelector('[data-consent-status]'),key='cuscini_it_marketing_v1';
let consent=null;try{consent=localStorage.getItem(key)}catch(_){}
let pixelActive=false,metaLoading=false;
const loadMeta=()=>{
 if(!cfg.pixel||metaLoading)return;metaLoading=true;
 const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(s);
};
const enableTracking=()=>{
 if(pixelActive)return;pixelActive=true;
 if(cfg.pixel){
  if(!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};if(!window._fbq)window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[]}
  window.fbq('init',String(cfg.pixel));window.fbq('track','PageView');window.fbq('track','ViewContent',product);loadMeta();
 }
 const s=document.createElement('script');s.async=true;s.src='https://cdn.utmify.com.br/scripts/utms/latest.js';s.dataset.utmifyPreventXcodSck='';s.dataset.utmifyPreventSubids='';document.head.appendChild(s);
};
// Nenhum aviso flutuante. Consentimento opcional somente dentro do rodapé.
if(consent==='accepted')enableTracking();
const refreshStatus=()=>{if(status)status.textContent=consent==='accepted'?'Statistiche attive.':consent==='rejected'?'Statistiche disattivate.':'Statistiche disattivate finché non le autorizzi.';};
refreshStatus();
const setConsent=(val)=>{
  const previouslyActive=pixelActive;
  consent=val;
  try{localStorage.setItem(key,val)}catch(_){}
  refreshStatus();
  if(prefs)prefs.open=false;
  if(val==='accepted')enableTracking();
  else if(previouslyActive){try{window.fbq?.('consent','revoke')}catch(_){};location.reload();}
};
document.querySelector('[data-consent-accept]')?.addEventListener('click',()=>setConsent('accepted'));
document.querySelector('[data-consent-reject]')?.addEventListener('click',()=>setConsent('rejected'));
document.querySelectorAll('a[data-checkout]').forEach(a=>a.addEventListener('click',()=>{if(pixelActive&&typeof window.fbq==='function')window.fbq('track','InitiateCheckout',product)}));
// Sticky CTA se mostra fora do hero e fora da oferta.
const sticky=document.querySelector('[data-sticky]'),hero=document.querySelector('.hero'),offer=document.querySelector('#offerta');
if(sticky&&hero&&offer){let busy=false;const update=()=>{const r=offer.getBoundingClientRect();sticky.classList.toggle('visible',hero.getBoundingClientRect().bottom<0&&(r.top>=innerHeight||r.bottom<=0));busy=false;};addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update,{passive:true});update();}
})();