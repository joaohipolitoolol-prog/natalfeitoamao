(()=>{'use strict';
const config=window.NAVIDAD_HOTMART_FUNNEL||{};
const stepKey=document.body.dataset.step;
const step=(config.steps||{})[stepKey];
// A navegação sem widget serve apenas para revisão. Aceite e cobrança pertencem à Hotmart.
document.querySelectorAll('[data-decline]').forEach(link=>{const url=new URL(link.href);for(const [key,value] of new URLSearchParams(location.search)){url.searchParams.set(key,value)}link.href=url.href});
const widget=document.getElementById('hotmart-sales-funnel');
const html=step&&(step.widgetHtml||config.widgetHtml);
if(widget&&step&&step.productId&&step.offerCode&&typeof html==='string'&&html.trim()){
  widget.innerHTML=html;
  // Executa somente os scripts do código oficial inserido pelo responsável no arquivo de configuração.
  const scripts=Array.from(widget.querySelectorAll('script'));
  let failed=false;
  const ready=()=>{if(!failed){document.body.dataset.purchase='ready'}};
  const error=()=>{failed=true;widget.replaceChildren();document.body.dataset.purchase='pending'};
  (async()=>{try{for(const old of scripts){const script=document.createElement('script');for(const a of old.attributes)script.setAttribute(a.name,a.value);script.textContent=old.textContent;if(script.src){await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;old.replaceWith(script)})}else{old.replaceWith(script)}}ready()}catch(_){error()}})();
}
// Purchase e aceite nunca são inferidos pela visita ou por um clique local.
if(config.pixel&&step){
 if(!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};if(!window._fbq)window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[]}
 window.fbq('init',String(config.pixel));window.fbq('track','PageView');
 window.fbq('track','ViewContent',{content_name:document.body.dataset.product,content_type:'product',value:step.price,currency:config.currency||'USD'});
 const load=()=>{const script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(script)};
 if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:1500});else setTimeout(load,500);
}
})();
