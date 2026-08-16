/* ===================================================================
   Multi-page site engine — mobile menu, particles, tilt, AOS, lightbox
   Each page is now its own HTML file (index.html + pages/*.html)
=================================================================== */

/* ---- mobile menu ---- */
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('ham');
  const navLinks = document.getElementById('navLinks');
  if (ham && navLinks) {
    ham.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('button, a').forEach(el => {
      el.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
});

/* ===== SYLLABUS PAGES: auto stat chip for the roadmap ===== */
(function upgradeSyllabusPages(){
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('.page[id^="page-"]');
    if (!page) return;
    const rows = page.querySelectorAll('.tl-step').length;
    const modules = new Set(Array.from(page.querySelectorAll('.mod-tag')).map(m => m.textContent.trim())).size;
    const heroInner = page.querySelector('.syl-hero-inner');
    if (heroInner && rows){
      const chip = document.createElement('div');
      chip.className = 'syl-stat-chip';
      const modulesHtml = modules ? '<span><b>' + modules + '</b>Modules</span>' : '';
      chip.innerHTML = '<span><b>' + rows + '</b>Topics</span>' + modulesHtml + '<span><b>100%</b>Hands-on</span>';
      heroInner.appendChild(chip);
    }
  });
})();

/* ===== PROJECTS PAGE: short titles + scan-friendly badges ===== */
(function upgradeProjectCards(){
  const titles = [
    'AWS 20+ Services App','AWS Python DR','Azure Spring Boot','GCP Node.js App','DMS Migration',
    'On-Prem to AWS','S3 Static Website','Lambda Backups','CloudFront Automation','ECS Fargate CI/CD',
    'Prometheus Grafana','CloudWatch Logging','Terraform Multi-Cloud','Tomcat CI/CD','Jenkins Kubernetes',
    'GitLab EKS','Azure DevOps AKS','GitLab GKE','Microservices GitOps','Terraform Kubernetes',
    'Serverless Platform','Ansible Operations','Docker Compose Stack','EKS ELK Observability','ALB Path Routing',
    'AWS SSO IAM','Argo CD GitHub Actions','Ingress Controllers','OTP Microservices','OTP Auth Platform'
  ];
  const badges = [
    ['AWS','HA','Monitoring'],['AWS','EC2','DR'],['Azure','Java','DR'],['GCP','Node.js','Security'],['AWS','DMS','RDS'],
    ['Migration','AWS','Security'],['S3','CDN','Domain'],['Lambda','Backup','Serverless'],['CloudFront','Lambda','CDN'],['ECS','Fargate','CI/CD'],
    ['Prometheus','Grafana','Ops'],['CloudWatch','S3','Lambda'],['Terraform','AWS','Azure/GCP'],['Maven','Tomcat','CI/CD'],['Jenkins','K8s','Node.js'],
    ['GitLab','EKS','K8s'],['Azure DevOps','AKS','Docker'],['GitLab','GKE','Docker'],['Helm','GitOps','EFK'],['Terraform','K8s','HA'],
    ['Lambda','API GW','DynamoDB'],['Ansible','Patch','Monitoring'],['Docker','Compose','Full Stack'],['EKS','ELK','Logs'],['EC2','ALB','Routing'],
    ['AWS SSO','IAM','Enterprise'],['Argo CD','EKS','Actions'],['Ingress','K8s','HA'],['OTP','CI/CD','K8s'],['Auth','AWS','DevOps']
  ];
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#page-projects .proj-card').forEach((card, i) => {
      if (card.querySelector('.proj-title')) return;
      const text = card.querySelector('.proj-txt');
      if (!text) return;
      const title = document.createElement('span');
      title.className = 'proj-title';
      title.textContent = titles[i] || 'Cloud DevOps Project';
      const meta = document.createElement('div');
      meta.className = 'proj-meta';
      meta.innerHTML = (badges[i] || ['Cloud','DevOps','Hands-on']).map(label => '<span>' + label + '</span>').join('');
      text.before(title);
      text.after(meta);
    });
  });
})();

