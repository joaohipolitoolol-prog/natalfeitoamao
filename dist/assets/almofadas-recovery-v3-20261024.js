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
const prod={content_name:config.productName||'4 Almofadas Natalinas',content_ids:[String(config.productId||'1219106')],content_type:'product',value:37,currency:'BRL'};
try{
  if(config.pixel){
    if(!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};if(!window._fbq)window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[]}
    window.fbq('init',String(config.pixel));window.fbq('track','PageView');window.fbq('track','ViewContent',prod);
    window.fbq('trackCustom','ExitOfferView',{offer_step:'recuperacao_almofadas'});
    document.querySelectorAll('[data-checkout]').forEach(link=>link.addEventListener('click',()=>{
      try{window.fbq('trackCustom','ExitOfferCheckoutClick',{offer_step:'recuperacao_almofadas'})}catch(_){}
    }));
    const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(s);
  }
}catch(_){}
/* A atribuição acima preserva os valores originais dos parâmetros. */
})();

(() => {'use strict';
const options={
  receita:{src:'/assets/almofadas-previa-receita-20261022.webp',title:'Passo a passo com fotos',alt:'Página real da receita com instruções escritas e fotografias de apoio',description:'Confira como o PDF apresenta as instruções escritas e as imagens que ajudam a acompanhar a confecção.'},
  materiais:{src:'/assets/almofadas-previa-materiais-20261022.webp',title:'Lista de materiais',alt:'Página real da receita com lista de materiais para o projeto',description:'Veja o exemplo da seção de materiais, que ajuda a separar o necessário antes de começar.'}
};
const tabs=[...document.querySelectorAll('[data-preview-tab]')];
const preview=document.querySelector('[data-preview-image]');
const previewOpen=document.querySelector('[data-preview-open]');
const title=document.querySelector('[data-preview-title]');
const desc=document.querySelector('[data-preview-description]');
const modal=document.querySelector('[data-zoom-dialog]');
const modalTitle=document.querySelector('[data-zoom-title]');
const zoomImage=document.querySelector('[data-zoom-image]');
const viewport=document.querySelector('[data-zoom-viewport]');
const zoomText=document.querySelector('[data-zoom-value]');
const original=document.querySelector('[data-zoom-original]');
const close=document.querySelector('[data-zoom-close]');
const plus=document.querySelector('[data-zoom-in]');
const minus=document.querySelector('[data-zoom-out]');
if(!preview||!modal||!previewOpen)return;
let selected='receita',zoom=1,lastFocus=null,previousOverflow='';
const resetZoom=()=>{
  zoom=1;
  zoomImage.style.width='100%';
  zoomText.textContent='100%';
  viewport.scrollTop=0;viewport.scrollLeft=0;
};
const select=(key)=>{
  const next=options[key];if(!next)return;
  selected=key;preview.src=next.src;preview.alt=next.alt;
  title.textContent=next.title;desc.textContent=next.description;
  previewOpen.setAttribute('aria-label','Ampliar '+next.title.toLowerCase());
  tabs.forEach(tab=>{const active=tab.dataset.previewTab===key;tab.classList.toggle('is-active',active);tab.setAttribute('aria-pressed',String(active))});
  if(!modal.hidden){
    zoomImage.src=next.src;zoomImage.alt=next.alt;
    modalTitle.textContent=next.title;
    original.href=next.src;resetZoom();
  }
};
tabs.forEach(tab=>tab.addEventListener('click',()=>select(tab.dataset.previewTab)));
const setZoom=(value)=>{
  zoom=Math.min(3,Math.max(1,value));
  zoomImage.style.width=(zoom*100)+'%';
  zoomText.textContent=Math.round(zoom*100)+'%';
};
const dismiss=()=>{
  if(modal.hidden)return;
  modal.hidden=true;document.body.style.overflow=previousOverflow;
  if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus();
};
previewOpen.addEventListener('click',()=>{
  const selectedPreview=options[selected];lastFocus=document.activeElement;
  previousOverflow=document.body.style.overflow;
  modalTitle.textContent=selectedPreview.title;
  zoomImage.src=selectedPreview.src;zoomImage.alt=selectedPreview.alt;
  original.href=selectedPreview.src;
  modal.hidden=false;document.body.style.overflow='hidden';
  resetZoom();close.focus();
  try{window.fbq&&window.fbq('trackCustom','RecipePreviewZoom',{preview:selected})}catch(_){}
});
close.addEventListener('click',dismiss);
plus.addEventListener('click',()=>setZoom(zoom+0.5));
minus.addEventListener('click',()=>setZoom(zoom-0.5));
modal.addEventListener('click',event=>{if(event.target===modal)dismiss()});
document.addEventListener('keydown',event=>{
  if(modal.hidden)return;
  if(event.key==='Escape'){event.preventDefault();dismiss()}
  if(event.key==='+'||event.key==='='){event.preventDefault();setZoom(zoom+0.5)}
  if(event.key==='-'){event.preventDefault();setZoom(zoom-0.5)}
  if(event.key==='Tab'){
    const focusables=[...modal.querySelectorAll('button,a[href]')].filter(n=>!n.disabled);
    const first=focusables[0],last=focusables[focusables.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
});
})();
