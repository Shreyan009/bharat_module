/**
 * BHARAT MODULES — FRONTEND API INTEGRATION
 * Paste this in a <script> tag in each HTML page, or as a shared api.js file.
 * 
 * Usage examples are at the bottom for each page.
 */

const API = 'https://your-backend.railway.app'; // ← replace with your Railway URL

// ── Auth helpers ──────────────────────────────────────────────────────────
const Auth = {
  getToken: () => localStorage.getItem('bm_token'),
  getUser:  () => JSON.parse(localStorage.getItem('bm_user') || 'null'),
  isLoggedIn: () => !!localStorage.getItem('bm_token'),

  save(token, user) {
    localStorage.setItem('bm_token', token);
    localStorage.setItem('bm_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('bm_token');
    localStorage.removeItem('bm_user');
  },
};

// ── Base fetch with auth header ───────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data.errors?.[0]?.msg || data.error || 'Something went wrong';
    throw new Error(msg);
  }

  return data;
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE: login-page.html
// Wire to your existing login form — add id="loginForm" to the <form>
// ─────────────────────────────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Signing in…';
  try {
    const { token, user } = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email:    e.target.email.value,
        password: e.target.password.value,
      }),
    });
    Auth.save(token, user);
    window.location.href = 'customer_dashboard_5.html';
  } catch (err) {
    showError(err.message);
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE: oem_register_landingpage.html
// ─────────────────────────────────────────────────────────────────────────
async function handleRegister(e) {
  e.preventDefault();
  try {
    const { token, user } = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email:    e.target.email.value,
        password: e.target.password.value,
        name:     e.target.name.value,
        company:  e.target.company?.value,
        phone:    e.target.phone?.value,
        role:     'oem',   // or 'buyer' depending on which form
      }),
    });
    Auth.save(token, user);
    window.location.href = 'onboarding2.html';
  } catch (err) {
    showError(err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE: catalogue.html
// Replace the hardcoded `const products = [...]` array with this
// ─────────────────────────────────────────────────────────────────────────
async function loadCatalogue(page = 1, category = '', search = '') {
  const params = new URLSearchParams({ page, limit: 20 });
  if (category) params.set('cat', category);
  if (search)   params.set('q', search);

  const { products, pagination } = await apiFetch(`/api/products?${params}`);

  // Render products (adapt to your existing renderProduct() function)
  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-name">${p.name}</div>
      <div class="product-sku">SKU: ${p.sku}</div>
      <div class="product-category">${p.category}</div>
      <button onclick="addToRfqCart('${p.id}', '${p.name}', '${p.sku}')">
        Add to RFQ
      </button>
    </div>
  `).join('');

  return pagination;
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE: rfq_cart.html
// ─────────────────────────────────────────────────────────────────────────
// Cart stored in localStorage until submitted
const Cart = {
  get:  () => JSON.parse(localStorage.getItem('bm_rfq_cart') || '[]'),
  save: (items) => localStorage.setItem('bm_rfq_cart', JSON.stringify(items)),
  add(product_id, product_name, sku, quantity = 1) {
    const items = this.get();
    const existing = items.find(i => i.sku === sku);
    if (existing) { existing.quantity += quantity; }
    else { items.push({ product_id, product_name, sku, quantity, unit: 'units' }); }
    this.save(items);
  },
  clear: () => localStorage.removeItem('bm_rfq_cart'),
};

async function submitRfq(notes = '') {
  if (!Auth.isLoggedIn()) {
    window.location.href = `login-page.html?redirect=rfq_cart.html`;
    return;
  }
  const items = Cart.get();
  if (!items.length) return showError('Your RFQ cart is empty');

  try {
    const { rfq } = await apiFetch('/api/rfq', {
      method: 'POST',
      body: JSON.stringify({ items, notes }),
    });
    Cart.clear();
    showSuccess(`RFQ ${rfq.rfq_number} submitted! Check your email for confirmation.`);
    setTimeout(() => window.location.href = 'customer_dashboard_5.html', 2000);
  } catch (err) {
    showError(err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE: customer_dashboard_3.html / customer_dashboard_5.html
// ─────────────────────────────────────────────────────────────────────────
async function loadDashboard() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login-page.html';
    return;
  }

  const user = Auth.getUser();
  document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.user-company').forEach(el => el.textContent = user.company || '');

  const { rfqs } = await apiFetch('/api/rfq/my');
  const list = document.getElementById('rfqList');
  if (list) {
    list.innerHTML = rfqs.length ? rfqs.map(r => `
      <div class="rfq-row">
        <span class="rfq-number">${r.rfq_number}</span>
        <span class="rfq-items">${r.item_count} item${r.item_count !== 1 ? 's' : ''}</span>
        <span class="rfq-status rfq-status--${r.status}">${r.status}</span>
        <span class="rfq-date">${new Date(r.created_at).toLocaleDateString('en-IN')}</span>
      </div>
    `).join('') : '<p>No RFQs yet. <a href="catalogue.html">Browse catalogue</a></p>';
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE: contact_us.html
// ─────────────────────────────────────────────────────────────────────────
async function handleContactForm(e) {
  e.preventDefault();
  try {
    await apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name:    e.target.name.value,
        email:   e.target.email.value,
        company: e.target.company?.value,
        phone:   e.target.phone?.value,
        subject: e.target.subject?.value,
        message: e.target.message.value,
      }),
    });
    showSuccess('Message sent! We\'ll get back to you within 24 hours.');
    e.target.reset();
  } catch (err) {
    showError(err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE: onboarding2.html — final step submit
// ─────────────────────────────────────────────────────────────────────────
async function submitOnboarding(formData) {
  try {
    await apiFetch('/api/onboarding', { method: 'POST', body: JSON.stringify(formData) });
    window.location.href = 'customer_dashboard_5.html';
  } catch (err) {
    showError(err.message);
  }
}

// ── Utility ───────────────────────────────────────────────────────────────
function showError(msg) {
  // Adapt to your existing toast/snackbar system
  console.error(msg);
  const el = document.getElementById('errorMsg');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function showSuccess(msg) {
  console.log(msg);
  const el = document.getElementById('successMsg');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// Logout — call from nav "Sign Out" button
function logout() {
  Auth.clear();
  window.location.href = 'home.html';
}
