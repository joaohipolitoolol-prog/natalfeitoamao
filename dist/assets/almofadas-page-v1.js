(()=>{'use strict';
const config=window.ALMOFADAS_CONFIG||{},name='Almofadas de Natal: 4 Projetos de Crochê',price=Number(config.price)||47;
const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());
const date=Object.fromEntries(parts.map(p=>[p.type,p.value]));
const year=Number(date.year),today=Date.UTC(year,Number(date.month)-1,Number(date.day));let target=Date.UTC(year,11,25);if(today>target)target=Date.UTC(year+1,11,25);
const days=Math.max(0,Math.ceil((target-today)/86400000));document.querySelectorAll('[data-days]').forEach(el=>{el.textContent=String(days)});
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src'],params=new URLSearchParams(location.search),storage='almofadas_attribution_v1';let attr={};
try{attr=JSON.parse(sessionStorage.getItem(storage)||'{}')||{}}catch(_){}if(typeof attr!=='object'||Array.isArray(attr))attr={};
for(const k of keys){const v=params.get(k);if(v&&v.length<=1000)attr[k]=v}try{sessionStorage.setItem(storage,JSON.stringify(attr))}catch(_){}
let destination;try{if(config.checkoutEnabled && config.checkout){destination=new URL(config.checkout);if(destination.protocol!=='https:')destination=null}}catch(_){}
if(destination){for(const k of keys)if(attr[k])destination.searchParams.set(k,attr[k]);document.querySelectorAll('[data-checkout]').forEach(el=>{const a=document.createElement('a');a.className=el.className;a.setAttribute('data-checkout','');a.href=destination.href;a.textContent='Quero minha coleção de Natal →';el.replaceWith(a)})}
if(config.pixel){if(!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};if(!window._fbq)window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[]}fbq('init',config.pixel);fbq('track','PageView');fbq('track','ViewContent',{content_name:name,content_type:'product',value:price,currency:config.currency||'BRL'});
const meta=document.createElement('script');meta.async=true;meta.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(meta);
document.querySelectorAll('a[data-checkout]').forEach(a=>a.addEventListener('click',()=>fbq('track','InitiateCheckout',{content_name:name,content_type:'product',value:price,currency:config.currency||'BRL',num_items:1})));}
const utm=document.createElement('script');utm.async=true;utm.src='https://cdn.utmify.com.br/scripts/utms/latest.js';utm.dataset.utmifyPreventXcodSck='';utm.dataset.utmifyPreventSubids='';document.head.appendChild(utm);
const sticky=document.querySelector('[data-sticky]'),hero=document.querySelector('.hero'),offer=document.querySelector('#oferta');let busy=false;
const update=()=>{const r=offer.getBoundingClientRect();sticky.classList.toggle('visible',hero.getBoundingClientRect().bottom<0&&(r.top>=innerHeight||r.bottom<=0));busy=false};
addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update,{passive:true});update();
})();
