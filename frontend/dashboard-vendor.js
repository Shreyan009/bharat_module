// ── RFQ DATA ──
const rfqData = {
  8042: {
    id: "RFQ-8042",
    part: "Turbine Blade Actuator",
    qty: 250,
    sector: "Aerospace",
    status: "AWAITING_QUOTE",
    secsLeft: 9 * 3600 + 14 * 60,
    compliance: [
      "DO-160G Qualified",
      "MIL-STD-810G",
      "AS9100D Traceability",
    ],
    notes:
      "Buyer requires DFM report alongside quote. Preferred material: Inconel 718. Delivery to Bangalore SEZ only.",
    poNumber: "—",
    buyerGST: "29AAACH8565R1ZX",
    buyerContact: "Procurement-Central@tier1.in",
    hsn: "8503",
    oemLocation: "KA",
    buyerLocation: "KA",
    gstRate: 18,
    options: {
      name: "Additional Charges",
      values: [
        { label: "Raw", price: 0 },
        { label: "Anodized", price: 150 },
        { label: "Painted", price: 250 },
      ],
    },
  },
  8041: {
    id: "RFQ-8041",
    part: "Servo Actuator Mk-IV",
    qty: 80,
    sector: "Defence",
    status: "AWAITING_QUOTE",
    secsLeft: 11 * 3600 + 5 * 60,
    compliance: ["MIL-STD-461G (EMC)", "IP67 Rated", "ITAR Compliant"],
    notes:
      "Quote must include COTS substitute analysis. No foreign components above 30%.",
    poNumber: "—",
    buyerGST: "07AAACH8566R1ZY",
    buyerContact: "— (Blind)",
    hsn: "8503",
    oemLocation: "KA",
    buyerLocation: "DL",
    gstRate: 18,
    options: {
      name: "Additional Charges",
      values: [
        { label: "No", price: 0 },
        { label: "Yes - Standard", price: 500 },
        { label: "Yes - High Precision", price: 1200 },
      ],
    },
  },
  8039: {
    id: "RFQ-8039",
    part: "IMU Sensor Module",
    qty: 500,
    sector: "Aerospace",
    status: "AWAITING_QUOTE",
    secsLeft: 31 * 3600 + 52 * 60,
    compliance: ["MIL-STD-810G", "DO-178C Level A", "RoHS Compliant"],
    notes:
      "Batch traceability required per unit. Preference for MEMS-based 6-DOF configuration.",
    poNumber: "—",
    buyerGST: "27AAACH8567R1ZZ",
    buyerContact: "— (Blind)",
    hsn: "9030",
    oemLocation: "KA",
    buyerLocation: "KA",
    gstRate: 18,
    options: {
      name: "Additional Charges",
      values: [
        { label: "3-Axis", price: 0 },
        { label: "6-DOF", price: 800 },
        { label: "9-DOF", price: 1500 },
      ],
    },
  },
  8038: {
    id: "RFQ-8038",
    part: "Thermal Camera Core",
    qty: 30,
    sector: "Defence",
    status: "AWAITING_QUOTE",
    secsLeft: 40 * 3600,
    compliance: [
      "NSOP-5 Classified",
      "MIL-STD-461F",
      "Export Control Req.",
    ],
    notes:
      "Requires export clearance documentation with quote. SCOMET item category check required.",
    poNumber: "—",
    buyerGST: "06AAACH8568R1ZW",
    buyerContact: "— (Blind)",
    hsn: "9010",
    oemLocation: "KA",
    buyerLocation: "MH",
    gstRate: 18,
    options: {
      name: "Additional Charges",
      values: [
        { label: "25-250°C", price: 0 },
        { label: "25-500°C", price: 2000 },
        { label: "Custom", price: 5000 },
      ],
    },
  },
  8027: {
    id: "RFQ-8027",
    part: "Radar Antenna Array",
    qty: 12,
    sector: "Defence",
    status: "QUOTE_SUBMITTED",
    secsLeft: 0,
    compliance: ["MIL-STD-810G", "IP68", "VSWR < 1.5"],
    notes: "Standard quote submitted. Awaiting buyer review.",
    poNumber: "—",
    buyerGST: "08AAACH8569R1ZV",
    buyerContact: "— (Blind)",
    hsn: "8529",
    oemLocation: "KA",
    buyerLocation: "DL",
    gstRate: 18,
    options: {
      name: "Additional Charges",
      values: [
        { label: "S-Band", price: 0 },
        { label: "X-Band", price: 3000 },
        { label: "Ku-Band", price: 5000 },
      ],
    },
  },
  8031: {
    id: "RFQ-8031",
    part: "EO/IR Camera Gimbal",
    qty: 6,
    sector: "Aerospace",
    status: "PO_ACCEPTED",
    secsLeft: 0,
    compliance: ["DO-160G", "MIL-STD-810G", "AS9100D"],
    notes: "PO confirmed. Schedule delivery as per agreed T+60 days.",
    poNumber: "HAL-PO-2026-0411",
    buyerGST: "29AAHAL1234L1Z5",
    buyerContact: "procurement@hal.in",
    buyerName: "HAL – Bengaluru Division",
    hsn: "9011",
    oemLocation: "KA",
    buyerLocation: "KA",
    gstRate: 18,
    options: {
      name: "Additional Charges",
      values: [
        { label: "Spherical", price: 0 },
        { label: "Gimbal", price: 1500 },
        { label: "Fixed", price: 800 },
      ],
    },
  },
};

