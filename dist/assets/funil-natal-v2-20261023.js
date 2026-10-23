(() => {
'use strict';
// Os botões de pagamento continuam usando os checkouts Cakto ativos.
// Para upsell de um clique, substituir pelo HTML emitido no Gerador de Upsell Cakto.
const offer=document.body.dataset.offer||'';
const product=document.body.dataset.product||offer;
const price=Number(document.body.dataset.price||0);
const productId=document.body.dataset.productId||offer;
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src','src_id'];
const query=new URLSearchParams(location.search);
const store='almofadas_attribution_v2';
let saved={};
try {
  const snapshot=JSON.parse(sessionStorage.getItem(store)||'{}');
  if(snapshot&&typeof snapshot==='object'&&!Array.isArray(snapshot)&&snapshot.values&&typeof snapshot.values==='object'){
    const fresh=!(typeof snapshot.time==='number')||(Date.now()-snapshot.time<86400000);
    if(fresh)saved=snapshot.values;
  }
} catch(_){}
const attr={...saved};
for(const key of keys){
  const value=query.get(key);
  if(value&&value.length<=1000)attr[key]=value;
}
try{sessionStorage.setItem(store,JSON.stringify({time:Date.now(),values:attr}))}catch(_){}
for(const link of document.querySelectorAll('[data-next],[data-checkout]')){
  try{
    const url=new URL(link.href,location.origin);
    for(const key of keys){if(typeof attr[key]==='string'&&attr[key].length<=1000)url.searchParams.set(key,attr[key])}
    link.href=url.href;
  }catch(_){}
}
const track=(name,params)=>{
  try{if(window.fbq)window.fbq(name==='InitiateCheckout'?'track':'trackCustom',name,params)}catch(_){}
};
const props={content_name:product,content_ids:[String(productId)],content_type:'product',value:price,currency:'BRL',funnel:'almofadas_natalinas',offer_step:offer};
for(const link of document.querySelectorAll('[data-checkout]')){
  link.addEventListener('click',()=>{
    track('InitiateCheckout',props);
    track('UpsellCheckoutClick',{offer_step:offer,product_id:String(productId)});
  });
}
for(const link of document.querySelectorAll('[data-next]')){
  link.addEventListener('click',()=>track('UpsellDeclineClick',{offer_step:offer,product_id:String(productId)}));
}
// O evento Purchase deve vir SOMENTE de confirmação de pagamento na Cakto.
try{
  if(!window.fbq){
    const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};
    if(!window._fbq)window._fbq=f;
    f.push=f;f.loaded=true;f.version='2.0';f.queue=[];
  }
  window.fbq('init','1051422547811449');
  window.fbq('track','PageView');
  window.fbq('track','ViewContent',props);
  window.fbq('trackCustom','UpsellView',{offer_step:offer,product_id:String(productId)});
  const meta=document.createElement('script');meta.async=true;meta.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(meta);
}catch(_){}
const utm=document.createElement('script');
utm.async=true;utm.src='https://cdn.utmify.com.br/scripts/utms/latest.js';
utm.dataset.utmifyPreventXcodSck='';utm.dataset.utmifyPreventSubids='';
document.head.appendChild(utm);
})();
