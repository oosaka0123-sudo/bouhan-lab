let linkSwitchPromise=null;
export async function loadValueCommerceLinkSwitch(){
  if(linkSwitchPromise)return linkSwitchPromise;
  linkSwitchPromise=(async()=>{
    const res=await fetch('data/valuecommerce.runtime.json',{cache:'no-store'});
    if(!res.ok)return false;
    const cfg=await res.json();
    const pid=String(cfg?.pid||'').trim();
    if(!/^\d+$/.test(pid))return false;
    globalThis.vc_pid=pid;
    if(document.querySelector('script[data-vc-linkswitch]'))return true;
    return await new Promise(resolve=>{
      const script=document.createElement('script');
      script.src='https://aml.valuecommerce.com/vcdal.js';
      script.async=true;
      script.dataset.vcLinkswitch='';
      script.onload=()=>resolve(true);
      script.onerror=()=>resolve(false);
      document.head.appendChild(script);
    });
  })().catch(()=>false);
  return linkSwitchPromise;
}

export class AdRouter {
  constructor(registry){this.ads=Array.isArray(registry?.ads)?registry.ads:[]}
  eligible(){return this.ads.filter(ad=>ad.approved===true&&ad.active===true&&(ad.url||ad.sourceHtml))}
  select(context=[]){const tags=new Set(context);const eligible=this.eligible().filter(ad=>ad.pinnedOnly!==true);const intents=['camera','smart-lock','sensor-light','alarm','home-security'];const activeIntent=context.find(t=>intents.includes(t));const pool=activeIntent&&eligible.some(ad=>(ad.category||[]).includes(activeIntent))?eligible.filter(ad=>(ad.category||[]).includes(activeIntent)):eligible;return pool.map(ad=>({...ad,score:Number(ad.priority||0)+(ad.category||[]).reduce((n,t)=>n+(tags.has(t)?20:0),0)})).sort((a,b)=>b.score-a.score)[0]||null}
  render(anchor,context=[],preferredId=''){if(!anchor)return null;const ad=preferredId?(this.eligible().find(item=>item.id===preferredId)||null):this.select(context);if(!ad){anchor.hidden=true;return null}anchor.hidden=false;anchor.innerHTML='';const badge=document.createElement('span');badge.textContent='PR';badge.className='ad-label';const track=()=>window.dispatchEvent(new CustomEvent('bouhan:affiliate-click',{detail:{adId:ad.id,network:ad.network,path:location.pathname}}));if(ad.sourceHtml){const wrap=document.createElement('div');wrap.className='ad-official-html';wrap.dataset.adId=ad.id;wrap.dataset.network=ad.network;wrap.innerHTML=ad.sourceHtml;wrap.addEventListener('click',e=>{if(e.target.closest('a'))track()});anchor.append(badge,wrap);return ad}const link=document.createElement('a');link.href=ad.url;link.rel='sponsored nofollow noopener';link.target='_blank';link.textContent=ad.label;link.dataset.adId=ad.id;link.dataset.network=ad.network;link.addEventListener('click',track);anchor.append(badge,link);return ad}
}
const keywordMap={
'home-security':['ホームセキュリティ','SECOM','ALSOK','セコム','アルソック','駆けつけ'],
'camera':['防犯カメラ','見守りカメラ','監視カメラ','録画','暗視'],
'smart-lock':['スマートロック','電子錠','鍵','補助錠'],
'sensor-light':['センサーライト','人感ライト','人感センサー','外灯'],
'rental':['賃貸','原状回復','穴あけ','工事不要'],
'house':['戸建て','一戸建て','住宅'],
'condo':['マンション','集合住宅','共用部'],
'away':['留守','長期不在','外出'],
'door':['玄関','ドア'],'outdoor':['屋外','ベランダ','駐車場'],'alarm':['防犯ブザー','防犯アラーム','ブザー']};
export function inferPageContext(){const src=`${location.pathname} ${document.title} ${(document.querySelector('main')?.innerText||'').slice(0,6000)}`;const tags=[];Object.entries(keywordMap).forEach(([tag,words])=>{if(words.some(w=>src.includes(w)))tags.push(tag)});return [...new Set(tags)]}
export async function mountAffiliateSlots(){const slots=[...document.querySelectorAll('[data-affiliate-slot]')];if(!slots.length)return;try{const res=await fetch('data/ads.json',{cache:'no-store'});if(!res.ok)throw new Error(`ad registry ${res.status}`);const base=await res.json();let runtime={ads:[]};try{const rr=await fetch('data/ads.runtime.json',{cache:'no-store'});if(rr.ok)runtime=await rr.json()}catch{}const map=new Map((base.ads||[]).map(ad=>[ad.id,ad]));(runtime.ads||[]).forEach(ad=>map.set(ad.id,{...(map.get(ad.id)||{}),...ad}));const router=new AdRouter({ads:[...map.values()]});const inferred=inferPageContext();const rendered=[];slots.forEach(slot=>{const explicit=(slot.dataset.context||'').split(',').map(v=>v.trim()).filter(Boolean);const ad=router.render(slot,[...new Set([...explicit,...inferred])],(slot.dataset.adId||'').trim());if(ad)rendered.push({slot,ad})});const linkSwitchSlots=rendered.filter(({ad})=>ad.network==='valuecommerce'&&ad.type==='linkswitch');if(linkSwitchSlots.length){const ok=await loadValueCommerceLinkSwitch();if(!ok){console.warn('[affiliate] LinkSwitch runtime unavailable');linkSwitchSlots.forEach(({slot})=>{slot.innerHTML='';slot.hidden=true})}}}catch(e){console.warn('[affiliate] registry unavailable',e);slots.forEach(s=>s.hidden=true)}}


const amazonProductMap={
  '/tapo-c530ws.html':'B0DMV8ZR4V',
  '/tapo-c425.html':'B0CQ233LB8',
  '/tapo-c520ws.html':'B0CCV51F5R'
};

export async function mountAmazonAssociateCta(){
  const asin=amazonProductMap[location.pathname];
  if(!asin)return false;
  const box=document.querySelector('.buy-box');
  if(!box)return false;
  try{
    const res=await fetch('data/amazon.runtime.json',{cache:'no-store'});
    if(!res.ok)return false;
    const cfg=await res.json();
    const tag=String(cfg?.tag||'').trim();
    if(!/^[A-Za-z0-9_-]+-22$/.test(tag))return false;
    if(box.querySelector('.amazon-btn'))return true;
    const yahoo=box.querySelector('.yahoo-btn');
    const actions=document.createElement('div');
    actions.className='buy-actions';
    if(yahoo){
      yahoo.parentNode.insertBefore(actions,yahoo);
      actions.appendChild(yahoo);
    }else{
      box.appendChild(actions);
    }
    const a=document.createElement('a');
    a.className='amazon-btn';
    a.href='https://www.amazon.co.jp/dp/'+asin+'/ref=nosim?tag='+encodeURIComponent(tag);
    a.target='_blank';
    a.rel='sponsored nofollow noopener';
    const model=(document.querySelector('h1')?.textContent||'商品').trim();
    a.textContent='Amazonで'+model+'を見る';
    actions.appendChild(a);
    return true;
  }catch{return false}
}
