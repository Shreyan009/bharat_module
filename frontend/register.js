/**
 * register.js
 * Logic for Manufacturer Registration and Onboarding Landing Page
 */

// ── Nav scroll tint ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('search-mode')) {
    nav.style.background = window.scrollY > 20
      ? 'rgba(8,8,8,0.97)'
      : 'rgba(10,10,10,0.92)';
  }
});

// ── Mobile menu ──
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (navLinks) navLinks.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('active');
}

// ── Search ──
function openSearch() {
  const nav = document.getElementById('nav');
  const searchInput = document.getElementById('navSearchInput');
  if (nav) nav.classList.add('search-mode');
  if (searchInput) setTimeout(() => searchInput.focus(), 320);
}

function closeSearch() {
  const nav = document.getElementById('nav');
  const searchInput = document.getElementById('navSearchInput');
  if (nav) nav.classList.remove('search-mode');
  if (searchInput) searchInput.value = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { 
    e.preventDefault(); 
    openSearch(); 
  }
});

// ── Popup ──
function openPopup() {
  const overlay = document.getElementById('popupOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closePopup() {
  const overlay = document.getElementById('popupOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => goBackToChoose(), 320);
  }
}

const popupOverlay = document.getElementById('popupOverlay');
if (popupOverlay) {
  popupOverlay.addEventListener('click', function(e) {
    if (e.target === this) closePopup();
  });
}

document.addEventListener('keydown', e => { 
  if (e.key === 'Escape') closePopup(); 
});

function chooseBuyer() {
  alert('Buyer registration coming soon! Redirecting to login.');
  closePopup();
}

function chooseManufacturer() {
  const chooseView = document.getElementById('popupChoose');
  const formView = document.getElementById('popupForm');
  const backBtn = document.getElementById('popupBackBtn');
  
  if (chooseView) chooseView.style.display = 'none';
  if (formView) formView.classList.add('active');
  if (backBtn) backBtn.style.display = 'flex';
}

function goBackToChoose() {
  const chooseView = document.getElementById('popupChoose');
  const formView = document.getElementById('popupForm');
  const backBtn = document.getElementById('popupBackBtn');

  if (chooseView) chooseView.style.display = 'grid';
  if (formView) formView.classList.remove('active');
  if (backBtn) backBtn.style.display = 'none';
}

// ── Form validation ──
(function() {
  const phoneInput = document.getElementById('inputPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      let val = this.value;
      val = val.replace(/^\+?91\s*/, '');
      this.value = val.replace(/[^0-9]/g, '').slice(0, 10);
    });
    phoneInput.addEventListener('paste', function(e) {
      e.preventDefault();
      let p = (e.clipboardData || window.clipboardData).getData('text');
      p = p.replace(/^\+?91\s*/, '').replace(/[^0-9]/g, '').slice(0, 10);
      this.value = p;
    });
  }
  
  document.querySelectorAll('#popupForm input').forEach(inp => {
    inp.addEventListener('input', function() {
      const f = this.closest('.form-field');
      if (f) { f.classList.remove('error', 'valid'); }
    });
  });
})();

function submitForm() {
  let valid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = [
    { id: 'fieldName', input: 'inputName' },
    { id: 'fieldBusiness', input: 'inputBusiness' },
    { id: 'fieldEmail', input: 'inputEmail', type: 'email', errorId: 'errorEmail' },
    { id: 'fieldPhone', input: 'inputPhone', type: 'phone', errorId: 'errorPhone' }
  ];

  fields.forEach(f => {
    const fieldEl = document.getElementById(f.id);
    const inputEl = document.getElementById(f.input);
    if (!fieldEl || !inputEl) return;

    fieldEl.classList.remove('error', 'valid');
    const val = inputEl.value.trim();

    if (!val) {
      fieldEl.classList.add('error');
      valid = false;
    } else if (f.type === 'email' && !emailRegex.test(val)) {
      fieldEl.classList.add('error');
      const errEl = document.getElementById(f.errorId);
      if (errEl) errEl.textContent = 'Enter a valid email (e.g. name@company.co.in)';
      valid = false;
    } else if (f.type === 'phone' && val.replace(/^\+91/, '').replace(/[^0-9]/g, '').length !== 10) {
      fieldEl.classList.add('error');
      const errEl = document.getElementById(f.errorId);
      if (errEl) errEl.textContent = 'Enter exactly 10 digits (excluding +91)';
      valid = false;
    } else {
      fieldEl.classList.add('valid');
    }
  });

  if (!valid) return;

  const nameVal = document.getElementById('inputName').value.trim();
  const bizVal = document.getElementById('inputBusiness').value.trim();
  const emailVal = document.getElementById('inputEmail').value.trim();
  const phoneVal = document.getElementById('inputPhone').value.trim().replace(/^\+91/, '').replace(/[^0-9]/g, '');

  const data = { name: nameVal, business: bizVal, email: emailVal, phone: '+91' + phoneVal };
  try { 
    localStorage.setItem('bharat_modules_registration', JSON.stringify(data)); 
  } catch(e) {}
  
  window.location.href = 'onboarding.html';
}

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── Pricing card mouse spotlight ──
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ── Hero stat pill counter animation ──
const statPills = document.querySelectorAll('.hero-stat-pill');
const statData = [
  { num: 365, suffix: 'D', lbl: 'Visibility / Year' },
  { num: 0,   suffix: '',  lbl: 'Cold Calling'       },
  { num: 24,  suffix: '/7',lbl: 'Live Catalog'        },
  { num: 100, suffix: '%', lbl: 'Manufacturers'       },
];
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statPills.forEach((pill, i) => {
      const numEl = pill.querySelector('.hero-stat-num');
      const { num, suffix } = statData[i];
      if (num === 0) return;
      let start = null;
      const dur = 1200 + i * 150;
      const tick = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        numEl.innerHTML = Math.floor(eased * num) + `<span class="hl-o">${suffix}</span>`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
}, { threshold: 0.5 });
const statsRow = document.querySelector('.hero-stats-row');
if (statPills[0] && statsRow) statsObserver.observe(statsRow);

// ── why-card: tilt on hover ──
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    card.style.transform = `translateX(6px) rotateX(${-y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Checklist rows stagger in ──
const checklistEl = document.getElementById('moatChecklist');
if (checklistEl) {
  const rowObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.moat-check-row').forEach((row, i) => {
        setTimeout(() => row.classList.add('row-in'), i * 80 + 100);
      });
      rowObserver.disconnect();
    }
  }, { threshold: 0.2 });
  rowObserver.observe(checklistEl);
}


