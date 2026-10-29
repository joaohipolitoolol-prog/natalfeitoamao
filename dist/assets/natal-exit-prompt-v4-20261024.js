/* Recuperação de saída PT/ES. O retorno do checkout mantém a página normal. */
(() => {
'use strict';
const path=location.pathname.replace(/\/$/,'');
const es=path==='/cojines-navidenos';
if(!es&&path!=='/almofadas-natalinas')return;
const key=(es?'cojines_es':'almofadas')+'_exit_prompt_v4';
const marker='natal-exit-v4';
const recovery=es?'/cojines-navidenos/volver':'/almofadas-natalinas/voltar';
let shown=false,navigating=false,entered=false;
const start=Date.now();
try{shown=sessionStorage.getItem(key)==='1'}catch(_){}
const copy=es?{
eyebrow:'MIRA EL MATERIAL POR DENTRO',
title:'¿Te gustaría ver cómo son los patrones?',
text:'Mira páginas reales del paso a paso en español antes de decidir. Los 4 patrones y los 3 bonos siguen incluidos por US$12.',
price:'4 patrones + 3 bonos · US$12',
cta:'Ver los patrones por dentro',
dismiss:'Seguir viendo la colección',close:'Cerrar'
}:{
eyebrow:'VEJA O MATERIAL POR DENTRO',
title:'Quer conferir as receitas antes de decidir?',
text:'Veja páginas reais do passo a passo em português. As 4 receitas e os 3 guias estão incluídos por R$ 67.',
price:'4 receitas + 3 guias · R$ 67',
cta:'Quero ver o material por dentro',
dismiss:'Continuar vendo a coleção',close:'Fechar'
};
const style=document.createElement('style');
style.textContent='.natal-exit-dialog{position:fixed;inset:0;width:min(480px,calc(100% - 32px));max-height:calc(100dvh - 40px);padding:0;border:1px solid #e4d5bf;border-radius:18px;background:#fffaf2;color:#342e29;box-shadow:0 20px 90px #0005;overflow:auto;text-align:center;font:15px/1.55 system-ui,sans-serif}.natal-exit-dialog::backdrop{background:#12291ed1}.natal-exit-content{padding:30px 27px 25px}.natal-exit-close{position:absolute;right:10px;top:7px;width:38px;height:38px;border:0;background:transparent;color:#173b30;font-size:29px;cursor:pointer}.natal-exit-kicker{display:block;margin:4px 22px 13px;font-size:10px;font-weight:850;letter-spacing:.09em;color:#922c3d}.natal-exit-dialog h2{margin:0 0 14px;color:#173b30;font:700 32px/1.12 Georgia,serif;letter-spacing:-.025em}.natal-exit-dialog p{margin:0;color:#6b6055;font-size:14px}.natal-exit-price{display:block;margin:19px 0 0;color:#922c3d;font-size:16px}.natal-exit-cta{display:block;margin:18px 0 12px;padding:15px 18px;border-radius:10px;background:#28734b;color:#fff;text-decoration:none;font-size:14px;font-weight:800;line-height:1.4}.natal-exit-dismiss{padding:8px;border:0;background:transparent;color:#675c53;text-decoration:underline;text-underline-offset:3px;font-size:12px;cursor:pointer}.natal-exit-dialog :focus-visible{outline:3px solid #c69447;outline-offset:3px}@media(max-width:420px){.natal-exit-content{padding:30px 20px 21px}.natal-exit-dialog h2{font-size:28px}}';
document.head.append(style);
const dialog=document.createElement('dialog');
dialog.className='natal-exit-dialog';
dialog.setAttribute('aria-labelledby','natal-exit-title');
dialog.innerHTML='<div class="natal-exit-content"><button type="button" class="natal-exit-close" aria-label="'+copy.close+'">×</button><span class="natal-exit-kicker">'+copy.eyebrow+'</span><h2 id="natal-exit-title">'+copy.title+'</h2><p>'+copy.text+'</p><strong class="natal-exit-price">'+copy.price+'</strong><a class="natal-exit-cta" href="'+recovery+location.search+'">'+copy.cta+'</a><button type="button" class="natal-exit-dismiss">'+copy.dismiss+'</button></div>';
document.body.append(dialog);
let focusBefore=null,overflowBefore='';
function dismiss(){dialog.close()}
dialog.querySelector('.natal-exit-close').addEventListener('click',dismiss);
dialog.querySelector('.natal-exit-dismiss').addEventListener('click',dismiss);
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dismiss()}});
dialog.addEventListener('close',()=>{document.body.style.overflow=overflowBefore;if(focusBefore&&focusBefore.isConnected)focusBefore.focus({preventScroll:true})});
function show(reason){
if(shown||navigating||dialog.open||typeof dialog.showModal!=='function')return;
shown=true;try{sessionStorage.setItem(key,'1')}catch(_){}
focusBefore=document.activeElement;overflowBefore=document.body.style.overflow;
dialog.showModal();document.body.style.overflow='hidden';
try{window.fbq&&window.fbq('trackCustom','ExitPromptView',{language:es?'es':'pt',trigger:reason})}catch(_){}
}
document.addEventListener('pointermove',event=>{if(event.clientY>80)entered=true},{passive:true});
document.documentElement.addEventListener('mouseleave',event=>{
if(event.clientY>0||!entered||Date.now()-start<8000||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
show('mouse_exit');
});
document.addEventListener('click',event=>{
const a=event.target.closest&&event.target.closest('a[href]');
if(!a||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||a.target==='_blank')return;
try{const u=new URL(a.href,location.href);if(u.pathname!==location.pathname||u.origin!==location.origin)navigating=true}catch(_){}
});
addEventListener('pageshow',()=>{navigating=false});
/* Preserve a rolagem normal do navegador e não redirecione ao voltar do checkout. */
document.addEventListener('click',event=>{
const a=event.target.closest&&event.target.closest('a[href="#oferta"]');
if(!a||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
const offer=document.getElementById('oferta');if(!offer)return;
event.preventDefault();offer.scrollIntoView({behavior:'smooth',block:'start'});
});
const old=history.state;
if(!shown&&history.pushState&&!(old&&old.natalExit===marker)){
try{
const base=old&&typeof old==='object'&&!Array.isArray(old)?{...old}:{};
history.replaceState({...base,natalExit:marker,natalExitGuard:false},'',location.href);
history.pushState({...base,natalExit:marker,natalExitGuard:true},'',location.href);
}catch(_){}
}
addEventListener('popstate',event=>{
const s=event.state;
if(!s||s.natalExit!==marker||s.natalExitGuard!==false||location.pathname.replace(/\/$/,'')!==path)return;
show('back');
});
})();