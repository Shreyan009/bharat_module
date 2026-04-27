const wishlistItems = {
  "WL-001": {
    name: "High-Precision Gyroscope Module",
    id: "BM-GYR-4001",
    desc: "A defense-grade, high-precision MEMS gyroscope module designed for inertial navigation systems. Offers wide dynamic range, low noise density, and ruggedized construction for harsh environments.",
  },
  "WL-002": {
    name: "MEMS Accelerometer Array",
    id: "BM-ACC-2204",
    desc: "Multi-axis MEMS accelerometer array with high shock survivability and wide temperature operation range. Ideal for platform stabilization and vibration analysis.",
  },
  "WL-003": {
    name: "RF Signal Conditioning PCB",
    id: "BM-PCB-7731",
    desc: "Compact RF signal conditioning board with integrated low-noise amplifier, bandpass filter and impedance matching network. Designed for EW and radar front-end applications.",
  },
  "WL-004": {
    name: "Ruggedized Connector Assembly",
    id: "BM-CON-0098",
    desc: "MIL-spec ruggedized circular connector assembly rated for vibration, thermal shock, and salt spray. Available in multiple pin configurations.",
  },
  "WL-005": {
    name: "Inertial Measurement Unit v2",
    id: "BM-IMU-3310",
    desc: "Tactical-grade 6-DOF IMU combining tri-axis gyroscope and accelerometer. SPI/I2C output with built-in calibration routines and factory-tested MTBF.",
  },
  "WL-006": {
    name: "Pressure Transducer Module",
    id: "BM-PTR-0055",
    desc: "High-accuracy piezoresistive pressure transducer with analogue and digital output. Suitable for altitude sensing, hydraulic monitoring, and process control.",
  },
};

const orders = {
  "ORD-2024-001": {
    id: "ORD-2024-001",
    name: "High-Precision Gyroscope Module",
    part: "Part No. BM-GYR-4001",
    qty: "50 Units",
    date: "28 Jul 2025",
    status: "manufacturing",
    statusLabel: "Manufacturing",
  },
  "ORD-2024-002": {
    id: "ORD-2024-002",
    name: "MEMS Accelerometer Array",
    part: "Part No. BM-ACC-2204",
    qty: "120 Units",
    date: "15 Jul 2025",
    status: "dispatched",
    statusLabel: "Dispatched",
  },
  "ORD-2024-003": {
    id: "ORD-2024-003",
    name: "RF Signal Conditioning PCB",
    part: "Part No. BM-PCB-7731",
    qty: "30 Units",
    date: "02 Jun 2025",
    status: "delivered",
    statusLabel: "Delivered",
  },
  "ORD-2024-004": {
    id: "ORD-2024-004",
    name: "Ruggedized Connector Assembly",
    part: "Part No. BM-CON-0098",
    qty: "200 Units",
    date: "10 May 2025",
    status: "delivered",
    statusLabel: "Delivered",
  },
};

function showView(view) {
  const views = [
    "view-dashboard",
    "view-orders",
    "view-order-detail",
    "view-rfqs",
    "view-wishlist",
    "view-wishlist-detail",
  ];
  views.forEach((v) => {
    const el = document.getElementById(v);
    if (el) el.style.display = "none";
  });

  ["nav-dashboard", "nav-orders", "nav-rfqs", "nav-wishlist"].forEach((n) => {
    const el = document.getElementById(n);
    if (el) el.classList.remove("active");
  });

  const map = {
    dashboard: ["view-dashboard", "nav-dashboard"],
    orders: ["view-orders", "nav-orders"],
    rfqs: ["view-rfqs", "nav-rfqs"],
    wishlist: ["view-wishlist", "nav-wishlist"],
  };
  if (map[view]) {
    const viewEl = document.getElementById(map[view][0]);
    if (viewEl) viewEl.style.display = "block";
    const navEl = document.getElementById(map[view][1]);
    if (navEl) navEl.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showOrderDetail(orderId) {
  const o = orders[orderId];
  if (!o) return;

  document.getElementById("detail-order-id").textContent = o.id;
  document.getElementById("detail-product-title").textContent = o.name;
  document.getElementById("detail-card-name").textContent = o.name;
  document.getElementById("detail-card-part").textContent = o.part;
  document.getElementById("detail-card-id").textContent = o.id;
  document.getElementById("detail-card-qty").textContent = o.qty;
  document.getElementById("detail-card-date").textContent = o.date;
  document.getElementById("detail-card-status").innerHTML = `<span class="status-tag status-${o.status}">${o.statusLabel}</span>`;

  [
    "view-dashboard",
    "view-orders",
    "view-rfqs",
    "view-wishlist",
    "view-wishlist-detail",
  ].forEach((v) => {
    const el = document.getElementById(v);
    if (el) el.style.display = "none";
  });
  document.getElementById("view-order-detail").style.display = "block";

  ["nav-dashboard", "nav-rfqs", "nav-wishlist"].forEach((n) => {
    const el = document.getElementById(n);
    if (el) el.classList.remove("active");
  });
  document.getElementById("nav-orders").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showWishlistDetail(wlId) {
  const w = wishlistItems[wlId];
  if (!w) return;

  document.getElementById("wl-detail-breadcrumb").textContent = w.name;
  document.getElementById("wl-detail-title").textContent = w.name;
  document.getElementById("wl-detail-category").textContent = w.category || "SENSORS & MODULES";
  document.getElementById("wl-detail-name").textContent = w.name;
  document.getElementById("wl-detail-desc").textContent = w.desc;
  document.getElementById("wl-detail-sku").textContent = "SKU: " + w.id;

  // reset tabs
  document.querySelectorAll(".wl-tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".wl-tab")[0].classList.add("active");
  ["tab-specs", "tab-electrical", "tab-certs", "tab-compliance"].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.display = i === 0 ? "block" : "none";
  });

  [
    "view-dashboard",
    "view-orders",
    "view-order-detail",
    "view-rfqs",
    "view-wishlist",
  ].forEach((v) => {
    const el = document.getElementById(v);
    if (el) el.style.display = "none";
  });
  document.getElementById("view-wishlist-detail").style.display = "block";

  ["nav-dashboard", "nav-orders", "nav-rfqs"].forEach((n) => {
    const el = document.getElementById(n);
    if (el) el.classList.remove("active");
  });
  document.getElementById("nav-wishlist").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchTab(btn, tabId) {
  document.querySelectorAll(".wl-tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  ["tab-specs", "tab-electrical", "tab-certs", "tab-compliance"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === tabId ? "block" : "none";
  });
}