// ── INVENTORY DATA ──
const inventoryData = {
  "imu-sensor": {
    id: "imu-sensor",
    name: "IMU Sensor Module",
    spec: "6-DOF · MEMS · MIL-STD-810G",
    status: "Live",
    moq: 50,
    leadTime: 28,
    unitPrice: 18500,
    certifications: ["MIL-STD-810G", "DO-178C Level A", "RoHS Compliant"],
    description:
      "6-DOF inertial measurement unit with MEMS accelerometers and gyroscopes. Aerospace-grade shock and vibration resistance per DO-160G Category 4.",
    capacity: "500 units/month",
    materials: "PCB Grade FR-4, Aluminum Housing",
    hsn: "9030",
  },
  "turbine-actuator": {
    id: "turbine-actuator",
    name: "Turbine Blade Actuator",
    spec: "Pneumatic · 450°C · DO-160",
    status: "Live",
    moq: 100,
    leadTime: 45,
    unitPrice: 42000,
    certifications: [
      "DO-160G Qualified",
      "MIL-STD-810G",
      "AS9100D Traceability",
    ],
    description:
      "High-temperature pneumatic actuator designed for aerospace turbine applications. Rated to 450°C continuous operation with precision control.",
    capacity: "250 units/month",
    materials: "Stainless Steel 316L, PTFE Seals",
    hsn: "8503",
  },
  "eo-ir-gimbal": {
    id: "eo-ir-gimbal",
    name: "EO/IR Camera Gimbal",
    spec: "3-axis stabilized · −40°C to 85°C",
    status: "Live",
    moq: 5,
    leadTime: 60,
    unitPrice: 285000,
    certifications: ["DO-160G", "MIL-STD-810G", "AS9100D"],
    description:
      "3-axis stabilized gimbal system for EO/IR payloads. Full stabilization for platform motion compensation in airborne environments.",
    capacity: "50 units/month",
    materials: "Magnesium Alloy, Precision Bearings",
    hsn: "9011",
  },
  "radar-antenna": {
    id: "radar-antenna",
    name: "Radar Antenna Array",
    spec: "Phased Array · Ku-Band · IP68",
    status: "Live",
    moq: 2,
    leadTime: 90,
    unitPrice: 1250000,
    certifications: ["MIL-STD-810G", "IP68", "VSWR < 1.5"],
    description:
      "Phased array radar antenna for airborne surveillance. Ku-band operation with 1.2° beam width and 45+ dBi gain.",
    capacity: "20 units/month",
    materials: "Aluminum 7075-T6, Aerospace Epoxy",
    hsn: "8529",
  },
  "lidar-unit": {
    id: "lidar-unit",
    name: "LIDAR Proximity Unit",
    spec: "360° · 200m range · IP54",
    status: "Audit Pending",
    moq: 10,
    leadTime: 35,
    unitPrice: 75000,
    certifications: ["IP54", "MIL-STD-810G", "CE Marked"],
    description:
      "360° solid-state LiDAR with 200m maximum range and 12 fps update rate. MEMS solid-state technology for reliability.",
    capacity: "400 units/month",
    materials: "Aluminum Housing, Polycarbonate Lens",
    hsn: "9030",
  },
  "servo-control": {
    id: "servo-control",
    name: "Servo Control Unit",
    spec: "CAN Bus · 48V · DO-178C",
    status: "Audit Pending",
    moq: 25,
    leadTime: 20,
    unitPrice: 32000,
    certifications: ["DO-178C", "CAN 2.0B", "IEC 61508 SIL2"],
    description:
      "Safety-critical servo control unit with dual redundant CAN interfaces. Certified for civil aviation applications per DO-178C.",
    capacity: "600 units/month",
    materials: "PCB Grade FR-4, Potted Epoxy",
    hsn: "8534",
  },
};

