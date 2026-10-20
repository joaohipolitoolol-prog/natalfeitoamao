(()=>{'use strict';
/* Trackeamento da LP; Purchase é responsabilidade da Cakto, nunca desta página. */
const config=window.ALMOFADAS_CONFIG||{};
const price=Number(config.price)||12;
const currency=config.currency||'USD';
const name=config.productName||'Cojines de Navidad: 4 patrones de crochet';
const product={content_name:name,content_ids:[String(config.productId||'cojines-navidenos-es')],content_type:'product',value:price,currency:currency,num_items:1};

/* Prazo real até 25 de dezembro, no fuso brasileiro; não é falsa oferta temporizada. */
try{
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());
  const date=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  const year=Number(date.year),today=Date.UTC(year,Number(date.month)-1,Number(date.day));
  let christmas=Date.UTC(year,11,25);if(today>christmas)christmas=Date.UTC(year+1,11,25);
  const days=Math.max(0,Math.ceil((christmas-today)/86400000));
  document.querySelectorAll('[data-days]').forEach(el=>{el.textContent=String(days)});
}catch(_){}

const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src','src_id'];
const current=new URLSearchParams(window.location.search);
const store='cojines_es_attribution_v1';
const now=Date.now();
let saved={};
try{saved=JSON.parse(sessionStorage.getItem(store)||'{}')||{}}catch(_){}
if(typeof saved!=='object'||Array.isArray(saved))saved={};
const campaignClick=['utm_source','utm_campaign','utm_id','fbclid','gclid','ttclid','xcod','sck'].some(k=>current.has(k));
let attr=(!campaignClick&&saved.time&&now-saved.time<86400000&&saved.values&&typeof saved.values==='object'&&!Array.isArray(saved.values))?saved.values:{};
attr=Object.assign({},attr);
for(const k of keys){const v=current.get(k);if(v&&v.length<=1000)attr[k]=v}
try{sessionStorage.setItem(store,JSON.stringify({time:now,values:attr}))}catch(_){}

let destination=null;
try{
  if(config.checkoutEnabled&&config.checkout){
    const next=new URL(config.checkout);
    if(next.protocol==='https:'&&['pay.hotmart.com','pay.cakto.com.br'].includes(next.hostname)){
      for(const k of keys){if(attr[k])next.searchParams.set(k,attr[k])}
      destination=next.href;
    }
  }
}catch(_){}
if(destination){
  document.querySelectorAll('[data-checkout-status]').forEach(el=>el.remove());
  document.querySelectorAll('[data-checkout]').forEach(button=>{
    const link=document.createElement('a');
    link.className=button.className;
    link.dataset.checkout='';
    link.href=destination;
    link.rel='noopener noreferrer';
    link.textContent='Quiero mis 4 cojines por US$12 →';
    link.setAttribute('aria-label','Ir al pago de la colección Cojines de Navidad');
    button.replaceWith(link);
  });
}

if(config.pixel){
  if(!window.fbq){
    const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};
    if(!window._fbq)window._fbq=f;
    f.push=f;f.loaded=true;f.version='2.0';f.queue=[];
  }
  window.fbq('init',String(config.pixel));
  window.fbq('track','PageView');
  window.fbq('track','ViewContent',product);
  const meta=document.createElement('script');meta.async=true;
  meta.src='https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(meta);
  /* IC na intenção explícita, no clique. Purchase apenas quando a Cakto confirmar. */
  document.querySelectorAll('a[data-checkout]').forEach(link=>{
    link.addEventListener('click',()=>{
      try{window.fbq('track','InitiateCheckout',product)}catch(_){}
    });
  });
}
/* UTMify da mesma instalação existente nas LPs de Bonecas Encantadas. */
const utm=document.createElement('script');
utm.async=true;
utm.src='https://cdn.utmify.com.br/scripts/utms/latest.js';
utm.dataset.utmifyPreventXcodSck='';
utm.dataset.utmifyPreventSubids='';
document.head.appendChild(utm);

const sticky=document.querySelector('[data-sticky]');
const hero=document.querySelector('.hero');
const offer=document.querySelector('#oferta');
if(sticky&&hero&&offer){
  let busy=false;
  const update=()=>{
    const r=offer.getBoundingClientRect();
    sticky.classList.toggle('visible',hero.getBoundingClientRect().bottom<0&&(r.top>=innerHeight||r.bottom<=0));
    busy=false;
  };
  addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('resize',update,{passive:true});
  update();
}
})();
