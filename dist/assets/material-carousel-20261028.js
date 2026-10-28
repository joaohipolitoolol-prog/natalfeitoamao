(()=>{'use strict';
document.querySelectorAll('[data-material-carousel]').forEach(root=>{
 const viewport=root.querySelector('.material-viewport'),track=root.querySelector('.material-track');
 const originals=[...track.children],pauseButton=root.querySelector('[data-material-pause]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,hover=false,holding=false,until=0,frame=0,last=0,x=0,focusBefore=null,oldOverflow='';
 const dialog=document.createElement('dialog');dialog.className='material-dialog';
 const header=document.createElement('div');header.className='material-dialog-header';
 const title=document.createElement('span');title.id='material-title-'+Math.random().toString(36).slice(2);
 const close=document.createElement('button');close.type='button';close.className='material-dialog-close';close.textContent='×';close.setAttribute('aria-label',root.dataset.close);
 const fullImage=document.createElement('img');header.append(title,close);dialog.append(header,fullImage);dialog.setAttribute('aria-labelledby',title.id);document.body.append(dialog);
 const syncPause=()=>{pauseButton.textContent=paused?root.dataset.resume:root.dataset.pause;pauseButton.setAttribute('aria-pressed',String(paused));};syncPause();
 pauseButton.addEventListener('click',()=>{paused=!paused;syncPause();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;syncPause();});
 for(const item of originals){const copy=item.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelectorAll('button').forEach(b=>b.tabIndex=-1);track.append(copy);}
 const interact=()=>{until=performance.now()+15000;};
 root.addEventListener('pointerenter',()=>{hover=true;});root.addEventListener('pointerleave',()=>{hover=false;});
 viewport.addEventListener('pointerdown',()=>{holding=true;interact();},{passive:true});
 addEventListener('pointerup',()=>{if(holding){holding=false;interact();}});
 viewport.addEventListener('pointercancel',()=>{holding=false;interact();},{passive:true});
 viewport.addEventListener('wheel',interact,{passive:true});viewport.addEventListener('keydown',interact);
 const move=direction=>{interact();viewport.scrollBy({left:direction*(originals[0].getBoundingClientRect().width+20),behavior:reduced.matches?'instant':'smooth'});};
 root.querySelector('[data-material-prev]').addEventListener('click',()=>move(-1));root.querySelector('[data-material-next]').addEventListener('click',()=>move(1));
 root.addEventListener('click',event=>{const button=event.target.closest('[data-material-open]');if(!button)return;
  const label=button.closest('figure').querySelector('strong').textContent;
  title.textContent=label;fullImage.src=button.dataset.full;fullImage.alt=button.querySelector('img').alt;
  focusBefore=button;oldOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';
 });
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});interact();});
 function tick(now){
  const dt=Math.min(now-last||0,50);last=now;
  const active=root.contains(document.activeElement),box=viewport.getBoundingClientRect();
  if(!paused&&!reduced.matches&&!hover&&!holding&&!active&&!dialog.open&&!document.hidden&&now>until&&box.top<innerHeight&&box.bottom>0){
   if(Math.abs(viewport.scrollLeft-x)>2)x=viewport.scrollLeft;
   x+=dt*.022;const loop=track.children[originals.length].offsetLeft-track.children[0].offsetLeft;
   if(loop>0&&x>=loop)x-=loop;viewport.scrollLeft=x;
  }else{x=viewport.scrollLeft;}
  frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);addEventListener('pagehide',()=>cancelAnimationFrame(frame));addEventListener('pageshow',()=>{cancelAnimationFrame(frame);last=0;frame=requestAnimationFrame(tick);});
});
})();
