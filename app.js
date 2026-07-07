/* ===== Dr. Sathish Muthu — interactive site logic ===== */
(function(){
  const D = window.SM_DATA || {pubs:[],featured:[],nodes:[],themes:{},stats:{}};
  // PLACEHOLDER citations-per-year (replace via D.citesByYear once real Scholar numbers are provided)
  window.__PLACEHOLDER_CITES__ = {2018:60,2019:210,2020:520,2021:1150,2022:2200,2023:3400,2024:5000,2025:6300,2026:5565};

  // theme colors
  const THEME_COLORS = {
    "Spine":"#1667c4","Regenerative Medicine":"#6a5acd","Systematic Reviews":"#e0993a",
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

  /* ---------- count-up stats ---------- */
  const fmt=n=>n.toLocaleString('en-US');
  function countUp(el){
    const target=+el.dataset.count, suffix=el.dataset.suffix||'';
    const dur=1600, t0=performance.now();
    function step(now){
      const p=Math.min(1,(now-t0)/dur);
      const eased=1-Math.pow(1-p,3); // ease-out cubic
      el.textContent=fmt(Math.round(target*eased))+suffix;
      if(p<1)requestAnimationFrame(step);
      else el.textContent=fmt(target)+suffix;
    }
    requestAnimationFrame(step);
  }
  const cio=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target);}})},{threshold:.5});
  document.querySelectorAll('.num[data-count]').forEach(el=>cio.observe(el));

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
      const W=cc.clientWidth||760, H=300, padB=42, padT=34, padX=10;
      const maxV=Math.max(...vals,1);
      const n=years.length, gap=Math.max(10,Math.min(26,(W/n)*0.34));
      const slot=(W-padX*2)/n;
      const bw=slot-gap;
      // gradient + soft baseline
      const defs=document.createElementNS(NS,'defs');
      defs.innerHTML='<linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">'+
        '<stop offset="0" stop-color="var(--teal)"/><stop offset="1" stop-color="var(--teal-deep)"/></linearGradient>';
      cc.appendChild(defs);
      // baseline
      const base=document.createElementNS(NS,'line');
      base.setAttribute('x1',padX);base.setAttribute('x2',W-padX);
      base.setAttribute('y1',H-padB);base.setAttribute('y2',H-padB);
      base.setAttribute('stroke','var(--line)');base.setAttribute('stroke-width','1');
      cc.appendChild(base);
      years.forEach((y,i)=>{
        const bh=Math.max(3,(vals[i]/maxV)*(H-padB-padT));
        const x=padX+i*slot+gap/2;
        const yTop=H-padB-bh;
        const bar=document.createElementNS(NS,'rect');
        bar.setAttribute('class','cc-bar');bar.setAttribute('x',x);bar.setAttribute('y',yTop);
        bar.setAttribute('width',bw);bar.setAttribute('height',bh);bar.setAttribute('rx',5);
        bar.setAttribute('fill','url(#barGrad)');
        cc.appendChild(bar);
        // exact count data label on top of each bar
        const vl=document.createElementNS(NS,'text');vl.setAttribute('class','cc-bar-label');
        vl.setAttribute('x',x+bw/2);vl.setAttribute('y',yTop-9);
        vl.textContent=vals[i].toLocaleString();cc.appendChild(vl);
        // full year label
        const yl=document.createElementNS(NS,'text');yl.setAttribute('class','cc-year');
        yl.setAttribute('x',x+bw/2);yl.setAttribute('y',H-16);yl.textContent=y;cc.appendChild(yl);
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

  /* ---------- COLLABORATOR CHORD / RADIAL CONNECTIVITY ---------- */
  const svg=document.getElementById('network-svg');
  if(svg && D.nodes && D.nodes.length){
    const tooltip=document.getElementById('netTooltip');
    const NS="http://www.w3.org/2000/svg";

    // group colours
    const GROUP_COLORS={
      'ORG':'#1667c4',
      'AO Spine KFD':'#6a5acd',
      'GBD Study':'#e0993a',
      'Regenerative / Intl':'#2b9fd4'
    };
    const GROUP_ORDER=['ORG','AO Spine KFD','GBD Study','Regenerative / Intl'];

    // prepare collaborators sorted by group then count desc
    const collabs=D.nodes.map(n=>({...n,group:n.group||'Regenerative / Intl'}));
    const groups=GROUP_ORDER.filter(g=>collabs.some(c=>c.group===g));
    collabs.sort((a,b)=>{
      const ga=GROUP_ORDER.indexOf(a.group), gb=GROUP_ORDER.indexOf(b.group);
      if(ga!==gb) return ga-gb;
      return b.count-a.count;
    });
    const maxC=Math.max(...collabs.map(c=>c.count));
    let activeGroup=null;

    function draw(){
      const W=svg.clientWidth||900;
      const H=Math.min(680, Math.max(560, W*0.72));
      svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
      svg.innerHTML='';
      const cx=W/2, cy=H*0.52;
      const R=Math.min(W,H)*0.36;          // collaborator ring radius
      const labelR=R+16;
      const hubR=30;

      // Sathish hub at centre
      const defs=document.createElementNS(NS,'defs');
      defs.innerHTML='<radialGradient id="hubg"><stop offset="0" stop-color="#1667c4"/><stop offset="1" stop-color="#0f4a94"/></radialGradient>';
      svg.appendChild(defs);

      // arrange collaborators around a circle, leaving a gap at the very bottom (base) for the hub label
      const n=collabs.length;
      const arcStart=-Math.PI/2 + 0.28;         // start just right of top
      const arcEnd=  Math.PI*1.5 - 0.28;        // full loop minus a gap
      const span=arcEnd-arcStart;

      // group boundaries for coloured arcs
      const positions=[];
      collabs.forEach((c,i)=>{
        const ang=arcStart + span*(i/(n-1));
        positions.push(ang);
      });

      // --- draw group arc bands (outer ring) ---
      groups.forEach(g=>{
        const idxs=collabs.map((c,i)=>c.group===g?i:-1).filter(i=>i>=0);
        if(!idxs.length) return;
        const a0=positions[idxs[0]]-span/(n-1)*0.5;
        const a1=positions[idxs[idxs.length-1]]+span/(n-1)*0.5;
        const rr=labelR+30;
        const x0=cx+Math.cos(a0)*rr, y0=cy+Math.sin(a0)*rr;
        const x1=cx+Math.cos(a1)*rr, y1=cy+Math.sin(a1)*rr;
        const large=(a1-a0)>Math.PI?1:0;
        const arc=document.createElementNS(NS,'path');
        arc.setAttribute('d',`M ${x0} ${y0} A ${rr} ${rr} 0 ${large} 1 ${x1} ${y1}`);
        arc.setAttribute('fill','none');
        arc.setAttribute('stroke',GROUP_COLORS[g]);
        arc.setAttribute('stroke-width','5');
        arc.setAttribute('stroke-linecap','round');
        arc.setAttribute('opacity',activeGroup&&activeGroup!==g?0.15:0.85);
        svg.appendChild(arc);
        // group label at arc midpoint
        const am=(a0+a1)/2;
        const lx=cx+Math.cos(am)*(rr+20), ly=cy+Math.sin(am)*(rr+20);
        const gl=document.createElementNS(NS,'text');
        gl.setAttribute('x',lx);gl.setAttribute('y',ly);
        gl.setAttribute('text-anchor','middle');gl.setAttribute('dominant-baseline','middle');
        gl.setAttribute('class','net-grouplabel');
        gl.setAttribute('fill',GROUP_COLORS[g]);
        gl.textContent=g;
        svg.appendChild(gl);
      });

      // --- ribbons from hub to each collaborator ---
      collabs.forEach((c,i)=>{
        const ang=positions[i];
        const nx=cx+Math.cos(ang)*R, ny=cy+Math.sin(ang)*R;
        const dim=activeGroup&&activeGroup!==c.group;
        const w=1.5+Math.sqrt(c.count/maxC)*7;
        const rib=document.createElementNS(NS,'path');
        // quadratic curve bowing toward centre
        const mx=cx+Math.cos(ang)*R*0.35, my=cy+Math.sin(ang)*R*0.35;
        rib.setAttribute('d',`M ${cx} ${cy} Q ${mx} ${my} ${nx} ${ny}`);
        rib.setAttribute('fill','none');
        rib.setAttribute('stroke',GROUP_COLORS[c.group]);
        rib.setAttribute('stroke-width',w);
        rib.setAttribute('stroke-linecap','round');
        rib.setAttribute('opacity',dim?0.06:0.32);
        rib.setAttribute('class','net-ribbon');
        svg.appendChild(rib);
      });

      // --- collaborator nodes + labels ---
      collabs.forEach((c,i)=>{
        const ang=positions[i];
        const nx=cx+Math.cos(ang)*R, ny=cy+Math.sin(ang)*R;
        const dim=activeGroup&&activeGroup!==c.group;
        const r=4+Math.sqrt(c.count/maxC)*7;
        const node=document.createElementNS(NS,'circle');
        node.setAttribute('cx',nx);node.setAttribute('cy',ny);node.setAttribute('r',r);
        node.setAttribute('fill',GROUP_COLORS[c.group]);
        node.setAttribute('opacity',dim?0.15:1);
        node.setAttribute('class','net-node');
        node.style.cursor='pointer';
        svg.appendChild(node);

        // label
        const onRight=Math.cos(ang)>=0;
        const lx=cx+Math.cos(ang)*labelR, ly=cy+Math.sin(ang)*labelR;
        const lbl=document.createElementNS(NS,'text');
        lbl.setAttribute('x',lx);lbl.setAttribute('y',ly);
        lbl.setAttribute('text-anchor',onRight?'start':'end');
        lbl.setAttribute('dominant-baseline','middle');
        lbl.setAttribute('class','net-nodelabel');
        lbl.setAttribute('opacity',dim?0.2:1);
        // shorten name: first initial + surname
        const parts=c.name.split(' ');
        const short=parts.length>1?`${parts[0][0]}. ${parts.slice(1).join(' ')}`:c.name;
        lbl.textContent=short;
        // rotate label to follow the circle for readability
        const deg=ang*180/Math.PI;
        const rot=onRight?deg:deg+180;
        lbl.setAttribute('transform',`rotate(${rot} ${lx} ${ly})`);
        svg.appendChild(lbl);

        const showTip=(ev)=>{
          const rect=svg.getBoundingClientRect();
          tooltip.innerHTML=`<b>${c.name}</b><br>${c.count} shared papers · ${c.group}<br><span style="color:var(--muted)">${c.theme} · ${c.firstYear}–${c.lastYear}</span>`;
          tooltip.style.opacity=1;
          tooltip.style.left=(ev.clientX-rect.left+12)+'px';
          tooltip.style.top=(ev.clientY-rect.top+12)+'px';
        };
        node.addEventListener('mousemove',showTip);
        node.addEventListener('mouseleave',()=>tooltip.style.opacity=0);
      });

      // --- central hub (Sathish) drawn last, on top ---
      const hub=document.createElementNS(NS,'circle');
      hub.setAttribute('cx',cx);hub.setAttribute('cy',cy);hub.setAttribute('r',hubR);
      hub.setAttribute('fill','url(#hubg)');
      svg.appendChild(hub);
      const hi=document.createElementNS(NS,'text');
      hi.setAttribute('x',cx);hi.setAttribute('y',cy);
      hi.setAttribute('text-anchor','middle');hi.setAttribute('dominant-baseline','central');
      hi.setAttribute('class','net-hublabel');hi.textContent='SM';
      svg.appendChild(hi);
      const hn=document.createElementNS(NS,'text');
      hn.setAttribute('x',cx);hn.setAttribute('y',cy+hubR+16);
      hn.setAttribute('text-anchor','middle');
      hn.setAttribute('class','net-hubname');hn.textContent='Dr. Sathish Muthu';
      svg.appendChild(hn);
    }

    draw();
    let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(draw,200);});

    // group filter toolbar
    const bar=document.getElementById('netToolbar');
    if(bar){
      bar.insertAdjacentHTML('beforeend',
        `<button class="net-chip" data-g="__all"><span class="dot" style="background:var(--teal)"></span>All</button>`+
        groups.map(g=>`<button class="net-chip" data-g="${g}"><span class="dot" style="background:${GROUP_COLORS[g]}"></span>${g}</button>`).join(''));
      bar.querySelectorAll('.net-chip').forEach(b=>b.addEventListener('click',()=>{
        const g=b.dataset.g;activeGroup=(g==='__all')?null:g;
        bar.querySelectorAll('.net-chip').forEach(x=>x.classList.toggle('off',activeGroup&&x.dataset.g!==g&&x.dataset.g!=='__all'));
        draw();
      }));
    }
  }
})();