// Store for submitted modules pending audit
window.submittedModules = {};

function renderInventoryGrid() {
  const grid = document.getElementById("inventoryGrid");
  if (!grid) return;
  let html = "";

  // Render existing inventory products
  Object.values(inventoryData).forEach((prod) => {
    const badge =
      prod.status === "Live"
        ? '<span class="badge b-green">Live</span>'
        : '<span class="badge b-amber">Audit Pending</span>';
    const borderStyle =
      prod.status === "Audit Pending"
        ? "border-color:rgba(217,119,6,0.3);"
        : "";
    html += `
<div class="inv-card" onclick="openInventory('${prod.id}')" style="cursor:pointer;${borderStyle}">
  <div class="inv-hdr"><div><div class="inv-name">${prod.name}</div><div class="inv-spec">${prod.spec}</div></div>${badge}</div>
  <div class="inv-meta"><div><div class="im-label">MOQ</div><div class="im-val">${prod.moq} units</div></div><div><div class="im-label">Lead Time</div><div class="im-val">${prod.leadTime} days</div></div><div><div class="im-label">Unit Price</div><div class="im-val" style="color:var(--orange);font-weight:700;">₹${prod.unitPrice.toLocaleString("en-IN")}</div></div></div>
</div>
`;
  });

  // Render submitted modules pending audit
  Object.values(window.submittedModules).forEach((mod) => {
    html += `
<div class="inv-card" onclick="openInventory('${mod.id}')" style="cursor:pointer;border-color:rgba(217,119,6,0.3);">
  <div class="inv-hdr"><div><div class="inv-name">${mod.name}</div><div class="inv-spec">${mod.spec}</div></div><span class="badge b-amber">Audit Pending</span></div>
  <div class="inv-meta"><div><div class="im-label">MOQ</div><div class="im-val">${mod.moq} units</div></div><div><div class="im-label">Lead Time</div><div class="im-val">${mod.leadTime} days</div></div><div><div class="im-label">Status</div><div class="im-val" style="color:var(--text-faint);">Awaiting Review</div></div></div>
</div>
`;
  });

  grid.innerHTML = html;
}

