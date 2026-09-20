export class AdRouter {
  constructor(registry){this.ads=Array.isArray(registry?.ads)?registry.ads:[]}
  eligible(){return this.ads.filter(ad=>ad.approved===true&&ad.active===true&&(ad.url||ad.sourceHtml))}
  select(context=[]){const tags=new Set(context);const eligible=this.eligible();const intents=['camera','smart-lock','sensor-light','home-security'];const activeIntent=intents.find(t=>tags.has(t));const pool=activeIntent&&eligible.some(ad=>(ad.category||[]).includes(activeIntent))?eligible.filter(ad=>(ad.category||[]).includes(activeIntent)):eligible;return pool.map(ad=>({...ad,score:Number(ad.priority||0)+(ad.category||[]).reduce((n,t)=>n+(tags.has(t)?20:0),0)})).sort((a,b)=>b.score-a.score)[0]||null}
  render(anchor,context=[]){if(!anchor)return;const ad=this.select(context);if(!ad){anchor.hidden=true;return}anchor.hidden=false;anchor.innerHTML='';const badge=document.createElement('span');badge.textContent='PR';badge.className='ad-label';const track=()=>window.dispatchEvent(new CustomEvent('bouhan:affiliate-click',{detail:{adId:ad.id,network:ad.network,path:location.pathname}}));if(ad.sourceHtml){const wrap=document.createElement('div');wrap.className='ad-official-html';wrap.dataset.adId=ad.id;wrap.dataset.network=ad.network;wrap.innerHTML=ad.sourceHtml;wrap.addEventListener('click',e=>{if(e.target.closest('a'))track()});anchor.append(badge,wrap);return}const link=document.createElement('a');link.href=ad.url;link.rel='sponsored nofollow noopener';link.target='_blank';link.textContent=ad.label;link.dataset.adId=ad.id;link.dataset.network=ad.network;link.addEventListener('click',track);anchor.append(badge,link)}
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
'door':['玄関','ドア'],'outdoor':['屋外','ベランダ','駐車場']};
export function inferPageContext(){const src=`${location.pathname} ${document.title} ${(document.querySelector('main')?.innerText||'').slice(0,6000)}`;const tags=[];Object.entries(keywordMap).forEach(([tag,words])=>{if(words.some(w=>src.includes(w)))tags.push(tag)});return [...new Set(tags)]}
export async function mountAffiliateSlots(){const slots=[...document.querySelectorAll('[data-affiliate-slot]')];if(!slots.length)return;try{const r=await fetch('data/ads.json',{cache:'no-store'});if(!r.ok)throw new Error(`ad registry ${r.status}`);const router=new AdRouter(await r.json());const inferred=inferPageContext();slots.forEach(slot=>{const explicit=(slot.dataset.context||'').split(',').map(v=>v.trim()).filter(Boolean);router.render(slot,[...new Set([...inferred,...explicit])])})}catch(e){console.warn('[affiliate] registry unavailable',e);slots.forEach(s=>s.hidden=true)}}