/* ===== REVIEWS PAGE: data + render ===== */
const reviewNums = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16];
const placementNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

function renderReviewsAndPlacements(){
  const rGrid = document.getElementById('reviewsGrid');
  if (rGrid && !rGrid.dataset.built) {
    rGrid.innerHTML = reviewNums.map((n,i) => `
      <div class="review-card" onclick="openLightbox('review',${i})">
        <span class="quote-mark">❝</span>
        <img class="review-img" alt="Student review ${n}" src="../docs/review${n}.png">
        <div class="rev-zoom-hint"><span>🔍 Click to enlarge</span></div>
        <div class="review-foot"><span>Verified course review</span><span class="stars">★★★★★</span></div>
      </div>`).join('');
    rGrid.dataset.built = '1';
  }
  const pGrid = document.getElementById('placementGrid');
  if (pGrid && !pGrid.dataset.built) {
    pGrid.innerHTML = placementNums.map((n,i) => `
      <div class="place-card" onclick="openLightbox('placement',${i})">
        <img class="place-img" alt="Placement student ${n}" src="../docs/p${n}.jpg">
        <div class="place-overlay"><span class="place-badge">✅ Placed Successfully</span></div>
      </div>`).join('');
    pGrid.dataset.built = '1';
  }
}
document.addEventListener('DOMContentLoaded', renderReviewsAndPlacements);

function switchRevTab(which){
  const isReviews = which === 'reviews';
  document.getElementById('rev-panel-reviews').classList.toggle('active', isReviews);
  document.getElementById('rev-panel-placements').classList.toggle('active', !isReviews);
  document.getElementById('revTabReviews').classList.toggle('active', isReviews);
  document.getElementById('revTabPlacements').classList.toggle('active', !isReviews);
}

/* ===== LIGHTBOX ===== */
let lbMode = 'review';
let lbIndex = 0;
function lbSrcFor(mode, idx){
  if (mode === 'review') return '../docs/review' + reviewNums[idx] + '.png';
  return '../docs/p' + placementNums[idx] + '.jpg';
}
function lbLenFor(mode){ return mode === 'review' ? reviewNums.length : placementNums.length; }
function openLightbox(mode, idx){
  lbMode = mode; lbIndex = idx;
  updateLightbox();
  document.getElementById('reviewLightbox').classList.add('open');
}
function updateLightbox(){
  document.getElementById('reviewLightboxImg').src = lbSrcFor(lbMode, lbIndex);
  document.getElementById('reviewLightboxCaption').textContent = lbMode === 'review' ? 'Verified Student Review' : 'Placement Success Story';
  document.getElementById('reviewLightboxCounter').textContent = (lbIndex+1) + ' / ' + lbLenFor(lbMode);
}
function closeLightbox(){ document.getElementById('reviewLightbox').classList.remove('open'); }
function lbNext(){ lbIndex = (lbIndex+1) % lbLenFor(lbMode); updateLightbox(); }
function lbPrev(){ lbIndex = (lbIndex-1+lbLenFor(lbMode)) % lbLenFor(lbMode); updateLightbox(); }

document.addEventListener('DOMContentLoaded', () => {
  const lbEl = document.getElementById('reviewLightbox');
  if (!lbEl) return;
  document.getElementById('reviewLightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('reviewLightboxNext').addEventListener('click', e => { e.stopPropagation(); lbNext(); });
  document.getElementById('reviewLightboxPrev').addEventListener('click', e => { e.stopPropagation(); lbPrev(); });
  lbEl.addEventListener('click', e => { if (e.target === lbEl) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lbEl.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'ArrowLeft') lbPrev();
  });
});