function openRFQ(id) {
  const r = rfqData[id];
  if (!r) return;
  window.currentRFQId = id;
  window.currentRFQ = r;
  document.getElementById("slideTitle").textContent = r.id;
  document.getElementById("slideSubtitle").textContent =
    r.part + " · " + r.sector;

  let urgCls =
    r.secsLeft > 0 && r.secsLeft < 12 * 3600
      ? "crit"
      : r.secsLeft < 24 * 3600
        ? "warn"
        : "ok";
  let slaStr = r.secsLeft > 0 ? fmtSecs(r.secsLeft) : "—";

  let leftCol = `
<div class="detail-grid">
<div class="detail-item"><div class="d-label">RFQ Identifier</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;">${r.id}</div></div>
<div class="detail-item"><div class="d-label">Component</div><div class="d-value">${r.part}</div></div>
<div class="detail-item"><div class="d-label">Quantity</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;">${r.qty.toLocaleString()} units</div></div>
<div class="detail-item"><div class="d-label">SLA Remaining</div><div class="d-value"><span class="sla-clock ${urgCls}" id="detailTimer">${slaStr}</span></div></div>
<div class="detail-item"><div class="d-label">Status</div><div class="d-value">${statusBadge(r.status)}</div></div>`;

  if (r.status === "PO_ACCEPTED") {
    leftCol += `<div class="detail-item"><div class="d-label">PO Number</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-weight:700;">${r.poNumber}</div></div>
<div class="detail-item"><div class="d-label">Buyer</div><div class="d-value" style="color:var(--green-bright);font-weight:600;">${r.buyerName}</div></div>
<div class="detail-item"><div class="d-label">Buyer GSTIN</div><div class="d-value">${r.buyerGST}</div></div>
<div class="detail-item"><div class="d-label">Contact</div><div class="d-value">${r.buyerContact}</div></div>`;
  } else {
    leftCol += `<div class="detail-item"><div class="d-label">Buyer</div><div class="d-value"><div class="blind-id"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Verified Tier-1 Enterprise</div></div></div>`;
  }
  leftCol += `</div><hr class="divider">`;

  leftCol += `<div class="d-label" style="margin-bottom:10px;">Required Compliance</div>
<div style="display:flex;flex-direction:column;gap:7px;margin-bottom:18px;">`;
  r.compliance.forEach((c) => {
    leftCol += `<div style="display:flex;align-items:center;gap:9px;font-size:12px;color:var(--text-mid);">
<div style="width:16px;height:16px;border-radius:3px;background:var(--green-dim);border:1px solid rgba(34,197,94,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--green-bright)" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
</div>${c}</div>`;
  });
  leftCol += `</div>`;

  leftCol += `<hr class="divider"><div class="d-label" style="margin-bottom:9px;">Notes</div>
<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:4px;padding:13px 15px;font-size:12px;color:var(--text-mid);line-height:1.6;">${r.notes}</div>`;

  let rightCol = "";

  // Quote engine
  if (r.status === "AWAITING_QUOTE") {
    rightCol = `
<div class="quote-engine">
<div class="qe-title">Submit Quote</div>
<div class="quote-inputs" style="grid-template-columns:1fr;gap:12px;margin-bottom:0;">
  <div class="inp-group">
    <label class="inp-label">Your Price (₹ / unit)</label>
    <input class="num-input" type="number" id="qUnit" placeholder="0.00" min="0" oninput="calcTotal('${r.qty}')"/>
    <div class="inp-hint">Your manufacturing cost + profit, ex-GST</div>
  </div>
  <div class="inp-group">
    <label class="inp-label">Lead Time (Days)</label>
    <input class="num-input" type="number" id="qLead" placeholder="30" min="1"/>
    <div class="inp-hint">From PO confirmation</div>
  </div>
  <div class="inp-group">
    <label class="inp-label">GST Rate (%)</label>
    <div class="num-input" style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--surface-3);border-radius:4px;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;color:var(--text);" id="qGST">${r.gstRate}% <span style="font-size:11px;color:var(--text-dim);" id="gstType">(Linked to HSN: ${r.hsn})</span></div>
    <div class="inp-hint">Auto-calculated based on OEM & buyer location</div>
  </div>
</div>
<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:5px;padding:14px 16px;margin:14px 0;display:flex;flex-direction:column;gap:12px;">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">Unit Price</span>
    <span style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;color:var(--text);" id="calcUnitPrice">₹ —</span>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">×  Total Units</span>
    <span style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;color:var(--text);" id="calcTotalUnits">${r.qty.toLocaleString()}</span>
  </div>
  <div style="border-top:1px solid var(--border);padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">Subtotal (ex-GST)</span>
    <span style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;color:var(--text);" id="calcSubtotal">₹ —</span>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;" id="cgstRow">
    <span style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">+ CGST</span>
    <span style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;color:var(--text);" id="calcCGST">₹ —</span>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;" id="sgstRow">
    <span style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">+ SGST</span>
    <span style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;color:var(--text);" id="calcSGST">₹ —</span>
  </div>
  <div style="display:none;flex;justify-content:space-between;align-items:center;" id="igstRow">
    <span style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">+ IGST</span>
    <span style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;color:var(--text);" id="calcIGST">₹ —</span>
  </div>
  <div style="border-top:1px solid var(--border);padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:11px;color:var(--text);font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">TOTAL ORDER VALUE</span>
    <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:18px;color:var(--orange);" id="calcFinalTotal">₹ —</span>
  </div>
</div>
<div class="quote-total" id="quoteTotalRow" style="display:none;">
  <div><div class="qt-label">Total Order Value</div><div style="font-size:10px;color:var(--text-faint);margin-top:2px;">For ${r.qty.toLocaleString()} units at selling price</div></div>
  <div class="qt-val" id="qTotalVal">₹0</div>
</div>
<div id="quoteFormArea">
  <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="submitQuote('${id}')">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
    Transmit Quote
  </button>
</div>
<div class="quote-success" id="quoteSuccess">
  <div class="success-ring"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green-bright)" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg></div>
  <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:16px;color:var(--green-bright);letter-spacing:0.08em;">QUOTE TRANSMITTED</div>
  <div style="font-size:11.5px;color:var(--text-dim);margin-top:7px;">Standardised PDF dispatched as <strong style="color:var(--text-mid);">OEM #4872</strong>. Buyer notified anonymously.</div>
</div>
</div>`;
  }

  if (r.status === "QUOTE_SUBMITTED") {
    rightCol = `<div style="background:var(--blue-dim);border:1px solid rgba(37,99,235,0.25);border-radius:5px;padding:18px;text-align:center;">
<div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;color:var(--blue-bright);letter-spacing:0.08em;margin-bottom:6px;">QUOTE DISPATCHED</div>
<div style="font-size:11.5px;color:var(--text-dim);">Transmitted as <strong style="color:var(--text-mid);">OEM #4872</strong>. Awaiting buyer acceptance.</div>
</div>`;
  }

  if (r.status === "PO_ACCEPTED") {
    rightCol = `<div style="background:var(--green-dim);border:1px solid rgba(34,197,94,0.25);border-radius:5px;padding:18px;text-align:center;">
<div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;color:var(--green-bright);letter-spacing:0.08em;margin-bottom:6px;">PURCHASE ORDER LOCKED</div>
<div style="font-size:11.5px;color:var(--text-dim);">Proceed with fulfillment per agreed delivery schedule.</div>
</div>`;
  }

  let body = `<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:20px;">
<div>${leftCol}</div>
<div>${rightCol}</div>
</div>`;

  document.getElementById("slideBody").innerHTML = body;

  let ftr = "";
  if (r.status === "PO_ACCEPTED") {
    ftr = `<button class="btn btn-primary" style="flex:1;justify-content:center;">Mark as Dispatched</button><button class="btn btn-ghost" onclick="closeRFQ()">Close</button>`;
  } else {
    ftr = `<button class="btn btn-ghost" onclick="closeRFQ()">Close Panel</button>`;
  }
  document.getElementById("slideFtr").innerHTML = ftr;
  document.getElementById("rfqOverlay").classList.add("open");
  document.getElementById("rfqSlideout").classList.add("open");

  // live countdown in detail panel
  if (r.secsLeft > 0) {
    window._detailInterval = setInterval(() => {
      if (r.secsLeft > 0) {
        r.secsLeft--;
        const el = document.getElementById("detailTimer");
        if (el) el.textContent = fmtSecs(r.secsLeft);
      }
    }, 1000);
  }
}

