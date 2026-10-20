const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function boot({page='',blocked=false}={}){
 const calls=[],scripts=[],listeners={};
 const checkout={href:'https://pay.cakto.com.br/cf86v3q_1223436',setAttribute(){},addEventListener:(k,f)=>listeners[k]=f};
 const returning={href:'/presepio-amigurumi#oferta'};
 const context={URL,URLSearchParams,Date,Intl,Object,Number,JSON,location:{origin:'https://natalfeitoamao.vercel.app',search:'?utm_source=meta&utm_campaign=teste&fbclid=abc'},sessionStorage:{getItem:()=>{if(blocked)throw Error();return null},setItem:()=>{if(blocked)throw Error()}},document:{body:{dataset:{page}},head:{appendChild:s=>scripts.push(s)},createElement:()=>({dataset:{}}),getElementById:id=>scripts.find(s=>s.id===id),querySelectorAll:s=>s==='a[data-checkout]'?[checkout]:s==='a[data-return-offer]'?[returning]:[],querySelector:s=>s.includes('hero-picture')?{complete:true}:null},addEventListener(){},requestAnimationFrame:f=>f(),setTimeout(){}};
 context.window=context;context.fbq=(...args)=>calls.push(args);
 vm.runInNewContext(fs.readFileSync('dist/assets/natividade-config-v3.js','utf8'),context);
 vm.runInNewContext(fs.readFileSync('dist/assets/natividade-page-v4.js','utf8'),context);
 return {calls,scripts,checkout,returning,listeners};
}
test('correct pixel, product and price; no checkout event on page load',()=>{const e=boot();assert.deepEqual(e.calls[0],['init','1051422547811449']);assert.equal(e.calls.filter(c=>c[1]==='PageView').length,1);const p=e.calls.find(c=>c[1]==='ViewContent')[2];assert.equal(p.content_ids[0],'1223436');assert.equal(p.value,47);assert.equal(e.calls.some(c=>c[1]==='InitiateCheckout'),false);e.listeners.click();assert.equal(e.calls.filter(c=>c[1]==='InitiateCheckout').length,1);assert.equal(e.calls.some(c=>c[1]==='Purchase'),false)});
test('campaign and click ID propagate to checkout and offer return',()=>{const e=boot();for(const url of [e.checkout.href,e.returning.href]){const u=new URL(url);assert.equal(u.searchParams.get('utm_source'),'meta');assert.equal(u.searchParams.get('fbclid'),'abc')}assert.equal(new URL(e.returning.href).hash,'#oferta')});
test('UTMify and Meta library each load once',()=>{const e=boot();assert.equal(e.scripts.filter(s=>s.src==='https://cdn.utmify.com.br/scripts/utms/latest.js').length,1);assert.equal(e.scripts.filter(s=>s.src==='https://connect.facebook.net/en_US/fbevents.js').length,1);e.listeners.click();assert.equal(e.scripts.filter(s=>s.src==='https://connect.facebook.net/en_US/fbevents.js').length,1)});
test('recovery records its own view without faking a purchase',()=>{const e=boot({page:'recovery'});assert.equal(e.calls.filter(c=>c[0]==='trackCustom'&&c[1]==='RecoveryView').length,1);assert.equal(e.calls.some(c=>c[1]==='Purchase'),false)});
test('storage denied does not break checkout attribution or tracking',()=>{const e=boot({blocked:true});assert.equal(new URL(e.checkout.href).searchParams.get('utm_campaign'),'teste');e.listeners.click();assert.equal(e.calls.filter(c=>c[1]==='InitiateCheckout').length,1)});
