/* main.js — dynamic content loader and small interactions */
const yearEls = document.querySelectorAll('#year,#year2,#year3,#year4,#year5');
yearEls.forEach(el => el && (el.textContent = new Date().getFullYear()));

// mobile menu toggle
document.addEventListener('click', (e)=>{
  if(e.target.matches('.menu-toggle')){
    const nav = document.querySelector('.nav-links');
    if(nav) nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
  }
});

// load profile JSON and populate pages
fetch('data/profile.json').then(r => r.json()).then(data => {
  // HERO
  const heroName = document.getElementById('heroName');
  if(heroName) heroName.textContent = data.name + (data.title ? ' — ' + data.title : '');
  const heroTitle = document.getElementById('heroTitle');
  if(heroTitle) heroTitle.textContent = data.role;
  const heroShort = document.getElementById('heroShort');
  if(heroShort) heroShort.textContent = data.summary;

  // Experience list (index)
  const expList = document.getElementById('experienceList');
  if(expList && data.experience){
    expList.innerHTML = data.experience.slice(0,3).map(exp => `
      <article class="card">
        <h4>${exp.designation}</h4>
        <small class="muted">${exp.institution} (${exp.from} — ${exp.to || 'Present'})</small>
        <p class="muted">${exp.summary || ''}</p>
      </article>`).join('');
  }

  // Research interests (parallax)
  const researchInterests = document.getElementById('researchInterests');
  if(researchInterests) researchInterests.textContent = data.research_interests;

  // publications (home small)
  const latestPubs = document.getElementById('latestPubs');
  if(latestPubs && data.publications){
    latestPubs.innerHTML = data.publications.slice(0,3).map(p => `
      <article class="card">
        <h4>${p.title}</h4>
        <small class="muted">${p.venue} ${p.year ? '• ' + p.year : ''}</small>
        <p class="muted">${p.desc || ''}</p>
      </article>`).join('');
  }

  // about page
  const aboutSummary = document.getElementById('aboutSummary');
  if(aboutSummary) aboutSummary.textContent = data.summary_long;

  const qualifications = document.getElementById('qualifications');
  if(qualifications && data.qualifications){
    qualifications.innerHTML = '<ul>' + data.qualifications.map(q => `<li><strong>${q.degree}</strong> — ${q.institution} (${q.year || ''})</li>`).join('') + '</ul>';
  }

  const fullExperience = document.getElementById('fullExperience');
  if(fullExperience && data.experience){
    fullExperience.innerHTML = data.experience.map(e => `<div class="card"><strong>${e.designation}</strong> — ${e.institution}<br><small class="muted">${e.from} — ${e.to || 'Present'}</small><p>${e.summary || ''}</p></div>`).join('');
  }

  const patentsBooks = document.getElementById('patentsBooks');
  if(patentsBooks){
    patentsBooks.innerHTML = (data.patents||[]).map(p=>`<div class="muted">• ${p}</div>`).join('') + (data.books? '<h4>Books</h4>' + data.books.map(b=>`<div>${b}</div>`).join('') : '');
  }

  // publications page
  const pubList = document.getElementById('pubList');
  if(pubList && data.publications){
    pubList.innerHTML = data.publications.map(p => `<div class="pub"><h4>${p.title}</h4><small class="muted">${p.authors || ''} • ${p.venue} ${p.year? '• ' + p.year : ''}</small><p>${p.desc || ''}</p></div>`).join('');
  }

  // research page
  const researchList = document.getElementById('researchList');
  if(researchList && data.research_projects){
    researchList.innerHTML = data.research_projects.map(r => `<div class="card"><strong>${r.title}</strong><p class="muted">${r.desc}</p></div>`).join('');
  }
  const phdTitle = document.getElementById('phdTitle');
  if(phdTitle) phdTitle.textContent = data.phd_title;

  // contact page
  const contactInfo = document.getElementById('contactInfo') || document.getElementById('asideContact') || document.getElementById('contactList');
  if(contactInfo && data.contact){
    contactInfo.innerHTML = Object.entries(data.contact).map(([k,v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('');
  }

  // simple contact form handler (no backend — instructs how to wire)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit',(ev)=>{
      ev.preventDefault();
      const status = document.getElementById('formStatus');
      status.textContent = 'This form is client-only. To receive messages, configure a server endpoint or use GitHub Forms / Formspree. Example: https://formspree.io/';
      status.classList.add('muted');
    });
  }
})
.catch(err=>{
  console.warn('Could not load data/profile.json', err);
});
