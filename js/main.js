/* main.js — dynamic content loader, counters, animations */
const yearEls = document.querySelectorAll('#year,#year2,#year3,#year4,#year5');
yearEls.forEach(el => el && (el.textContent = new Date().getFullYear()));

// mobile menu toggle
document.addEventListener('click', (e)=>{
  if(e.target.matches('.menu-toggle')){
    const nav = document.querySelector('.nav-links');
    if(nav) nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
  }
});

// small helper
function el(id){ return document.getElementById(id); }

// load profile JSON and populate pages
fetch('data/profile.json').then(r => r.json()).then(data => {
  // BASIC
  const name = data.name || 'Dr. S. Santhosh';
  document.querySelectorAll('#heroName, #asideName').forEach(n => n && (n.textContent = name));
  document.querySelectorAll('#heroTitle, #asideRole').forEach(n => n && (n.textContent = data.role || 'Assistant Professor'));
  if(el('heroShort')) el('heroShort').textContent = data.summary;
  if(el('aboutSummary')) el('aboutSummary').textContent = data.summary_long;

  // skill badges
  const skillBadges = el('skillBadges');
  if(skillBadges && data.skills){
    skillBadges.innerHTML = data.skills.map(s => `<span class="badge">${s}</span>`).join('');
  }

  // domains text
  if(el('domainsText')) el('domainsText').textContent = (data.domains || []).join(' • ');

  // Experience (index)
  const expList = el('experienceList');
  if(expList && data.experience){
    expList.innerHTML = data.experience.slice(0,3).map(exp => `
      <article class="card">
        <h4>${exp.designation}</h4>
        <small class="muted">${exp.institution} (${exp.from} — ${exp.to || 'Present'})</small>
        <p class="muted">${exp.summary || ''}</p>
      </article>`).join('');
  }

  // counters (animated)
  document.querySelectorAll('.counter').forEach(c=>{
    const target = +c.dataset.target || 0;
    const numEl = c.querySelector('.num');
    const start = Math.max(0, Math.floor(target * 0.6));
    let current = start;
    numEl.textContent = current + '+';
    const step = Math.max(1, Math.floor((target - start) / 60));
    const iv = setInterval(()=> {
      current += step;
      if(current >= target) { current = target; clearInterval(iv); }
      numEl.textContent = current + '+';
    }, 20);
  });

  // latest publications
  const latestPubs = el('latestPubs');
  if(latestPubs && data.publications){
    latestPubs.innerHTML = data.publications.slice(0,4).map(p => `
      <article class="card">
        <h4>${p.title}</h4>
        <small class="muted">${(p.authors||'')}${p.venue? ' • ' + p.venue : ''} ${p.year? '• ' + p.year : ''}</small>
        <p class="muted">${p.desc || ''}</p>
      </article>`).join('');
  }

  // teaching & projects
  const tp = el('teachingProjects');
  if(tp && data.projects){
    tp.innerHTML = data.projects.slice(0,3).map(p=>`
      <div class="card">
        <h4>${p.title}</h4>
        <p class="muted">${p.desc}</p>
        ${p.link ? `<p><a href="${p.link}" target="_blank" class="muted">Project link</a></p>` : ''}
      </div>`).join('');
  }

  // about page fields
  if(el('skillsGrid') && data.skills){
    el('skillsGrid').innerHTML = data.skills.map(s=>`<div class="skill-pill">${s}</div>`).join('');
  }
  if(el('leadership') && data.leadership){
    el('leadership').innerHTML = data.leadership.map(l=>`<div class="card"><strong>${l.title}</strong><p class="muted">${l.desc}</p></div>`).join('');
  }
  if(el('coursesList') && data.courses){
    el('coursesList').innerHTML = data.courses.map(c=>`<li>${c}</li>`).join('');
  }

  // publications page (filter)
  const pubList = el('pubList');
  function renderPubs(filter='all'){
    if(!pubList) return;
    const pubs = data.publications || [];
    const filtered = pubs.filter(p=>{
      if(filter==='all') return true;
      return (p.type||'other').toLowerCase() === filter;
    });
    pubList.innerHTML = filtered.map(p=>`
      <div class="pub card">
        <h4>${p.title}</h4>
        <small class="muted">${p.authors || ''} • ${p.venue || ''} ${p.year? ' • ' + p.year : ''}</small>
        <p class="muted">${p.desc || ''}</p>
        ${p.pdf? `<p><a href="${p.pdf}" download>Download PDF</a></p>` : ''}
      </div>`).join('');
  }
  renderPubs();
  const pubFilter = el('pubFilter');
  if(pubFilter){
    pubFilter.addEventListener('change', e => renderPubs(e.target.value));
  }

  // research page
  if(el('researchList') && data.research_projects){
    el('researchList').innerHTML = data.research_projects.map(r=>`<div class="card"><strong>${r.title}</strong><p class="muted">${r.desc}</p></div>`).join('');
  }
  if(el('phdTitle')) el('phdTitle').textContent = data.phd_title || '';
  if(el('phdAbstract')) el('phdAbstract').textContent = data.phd_abstract || '';

  // supervision
  if(el('supervisionList') && data.supervision){
    el('supervisionList').innerHTML = data.supervision.map(s=>`<div class="card"><strong>${s.student}</strong><p class="muted">${s.topic}</p></div>`).join('');
  }

  // contact blocks
  const contactInfo = el('contactInfo') || el('asideContact') || el('contactList');
  if(contactInfo && data.contact){
    contactInfo.innerHTML = Object.entries(data.contact).map(([k,v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('');
  }

  // socials links (if available)
  if(data.links){
    if(el('githubLink')) el('githubLink').href = data.links.github || '#';
    if(el('linkedinLink')) el('linkedinLink').href = data.links.linkedin || '#';
  }

  // Add subtle reveal animations for cards
  document.querySelectorAll('.animated-grid .card').forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(18px)';
    setTimeout(()=>{ card.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.2,.9,.2,1)'; card.style.opacity=1; card.style.transform='none'; }, 120*i);
  });

}).catch(err=>{
  console.warn('Could not load data/profile.json', err);
});

// CONTACT FORM handler (client only)
document.addEventListener('submit', (ev)=>{
  if(ev.target && ev.target.id === 'contactForm'){
    ev.preventDefault();
    const status = document.getElementById('formStatus');
    status.textContent = 'This is a static demo. To receive messages, configure Formspree / Netlify Forms / a server endpoint. Example: https://formspree.io/';
    status.classList.add('muted');
  }
});
