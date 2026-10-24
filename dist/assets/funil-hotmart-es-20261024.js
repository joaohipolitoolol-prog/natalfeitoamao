(()=>{'use strict';
const config=window.NAVIDAD_HOTMART_FUNNEL||{};
const stepKey=document.body.dataset.step;
const step=(config.steps||{})[stepKey];
// A navegação sem widget serve apenas para revisão. Aceite e cobrança pertencem à Hotmart.
document.querySelectorAll('[data-decline]').forEach(link=>{const url=new URL(link.href);for(const [key,value] of new URLSearchParams(location.search)){url.searchParams.set(key,value)}link.href=url.href});
const widget=document.getElementById('hotmart-sales-funnel');
const fallback=document.querySelector('.fallback');
const status=document.querySelector('.availability');
if(widget&&step&&config.widgetEnabled){
  let timeout;
  const rendered=()=>{
    const content=Array.from(widget.children).some(el=>!['SCRIPT','STYLE','TEMPLATE'].includes(el.tagName));
    if(content){document.body.dataset.purchase='ready';clearTimeout(timeout);return true;}
    return false;
  };
  const observer=new MutationObserver(()=>{if(rendered())observer.disconnect()});
  observer.observe(widget,{childList:true,subtree:true});
  const unavailable=()=>{
    if(!rendered()&&status)status.textContent='Esta oferta está disponible al continuar desde tu compra en Hotmart.';
  };
  if(status)status.textContent='Cargando tu oferta…';
  timeout=setTimeout(unavailable,10000);
  const mount=async()=>{
    try{
      if(!window.checkoutElements)throw new Error('Hotmart widget unavailable');
      await window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
      rendered();
    }catch(_){unavailable();}
  };
  if(window.checkoutElements){mount();}
  else{
    const script=document.createElement('script');
    script.src='https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
    script.async=true;
    script.onload=mount;
    script.onerror=unavailable;
    document.head.appendChild(script);
  }
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
