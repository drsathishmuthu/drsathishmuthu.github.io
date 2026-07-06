/* ===== Dr. Sathish Muthu — interactive site logic ===== */
(function(){
  const D = window.SM_DATA || {pubs:[],featured:[],nodes:[],themes:{},stats:{}};
  // PLACEHOLDER citations-per-year (replace via D.citesByYear once real Scholar numbers are provided)
  window.__PLACEHOLDER_CITES__ = {2018:60,2019:210,2020:520,2021:1150,2022:2200,2023:3400,2024:5000,2025:6300,2026:5565};

  // theme colors
  const THEME_COLORS = {
    "Spine":"#0e7c86","Regenerative Medicine":"#6a5acd","Systematic Reviews":"#d98a2b",
    "Research Methodology":"#c0497f","AI in Healthcare":"#2b8a5a","GBD / Burden of Disease":"#3b6fd4",
    "Knee & Cartilage":"#d5604a","Orthopaedic Rheumatology":"#9a7b2e","Trauma & General Ortho":"#5a6b78",
    "Original Research":"#7a8a96"
  };
  const tc = t => THEME_COLORS[t] || "#7a8a96";

  /* ---------- year / basics ---------- */
  const yrEl = document.getElementById('yr'); if(yrEl) yrEl.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  const nav = document.getElementById('nav');
  addEventListener('scroll',()=>nav && nav.classList.toggle('scrolled', scrollY>20));
  const toggle=document.getElementById('menuToggle'), links=document.getElementById('navLinks');
  if(toggle&&links){toggle.addEventListener('click',()=>links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));}

  /* ---------- theme toggle ---------- */
  const themeBtn=document.getElementById('themeBtn'), root=document.documentElement;
  const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>';
  const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function setTheme(t){root.setAttribute('data-theme',t);const i=document.getElementById('themeIcon');
    if(i)i.outerHTML=(t==='dark'?sun:moon).replace('<svg','<svg id="themeIcon"');
    if(window.__redrawNet)window.__redrawNet();}
  setTheme(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  if(themeBtn)themeBtn.addEventListener('click',()=>setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));

  /* ---------- reveal ---------- */
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%5*55)+'ms';io.observe(el);});

  /* ---------- helpers ---------- */
  const MONTHS=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function pubRow(p){
    const tags=(p.m||[]).slice(0,2).map(t=>`<span class="mini-tag" style="border-color:${tc(t)}55;color:${tc(t)}">${t}</span>`).join('');
    const auth=p.a?`<div class="pa">${p.f?'<span class="lead">Muthu S</span>, ':''}${p.a.replace(/^S\.?\s*Muthu,?\s*/,'')}</div>`:'';
    return `<a class="pub" href="${p.d}" target="_blank" rel="noopener">
      <div class="pub-year">${p.y}${p.c?`<span class="cite">${p.c} cites</span>`:''}</div>
      <div class="pub-main"><div class="pj">${p.s||'—'}</div><div class="pt">${p.t}</div>${auth}</div>
      <div class="pub-tags">${tags}</div></a>`;
  }

  /* ---------- recent strip ---------- */
  const rs=document.getElementById('recentStrip');
  if(rs){
    const recent=[...D.pubs].sort((a,b)=>b.y-a.y).slice(0,6);
    rs.innerHTML=recent.map(p=>`<a class="recent-item" href="${p.d}" target="_blank" rel="noopener">
      <div class="rd">${p.y} · ${(p.m&&p.m[0])||'Research'}</div>
      <div class="rt">${p.t.length>90?p.t.slice(0,90)+'…':p.t}</div>
      <div class="rj">${p.s||''}</div></a>`).join('');
  }

  /* ---------- featured filter ---------- */
  const fFilter=document.getElementById('featFilter'), fList=document.getElementById('featList'), fShown=document.getElementById('featShown');
  if(fFilter&&fList){
    const feats=D.featured.length?D.featured:D.pubs.slice(0,16);
    // themes present in featured
    const tset={}; feats.forEach(p=>(p.m||[]).forEach(t=>tset[t]=(tset[t]||0)+1));
    const order=["Spine","Regenerative Medicine","Systematic Reviews","Research Methodology","AI in Healthcare","GBD / Burden of Disease","Knee & Cartilage","Orthopaedic Rheumatology"];
    const themes=order.filter(t=>tset[t]);
    let active="All";
    function render(){
      const show = active==="All"?feats:feats.filter(p=>(p.m||[]).includes(active));
      fList.innerHTML=show.map(pubRow).join('');
      if(fShown)fShown.textContent=show.length;
      fFilter.querySelectorAll('.chip-btn').forEach(b=>b.classList.toggle('active',b.dataset.t===active));
    }
    fFilter.innerHTML=`<button class="chip-btn active" data-t="All">All <span class="ct">${feats.length}</span></button>`+
      themes.map(t=>`<button class="chip-btn" data-t="${t}"><span class="dot"></span>${t} <span class="ct">${tset[t]}</span></button>`).join('');
    fFilter.querySelectorAll('.chip-btn').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.t;render();}));
    render();
  }

  /* ---------- CITATION METRICS CHART (Scholar-style) ---------- */
  const cc=document.getElementById('citeChart');
  if(cc){
    // yearly citations: use provided data if present, else placeholder to be replaced
    const cby = (D.citesByYear && Object.keys(D.citesByYear).length) ? D.citesByYear : window.__PLACEHOLDER_CITES__;
    const m = D.metrics||{};
    if(m.citAll)document.getElementById('mCitAll').textContent=m.citAll;
    if(m.citRec)document.getElementById('mCitRec').textContent=m.citRec;
    if(m.hAll)document.getElementById('mHAll').textContent=m.hAll;
    if(m.hRec)document.getElementById('mHRec').textContent=m.hRec;
    if(m.iAll)document.getElementById('mIAll').textContent=m.iAll;
    if(m.iRec)document.getElementById('mIRec').textContent=m.iRec;

    const years=Object.keys(cby).map(Number).sort((a,b)=>a-b);
    const vals=years.map(y=>cby[y]);
    const NS="http://www.w3.org/2000/svg";
    const tip=document.getElementById('ccTip');
    function drawChart(){
      cc.innerHTML='';
      const W=cc.clientWidth||760, H=280, padB=28, padT=20, padX=6;
      const maxV=Math.max(...vals,1);
      const n=years.length, gap=6;
      const bw=(W-padX*2)/n - gap;
      years.forEach((y,i)=>{
        const bh=Math.max(2,(vals[i]/maxV)*(H-padB-padT));
        const x=padX+i*((W-padX*2)/n)+gap/2;
        const yTop=H-padB-bh;
        const bar=document.createElementNS(NS,'rect');
        bar.setAttribute('class','cc-bar');bar.setAttribute('x',x);bar.setAttribute('y',yTop);
        bar.setAttribute('width',bw);bar.setAttribute('height',bh);bar.setAttribute('rx',3);
        cc.appendChild(bar);
        // value label on top
        if(bw>16){const vl=document.createElementNS(NS,'text');vl.setAttribute('class','cc-bar-label');
          vl.setAttribute('x',x+bw/2);vl.setAttribute('y',yTop-5);vl.textContent=vals[i]>=1000?(vals[i]/1000).toFixed(1)+'k':vals[i];cc.appendChild(vl);}
        // year label (show every other if crowded)
        if(n<=14||i%2===0){const yl=document.createElementNS(NS,'text');yl.setAttribute('class','cc-year');
          yl.setAttribute('x',x+bw/2);yl.setAttribute('y',H-10);yl.textContent="'"+String(y).slice(2);cc.appendChild(yl);}
        // hover
        bar.addEventListener('mousemove',ev=>{const r=cc.getBoundingClientRect();
          tip.innerHTML=`<b>${y}</b> · ${vals[i].toLocaleString()} citations`;tip.style.opacity=1;
          tip.style.left=(ev.clientX-r.left+10)+'px';tip.style.top=(ev.clientY-r.top-10)+'px';});
        bar.addEventListener('mouseleave',()=>tip.style.opacity=0);
      });
    }
    drawChart();
    let ct;addEventListener('resize',()=>{clearTimeout(ct);ct=setTimeout(drawChart,200);});
  }

  /* ---------- CO-AUTHOR NETWORK (force sim) ---------- */
  const svg=document.getElementById('network-svg');
  if(svg && D.nodes.length){
    const tooltip=document.getElementById('netTooltip');
    const NS="http://www.w3.org/2000/svg";
    let W=svg.clientWidth||900, H=560;
    // central node = Sathish
    const center={id:"__SM",name:"Sathish Muthu",count:Math.max(...D.nodes.map(n=>n.count)),theme:"Spine",center:true};
    const nodes=[center, ...D.nodes.map(n=>({...n}))];
    const maxC=Math.max(...D.nodes.map(n=>n.count));
    const links=D.nodes.map(n=>({s:"__SM",t:n.id,w:n.count}));
    const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));

    function radius(n){return n.center?26:6+Math.sqrt(n.count/maxC)*20;}
    // init positions in a circle
    nodes.forEach((n,i)=>{
      if(n.center){n.x=W/2;n.y=H/2;}
      else{const a=(i/nodes.length)*Math.PI*2;n.x=W/2+Math.cos(a)*(120+Math.random()*160);n.y=H/2+Math.sin(a)*(90+Math.random()*140);}
      n.vx=0;n.vy=0;
    });

    let activeTheme=null, dragNode=null, raf=null;

    // build DOM
    let gLinks=document.createElementNS(NS,'g'), gNodes=document.createElementNS(NS,'g');
    svg.appendChild(gLinks);svg.appendChild(gNodes);
    const linkEls=links.map(l=>{const e=document.createElementNS(NS,'line');e.setAttribute('class','net-link');
      e.setAttribute('stroke-width',Math.max(.5,Math.sqrt(l.w)/1.6));gLinks.appendChild(e);return e;});
    const nodeEls=nodes.map(n=>{
      const g=document.createElementNS(NS,'g');g.setAttribute('class','net-node');
      const c=document.createElementNS(NS,'circle');c.setAttribute('r',radius(n));
      c.setAttribute('fill',n.center?'var(--teal-deep)':tc(n.theme));
      c.setAttribute('stroke',n.center?'#fff':'var(--surface)');c.setAttribute('stroke-width',n.center?3:1.5);
      const t=document.createElementNS(NS,'text');t.setAttribute('text-anchor','middle');
      t.setAttribute('dy',-radius(n)-4);t.textContent=n.center?'Sathish Muthu':n.name;
      if(n.center)g.classList.add('show-label');
      g.appendChild(c);g.appendChild(t);gNodes.appendChild(g);
      // interactions
      g.addEventListener('mouseenter',ev=>{
        g.classList.add('show-label');
        if(!n.center&&tooltip){
          tooltip.innerHTML=`<div class="tn">${n.name}</div><div class="tm">${n.theme}</div><div style="margin-top:4px;font-size:.74rem">${n.count} shared papers${n.firstYear?` · ${n.firstYear}–${n.lastYear}`:''}</div>`;
          tooltip.style.opacity=1;
        }
      });
      g.addEventListener('mousemove',ev=>{if(tooltip&&!n.center){const r=svg.getBoundingClientRect();
        tooltip.style.left=(ev.clientX-r.left+14)+'px';tooltip.style.top=(ev.clientY-r.top+14)+'px';}});
      g.addEventListener('mouseleave',()=>{if(!n.center)g.classList.remove('show-label');if(tooltip)tooltip.style.opacity=0;});
      // drag
      g.addEventListener('pointerdown',ev=>{dragNode=n;n.fixed=true;g.setPointerCapture(ev.pointerId);ev.preventDefault();});
      return {g,c,t};
    });

    function onMove(ev){
      if(!dragNode)return;const r=svg.getBoundingClientRect();
      dragNode.x=ev.clientX-r.left;dragNode.y=ev.clientY-r.top;dragNode.vx=0;dragNode.vy=0;kick();
    }
    function onUp(){if(dragNode){dragNode.fixed=false;dragNode=null;}}
    svg.addEventListener('pointermove',onMove);
    addEventListener('pointerup',onUp);

    // simple force sim
    function step(){
      const cx=W/2, cy=H/2;
      for(let i=0;i<nodes.length;i++){
        const a=nodes[i];if(a.fixed||a.center){if(a.center){a.x=cx;a.y=cy;}continue;}
        // center gravity
        a.vx+=(cx-a.x)*0.002; a.vy+=(cy-a.y)*0.002;
        // repulsion
        for(let j=0;j<nodes.length;j++){if(i===j)continue;const b=nodes[j];
          let dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy||1;if(d2<40000){const f=380/d2;a.vx+=dx*f;a.vy+=dy*f;}}
      }
      // link spring to center
      links.forEach(l=>{const b=byId[l.t];if(b.fixed||b.center)return;
        const desired=90+ (1-Math.sqrt(l.w/maxC))*150;
        const dx=b.x-cx,dy=b.y-cy,dist=Math.hypot(dx,dy)||1,diff=(desired-dist)/dist*0.06;
        b.vx-=dx*diff;b.vy-=dy*diff;});
      nodes.forEach(n=>{if(n.fixed||n.center)return;n.vx*=0.86;n.vy*=0.86;n.x+=n.vx;n.y+=n.vy;
        n.x=Math.max(20,Math.min(W-20,n.x));n.y=Math.max(24,Math.min(H-16,n.y));});
      draw();
    }
    function draw(){
      links.forEach((l,i)=>{const a=byId[l.s],b=byId[l.t];const e=linkEls[i];
        e.setAttribute('x1',a.x);e.setAttribute('y1',a.y);e.setAttribute('x2',b.x);e.setAttribute('y2',b.y);
        const dim=activeTheme&&b.theme!==activeTheme;e.setAttribute('stroke-opacity',dim?.06:.5);
        e.setAttribute('stroke',dim?'var(--line)':tc(b.theme));});
      nodes.forEach((n,i)=>{const {g,c,t}=nodeEls[i];g.setAttribute('transform',`translate(${n.x},${n.y})`);
        t.setAttribute('dy',-radius(n)-4);
        const dim=activeTheme&&!n.center&&n.theme!==activeTheme;g.style.opacity=dim?.18:1;});
    }
    window.__redrawNet=draw;
    let energy=0;
    function loop(){step();energy++;if(energy<600||dragNode){raf=requestAnimationFrame(loop);}else{raf=null;}}
    function kick(){energy=0;if(!raf)raf=requestAnimationFrame(loop);}
    loop();

    // resize
    let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{W=svg.clientWidth||900;kick();},200);});

    // theme filter toolbar
    const bar=document.getElementById('netToolbar');
    if(bar){
      const themesInNet=[...new Set(D.nodes.map(n=>n.theme))];
      const order=["Spine","Regenerative Medicine","Systematic Reviews","Research Methodology","AI in Healthcare","GBD / Burden of Disease","Knee & Cartilage","Orthopaedic Rheumatology","Trauma & General Ortho","Original Research"];
      const ordered=order.filter(t=>themesInNet.includes(t));
      bar.insertAdjacentHTML('beforeend',
        `<button class="net-chip" data-t="__all"><span class="dot" style="background:var(--teal)"></span>All</button>`+
        ordered.map(t=>`<button class="net-chip" data-t="${t}"><span class="dot" style="background:${tc(t)}"></span>${t}</button>`).join(''));
      bar.querySelectorAll('.net-chip').forEach(b=>b.addEventListener('click',()=>{
        const t=b.dataset.t;activeTheme=(t==='__all')?null:t;
        bar.querySelectorAll('.net-chip').forEach(x=>x.classList.toggle('off',activeTheme&&x.dataset.t!==t&&x.dataset.t!=='__all'));
        draw();
      }));
    }
  }
})();
