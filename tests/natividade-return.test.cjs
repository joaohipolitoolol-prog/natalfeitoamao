const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const code=fs.readFileSync('dist/assets/natividade-return-v1.js','utf8');
const P='natividade_checkout_return_v1', S='natividade_recovery_seen_v1';
function env({type='navigate',pending,seen=false,page='',blocked=false}={}){
 const storage=new Map();if(pending)storage.set(P,JSON.stringify(pending));if(seen)storage.set(S,'1');
 const handlers={},redirects=[];const on=(name,fn)=>(handlers[name]??=[]).push(fn);
 const context={URL,URLSearchParams,Date,Number,JSON,performance:{getEntriesByType:()=>[{type}]},location:{origin:'https://natalfeitoamao.vercel.app',search:'?utm_source=meta&utm_campaign=natal',replace:url=>redirects.push(url)},document:{body:{dataset:{page}},addEventListener:on},addEventListener:on,sessionStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)??null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)},removeItem:k=>{if(blocked)throw Error('blocked');storage.delete(k)}}};
 vm.runInNewContext(code,context);
 return {storage,redirects,emit:(name,event={})=>(handlers[name]||[]).forEach(fn=>fn(event))};
}
const pending=()=>({time:Date.now(),departed:true,attribution:{utm_content:'criativo_1',fbclid:'click-123'}});
function click(overrides={}){const link={href:'https://pay.cakto.com.br/cf86v3q_1223436?utm_source=meta&utm_content=criativo_1',target:'',hasAttribute:()=>false,...overrides.link};return {button:0,target:{closest:selector=>selector==='a[data-checkout]'?link:null},...overrides,link:undefined};}
test('fresh entry never redirects, even with a previous checkout marker',()=>{const e=env({pending:pending()});assert.equal(e.redirects.length,0);assert.equal(e.storage.has(P),false)});
test('reload never redirects',()=>{const e=env({type:'reload',pending:pending()});e.emit('pageshow');assert.equal(e.redirects.length,0)});
test('back without a checkout marker never redirects',()=>assert.equal(env({type:'back_forward'}).redirects.length,0));
test('confirmed checkout return redirects once and preserves attribution',()=>{const e=env({type:'back_forward',pending:pending()});assert.equal(e.redirects.length,1);const u=new URL(e.redirects[0]);assert.equal(u.pathname,'/presepio-amigurumi/voltar');assert.equal(u.searchParams.get('utm_source'),'meta');assert.equal(u.searchParams.get('utm_content'),'criativo_1');assert.equal(u.searchParams.get('fbclid'),'click-123');assert.equal(e.storage.get(S),'1');assert.equal(e.storage.has(P),false);e.emit('pageshow',{persisted:true});assert.equal(e.redirects.length,1)});
test('same-tab checkout click, departure and bfcache return recover',()=>{const e=env();e.emit('click',click());assert.equal(JSON.parse(e.storage.get(P)).departed,false);e.emit('pagehide');assert.equal(JSON.parse(e.storage.get(P)).departed,true);e.emit('pageshow',{persisted:true});assert.equal(e.redirects.length,1)});
test('a click without actual departure does not recover',()=>{const e=env();e.emit('click',click());e.emit('pageshow',{persisted:true});assert.equal(e.redirects.length,0)});
test('internal offer link does not arm recovery',()=>{const e=env();e.emit('click',{button:0,target:{closest:()=>null}});e.emit('pagehide');e.emit('pageshow',{persisted:true});assert.equal(e.redirects.length,0)});
for(const modifier of ['ctrlKey','metaKey','shiftKey','altKey','defaultPrevented'])test(`${modifier} does not arm same-tab recovery`,()=>{const e=env();e.emit('click',click({[modifier]:true}));assert.equal(e.storage.has(P),false)});
test('new-tab, middle-click and different checkout are ignored',()=>{for(const options of [{link:{target:'_blank'}},{button:1},{link:{href:'https://pay.cakto.com.br/other'}}]){const e=env();e.emit('click',click(options));assert.equal(e.storage.has(P),false)}});
test('expired or future markers are ignored',()=>{for(const time of [Date.now()-31*60*1000,Date.now()+60000])assert.equal(env({type:'back_forward',pending:{...pending(),time}}).redirects.length,0)});
test('recovery appears at most once per tab session',()=>assert.equal(env({type:'back_forward',pending:pending(),seen:true}).redirects.length,0));
test('recovery page clears pending marker and never redirects',()=>{const e=env({page:'recovery',type:'back_forward',pending:pending()});assert.equal(e.redirects.length,0);assert.equal(e.storage.has(P),false);assert.equal(e.storage.get(S),'1')});
test('blocked session storage leaves navigation usable',()=>{const e=env({blocked:true,type:'back_forward'});e.emit('click',click());e.emit('pagehide');e.emit('pageshow',{persisted:true});assert.equal(e.redirects.length,0)});
