/* Muñeca de Rizos Rosas · keep attribution on Hotmart checkout links. */
(function(){
'use strict';
var storageKey='rosa_utm_attribution_v1';
var keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','xcod','sck','src'];
var query=new URLSearchParams(window.location.search);
var saved={};
try {
  saved=JSON.parse(sessionStorage.getItem(storageKey)||'{}')||{};
  if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
} catch(e){saved={};}
var newTraffic=['utm_source','fbclid','gclid','ttclid'].some(function(k){return !!query.get(k);});
if(newTraffic)saved={};
keys.forEach(function(k){
  var v=query.get(k);
  if(v&&v.length<=1000)saved[k]=v;
});
try {sessionStorage.setItem(storageKey,JSON.stringify(saved));}catch(e){}
function updateCheckoutLink(link){
  if(!link||!link.href)return;
  try {
    var url=new URL(link.href,window.location.href);
    if(url.origin!=='https://pay.hotmart.com'||url.pathname!=='/U107973976E')return;
    keys.forEach(function(key){
      if(saved[key]&&!url.searchParams.has(key))url.searchParams.set(key,saved[key]);
    });
    link.href=url.href;
  }catch(e){}
}
function refresh(){document.querySelectorAll('a[data-rosa-checkout]').forEach(updateCheckoutLink);}
refresh();
document.addEventListener('pointerdown',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[data-rosa-checkout]'):null;
  if(a)updateCheckoutLink(a);
},true);
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[data-rosa-checkout]'):null;
  if(a)updateCheckoutLink(a);
},true);
window.addEventListener('pageshow',refresh);
})();