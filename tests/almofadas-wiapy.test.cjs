const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const configSource=fs.readFileSync('dist/assets/almofadas-config-v2.js','utf8');
const pageSource=fs.readFileSync('dist/assets/almofadas-page-v4-20261024.js','utf8');
function boot({query='',saved=null,blocked=false,checkout=null}={}){
  const calls=[],scripts=[],storage=new Map();
  if(saved)storage.set('almofadas_attribution_v2',JSON.stringify(saved));
  const anchors=Array.from({length:3},()=>({className:'cta',innerHTML:'Comprar',href:'fallback',dataset:{},events:{},setAttribute(){},addEventListener(k,f){this.events[k]=f},replaceWith(a){Object.assign(this,a)}}));
  const ctx={URL,URLSearchParams,Intl,Date,Object,Number,String,JSON,location:{search:query},sessionStorage:{getItem:k=>{if(blocked)throw Error();return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error();storage.set(k,v)}},document:{head:{appendChild:s=>scripts.push(s)},createElement:()=>({dataset:{},events:{},setAttribute(){},addEventListener(k,f){this.events[k]=f}}),querySelectorAll:s=>s.includes('data-checkout')?anchors:[],querySelector:()=>null}};
  ctx.window=ctx;ctx.fbq=(...a)=>calls.push(a);
  vm.runInNewContext(configSource,ctx);
  if(checkout)ctx.ALMOFADAS_CONFIG={...ctx.ALMOFADAS_CONFIG,checkout};
  vm.runInNewContext(pageSource,ctx);
  return {ctx,anchors,calls,scripts};
}
test('main and recovery HTML have Wiapy fallbacks at their existing prices',()=>{
  for(const [path,url,amount,count] of [['dist/almofadas-natalinas/index.html','https://pay.wiapy.com/rOZoq0kqHyl8','47',3],['dist/almofadas-natalinas/voltar/index.html','https://pay.wiapy.com/WJ8n4OXg_rU','37',1]]){
    const html=fs.readFileSync(path,'utf8');
    const tags=[...html.matchAll(/<a\b[^>]*data-checkout[^>]*>/g)];
    assert.equal(tags.length,count);for(const tag of tags)assert.ok(tag[0].includes(url));
    assert.equal(html.includes('pay.cakto.com.br'),false);
    assert.ok(html.includes(`R$ ${amount}`));
    assert.ok(html.includes('almofadas-config-v2.js?v=wiapy20261029b'));
  }
});
test('all CTAs preserve campaign identifiers and Unicode without leaking unrelated parameters',()=>{
  const values={utm_source:'meta',utm_medium:'paid',utm_campaign:'Natal & crochê',utm_content:'avó',utm_term:'artesãs',utm_id:'campaign',fbclid:'click',gclid:'google',ttclid:'tt',xcod:'x',sck:'ad',src:'feed',src_id:'id'};
  const e=boot({query:'?'+new URLSearchParams({...values,email:'private@example.com'})});
  for(const a of e.anchors){const url=new URL(a.href);assert.equal(url.host,'pay.wiapy.com');assert.equal(url.pathname,'/rOZoq0kqHyl8');for(const [k,v]of Object.entries(values))assert.equal(url.searchParams.get(k),v);assert.equal(url.searchParams.has('email'),false)}
});
test('session attribution survives direct return but a new campaign clears old click IDs',()=>{
  const saved={time:Date.now(),values:{utm_source:'old',fbclid:'old-click'}};
  assert.equal(new URL(boot({saved}).anchors[0].href).searchParams.get('fbclid'),'old-click');
  assert.equal(new URL(boot({saved,query:'?utm_source=new'}).anchors[0].href).searchParams.has('fbclid'),false);
  assert.equal(new URL(boot({blocked:true,query:'?utm_campaign=test'}).anchors[0].href).searchParams.get('utm_campaign'),'test');
});
test('untrusted checkout hosts cannot replace the configured fallback',()=>{
  assert.equal(boot({checkout:'https://example.com/checkout'}).anchors[0].href,'fallback');
  assert.equal(boot({checkout:'http://pay.wiapy.com/checkout'}).anchors[0].href,'fallback');
});
test('LP retains the existing pixel and product identity without fabricating purchase events',()=>{
  const e=boot();
  assert.ok(e.calls.some(x=>x[0]==='init'&&x[1]==='1051422547811449'));
  const v=e.calls.find(x=>x[1]==='ViewContent')[2];assert.equal(v.value,47);assert.equal(v.currency,'BRL');assert.equal(v.content_ids[0],'1219106');
  e.anchors[0].events.click();assert.ok(e.calls.some(x=>x[0]==='trackCustom'&&x[1]==='CheckoutClick'));
  assert.equal(e.calls.some(x=>x.includes('Purchase')||x.includes('InitiateCheckout')),false);
});

test("native attribution is not overwritten by a third-party link rewriter",()=>{const e=boot();assert.equal(e.scripts.some(s=>s.src.includes("utmify")),false);assert.equal(fs.readFileSync("dist/assets/almofadas-recovery-v3-20261024.js","utf8").includes("cdn.utmify.com.br"),false)});
