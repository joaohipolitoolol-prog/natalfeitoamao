(()=>{'use strict';
if(window.__almofadasPTStarted)return;window.__almofadasPTStarted=true;
const cfg=window.ALMOFADAS_PT_CONFIG||{};
const product={content_name:cfg.productName,content_ids:[String(cfg.productId)],content_type:'product',value:Number(cfg.price),currency:cfg.currency,num_items:1};
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic','fbclid','gclid','gbraid','wbraid','ttclid','msclkid','xcod','sck','src','src_id'];
const params=new URLSearchParams(location.search),storageKey='almofadas_pt_attr_v1',now=Date.now();
let saved={};try{saved=JSON.parse(sessionStorage.getItem(storageKey)||'{}')||{}}catch(_){}
const fresh=keys.some(k=>params.has(k));
let values=(!fresh&&saved.at&&now-saved.at<86400000&&saved.values&&typeof saved.values==='object'&&!Array.isArray(saved.values))?saved.values:{};
const attr={};for(const k of keys){const v=fresh?params.get(k):values[k];if(typeof v==='string'&&v&&v.length<=1000)attr[k]=v}
try{sessionStorage.setItem(storageKey,JSON.stringify({at:now,values:attr}))}catch(_){}
try{
 const dest=new URL(String(cfg.checkout||''));
 if(dest.protocol==='https:'&&dest.hostname==='pay.hotmart.com'&&dest.pathname==='/S108222287S'){
  for(const k of keys){if(attr[k])dest.searchParams.set(k,attr[k])}
  if(!dest.searchParams.has('src'))dest.searchParams.set('src','lp_portugal');
  document.querySelectorAll('a[data-checkout]').forEach((a,i)=>{a.href=dest.href;a.dataset.checkoutPosition=String(i+1);a.setAttribute('aria-label','Comprar a coleção de Almofadas de Natal na Hotmart')});
 }
}catch(_){} // Os href do HTML continuam válidos caso o armazenamento ou o script falhe.
const consentKey='almofadas_pt_marketing_v1';
let consent=null,trackingActive=false,servicesLoaded=false;
try{consent=localStorage.getItem(consentKey)}catch(_){}
const status=document.querySelector('[data-consent-status]'),prefs=document.querySelector('.pt-privacy-preferences');
function loadServices(){
 if(servicesLoaded||!trackingActive)return;servicesLoaded=true;
 const meta=document.createElement('script');meta.async=true;meta.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(meta);
 const utm=document.createElement('script');utm.async=true;utm.src='https://cdn.utmify.com.br/scripts/utms/latest.js';utm.dataset.utmifyPreventXcodSck='';utm.dataset.utmifyPreventSubids='';document.head.appendChild(utm);
}
function enableTracking(){
 if(trackingActive||!cfg.pixel)return;trackingActive=true;
 if(!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};if(!window._fbq)window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[]}
 window.fbq('consent','grant');window.fbq('init',String(cfg.pixel));
 window.fbq('trackSingle',String(cfg.pixel),'PageView');window.fbq('trackSingle',String(cfg.pixel),'ViewContent',product);
 const defer=()=>{if('requestIdleCallback' in window)requestIdleCallback(loadServices,{timeout:1200});else setTimeout(loadServices,0)};
 const image=document.querySelector('.hero-image img');
 if(!image||image.complete)defer();else{image.addEventListener('load',defer,{once:true});image.addEventListener('error',defer,{once:true});setTimeout(loadServices,1500)}
}
function refreshStatus(){if(status)status.textContent=consent==='accepted'?'Medição publicitária ativa.':consent==='rejected'?'Medição publicitária desativada.':'Medição publicitária desativada até à sua autorização.'}
function setConsent(next){const wasActive=trackingActive;consent=next;try{localStorage.setItem(consentKey,next)}catch(_){}refreshStatus();if(prefs)prefs.open=false;if(next==='accepted')enableTracking();else if(wasActive){try{window.fbq('consent','revoke')}catch(_){}location.reload()}}
if(consent==='accepted')enableTracking();refreshStatus();
document.querySelector('[data-consent-accept]')?.addEventListener('click',()=>setConsent('accepted'));
document.querySelector('[data-consent-reject]')?.addEventListener('click',()=>setConsent('rejected'));
// A LP mede o clique. InitiateCheckout e Purchase pertencem à integração do checkout Hotmart.
document.querySelectorAll('a[data-checkout]').forEach(a=>a.addEventListener('click',()=>{if(trackingActive&&typeof window.fbq==='function'){loadServices();try{window.fbq('trackSingleCustom',String(cfg.pixel),'CheckoutClick',{...product,cta_position:a.dataset.checkoutPosition})}catch(_){}}}));
const sticky=document.querySelector('[data-sticky]'),hero=document.querySelector('.hero'),offer=document.querySelector('#oferta');
if(sticky&&hero&&offer){let busy=false;const update=()=>{const r=offer.getBoundingClientRect();sticky.classList.toggle('visible',hero.getBoundingClientRect().bottom<0&&(r.top>=innerHeight||r.bottom<=0));busy=false};addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update,{passive:true});update()}
})();
