const header=document.querySelector('[data-header]');
const menuBtn=document.querySelector('[data-menu-button]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
const reveals=[...document.querySelectorAll('.reveal')];
window.addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',window.scrollY>18),{passive:true});

if(menuBtn&&mobileMenu){
  const style=document.createElement('style');
  style.textContent='.mobile-menu[hidden]{display:none!important}.menu-btn[aria-expanded="true"] span:nth-child(1){transform:translateY(6px) rotate(45deg)}.menu-btn[aria-expanded="true"] span:nth-child(2){opacity:0}.menu-btn[aria-expanded="true"] span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}.menu-btn span{transition:transform .2s ease,opacity .2s ease}body.menu-open{overflow:hidden}';
  document.head.append(style);
  const closeMenu=()=>{
    mobileMenu.hidden=true;
    mobileMenu.setAttribute('aria-hidden','true');
    menuBtn.setAttribute('aria-expanded','false');
    menuBtn.querySelector('b')&&(menuBtn.querySelector('b').textContent='MENU');
    document.body.classList.remove('menu-open');
  };
  const openMenu=()=>{
    mobileMenu.hidden=false;
    mobileMenu.setAttribute('aria-hidden','false');
    menuBtn.setAttribute('aria-expanded','true');
    menuBtn.querySelector('b')&&(menuBtn.querySelector('b').textContent='CLOSE');
    document.body.classList.add('menu-open');
  };
  closeMenu();
  menuBtn.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    menuBtn.getAttribute('aria-expanded')==='true'?closeMenu():openMenu();
  });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  document.addEventListener('click',e=>{
    if(menuBtn.getAttribute('aria-expanded')==='true'&&!mobileMenu.contains(e.target)&&!menuBtn.contains(e.target))closeMenu();
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>980)closeMenu()},{passive:true});
}

const io=('IntersectionObserver' in window)?new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}
}),{threshold:.12}):null;
if(io){reveals.forEach(el=>io.observe(el))}else{reveals.forEach(el=>el.classList.add('is-visible'))}

const shell=document.querySelector('[data-diagnosis]');
if(shell){
  const answers={};
  const steps=[...shell.querySelectorAll('[data-step]')];
  const total=steps.length;
  const bar=shell.querySelector('[data-progress-bar]');
  const progress=shell.querySelector('[data-progress]');
  const result=shell.querySelector('[data-result]');
  let current=1;
  const showStep=n=>{
    steps.forEach(s=>s.classList.toggle('is-active',Number(s.dataset.step)===n));
    current=n;
    progress.textContent=`${n} / ${total}`;
    bar.style.width=`${(n/total)*100}%`;
  };
  const tierEls={
    a:{title:shell.querySelector('[data-tier-a-title]'),copy:shell.querySelector('[data-tier-a-copy]'),link:shell.querySelector('[data-tier-a-link]')},
    b:{title:shell.querySelector('[data-tier-b-title]'),copy:shell.querySelector('[data-tier-b-copy]'),link:shell.querySelector('[data-tier-b-link]')},
    c:{title:shell.querySelector('[data-tier-c-title]'),copy:shell.querySelector('[data-tier-c-copy]'),link:shell.querySelector('[data-tier-c-link]')}
  };
  const setTier=(key,title,copy,href,label)=>{
    const t=tierEls[key]; if(!t||!t.title)return;
    t.title.textContent=title;
    t.copy.textContent=copy;
    t.link.textContent=label;
    t.link.setAttribute('href',href);
  };
  const render=()=>{
    steps.forEach(s=>s.classList.remove('is-active'));
    progress.textContent='完了';
    bar.style.width='100%';
    result.hidden=false;
    if(answers.risk==='door'){
      setTier('a','玄関まわりの対策から確認する','補助錠や鍵の状態など、侵入に時間をかけさせる基本を先に見直します。','burglary-prevention.html#entrance','玄関の対策を見る →');
    }else if(answers.risk==='window'){
      setTier('a','窓・ベランダの死角対策を確認する','窓やベランダは死角になりやすく、補助鍵やセンサーとの組み合わせを確認します。','burglary-prevention.html#window','窓・ベランダ対策を見る →');
    }else{
      setTier('a','留守中に確認できる仕組みを優先する','外出時間が長い場合は、状況をあとから確認できる方法を優先します。','security-camera-guide.html','見守りカメラの選び方 →');
    }
    if(answers.home==='rental'||answers.work==='no'){
      setTier('b','工事不要の対策を中心に選ぶ','原状回復が必要な住まいでは、置き型・粘着タイプを中心に検討します。','rental-security-camera.html','賃貸向けの防犯カメラ →');
    }else if(answers.home==='house'){
      setTier('b','戸建て向けに侵入経路を面で見直す','戸建ては侵入経路が複数あるため、場所ごとに優先順位を付けて対策します。','house-security.html','戸建ての防犯対策 →');
    }else{
      setTier('b','専有部と共用部を分けて考える','マンションは共用部の設備と、玄関ドアなど専有部の対策を分けて確認します。','condo-security.html','マンションの防犯対策 →');
    }
    if(answers.budget==='high'){
      setTier('c','ホームセキュリティも比較する','予算に余裕がある場合は、機器だけでなく駆けつけサービスまで含めて比較できます。','home-security-compare.html','ホームセキュリティ比較 →');
    }else if(answers.risk==='door'){
      setTier('c','スマートロックも候補に入れる','締め忘れ対策や施錠管理が目的なら、賃貸可否や電池切れ対策も確認します。','smart-lock-rental.html','スマートロックを見る →');
    }else{
      setTier('c','低コスト対策を組み合わせる','補助錠やセンサーライトなど、少額でも重ねられる対策を確認します。','burglary-prevention.html','基本対策を見る →');
    }
  };
  shell.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{
    const key=btn.dataset.answer;
    answers[key]=btn.dataset.value;
    if(current<total){showStep(current+1)}else{render()}
  }));
  shell.querySelector('[data-restart]')?.addEventListener('click',()=>{
    Object.keys(answers).forEach(k=>delete answers[k]);
    result.hidden=true;
    showStep(1);
  });
}