function closeRFQ() {
  document.getElementById("rfqOverlay").classList.remove("open");
  document.getElementById("rfqSlideout").classList.remove("open");
  clearInterval(window._detailInterval);
}

function openInventory(id) {
  let prod = inventoryData[id];
  if (!prod) prod = window.submittedModules[id];
  if (!prod) return;
  document.getElementById("invTitle").textContent = prod.name;
  document.getElementById("invSubtitle").textContent = prod.spec;

  let statusBadgeHtml =
    prod.status === "Live"
      ? '<span class="badge b-green">Live</span>'
      : '<span class="badge b-amber">Audit Pending</span>';

  let body = `
<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:20px;">
<div style="display:flex;flex-direction:column;gap:16px;">
<div class="detail-grid">
  <div class="detail-item"><div class="d-label">Product Name</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;">${prod.name}</div></div>
  <div class="detail-item"><div class="d-label">Specification</div><div class="d-value">${prod.spec}</div></div>
  <div class="detail-item"><div class="d-label">Status</div><div class="d-value">${statusBadgeHtml}</div></div>`;

  // Show unit price only for Live products
  if (prod.status === "Live") {
    body += `<div class="detail-item"><div class="d-label">Unit Price</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;color:var(--orange);">₹${prod.unitPrice.toLocaleString("en-IN")}</div></div>`;
  }

  body += `<div class="detail-item"><div class="d-label">Minimum Order Qty</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;">${prod.moq} units</div></div>
  <div class="detail-item"><div class="d-label">Lead Time</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;">${prod.leadTime} days</div></div>`;

  if (prod.status === "Live") {
    body += `<div class="detail-item"><div class="d-label">Production Capacity</div><div class="d-value">${prod.capacity}</div></div>
  <div class="detail-item"><div class="d-label">HSN Code</div><div class="d-value" style="font-family:'Rajdhani',sans-serif;font-weight:700;">${prod.hsn}</div></div>`;
  }

  body += `</div>
<hr class="divider">
<div class="d-label" style="margin-bottom:10px;">Description</div>
<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:4px;padding:13px 15px;font-size:12px;color:var(--text-mid);line-height:1.6;">${prod.description}</div>`;

  if (prod.status === "Live") {
    body += `<hr class="divider">
<div class="d-label" style="margin-bottom:10px;">Materials & Composition</div>
<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:4px;padding:13px 15px;font-size:12px;color:var(--text-mid);line-height:1.6;">${prod.materials}</div>
<hr class="divider">
<div class="d-label" style="margin-bottom:10px;">Certifications & Compliance</div>
<div style="display:flex;flex-direction:column;gap:7px;margin-bottom:18px;">`;
    prod.certifications.forEach((c) => {
      body += `<div style="display:flex;align-items:center;gap:9px;font-size:12px;color:var(--text-mid);">
    <div style="width:16px;height:16px;border-radius:3px;background:var(--green-dim);border:1px solid rgba(34,197,94,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--green-bright)" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
    </div>${c}</div>`;
    });
    body += `</div>`;
  } else if (prod.documents && prod.documents.length > 0) {
    body += `<hr class="divider">
<div class="d-label" style="margin-bottom:10px;">Submitted Documents</div>
<div style="display:flex;flex-direction:column;gap:8px;">`;
    prod.documents.forEach((doc) => {
      body += `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:4px;padding:10px 12px;font-size:11px;color:var(--text-mid);">
  <div style="font-weight:600;color:var(--text);">${doc.name}</div>
  <div style="font-size:10px;color:var(--text-faint);margin-top:3px;">${doc.file} · ${doc.size}MB</div>
</div>`;
    });
    body += `</div>`;
  }

  body += `</div>
<div style="padding:16px;background:var(--surface-2);border-radius:6px;border:1px solid var(--border);height:fit-content;">
<div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;color:var(--text);margin-bottom:14px;letter-spacing:0.08em;">LISTING STATUS</div>`;

  if (prod.status === "Live") {
    body += `<div style="background:var(--green-dim);border:1px solid rgba(34,197,94,0.25);border-radius:5px;padding:16px;text-align:center;margin-bottom:14px;">
<div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;color:var(--green-bright);letter-spacing:0.08em;margin-bottom:8px;">LIVE ON CATALOG</div>
<div style="font-size:11.5px;color:var(--text-dim);margin-bottom:12px;">This product is visible to all qualified buyers on the marketplace.</div>
<div style="background:var(--surface);padding:10px;border-radius:4px;border:1px solid rgba(34,197,94,0.1);font-size:10px;color:var(--text-faint);font-family:'Rajdhani',sans-serif;">
  <strong style="color:var(--text-mid);">Cannot be modified</strong><br>Submit change request to Bharat Modules for any updates.
</div>
</div>`;
  } else {
    body += `<div style="background:var(--amber-dim);border:1px solid rgba(217,119,6,0.25);border-radius:5px;padding:16px;text-align:center;margin-bottom:14px;">
<div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;color:var(--amber-bright);letter-spacing:0.08em;margin-bottom:8px;">AUDIT PENDING</div>
<div style="font-size:11.5px;color:var(--text-dim);">Awaiting admin approval. You'll be notified once approved.</div>
</div>`;
  }

  body += `<div style="background:var(--orange-dim);border:1px solid rgba(232,92,13,0.2);border-radius:4px;padding:11px;font-size:10px;color:var(--text-mid);">
<strong style="color:var(--orange);">ℹ️ Read-only Mode</strong><br>
All product details are locked. To make changes, submit a modification request to Bharat Modules support.
</div></div>
</div>`;

  document.getElementById("invBody").innerHTML = body;

  let ftr = "";
  if (prod.status === "Live") {
    ftr = `<button class="btn btn-primary" style="flex:1;justify-content:center;">Request Modification</button><button class="btn btn-ghost" onclick="closeInventory()">Close</button>`;
  } else {
    ftr = `<button class="btn btn-ghost" onclick="closeInventory()">Close Panel</button>`;
  }
  document.getElementById("invFtr").innerHTML = ftr;

  document.getElementById("invOverlay").classList.add("open");
  document.getElementById("invSlideout").classList.add("open");
}

