/* BR front and exit recovery: Cakto BR checkout and attribution parameters. */
(function(){
'use strict';
var CHECKOUT_URL = 'https://pay.cakto.com.br/c6ifvro_1191762';
var key='cachinhos_br_attribution_v1';
var keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src'];
var incoming=new URLSearchParams(location.search);
var attrs={};try{attrs=JSON.parse(sessionStorage.getItem(key)||'{}')||{};}catch(e){}
if(!attrs||typeof attrs!=='object'||Array.isArray(attrs))attrs={};
if(['utm_source','fbclid','gclid','ttclid'].some(function(k){return !!incoming.get(k);})){attrs={};}
keys.forEach(function(k){var val=incoming.get(k);if(val&&val.length<=1000)attrs[k]=val;});
try{sessionStorage.setItem(key,JSON.stringify(attrs));}catch(e){}
var valid=false;var url;
try{url=new URL(CHECKOUT_URL);valid=url.protocol==='https:'&&url.hostname==='pay.cakto.com.br'&&url.pathname==='/c6ifvro_1191762';}catch(e){}
document.querySelectorAll('[data-br-checkout]').forEach(function(a){
 if(!valid){a.removeAttribute('href');a.setAttribute('aria-disabled','true');return;}
 var target=new URL(url.href);
 keys.forEach(function(k){if(attrs[k]&&!target.searchParams.has(k))target.searchParams.set(k,attrs[k]);});
 a.setAttribute('href',target.href);a.removeAttribute('aria-disabled');
 a.addEventListener('click',function(){
  if(window.fbq)window.fbq('track','InitiateCheckout',{content_name:'Boneca de Cachinhos Rosas',content_ids:['boneca-cachinhos-rosas-br'],content_type:'product',value:37,currency:'BRL'});
 });
});
if(valid)document.querySelectorAll('[data-checkout-pending]').forEach(function(n){n.hidden=true;});
})();