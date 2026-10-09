(() => {
 const strip=document.querySelector(".covers-grid");
 if(!strip)return;
 const prev=document.querySelector("[data-covers-prev]"),next=document.querySelector("[data-covers-next]");
 let visible=false,pauseUntil=0;
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
 const step=(direction=1)=>{const card=strip.querySelector(".cover-card");const gap=parseFloat(getComputedStyle(strip).gap)||16;const distance=(card?.getBoundingClientRect().width||180)+gap;const end=strip.scrollWidth-strip.clientWidth;strip.scrollTo({left:direction>0&&strip.scrollLeft>=end-4?0:Math.max(0,strip.scrollLeft+direction*distance),behavior:reduced.matches?"auto":"smooth"});};
 const pause=()=>{pauseUntil=Date.now()+12000;};
 ["pointerdown","wheel","focusin","keydown"].forEach(name=>strip.addEventListener(name,pause,{passive:true}));
 strip.addEventListener("mouseenter",()=>{pauseUntil=Infinity;});
 strip.addEventListener("mouseleave",pause);
 prev?.addEventListener("click",()=>{pause();step(-1);});
 next?.addEventListener("click",()=>{pause();step(1);});
 if("IntersectionObserver" in window)new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{threshold:.15}).observe(strip);
 setInterval(()=>{if(visible&&!document.hidden&&!reduced.matches&&Date.now()>pauseUntil&&!strip.contains(document.activeElement))step();},4000);
})();