function closeInventory() {
  document.getElementById("invOverlay").classList.remove("open");
  document.getElementById("invSlideout").classList.remove("open");
}

function calcTotal(qty) {
  const r = window.currentRFQ;
  if (!r) return;

  const unit = parseFloat(document.getElementById("qUnit")?.value) || 0;
  const qtyNum = parseInt(qty);
  const subtotal = unit * qtyNum;

  // Determine if CGST+SGST or IGST based on OEM & buyer location
  const isSameState = r.oemLocation === r.buyerLocation;
  const gstRate = r.gstRate;

  let cgstAmount = 0,
    sgstAmount = 0,
    igstAmount = 0;

  if (isSameState) {
    cgstAmount = (subtotal * (gstRate / 2)) / 100;
    sgstAmount = (subtotal * (gstRate / 2)) / 100;
    document.getElementById("cgstRow").style.display = "flex";
    document.getElementById("sgstRow").style.display = "flex";
    document.getElementById("igstRow").style.display = "none";
    document.getElementById("calcCGST").textContent = "₹ " + cgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
    document.getElementById("calcSGST").textContent = "₹ " + sgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  } else {
    igstAmount = (subtotal * gstRate) / 100;
    document.getElementById("cgstRow").style.display = "none";
    document.getElementById("sgstRow").style.display = "none";
    document.getElementById("igstRow").style.display = "flex";
    document.getElementById("calcIGST").textContent = "₹ " + igstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }

  const finalTotal = subtotal + cgstAmount + sgstAmount + igstAmount;

  document.getElementById("calcUnitPrice").textContent = "₹ " + unit.toLocaleString("en-IN");
  document.getElementById("calcSubtotal").textContent = "₹ " + subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  document.getElementById("calcFinalTotal").textContent = "₹ " + finalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function submitQuote(id) {
  const btn = event.currentTarget;
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML =
    '<svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Transmitting...';

  setTimeout(() => {
    rfqData[id].status = "QUOTE_SUBMITTED";
    document.getElementById("quoteFormArea").style.display = "none";
    document.getElementById("quoteSuccess").style.display = "block";
    renderRFQTable();

    // Trigger success feedback
    const ring = document.querySelector(".success-ring");
    ring.style.transform = "scale(1.1)";
    setTimeout(() => (ring.style.transform = "scale(1)"), 200);
  }, 2000);
}

function statusBadge(s) {
  if (s === "AWAITING_QUOTE") return '<span class="badge b-orange">Awaiting Quote</span>';
  if (s === "QUOTE_SUBMITTED") return '<span class="badge b-blue">Quote Submitted</span>';
  if (s === "PO_ACCEPTED") return '<span class="badge b-green">PO Confirmed</span>';
  return '<span class="badge b-gray">' + s + "</span>";
}

function sectorBadge(s) {
  if (s === "Aerospace") return '<span class="sector-tag sector-aero">Aerospace</span>';
  if (s === "Defence") return '<span class="sector-tag sector-def">Defence</span>';
  return '<span class="sector-tag">' + s + "</span>";
}

function fmtSecs(s) {
  if (s <= 0) return "00:00:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => v.toString().padStart(2, "0")).join(":");
}

function renderRFQTable(filter = "ALL") {
  const tbody = document.querySelector("#rfqTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  Object.values(rfqData).forEach((r) => {
    if (filter !== "ALL" && r.status !== filter) return;

    let urgCls =
      r.secsLeft > 0 && r.secsLeft < 12 * 3600
        ? "crit"
        : r.secsLeft < 24 * 3600
          ? "warn"
          : "ok";
    let slaStr = r.secsLeft > 0 ? fmtSecs(r.secsLeft) : "—";

    const tr = document.createElement("tr");
    tr.onclick = () => openRFQ(r.id.split("-")[1]);
    tr.innerHTML = `
<td class="td-id">${r.id}</td>
<td class="td-part">${r.part}</td>
<td class="td-qty">${r.qty.toLocaleString()}</td>
<td>${sectorBadge(r.sector)}</td>
<td class="td-status">${statusBadge(r.status)}</td>
<td><span class="sla-clock ${urgCls}" data-id="${r.id}">${slaStr}</span></td>
<td style="text-align:right;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="opacity:0.3"><polyline points="9 18 15 12 9 6"/></svg>
</td>
`;
    tbody.appendChild(tr);
  });
}

