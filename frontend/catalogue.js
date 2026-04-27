(function() {
    'use strict';

    // Data - Kept as constant within the module
    const PRODUCTS = [
        {
            id: 1,
            category: "Motors",
            verified: true,
            msme: true,
            name: "BM-5010 Brushless Motor",
            desc: "High-torque outrunner motor for multirotor UAV platforms. Precision balanced rotors, corrosion-resistant casing.",
            sku: "BM-MTR-5010-KV360",
            specs: [
                ["Motor Type", "Brushless Outrunner"],
                ["KV Rating", "360 KV"],
                ["Shaft Diameter", "6 mm"],
                ["Stator Size", "50×10 mm"],
                ["Weight", "175 g"],
                ["Max Thrust", "2800 g"],
                ["Compatibility", "6S LiPo"],
            ],
            elec: [
                ["Operating Voltage", "22.2 V (6S)"],
                ["Max Current", "42 A"],
                ["Internal Resistance", "38 mΩ"],
                ["Power Rating", "930 W"],
                ["Efficiency", "> 85%"],
                ["No-load Current", "0.8 A"],
            ],
            certs: [
                "Bharat Verified OEM Certification",
                "MSME Registration No. IND-MH-2021-009",
                "Factory Licence No. FL/MH/2020/14482",
                "CoC – Grade 7075 Aluminium Bell",
            ],
            compliance: [
                ["Standard", "IS/IEC 60034-1"],
                ["RoHS", "Compliant"],
                ["Proof of Origin", "Maharashtra, India"],
                ["Audit Ready", "Yes – full traceability"],
            ],
        },
        {
            id: 2,
            category: "ESC",
            verified: true,
            msme: false,
            name: "BM-45A 4-in-1 ESC",
            desc: "Compact 4-in-1 electronic speed controller for racing and industrial quads. BLHeli_32 firmware compatible.",
            sku: "BM-ESC-45A-4IN1",
            specs: [
                ["Type", "4-in-1 ESC"],
                ["Continuous Current", "45A per channel"],
                ["Burst Current", "55A (10 sec)"],
                ["BEC Output", "5V / 2A"],
                ["Size", "38×38 mm"],
                ["Weight", "14.5 g"],
                ["Firmware", "BLHeli_32"],
            ],
            elec: [
                ["Input Voltage", "3–6S LiPo"],
                ["PWM Frequency", "8–48 kHz"],
                ["Telemetry", "UART / Dshot"],
                ["Motor Support", "2–8 poles"],
                ["Idle Rate", "3.5%"],
                ["Braking", "Active / Passive"],
            ],
            certs: [
                "Bharat Verified OEM Certification",
                "Factory Licence No. FL/KA/2022/08811",
                "CoC – PCB Grade FR4 TG180",
            ],
            compliance: [
                ["Standard", "IPC-6012 Class 3"],
                ["RoHS", "Compliant"],
                ["Proof of Origin", "Karnataka, India"],
                ["Audit Ready", "Yes"],
            ],
        },
        {
            id: 3,
            category: "Flight Controllers",
            verified: true,
            msme: true,
            name: "BM-FC7 Flight Controller",
            desc: "STM32F7-based flight controller with dual IMU redundancy. Designed for defence-grade UAV reliability.",
            sku: "BM-FC7-H743",
            specs: [
                ["MCU", "STM32H743 480 MHz"],
                ["IMU", "Dual ICM-42688-P"],
                ["Barometer", "BMP388"],
                ["Connectors", "6× UARTs, 13× PWM"],
                ["Dimensions", "40×40 mm"],
                ["Weight", "9 g"],
                ["Stack Mount", "M3 30.5×30.5 mm"],
            ],
            elec: [
                ["Input Voltage", "5V (regulated)"],
                ["Current Draw", "250 mA typical"],
                ["Flash", "2 MB"],
                ["RAM", "1 MB"],
                ["USB", "Micro-USB / USB-C"],
                ["Logging", "MicroSD blackbox"],
            ],
            certs: [
                "Bharat Verified OEM Certification",
                "MSME Registration No. IND-TN-2022-0341",
                "Factory Licence No. FL/TN/2021/33201",
                "CoC – Military-Grade PCB Substrate",
            ],
            compliance: [
                ["Standard", "IPC-6012 Class 3"],
                ["RoHS", "Compliant"],
                ["EMC", "MIL-STD-461F"],
                ["Proof of Origin", "Tamil Nadu, India"],
                ["Audit Ready", "Yes – full traceability"],
            ],
        },
        {
            id: 4,
            category: "Battery",
            verified: true,
            msme: true,
            name: "BM-6S 22000mAh LiPo",
            desc: "High-density 6S LiPo battery pack for heavy-lift UAV operations. BMS-protected with cycle-life monitoring.",
            sku: "BM-BAT-6S-22AH-15C",
            specs: [
                ["Cell Configuration", "6S1P (22.2 V nominal)"],
                ["Capacity", "22,000 mAh"],
                ["Discharge Rate", "15C continuous"],
                ["Peak Discharge", "30C (10 sec)"],
                ["Dimensions", "192×80×60 mm"],
                ["Weight", "2.35 kg"],
                ["Connector", "AS150 / XT150"],
            ],
            elec: [
                ["Nominal Voltage", "22.2 V"],
                ["Full Charge Voltage", "25.2 V"],
                ["Cutoff Voltage", "18.0 V"],
                ["Max Charge Rate", "1C (22 A)"],
                ["Internal Resistance", "< 8 mΩ/cell"],
                ["Cycle Life", "> 300 cycles"],
            ],
            certs: [
                "Bharat Verified OEM Certification",
                "MSME Registration No. IND-GJ-2021-4782",
                "Factory Licence No. FL/GJ/2020/29201",
                "UN38.3 Transport Test Certificate",
            ],
            compliance: [
                ["Standard", "IEC 62133-2"],
                ["UN38.3", "Pass"],
                ["Proof of Origin", "Gujarat, India"],
                ["Audit Ready", "Yes"],
            ],
        },
        {
            id: 5,
            category: "Motors",
            verified: false,
            msme: true,
            name: "BM-2306 Racing Motor",
            desc: "Ultra-lightweight 2306 stator motor for 5-inch FPV racing. Hard-anodised aluminium construction.",
            sku: "BM-MTR-2306-KV2450",
            specs: [
                ["Motor Type", "Brushless Outrunner"],
                ["KV Rating", "2450 KV"],
                ["Shaft Diameter", "3 mm"],
                ["Stator Size", "23×06 mm"],
                ["Weight", "29 g"],
                ["Max Thrust", "920 g"],
                ["Compatibility", "4S LiPo"],
            ],
            elec: [
                ["Operating Voltage", "14.8 V (4S)"],
                ["Max Current", "32 A"],
                ["Internal Resistance", "60 mΩ"],
                ["Power Rating", "475 W"],
                ["Efficiency", "> 82%"],
                ["No-load Current", "0.6 A"],
            ],
            certs: [
                "MSME Registration No. IND-MH-2020-1122",
                "CoC – 7075-T6 Aluminium Bell",
            ],
            compliance: [
                ["Standard", "IS/IEC 60034-1"],
                ["RoHS", "Compliant"],
                ["Proof of Origin", "Maharashtra, India"],
                ["Audit Ready", "Partial"],
            ],
        },
        {
            id: 6,
            category: "3D Printing",
            verified: true,
            msme: false,
            name: "BM-CF-PETG Filament",
            desc: "Carbon-fibre reinforced PETG filament for structural UAV frame printing. Aerospace-grade dimensional accuracy.",
            sku: "BM-3DP-CFPETG-1KG",
            specs: [
                ["Material", "CF-PETG (15% CF)"],
                ["Diameter", "1.75 mm ± 0.02 mm"],
                ["Spool Weight", "1 kg"],
                ["Print Temp", "240–260 °C"],
                ["Bed Temp", "70–80 °C"],
                ["Layer Adhesion", "Excellent"],
                ["Colour", "Matte Black"],
            ],
            elec: [
                ["Tensile Strength", "62 MPa"],
                ["Flexural Modulus", "3.8 GPa"],
                ["Density", "1.29 g/cm³"],
                ["Softening Point", "85 °C"],
                ["Shrinkage", "< 0.1%"],
            ],
            certs: [
                "Bharat Verified OEM Certification",
                "Material Safety Data Sheet (MSDS)",
                "CoC – Filament Grade CF15",
            ],
            compliance: [
                ["Standard", "ASTM D638"],
                ["RoHS", "Compliant"],
                ["Proof of Origin", "Maharashtra, India"],
                ["Audit Ready", "Yes"],
            ],
        },
    ];

    let activeFilters = new Set();
    let quoteItems = [];
    let currentPDPProduct = null;

    // Export functions to window
    window.toggleFilter = toggleFilter;
    window.clearFilters = clearFilters;
    window.filterByCategory = filterByCategory;
    window.sortProducts = sortProducts;
    window.doSearch = doSearch;
    window.openPDP = openPDP;
    window.goToCatalogue = goToCatalogue;
    window.switchTab = switchTab;
    window.addToQuote = addToQuote;
    window.submitQuote = submitQuote;
    window.addToRFQCart = addToRFQCart;
    window.openCatPopup = openCatPopup;
    window.closeCatPopup = closeCatPopup;
    window.toggleCategorySidebar = toggleCategorySidebar;
    window.toggleWishlist = toggleWishlist;

    // --- Init ---
    document.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get('cat');
        const initialCategory = categoryParam ? decodeURIComponent(categoryParam) : null;
        
        renderGrid(PRODUCTS);
        if (initialCategory) {
            setTimeout(() => filterByCategory(initialCategory), 100);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { 
                if (typeof window.closeSearch === 'function') window.closeSearch(); 
                closeCatPopup(); 
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { 
                e.preventDefault(); 
                if (typeof window.openSearch === 'function') window.openSearch(); 
            }
        });
    });

    // --- Render Grid ---
    function renderGrid(products) {
        const grid = document.getElementById('productGrid');
        const countEl = document.getElementById('resultCount');
        if (countEl) countEl.textContent = products.length;
        
        if (!grid) return;
        
        if (!products.length) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--gray-400)">
                <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin-bottom:12px;opacity:.4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <p style="font-size:14px">No products match your filters.</p></div>`;
            return;
        }
        
        // Use a document fragment for better performance if list was huge, but here map is fine
        grid.innerHTML = products.map(p => `
            <div class="product-card" onclick="openPDP(${p.id})">
                <div class="product-card-img">
                    <svg fill="none" stroke="currentColor" stroke-width="0.8" viewBox="0 0 24 24" style="width:56px;height:56px;color:var(--gray-200)">
                        ${getCatIcon(p.category)}
                    </svg>
                </div>
                <div class="product-card-body">
                    <div class="product-card-category">${escapeHTML(p.category)}</div>
                    <div class="product-card-name">${escapeHTML(p.name)}</div>
                    <div class="product-card-desc">${escapeHTML(p.desc)}</div>
                    <div class="product-card-footer">
                        <div class="card-arrow">
                            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                    </div>
                </div>
            </div>`).join('');
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getCatIcon(cat) {
        const icons = {
            Motors: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>',
            ESC: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
            "Flight Controllers": '<path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>',
            Battery: '<rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/>',
            "3D Printing": '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
        };
        return icons[cat] || icons["Motors"];
    }

    // --- Filter Logic ---
    function getFilteredProducts() {
        return PRODUCTS.filter(p => {
            if (activeFilters.size === 0) return true;
            if (activeFilters.has('verified') && !p.verified) return false;
            if (activeFilters.has('msme') && !p.msme) return false;
            
            const cats = ["Motors", "ESC", "Flight Controllers", "Battery", "3D Printing"];
            const activeCats = cats.filter(c => activeFilters.has(c));
            if (activeCats.length > 0 && !activeCats.includes(p.category)) return false;
            
            return true;
        });
    }

    function toggleFilter(el, key) {
        const cb = el.querySelector('.filter-checkbox');
        if (activeFilters.has(key)) {
            activeFilters.delete(key);
            cb.classList.remove('checked');
        } else {
            activeFilters.add(key);
            cb.classList.add('checked');
        }
        renderGrid(getFilteredProducts());
    }

    function clearFilters() {
        activeFilters.clear();
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.classList.remove('checked'));
        renderGrid(PRODUCTS);
    }

    function filterByCategory(cat) {
        activeFilters.clear();
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.classList.remove('checked'));
        
        if (cat !== 'All') {
            activeFilters.add(cat);
            const cbMap = {
                Motors: "fc-Motors",
                ESC: "fc-ESC",
                "Flight Controllers": "fc-FC",
                Battery: "fc-Battery",
                "3D Printing": "fc-3D"
            };
            const id = cbMap[cat];
            if (id) document.getElementById(id)?.classList.add('checked');
        }
        
        const breadcrumb = document.getElementById('catBreadcrumbLabel');
        const title = document.getElementById('catPageTitle');
        const sub = document.getElementById('catPageSub');
        
        if (breadcrumb) breadcrumb.textContent = cat === 'All' ? 'All Products' : cat;
        if (title) title.textContent = cat === 'All' ? 'PRODUCT CATALOGUE' : cat.toUpperCase();
        if (sub) sub.textContent = `Verified Indian-manufactured ${cat === 'All' ? 'components' : cat.toLowerCase()} for aerospace, defence & industrial applications`;
        
        goToCatalogue();
        renderGrid(getFilteredProducts());
    }

    // --- Sort ---
    function sortProducts(val) {
        let list = getFilteredProducts().slice();
        if (val === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
        if (val === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
        if (val === 'verified') list.sort((a, b) => b.verified - a.verified);
        renderGrid(list);
    }

    // --- Search ---
    function doSearch() {
        const input = document.getElementById('navSearchInput');
        if (!input) return;
        const q = input.value.trim().toLowerCase();
        
        const results = PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
        
        goToCatalogue();
        renderGrid(results);
        if (typeof window.closeSearch === 'function') window.closeSearch();
    }

    // --- PDP Logic ---
    function openPDP(id) {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return;
        currentPDPProduct = p;
        
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setVal('pdpBreadcrumb', p.name);
        setVal('pdpCategory', p.category);
        setVal('pdpTitle', p.name);
        setVal('pdpDesc', p.desc);
        setVal('pdpSKU', 'SKU: ' + p.sku);

        const qtyInput = document.getElementById('pdpQty');
        if (qtyInput) qtyInput.value = 1;

        const btn = document.getElementById('btnAddToQuote');
        if (btn) {
            btn.classList.remove('added');
            btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Add to Quote';
        }

        const renderTable = (id, data) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = data.map(([k, v]) => `<tr><td>${escapeHTML(k)}</td><td>${escapeHTML(v)}</td></tr>`).join('');
        };

        renderTable('specsTable', p.specs);
        renderTable('elecTable', p.elec);
        renderTable('complianceTable', p.compliance);

        document.querySelectorAll('.specs-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.specs-panel').forEach(p => p.classList.remove('active'));
        
        const firstTab = document.querySelectorAll('.specs-tab')[0];
        if (firstTab) firstTab.classList.add('active');
        const firstPanel = document.getElementById('tab-specs');
        if (firstPanel) firstPanel.classList.add('active');

        document.getElementById('pageCatalogue')?.classList.add('hidden');
        document.getElementById('pagePDP')?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goToCatalogue() {
        document.getElementById('pagePDP')?.classList.remove('active');
        document.getElementById('pageCatalogue')?.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function switchTab(el, tabId) {
        document.querySelectorAll('.specs-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.specs-panel').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        document.getElementById(tabId)?.classList.add('active');
    }

    // --- Quote ---
    function addToQuote() {
        const btn = document.getElementById('btnAddToQuote');
        quoteItems.push(1);
        if (btn) {
            btn.classList.add('added');
            btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> Added to Quote';
        }
        
        const countEl = document.getElementById('quoteCount');
        if (countEl) countEl.textContent = quoteItems.length;
        
        const drawer = document.getElementById('quoteDrawer');
        if (drawer) {
            const textEl = drawer.querySelector('.quote-drawer-text');
            if (textEl) textEl.textContent = quoteItems.length === 1 ? 'item in your quote list' : 'items in your quote list';
            drawer.classList.add('visible');
        }

        setTimeout(() => {
            if (btn) {
                btn.classList.remove('added');
                btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Add to Quote';
            }
        }, 800);

        setTimeout(() => {
            if (drawer) drawer.classList.remove('visible');
        }, 3500);
    }

    function submitQuote() {
        window.location.href = 'cart.html';
    }

    function addToRFQCart() {
        const product = currentPDPProduct;
        const qtyInput = document.getElementById('pdpQty');
        const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        if (!product) return;

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('bharat_rfq_cart') || '[]');
        } catch(e) {}

        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ ...product, qty });
        }
        
        try {
            localStorage.setItem('bharat_rfq_cart', JSON.stringify(cart));
        } catch(e) {}
        
        window.location.href = 'cart.html';
    }

    // --- Nav & UI ---
    function openCatPopup() {
        document.getElementById('catPopupOverlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCatPopup(e) {
        if (e && e.target !== e.currentTarget) return;
        document.getElementById('catPopupOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleCategorySidebar() {
        document.getElementById('catSidebar')?.classList.toggle('open');
        document.querySelector('.cat-sidebar-toggle')?.classList.toggle('open');
    }

    function toggleWishlist() {
        document.getElementById('btnWishlist')?.classList.toggle('wishlist-added');
    }
})();



