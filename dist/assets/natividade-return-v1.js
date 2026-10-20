/* Recover only an actual same-tab return from this product's checkout.
   No pushState, popstate trap, unload prompt or hidden body. */
(()=>{'use strict';
const pendingKey='natividade_checkout_return_v1';
const seenKey='natividade_recovery_seen_v1';
const ttl=30*60*1000;
const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src','src_id'];
let redirecting=false;
const clearPending=()=>{try{sessionStorage.removeItem(pendingKey)}catch(_){}};
const isBack=()=>{try{return performance.getEntriesByType('navigation')[0]?.type==='back_forward'}catch(_){return false}};
const readPending=()=>{
  try{
    const item=JSON.parse(sessionStorage.getItem(pendingKey)||'null');
    if(!item||!Number.isFinite(item.time)||Date.now()-item.time<0||Date.now()-item.time>ttl)return null;
    return item;
  }catch(_){return null}
};
if(document.body.dataset.page==='recovery'){
  clearPending();
  try{sessionStorage.setItem(seenKey,'1')}catch(_){}
  return;
}
const recover=isReturn=>{
  if(redirecting||!isReturn)return;
  const item=readPending();
  if(!item?.departed){clearPending();return}
  try{
    if(sessionStorage.getItem(seenKey)){clearPending();return}
    const next=new URL('/presepio-amigurumi/voltar',location.origin);
    const query=new URLSearchParams(location.search);
    for(const key of keys){const value=query.get(key)||item.attribution?.[key];if(typeof value==='string'&&value.length<=1000)next.searchParams.set(key,value)}
    // Consume the marker before navigating, so refresh and back cannot loop.
    clearPending();sessionStorage.setItem(seenKey,'1');
    redirecting=true;location.replace(next.href);
  }catch(_){redirecting=false;clearPending()}
};
// A normal entry or reload never triggers recovery, even with an old marker.
if(!isBack())clearPending();
else recover(true);
document.addEventListener('click',event=>{
  const link=event.target?.closest?.('a[data-checkout]');
  if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
  try{
    const url=new URL(link.href);
    if(url.origin!=='https://pay.cakto.com.br'||url.pathname!=='/cf86v3q_1223436'||sessionStorage.getItem(seenKey))return;
    const attribution={};
    for(const key of keys){const value=url.searchParams.get(key);if(value&&value.length<=1000)attribution[key]=value}
    sessionStorage.setItem(pendingKey,JSON.stringify({time:Date.now(),departed:false,attribution}));
  }catch(_){}
});
addEventListener('pagehide',()=>{
  const item=readPending();if(!item)return;
  try{item.departed=true;sessionStorage.setItem(pendingKey,JSON.stringify(item))}catch(_){}
});
addEventListener('pageshow',event=>recover(event.persisted||isBack()));
})();
