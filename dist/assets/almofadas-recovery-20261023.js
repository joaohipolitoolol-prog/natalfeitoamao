(() => {'use strict';
const config=window.ALMOFADAS_CONFIG||{};
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src','src_id'];
const current=new URLSearchParams(location.search);
const store='almofadas_attribution_v2';
let previous={};try{const d=JSON.parse(sessionStorage.getItem(store)||'{}');if(d&&d.values&&typeof d.values==='object')previous=d.values}catch(_){}
const attr={...previous};for(const key of keys){const v=current.get(key);if(v&&v.length<=1000)attr[key]=v}
try{sessionStorage.setItem(store,JSON.stringify({time:Date.now(),values:attr}))}catch(_){}
for(const link of document.querySelectorAll('[data-checkout],[data-return]')){
  try{const url=new URL(link.href,location.origin);for(const key of keys){if(typeof attr[key]==='string'&&attr[key].length<=1000)url.searchParams.set(key,attr[key])}link.href=url.href}catch(_){}
}
const prod={content_name:config.productName||'4 Almofadas Natalinas',content_ids:[String(config.productId||'1219106')],content_type:'product',value:Number(config.price)||47,currency:'BRL'};
try{
  if(config.pixel){
    if(!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};if(!window._fbq)window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[]}
    window.fbq('init',String(config.pixel));window.fbq('track','PageView');window.fbq('track','ViewContent',prod);
    window.fbq('trackCustom','ExitOfferView',{offer_step:'recuperacao_almofadas'});
    document.querySelectorAll('[data-checkout]').forEach(link=>link.addEventListener('click',()=>{
      try{window.fbq('track','InitiateCheckout',prod);window.fbq('trackCustom','ExitOfferCheckoutClick',{offer_step:'recuperacao_almofadas'})}catch(_){}
    }));
    const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(s);
  }
}catch(_){}
const utm=document.createElement('script');utm.async=true;utm.src='https://cdn.utmify.com.br/scripts/utms/latest.js';utm.dataset.utmifyPreventXcodSck='';utm.dataset.utmifyPreventSubids='';document.head.appendChild(utm);
})();