/* ===================================================================
   ADVANCED FX LAYER
   tsParticles per-page TOOL-LOGO networks · command-rain canvas ·
   AOS choreography · logo orbits · typed terminal · tilt · parallax
=================================================================== */
(function fxLayer(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 760;

  const L = n => (window.LOGOS && window.LOGOS[n]) || '';
  const logoSets = {
    'home':          ['aws','azure','gcp','docker','kubernetes','terraform','jenkins','python'],
    'page-aws':      ['aws','terraform','python','linux','git','docker'],
    'page-azure':    ['azure','docker','kubernetes','git','terraform','nodejs'],
    'page-gcp':      ['gcp','kubernetes','docker','gitlab','terraform','nodejs'],
    'page-devops':   ['docker','kubernetes','jenkins','terraform','ansible','grafana','prometheus','git'],
    'page-genai':    ['openai','python','langchain','huggingface','pinecone','tensorflow','pytorch','docker'],
    'page-reviews':  ['aws','docker','kubernetes','python','terraform','jenkins'],
    'page-projects': ['aws','azure','gcp','docker','kubernetes','jenkins','terraform','nginx']
  };
  const pageColors = {
    'home':          ['#22d3ee','#818cf8','#f472b6'],
    'page-aws':      ['#FF9900','#ffb84d'],
    'page-azure':    ['#0089D6','#7bdff6'],
    'page-gcp':      ['#34A853','#4285F4'],
    'page-devops':   ['#38ef7d','#00c6ff'],
    'page-genai':    ['#f5576c','#8e54e9'],
    'page-reviews':  ['#fbbf24','#f472b6'],
    'page-projects': ['#ff5e62','#00c6ff']
  };

  function currentPageId(){
    const p = document.querySelector('.page[id]');
    return p ? p.id : 'home';
  }
  const pid = currentPageId();

  /* ---- 0. Injected chrome: scroll progress + back-to-top ---- */
  const prog = document.createElement('div'); prog.id = 'scrollProgress'; document.body.appendChild(prog);
  const toTop = document.createElement('button'); toTop.id = 'toTop'; toTop.setAttribute('aria-label','Back to top'); toTop.textContent = '↑';
  toTop.onclick = () => window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'});
  document.body.appendChild(toTop);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    toTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  /* ---- 1. tsParticles — per-page network of REAL tool logos ---- */
  const pDiv = document.createElement('div'); pDiv.id = 'particles-bg';
  document.body.insertBefore(pDiv, document.body.firstChild);
  function particleConfig(id){
    const cols = pageColors[id] || pageColors['home'];
    const logos = logoSets[id] || logoSets['home'];
    const speeds = { 'page-aws':1.3, 'page-devops':1.5, 'page-projects':1.8, 'page-genai':0.8, 'page-reviews':0.7 };
    return {
      fpsLimit: 60,
      fullScreen: { enable: false },
      detectRetina: true,
      background: { color: 'transparent' },
      particles: {
        number: { value: isMobile ? 16 : 34, density: { enable: true, area: 1000 } },
        color: { value: cols },
        shape: {
          type: ['circle','image'],
          image: logos.filter(n => !['ansible','github','linux'].includes(n)).map(n => ({ src: L(n), width: 64, height: 64 }))
        },
        opacity: { value: { min: 0.25, max: 0.6 },
          animation: { enable: true, speed: 0.6, minimumValue: 0.15, sync: false } },
        size: { value: { min: 5, max: isMobile ? 12 : 16 } },
        rotate: { value: { min: 0, max: 360 }, direction: 'random',
          animation: { enable: true, speed: 4, sync: false } },
        links: { enable: true, distance: 150, color: cols[0], opacity: 0.22, width: 1 },
        move: { enable: true, speed: speeds[id] || 1, random: true, outModes: { default: 'out' } }
      },
      interactivity: {
        detectsOn: 'window',
        events: { onHover: { enable: !isMobile, mode: 'grab' }, onClick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 180, links: { opacity: 0.5 } }, push: { quantity: 2 } }
      }
    };
  }
  if (!reduced && window.tsParticles) {
    tsParticles.load('particles-bg', particleConfig(pid));
  }

  /* ---- 1.5 Command rain — falling commands (DevOps & GenAI pages) ---- */
  const rainWords = {
    'page-devops': ['kubectl get pods','docker build .','terraform apply','git push','helm install','ansible-playbook','docker ps','kubectl apply','git merge','jenkins build','argocd sync','docker push'],
    'page-genai':  ['import torch','model.fit()','01011010','pip install openai','agent.run()','predict()','tensor.cuda()','loss.backward()','01101001','copilot >>','train(model)','llm.invoke()']
  };
  (function startRain(){
    if (reduced || isMobile || !rainWords[pid]) return;
    const words = rainWords[pid];
    const color = (pageColors[pid] || ['#38ef7d'])[0];
    const c = document.createElement('canvas'); c.id = 'cmdRain'; document.body.insertBefore(c, pDiv.nextSibling);
    const ctx = c.getContext('2d');
    const fit = () => { c.width = innerWidth; c.height = innerHeight; };
    fit(); addEventListener('resize', fit);
    const COLS = Math.floor(innerWidth / 160);
    const drops = Array.from({length: COLS}, (_, i) => ({
      x: i * 160 + 20 + Math.random() * 60, y: Math.random() * innerHeight,
      v: 0.6 + Math.random() * 1.1, w: words[(Math.random() * words.length) | 0]
    }));
    (function loop(){
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.font = '12px "JetBrains Mono", monospace';
      drops.forEach(d => {
        const grad = ctx.createLinearGradient(0, d.y - 60, 0, d.y);
        grad.addColorStop(0, 'transparent'); grad.addColorStop(1, color);
        ctx.fillStyle = grad; ctx.globalAlpha = 0.5;
        ctx.fillText(d.w, d.x, d.y);
        ctx.globalAlpha = 1;
        d.y += d.v;
        if (d.y > c.height + 30) { d.y = -20; d.w = words[(Math.random() * words.length) | 0]; }
      });
      requestAnimationFrame(loop);
    })();
  })();

  /* ---- 2. Floating REAL tool logos in every hero ---- */
  const spots = [[6,18],[85,12],[12,66],[90,60],[45,7],[70,82],[26,86],[58,88]];
  function seedIcons(){
    document.querySelectorAll('.hero, .syl-hero').forEach(heroEl => {
      if (heroEl.querySelector('.float-icons') || reduced) return;
      const wrap = document.createElement('div'); wrap.className = 'float-icons'; wrap.setAttribute('aria-hidden','true');
      const logos = logoSets[pid] || logoSets['home'];
      const n = logos.length;
      for (let i = 0; i < n; i++) {
        const p = spots[i % spots.length];
        const el = document.createElement('span'); el.className = 'f-logo';
        const img = document.createElement('img');
        img.src = L(logos[i]); img.alt = ''; img.loading = 'lazy';
        if (['ansible','github','linux'].includes(logos[i])) img.classList.add('inv');
        el.appendChild(img);
        el.style.left = p[0] + '%'; el.style.top = p[1] + '%';
        el.style.setProperty('--d', (7 + (i % 5) * 1.7) + 's');
        el.style.setProperty('--dl', (i * 0.55) + 's');
        wrap.appendChild(el);
      }
      heroEl.prepend(wrap);
    });
  }

  /* ---- 2.5 Orbiting tool logos around syllabus hero ---- */
  function buildOrbits(){
    if (reduced) return;
    document.querySelectorAll('.syl-hero-inner').forEach(inner => {
      if (inner.querySelector('.logo-orbit')) return;
      const logos = logoSets[pid] || logoSets['home'];
      const orbit = document.createElement('div'); orbit.className = 'logo-orbit'; orbit.setAttribute('aria-hidden','true');
      const n = Math.min(logos.length, 8);
      for (let i = 0; i < n; i++) {
        const item = document.createElement('div'); item.className = 'orbit-item';
        item.style.setProperty('--a', (360 / n * i) + 'deg');
        const chip = document.createElement('div'); chip.className = 'orbit-chip';
        chip.style.setProperty('--a', (360 / n * i) + 'deg');
        const img = document.createElement('img'); img.src = L(logos[i]); img.alt = ''; img.loading = 'lazy';
        if (['ansible','github','linux'].includes(logos[i])) img.classList.add('inv');
        chip.appendChild(img); item.appendChild(chip); orbit.appendChild(item);
      }
      inner.appendChild(orbit);
    });
  }

  document.addEventListener('DOMContentLoaded', () => { seedIcons(); buildOrbits(); });

  /* ---- 3. Typed terminal chip in home hero ---- */
  (function typedTerminal(){
    document.addEventListener('DOMContentLoaded', () => {
      const sub = document.querySelector('#home .hero-sub');
      if (!sub) return;
      const chip = document.createElement('div');
      chip.className = 'typed-chip';
      chip.innerHTML = '<span class="tc-dots"><i></i><i></i><i></i></span><span class="prompt">$</span> <span id="typedCmd"></span><span class="typed-cursor"></span>';
      sub.after(chip);
      const cmds = [
        'kubectl apply -f your-career.yaml ✔',
        'terraform apply -auto-approve  # AWS · Azure · GCP',
        'docker push veera/skills:latest ✔',
        'git commit -m "from student to DevOps engineer"',
        'aws deploy --students 20k+ --projects 30 ✔'
      ];
      const el = chip.querySelector('#typedCmd');
      if (reduced) { el.textContent = cmds[0]; return; }
      let ci = 0, pos = 0, del = false;
      (function tick(){
        const t = cmds[ci];
        el.textContent = t.slice(0, pos);
        if (!del) {
          pos++;
          if (pos > t.length) { del = true; return setTimeout(tick, 2100); }
          return setTimeout(tick, 34 + Math.random() * 46);
        }
        pos -= 3;
        if (pos <= 0) { pos = 0; del = false; ci = (ci + 1) % cmds.length; return setTimeout(tick, 420); }
        setTimeout(tick, 13);
      })();
    });
  })();

  /* ---- 4. Animated count-up on stats ---- */
  function animateCounter(el){
    if (el.dataset.counted) return; el.dataset.counted = '1';
    const raw = el.textContent.trim();
    const m = raw.match(/^([\d.,]+)(.*)$/);
    if (!m || reduced) return;
    const target = parseFloat(m[1].replace(/,/g,''));
    if (!isFinite(target) || target === 0) return;
    const suffix = m[2] || '';
    const dur = 1400, t0 = performance.now();
    el.classList.add('counting');
    (function frame(t){
      const p = Math.min((t - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = target * e;
      el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else { el.textContent = raw; el.classList.remove('counting'); }
    })(t0);
  }
  const cObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); }
  }), { threshold: 0.5 });
  function watchCounters(){
    document.querySelectorAll('.stat-n, .ti-stat-n, .proj-mini b, .syl-stat-chip b').forEach(el => {
      if (!el.dataset.counted) cObs.observe(el);
    });
  }
  document.addEventListener('DOMContentLoaded', () => { watchCounters(); setTimeout(watchCounters, 500); });

  /* ---- 5. AOS scroll choreography — DIFFERENT per page ---- */
  const pageFX = {
    'page-aws':      { step:'fade-right',   card:'fade-right',   section:'fade-up',    dur: 700 },
    'page-azure':    { step:'flip-left',    card:'flip-left',    section:'zoom-in-up', dur: 800 },
    'page-gcp':      { step:'zoom-in-up',   card:'zoom-in-up',   section:'fade-up',    dur: 750 },
    'page-devops':   { step:'fade-up-right',card:'fade-up-right',section:'zoom-in',    dur: 700 },
    'page-genai':    { step:'zoom-in-left', card:'zoom-in-left', section:'flip-up',    dur: 850 },
    'page-reviews':  { step:'zoom-in',      card:'zoom-in',      section:'fade-up',    dur: 650 },
    'page-projects': { step:'fade-left',    card:'fade-left',    section:'fade-up',    dur: 700 }
  };
  function tagAOS(){
    const plans = [
      ['.tl-step',            'fade-right', 40, 6, 'step'],
      ['.home-section .card', 'zoom-in-up', 70, 6, null],
      ['.skill-item',         'fade-up',    50, 8, null],
      ['.ti-highlight',       'fade-up',    40, 8, null],
      ['.certx-card',         'zoom-in',    50, 6, null],
      ['.ti-stat',            'zoom-in',    50, 5, null],
      ['.proj-card',          'fade-up',    40, 6, 'card'],
      ['.review-card',        'zoom-in',    50, 6, 'card'],
      ['.place-card',         'flip-up',    40, 8, 'card'],
      ['.video-card',         'fade-up',    45, 6, 'card'],
      ['.syl-section',        'fade-up',     0, 1, 'section'],
      ['.trainer-intro-card', 'fade-up',     0, 1, null],
      ['.proj-showcase',      'fade-up',     0, 1, null]
    ];
    plans.forEach(([sel, anim, step, wrapAt, role]) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (el.hasAttribute('data-aos')) return;
        let a = anim, dur = 750;
        const fx = pageFX[pid];
        if (fx && role) {
          if (!(pid === 'page-reviews' && sel === '.place-card')) a = fx[role];
          dur = fx.dur;
        }
        el.setAttribute('data-aos', a);
        el.setAttribute('data-aos-delay', String((i % wrapAt) * step));
        el.setAttribute('data-aos-duration', String(dur));
      });
    });
    if (window.AOS) AOS.refreshHard();
  }
  document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) AOS.init({ once: true, duration: 750, easing: 'ease-out-cubic', offset: 50, disable: reduced });
    tagAOS();
    setTimeout(() => { tagAOS(); watchCounters(); }, 450);
  });

  /* ---- 6. Pointer tilt on interactive cards ---- */
  const tiltSelectors = '.card, .skill-item, .certx-card, .review-card, .place-card, .proj-card, .video-card, .ti-highlight, .tl-card';
  function bindTilt(el){
    if (el.dataset.tiltBound || isMobile || reduced) return;
    el.dataset.tiltBound = '1';
    el.classList.add('tilt-el');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py*5).toFixed(2)}deg) rotateY(${(px*6).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }
  function scanTilt(){ document.querySelectorAll(tiltSelectors).forEach(bindTilt); }
  document.addEventListener('DOMContentLoaded', () => { scanTilt(); setTimeout(scanTilt, 500); });

  /* ---- 6.5 Cursor spotlight (desktop) ---- */
  if (!reduced && !isMobile) {
    document.addEventListener('DOMContentLoaded', () => {
      const glow = document.createElement('div'); glow.id = 'cursorGlow'; glow.setAttribute('aria-hidden','true');
      document.body.appendChild(glow);
      window.addEventListener('pointermove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }, { passive: true });
    });
  }

  /* ---- 7. Ambient parallax (aurora follows cursor, hero drifts) ---- */
  document.addEventListener('DOMContentLoaded', () => {
    const mesh = document.querySelector('.bg-mesh');
    if (mesh && !reduced) {
      window.addEventListener('pointermove', (e) => {
        const px = (e.clientX / window.innerWidth - 0.5) * 26;
        const py = (e.clientY / window.innerHeight - 0.5) * 26;
        mesh.style.setProperty('--px', px.toFixed(1) + 'px');
        mesh.style.setProperty('--py', py.toFixed(1) + 'px');
      }, { passive: true });
    }
    const heroEl = document.querySelector('#home .hero');
    if (heroEl && !reduced) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroEl.style.transform = y < window.innerHeight ? `translateY(${y * 0.1}px)` : '';
        heroEl.style.opacity = Math.max(1 - y / 750, 0.25);
      }, { passive: true });
    }
  });
})();