function switchView(v) {
  document.querySelectorAll(".view").forEach((el) => el.classList.remove("active"));
  document.getElementById("view-" + v).classList.add("active");

  document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
  event.currentTarget.classList.add("active");

  document.getElementById("pageTitle").textContent =
    v === "rfq" ? "RFQ Management" : v === "inventory" ? "Global Inventory" : "Compliance Vault";
}

function filterRFQs(f) {
  document.querySelectorAll(".rfq-filter-btn").forEach((b) => b.classList.remove("active"));
  event.currentTarget.classList.add("active");
  renderRFQTable(f);
}

function openAddModal() {
  document.getElementById("addModuleOverlay").classList.add("open");
}

function closeAddModal() {
  document.getElementById("addModuleOverlay").classList.remove("open");
  resetAddForm();
}

function resetAddForm() {
  document.getElementById("modProductName").value = "";
  document.getElementById("modDescription").value = "";
  document.getElementById("modTechSpecs").value = "";
  document.getElementById("modMOQ").value = "";
  document.getElementById("modLeadTime").value = "";
  document.getElementById("modFileInput").value = "";
  document.getElementById("uploadedFilesList").innerHTML = "";
  window._uploadedFiles = [];
}

window._uploadedFiles = [];

function handleFileSelect(e) {
  const files = e.target.files;
  for (let f of files) {
    window._uploadedFiles.push(f);
    addFileToList(f);
  }
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById("uploadArea").style.borderColor = "var(--border-bright)";
  const files = e.dataTransfer.files;
  for (let f of files) {
    window._uploadedFiles.push(f);
    addFileToList(f);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById("uploadArea").style.borderColor = "var(--orange)";
}

function handleDragLeave(e) {
  document.getElementById("uploadArea").style.borderColor = "var(--border-bright)";
}

function addFileToList(f) {
  const list = document.getElementById("uploadedFilesList");
  const item = document.createElement("div");
  item.style =
    "display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--surface-3);border-radius:4px;border:1px solid var(--border);";
  item.innerHTML = `
<div style="display:flex;align-items:center;gap:10px;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
  <div style="font-size:11px;color:var(--text);font-weight:500;">${f.name}</div>
</div>
<div style="font-size:10px;color:var(--text-faint);">${(f.size / 1024 / 1024).toFixed(2)} MB</div>
`;
  list.appendChild(item);
}

function submitModule() {
  const name = document.getElementById("modProductName").value;
  if (!name) return alert("Product Name is required");

  const btn = event.currentTarget;
  btn.disabled = true;
  btn.innerHTML = "Submitting...";

  setTimeout(() => {
    const id = "mod-" + Date.now();
    window.submittedModules[id] = {
      id: id,
      name: name,
      spec: document.getElementById("modTechSpecs").value || "N/A",
      status: "Audit Pending",
      moq: document.getElementById("modMOQ").value || "0",
      leadTime: document.getElementById("modLeadTime").value || "0",
      description: document.getElementById("modDescription").value || "",
      documents: window._uploadedFiles.map((f) => ({
        name: "Technical Datasheet",
        file: f.name,
        size: (f.size / 1024 / 1024).toFixed(2),
      })),
    };

    closeAddModal();
    renderInventoryGrid();
    alert("Product submitted for audit successfully.");
  }, 1500);
}

// ── INITIALIZE ──
document.addEventListener("DOMContentLoaded", () => {
  renderRFQTable();
  renderInventoryGrid();

  // Global countdown timer for RFQs
  setInterval(() => {
    Object.values(rfqData).forEach((r) => {
      if (r.secsLeft > 0) {
        r.secsLeft--;
        const els = document.querySelectorAll('.sla-clock[data-id="' + r.id + '"]');
        els.forEach((el) => {
          el.textContent = fmtSecs(r.secsLeft);
        });
      }
    });
  }, 1000);
});


