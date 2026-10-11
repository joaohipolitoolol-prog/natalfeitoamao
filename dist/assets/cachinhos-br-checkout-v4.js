/* Rosa BR v4: native Cakto anchors, fail-open UTM attribution.
   The purchase links work independently of this file. */
(function(){
'use strict';
var checkout='https://pay.cakto.com.br/c6ifvro_1191762';
var key='cachinhos_br_attribution_v1';
var names=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src'];
var saved={};
var current;
try {
 current=new URLSearchParams(location.search);
 saved=JSON.parse(sessionStorage.getItem(key)||'{}')||{};
 if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
 if(['utm_source','fbclid','gclid','ttclid'].some(function(k){return !!current.get(k)}))saved={};
 names.forEach(function(k){var v=current.get(k);if(v&&v.length<=1000)saved[k]=v;});
 sessionStorage.setItem(key,JSON.stringify(saved));
} catch(e) {
 saved={};
 if(current){names.forEach(function(k){var v=current.get(k);if(v&&v.length<=1000)saved[k]=v;});}
}
var links=document.querySelectorAll('a[data-cakto-rosa-br]');
links.forEach(function(a){
 try{
  var u=new URL(checkout);
  names.forEach(function(k){if(saved[k])u.searchParams.set(k,saved[k]);});
  a.href=u.href;
 }catch(e){
  // Native href in HTML remains usable if tracking fails.
 }
});
document.addEventListener('click',function(e){
 var t=e.target;
 if(t&&t.nodeType!==1)t=t.parentElement;
 var a=t&&t.closest?t.closest('a[data-cakto-rosa-br]'):null;
 if(!a)return;
 try{
  if(window.fbq)window.fbq('track','InitiateCheckout',{
   content_name:'Boneca de Cachinhos Rosas',content_ids:['boneca-cachinhos-rosas-br'],
   content_type:'product',value:37,currency:'BRL'
  });
 }catch(error){}
 // No preventDefault; the browser performs the normal checkout navigation.
},true);
})();