import('./ad-router.js?v=20260921-2').then(m=>m.mountAffiliateSlots()).catch(e=>console.warn('[affiliate] init failed',e));

const siteSearch=document.querySelector('[data-site-search]');
if(siteSearch){const items=[...document.querySelectorAll('[data-search-item]')];siteSearch.addEventListener('input',()=>{const q=siteSearch.value.trim().toLowerCase();items.forEach(a=>{a.hidden=q&&!a.textContent.toLowerCase().includes(q)});document.querySelectorAll('[data-site-map] section').forEach(sec=>{sec.hidden=q&&![...sec.querySelectorAll('[data-search-item]')].some(a=>!a.hidden)})})}
document.addEventListener('click',e=>{document.querySelectorAll('.mega-nav details[open]').forEach(d=>{if(!d.contains(e.target))d.removeAttribute('open')})});

// Footer network: related sites are injected once; current site and Powered-by target are excluded from the network to avoid duplication.
(()=>{
  const footer=document.querySelector('.site-footer');
  if(!footer||footer.querySelector('.site-network')) return;

  const footerNav=footer.querySelector('nav');
  if(footerNav){
    [...footerNav.querySelectorAll('a')].forEach(a=>{
      const href=a.getAttribute('href')||'';
      if(href.includes('rss7.net')||href.includes('chat.rss7.net')) a.remove();
    });
  }

  const groups=[
    ['AI・Web制作・開発',[
      ['RSS7 AI Works','https://rss7.net/'],
      ['BitFrame','https://bitframe.rss7.net/'],
      ['Claude Code教室','https://claudecode.rss7.net/'],
      ['AI Agent','https://oosaka0123-sudo.github.io/ai-agent/']
    ]],
    ['サーフィン・スポーツ',[
      ['関西サーファーKS','https://kansai.rss7.net/'],
      ['関東サーファーKS','https://kanto.rss7.net/'],
      ['S.LEAGUE NOW','https://sleague.rss7.net/']
    ]],
    ['仏教・思想・スピリチュアル',[
      ['ブッダの教え','https://oosaka0123-sudo.github.io/buddha-no-oshie/'],
      ['密教図譜','https://oosaka0123-sudo.github.io/mikkyou-guide/'],
      ['アカシックレコード','https://oosaka0123-sudo.github.io/akashic-records-jp/']
    ]],
    ['暮らし・仕事・実用情報',[
      ['現場資格ラボ','https://genba.rss7.net/'],
      ['50PLUS','https://oosaka0123-sudo.github.io/50plus/'],
      ['50代体力研究所｜VITALITY ATLAS','https://oosaka0123-sudo.github.io/50plus-vitality-jp/']
    ]],
    ['映像・人生記録',[
      ['映像工房 軌跡','https://kiseki.rss7.net/']
    ]],
    ['FX・金融',[
      ['FX Entry Lab','https://oosaka0123-sudo.github.io/fx-entry-lab/']
    ]]
  ];

  const network=document.createElement('section');
  network.className='site-network';
  network.setAttribute('aria-label','関連サイト');
  network.innerHTML=
    '<div class="site-network-head"><span>RSS7 NETWORK</span><strong>関連サイト</strong></div>'+
    '<div class="site-network-grid">'+
      groups.map(([title,links])=>
        '<div class="site-network-group"><h2>'+title+'</h2><div>'+
        links.map(([name,url])=>
          '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+name+'<span aria-hidden="true">↗</span></a>'
        ).join('')+
        '</div></div>'
      ).join('')+
    '</div>';

  footer.insertBefore(network,footer.firstChild);

  const powered=document.createElement('div');
  powered.className='footer-powered';
  powered.innerHTML='Powered by <a href="https://chat.rss7.net/" target="_blank" rel="noopener noreferrer">チャットホームページ</a>';
  footer.appendChild(powered);
})();
