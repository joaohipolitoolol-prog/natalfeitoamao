/* Pink Curly Doll BR · fail-safe Cakto checkout + campaign attribution.
   Checkout links are valid in HTML without JavaScript; this script only enriches them. */
(function(){
'use strict';
var checkout='https://pay.cakto.com.br/c6ifvro_1191762';
var storageKey='cachinhos_br_attribution_v1';
var keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src'];
var current=new URLSearchParams(location.search);
var stored={};
try{stored=JSON.parse(sessionStorage.getItem(storageKey)||'{}')||{}}catch(e){}
if(!stored||typeof stored!=='object'||Array.isArray(stored))stored={};
if(['utm_source','fbclid','gclid','ttclid'].some(function(k){return !!current.get(k)}))stored={};
keys.forEach(function(k){var v=current.get(k);if(v&&v.length<=1000)stored[k]=v;});
try{sessionStorage.setItem(storageKey,JSON.stringify(stored))}catch(e){}
function updateLink(a){
 if(!a)return;
 try{
   // Never remove or disable the native checkout href, even if tracking fails.
   var u=new URL(a.getAttribute('href')||checkout,location.href);
   if(u.origin!=='https://pay.cakto.com.br'||u.pathname!=='/c6ifvro_1191762')return;
   keys.forEach(function(k){if(stored[k]&&!u.searchParams.has(k))u.searchParams.set(k,stored[k]);});
   a.href=u.href;
 }catch(e){}
}
function all(){document.querySelectorAll('a[data-br-checkout]').forEach(updateLink);}
all();
document.addEventListener('pointerdown',function(e){
 var t=e.target;
 if(t&&t.nodeType!==1)t=t.parentElement;
 var a=t&&t.closest?t.closest('a[data-br-checkout]'):null;
 if(a)updateLink(a);
},true);
document.addEventListener('click',function(e){
 var t=e.target;
 if(t&&t.nodeType!==1)t=t.parentElement;
 var a=t&&t.closest?t.closest('a[data-br-checkout]'):null;
 if(!a)return;
 updateLink(a);
 if(window.fbq){
  window.fbq('track','InitiateCheckout',{content_name:'Boneca de Cachinhos Rosas',content_ids:['boneca-cachinhos-rosas-br'],content_type:'product',value:37,currency:'BRL'});
 }
},true);
window.addEventListener('pageshow',all);
})();