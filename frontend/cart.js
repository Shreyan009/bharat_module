(function() {
    'use strict';

    let cart = [];

    // Export functions to window
    window.changeQty = changeQty;
    window.setQty = setQty;
    window.removeItem = removeItem;
    window.submitRFQ = submitRFQ;

    document.addEventListener('DOMContentLoaded', () => {
        loadCart();
        renderCart();
    });

    /**
     * Load cart from localStorage
     */
    function loadCart() {
        try {
            const savedCart = localStorage.getItem('bharat_rfq_cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            } else {
                // Initial sample data if empty
                cart = [
                    { id: 'WL-001', name: 'High-Precision Gyroscope Module', sku: 'BM-GYR-4001', qty: 50 },
                    { id: 'WL-002', name: 'MEMS Accelerometer Array', sku: 'BM-ACC-2204', qty: 120 }
                ];
                saveCart();
            }
        } catch (e) {
            console.error('Failed to load cart:', e);
            cart = [];
        }
    }

    /**
     * Save cart to localStorage
     */
    function saveCart() {
        try {
            localStorage.setItem('bharat_rfq_cart', JSON.stringify(cart));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    }

    /**
     * Render the cart table or empty state
     */
    function renderCart() {
        const tbody = document.getElementById('cartBody');
        const empty = document.getElementById('cartEmpty');
        const tableWrapper = document.getElementById('cartTableWrapper');
        const submitRow = document.getElementById('cartSubmitRow');
        const countEl = document.getElementById('cartCount');

        if (!tbody) return;

        if (cart.length === 0) {
            if (tableWrapper) tableWrapper.style.display = 'none';
            if (empty) empty.style.display = 'block';
            if (submitRow) submitRow.style.display = 'none';
            if (countEl) countEl.textContent = '0';
            return;
        }

        if (tableWrapper) tableWrapper.style.display = 'block';
        if (empty) empty.style.display = 'none';
        if (submitRow) submitRow.style.display = 'flex';
        if (countEl) countEl.textContent = cart.length;

        tbody.innerHTML = cart.map((item, idx) => `
            <tr id="row-${item.id}">
                <td style="color:var(--gray-400);font-size:13px;font-weight:700;text-align:center;">${String(idx + 1).padStart(2, '0')}</td>
                <td>
                    <div class="cart-thumb">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/></svg>
                    </div>
                </td>
                <td>
                    <div class="cart-product-cell">
                        <div>
                            <div class="cart-product-name">${escapeHTML(item.name)}</div>
                            <div class="cart-product-sku">${escapeHTML(item.sku)}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="cart-qty-wrap">
                        <button class="cart-qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                        <input class="cart-qty-val" type="number" min="1" value="${item.qty}" onchange="setQty('${item.id}', this.value)">
                        <button class="cart-qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </td>
                <td>
                    <button class="cart-remove-btn" onclick="removeItem('${item.id}')" title="Remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function changeQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty = Math.max(1, item.qty + delta);
        saveCart();
        renderCart();
    }

    function setQty(id, val) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty = Math.max(1, parseInt(val, 10) || 1);
        saveCart();
        renderCart();
    }

    function removeItem(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
    }

    function submitRFQ() {
        const cartView = document.getElementById('view-cart');
        const successView = document.getElementById('view-success');
        if (cartView) cartView.style.display = 'none';
        if (successView) successView.style.display = 'block';
        cart = [];
        saveCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
})();
