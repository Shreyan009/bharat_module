/**
 * onboarding.js
 * Logic for Manufacturer Onboarding & Verification
 */

/* ── 3D PARTICLE GLOBE BACKGROUND ── */
const bgCanvas = document.getElementById("particleCanvas");
const bgCtx = bgCanvas ? bgCanvas.getContext("2d") : null;
let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  if (bgCanvas) {
    bgCanvas.width = width;
    bgCanvas.height = height;
  }
}
window.addEventListener("resize", resize);
resize();

const numParticles = 1200; // Dense massive field
const particles = [];

for (let i = 0; i < numParticles; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);
  const dist = 750 + Math.random() * 50; // Base shell + variation
  particles.push({
    x: dist * Math.sin(phi) * Math.cos(theta),
    y: dist * Math.sin(phi) * Math.sin(theta),
    z: dist * Math.cos(phi),
    color: Math.random() > 0.85 ? "#e85c0d" : "#9a9a96",
    scale: 0.8 + Math.random() * 1.5,
    sm: Math.random() > 0.98 ? 2.5 : 1.0, // Occasional large star
  });
}

let rotationY = 0;
let rotationX = 0;

function drawGlobe() {
  if (!bgCtx) return;
  bgCtx.clearRect(0, 0, width, height);

  rotationY += 0.0006;
  rotationX += 0.0002;

  const cy = height / 2;
  const cx = width / 2;

  particles.forEach((p) => {
    // Rotation Y
    let x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
    let z1 = p.x * Math.sin(rotationY) + p.z * Math.cos(rotationY);

    // Rotation X
    let y2 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
    let z2 = p.y * Math.sin(rotationX) + z1 * Math.cos(rotationX);

    // Perspective projection
    const fov = 1000;
    const project = fov / (fov + z2);
    p.xp = x1 * project + cx;
    p.yp = y2 * project + cy;
    p.z = z2;

    if (
      p.xp > 0 &&
      p.xp < width &&
      p.yp > 0 &&
      p.yp < height &&
      z2 > -fov
    ) {
      bgCtx.beginPath();
      const r = Math.max(1.0, 1.8 * p.scale * p.sm);
      bgCtx.arc(p.xp, p.yp, r, 0, Math.PI * 2);
      bgCtx.fillStyle = p.color;
      bgCtx.globalAlpha = Math.max(0.02, Math.min(0.8, (2500 - p.z) / 4000));
      bgCtx.fill();
    }
  });

  requestAnimationFrame(drawGlobe);
}
drawGlobe();

/* ── STATE ── */
let currentPhase = 1;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB limit
const uploadedFiles = {
  gst: false,
  msme: false,
  coi: false,
  factory: false,
  pan: false,
  sigdoc: false,
};
let currentSigMethod = "draw";
let sigHasData = false;
let sigDrawing = false;

function toggleSigMethod() {
  const methods = document.getElementsByName("sigMethod");
  for (let m of methods) {
    if (m.checked) currentSigMethod = m.value;
  }
  const drawWrap = document.getElementById("sig-draw-wrap");
  const uploadWrap = document.getElementById("sig-upload-wrap");
  if (currentSigMethod === "draw") {
    if (drawWrap) drawWrap.style.display = "block";
    if (uploadWrap) uploadWrap.style.display = "none";
  } else {
    if (drawWrap) drawWrap.style.display = "none";
    if (uploadWrap) uploadWrap.style.display = "block";
  }
}

function goToPhase(p) {
  if (p < 1 || p > 5) return;
  document.querySelectorAll(".phase").forEach((el) => el.classList.remove("active"));
  const targetPhase = document.getElementById("phase" + p);
  if (targetPhase) targetPhase.classList.add("active");
  currentPhase = p;

  // Update Stepper
  document.querySelectorAll(".step-item").forEach((step, idx) => {
    step.classList.remove("active", "completed");
    if (idx + 1 < p) step.classList.add("completed");
    if (idx + 1 === p) step.classList.add("active");
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  localStorage.setItem("bharat_modules_onboarding_phase", p);

  if (p === 4) {
    setTimeout(resizeCanvas, 100);
    updateSigGate();
  }
}

function toggleDropdown() {
  const dropdown = document.getElementById("catDropdown");
  if (dropdown) dropdown.classList.toggle("open");
}

function handleUpload(input, uploadBoxId, statusId, key) {
  const file = input.files[0];
  const fu = document.getElementById(uploadBoxId);
  const us = document.getElementById(statusId);
  const fg = fu ? fu.closest(".form-group") : null;

  if (!file) {
    if (fu) fu.classList.remove("has-file");
    if (us) us.textContent = key === "sigdoc" ? "PDF/Image" : "PDF only";
    uploadedFiles[key] = false;
    return;
  }

  if (file.size > MAX_FILE_BYTES) {
    input.value = "";
    if (fu) fu.classList.remove("has-file");
    if (us) us.textContent = "File too large";
    uploadedFiles[key] = false;
    if (fg) {
      const err = fg.querySelector(".field-error");
      if (err) err.textContent = "Maximum file size is 5 MB.";
      fg.classList.add("has-error");
    }
    return;
  }

  const validTypes = key === "sigdoc"
    ? ["application/pdf", "image/jpeg", "image/png"]
    : ["application/pdf"];

  if (!validTypes.includes(file.type)) {
    input.value = "";
    if (fu) fu.classList.remove("has-file");
    if (us) us.textContent = key === "sigdoc" ? "PDF/Img only" : "PDF only";
    uploadedFiles[key] = false;
    if (fg) {
      const err = fg.querySelector(".field-error");
      if (err) err.textContent = key === "sigdoc" ? "Only PDF, JPG, and PNG are allowed." : "Only PDF files are accepted.";
      fg.classList.add("has-error");
    }
    return;
  }

  // Success
  if (fu) fu.classList.add("has-file");
  const shortName = file.name.length > 22 ? file.name.substring(0, 20) + "…" : file.name;
  if (us) us.textContent = "✓ " + shortName;
  uploadedFiles[key] = true;
  if (fg) fg.classList.remove("has-error");
}

/* ── PHASE 1 VALIDATION & VERIFICATION ── */
let verifiedStatus = { email: false, phone: false };

function startVerification(type) {
  const targetEl = document.getElementById(type === "email" ? "obEmail" : "obPhone");
  if (!targetEl) return;
  const targetVal = targetEl.value || (type === "email" ? "your email address" : "your phone number");
  const otpTarget = document.getElementById("otp-target-" + type);
  if (otpTarget) otpTarget.textContent = targetVal;

  const btn = document.getElementById("btn-verify-" + type);
  if (btn) {
    btn.innerHTML = "Sending...";
    btn.style.opacity = "0.7";
    btn.style.pointerEvents = "none";
  }

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = "Code Sent";
      btn.style.opacity = "1";
    }
    const container = document.getElementById("otp-container-" + type);
    const input = document.getElementById("otp-input-" + type);
    if (container) container.style.display = "block";
    if (input) input.focus();
  }, 800);
}

function confirmOTP(type) {
  const valEl = document.getElementById("otp-input-" + type);
  const err = document.getElementById("otp-error-" + type);
  if (!valEl) return;
  const val = valEl.value;

  if (val === "1234") {
    if (err) err.style.display = "none";
    verifiedStatus[type] = true;
    const container = document.getElementById("otp-container-" + type);
    if (container) container.style.display = "none";
    const btn = document.getElementById("btn-verify-" + type);
    if (btn) {
      btn.innerHTML = `✓ Verified`;
      btn.classList.add("verified");
    }
  } else {
    if (err) err.style.display = "block";
  }
}

function updateCatSelection() {
  const inputs = document.querySelectorAll('.dropdown-item input[type="checkbox"]:checked');
  const textEl = document.getElementById("catSelectedText");
  const fgCat = document.getElementById("fg-component-category");

  if (!textEl) return;

  if (inputs.length === 0) {
    textEl.textContent = "Select Categories...";
    textEl.style.color = "var(--gray-400)";
  } else if (inputs.length === 1) {
    textEl.textContent = inputs[0].value;
    textEl.style.color = "var(--black)";
    if (fgCat) fgCat.classList.remove("has-error");
  } else {
    textEl.textContent = inputs.length + " Categories Selected";
    textEl.style.color = "var(--black)";
    if (fgCat) fgCat.classList.remove("has-error");
  }
}

document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("catDropdown");
  if (dropdown && dropdown.classList.contains("open") && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

function validatePhase1() {
  let passed = true;

  if (!verifiedStatus.email) {
    const btn = document.getElementById("btn-verify-email");
    if (btn) {
      btn.style.boxShadow = "0 0 0 2px var(--error)";
      setTimeout(() => (btn.style.boxShadow = ""), 2000);
    }
    passed = false;
  }
  if (!verifiedStatus.phone) {
    const btn = document.getElementById("btn-verify-phone");
    if (btn) {
      btn.style.boxShadow = "0 0 0 2px var(--error)";
      setTimeout(() => (btn.style.boxShadow = ""), 2000);
    }
    passed = false;
  }

  const inputs = document.querySelectorAll('.dropdown-item input[type="checkbox"]:checked');
  const fgCat = document.getElementById("fg-component-category");
  if (inputs.length === 0) {
    if (fgCat) fgCat.classList.add("has-error");
    passed = false;
  } else {
    if (fgCat) fgCat.classList.remove("has-error");
  }

  if (passed) {
    goToPhase(2);
  } else {
    const notice = (!verifiedStatus.email || !verifiedStatus.phone)
      ? document.getElementById("fg-email")
      : fgCat;
    if (notice) notice.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function validatePhase2() {
  let valid = true;
  ["coi", "gst", "msme", "factory", "pan"].forEach((key) => {
    const fg = document.getElementById("fg-" + key);
    if (!uploadedFiles[key]) {
      if (fg) fg.classList.add("has-error");
      valid = false;
    } else {
      if (fg) fg.classList.remove("has-error");
    }
  });

  if (valid) {
    goToPhase(3);
  } else {
    const firstErr = document.querySelector("#phase2 .form-group.has-error");
    if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function validatePhase3() {
  const boxes = [
    "chk-tc-clause1", "chk-tc-clause2", "chk-tc-clause3", "chk-tc-clause4",
    "chk-tc-clause5", "chk-tc-clause6", "chk-tc-clause7", "chk-tc-clause8"
  ];
  const remaining = boxes.filter(id => {
    const el = document.getElementById(id);
    return el && !el.checked;
  });

  if (remaining.length > 0) {
    const notice = document.getElementById("tcGateNotice");
    if (notice) {
      notice.style.transform = "scale(1.02)";
      setTimeout(() => (notice.style.transform = "scale(1)"), 200);
    }

    remaining.forEach((id) => {
      const el = document.getElementById(id);
      const block = el ? el.closest(".clause-block") : null;
      if (block) {
        block.style.borderColor = "var(--error)";
        setTimeout(() => (block.style.borderColor = ""), 2000);
      }
    });
    return;
  }
  goToPhase(4);
}

function updateTcGate() {
  const clauses = [
    "chk-tc-clause1", "chk-tc-clause2", "chk-tc-clause3", "chk-tc-clause4",
    "chk-tc-clause5", "chk-tc-clause6", "chk-tc-clause7", "chk-tc-clause8"
  ];
  const remainingCount = clauses.filter(id => {
    const el = document.getElementById(id);
    return el && !el.checked;
  }).length;

  const notice = document.getElementById("tcGateNotice");
  const icon = document.getElementById("tcGateIcon");
  const text = document.getElementById("tcGateText");

  if (!notice) return;

  if (remainingCount === 0) {
    notice.style.background = "rgba(46, 125, 50, 0.08)";
    notice.style.color = "var(--green)";
    notice.style.borderColor = "rgba(46, 125, 50, 0.2)";
    if (icon) icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
    if (text) text.textContent = "All sections acknowledged. You may continue.";
  } else {
    notice.style.background = "rgba(232, 92, 13, 0.08)";
    notice.style.color = "var(--orange)";
    notice.style.borderColor = "rgba(232, 92, 13, 0.2)";
    if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
    if (text) text.textContent = `Acknowledge ${remainingCount} more section${remainingCount > 1 ? "s" : ""} above to continue.`;
  }
}

function toggleClause(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("open");
}

function allClausesChecked() {
  return ["chk-clause1", "chk-clause2", "chk-clause3", "chk-clause4"].every(id => {
    const el = document.getElementById(id);
    return el && el.checked;
  });
}

function updateSigGate() {
  const done = allClausesChecked();
  const sig = document.getElementById("sigContainer");
  const notice = document.getElementById("sigGateNotice");
  const gateText = document.getElementById("sigGateText");
  const gateIcon = document.getElementById("sigGateIcon");
  const phText = document.getElementById("sigPlaceholderText");
  const lockIcon = document.getElementById("sigLockIcon");

  const sigUploadInput = document.getElementById("sigdoc-input");
  const fuSigdoc = document.getElementById("fu-sigdoc");
  const lockMsg = document.getElementById("fe-sigdoc-lock");

  if (done) {
    if (sig) sig.classList.remove("locked");
    if (notice) notice.classList.add("all-done");
    if (gateIcon) gateIcon.innerHTML = '<polyline points="2,8 6,12 14,4"/>';
    if (gateText) gateText.textContent = "All clauses acknowledged. Please sign below or upload.";
    if (phText) phText.textContent = "Sign here using your mouse or finger";
    if (lockIcon) lockIcon.style.display = "none";

    if (sigUploadInput) {
      sigUploadInput.disabled = false;
      if (fuSigdoc) fuSigdoc.style.opacity = "1";
      if (lockMsg) lockMsg.style.display = "none";
    }
  } else {
    if (sig) sig.classList.add("locked");
    if (notice) notice.classList.remove("all-done");
    if (gateIcon) gateIcon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
    
    const remainingCount = ["chk-clause1", "chk-clause2", "chk-clause3", "chk-clause4"].filter(id => {
      const el = document.getElementById(id);
      return el && !el.checked;
    }).length;
    
    if (gateText) gateText.textContent = `Acknowledge ${remainingCount} more clause${remainingCount > 1 ? "s" : ""} above to unlock signing.`;
    if (phText) phText.textContent = "Acknowledge all clauses to unlock";
    if (lockIcon) lockIcon.style.display = "";

    if (sigUploadInput) {
      sigUploadInput.disabled = true;
      if (fuSigdoc) fuSigdoc.style.opacity = "0.42";
      if (lockMsg) lockMsg.style.display = "block";
    }
  }
}

/* ── SIGNATURE PAD ── */
const canvas = document.getElementById("sigCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

function resizeCanvas() {
  if (!canvas || !canvas.parentElement) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = 140 * dpr;
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }
}

function getPos(e) {
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

if (canvas) {
  canvas.addEventListener("mousedown", (e) => {
    if (!allClausesChecked()) return;
    sigDrawing = true;
    const p = getPos(e);
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    const ph = document.getElementById("sigPlaceholder");
    if (ph) ph.style.opacity = "0";
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!sigDrawing || !ctx) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    sigHasData = true;
  });
  canvas.addEventListener("mouseup", () => {
    sigDrawing = false;
    if (ctx) ctx.beginPath();
  });
  canvas.addEventListener("mouseleave", () => {
    sigDrawing = false;
    if (ctx) ctx.beginPath();
  });

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!allClausesChecked()) return;
    sigDrawing = true;
    const p = getPos(e);
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    const ph = document.getElementById("sigPlaceholder");
    if (ph) ph.style.opacity = "0";
  }, { passive: false });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!sigDrawing || !ctx) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    sigHasData = true;
  }, { passive: false });
  canvas.addEventListener("touchend", () => {
    sigDrawing = false;
    if (ctx) ctx.beginPath();
  });
}

function clearSig() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sigHasData = false;
  if (allClausesChecked()) {
    const ph = document.getElementById("sigPlaceholder");
    const pht = document.getElementById("sigPlaceholderText");
    if (ph) ph.style.opacity = "1";
    if (pht) pht.textContent = "Sign here using your mouse or finger";
  }
}

function downloadNDA() {
  if (!allClausesChecked()) {
    alert("Please acknowledge all clauses before downloading.");
    return;
  }
  if (currentSigMethod === "draw" && !sigHasData) {
    alert("Please provide your digital signature before downloading.");
    return;
  }
  const sName = document.getElementById("signer-name")?.value.trim() || "";
  const sRole = document.getElementById("signer-role")?.value.trim() || "";

  if (sName.length < 2 || sRole.length < 2) {
    alert("Please enter your Signer Name and Role to download the NDA.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Mutual Non-Disclosure Agreement (M-NDA)", 105, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let y = 35;

  const clauses = [
    "1. Definition of Confidential Information\n'Confidential Information' means any data or information, oral or written, disclosed by either Party that is designated as confidential or that should reasonably be treated as confidential. This includes business strategies, pricing, product formulations, etc.",
    "2. Obligations of the Receiving Party\nEach Party agrees to hold all Confidential Information in strict confidence, not disclose it to any third party without consent, and use it solely for business evaluation.",
    "3. Exclusions & Permitted Disclosures\nObligations shall not apply to information that is publicly available, rightfully known prior to disclosure, independently developed, or required by law.",
    "4. Term, Remedies & Governing Law\nThis M-NDA remains in effect for three (3) years from the date of signature. The non-breaching Party is entitled to seek equitable relief. Governed by Indian law.",
  ];

  clauses.forEach((text) => {
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, y);
    y += lines.length * 5 + 6;
  });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Agreement Acknowledged & Signed By:", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${sName}`, 20, y);
  y += 7;
  doc.text(`Role: ${sRole}`, 20, y);
  y += 7;
  const today = new Date().toLocaleDateString();
  doc.text(`Date: ${today}`, 20, y);

  y += 12;
  doc.text("Signature:", 20, y);
  y += 5;

  if (currentSigMethod === "draw" && sigHasData && canvas) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext("2d");
    if (tCtx) {
      tCtx.fillStyle = "#ffffff";
      tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tCtx.drawImage(canvas, 0, 0);
      const imgData = tempCanvas.toDataURL("image/jpeg", 1.0);
      doc.addImage(imgData, "JPEG", 20, y, 70, 25);
      doc.rect(20, y, 70, 25);
    }
  } else {
    doc.text("(Signed/Stamped Upload Provided)", 20, y + 10);
  }

  doc.save("Bharat_Modules_M-NDA.pdf");
}

function validatePhase4() {
  if (!allClausesChecked()) {
    const notice = document.getElementById("sigGateNotice");
    if (notice) {
      notice.style.boxShadow = "0 0 0 2px var(--error)";
      notice.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => { notice.style.boxShadow = ""; }, 2200);
    }
    return;
  }

  let nameValid = true;
  let roleValid = true;
  const nameInput = document.getElementById("signer-name");
  const roleInput = document.getElementById("signer-role");
  const sName = nameInput?.value.trim() || "";
  const sRole = roleInput?.value.trim() || "";

  if (sName.length < 2) {
    const fg = document.getElementById("fg-signer-name");
    if (fg) fg.classList.add("has-error");
    nameValid = false;
  }
  if (sRole.length < 2) {
    const fg = document.getElementById("fg-signer-role");
    if (fg) fg.classList.add("has-error");
    roleValid = false;
  }
  if (!nameValid || !roleValid) {
    const fgName = document.getElementById("fg-signer-name");
    if (fgName) fgName.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (currentSigMethod === "draw") {
    if (!sigHasData) {
      const sig = document.getElementById("sigContainer");
      if (sig) {
        sig.style.borderColor = "var(--error)";
        sig.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => { sig.style.borderColor = ""; }, 2200);
      }
      return;
    }
  } else if (currentSigMethod === "upload") {
    if (!uploadedFiles["sigdoc"]) {
      const fuSigdoc = document.getElementById("fg-sigdoc");
      if (fuSigdoc) {
        fuSigdoc.classList.add("has-error");
        fuSigdoc.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
  }

  goToPhase(5);
}

window.addEventListener("load", () => {
  resizeCanvas();
  updateSigGate();

  try {
    const stored = localStorage.getItem("bharat_modules_registration");
    if (stored) {
      const data = JSON.parse(stored);
      if (data.name) {
        const nameInput = document.getElementById("obName");
        const signerInput = document.getElementById("signer-name");
        if (nameInput) nameInput.value = data.name;
        if (signerInput) signerInput.value = data.name;
      }
      if (data.business) {
        const bizInput = document.getElementById("obBusiness");
        if (bizInput) bizInput.value = data.business;
      }
      if (data.email) {
        const emailInput = document.getElementById("obEmail");
        const dispEmail = document.getElementById("display-email");
        if (emailInput) emailInput.value = data.email;
        if (dispEmail) dispEmail.textContent = data.email;
      }
      if (data.phone) {
        const phoneInput = document.getElementById("obPhone");
        if (phoneInput) phoneInput.value = data.phone;
      }
    }

    const savedPhase = localStorage.getItem("bharat_modules_onboarding_phase");
    if (savedPhase && parseInt(savedPhase) !== 1) {
      goToPhase(parseInt(savedPhase));
    }
  } catch (e) {}
});

window.addEventListener("resize", () => {
  resize();
  resizeCanvas();
});

window.addEventListener("scroll", () => {
  const nav = document.getElementById("nav");
  if (nav && !nav.classList.contains("search-mode")) {
    nav.style.background = window.scrollY > 20 ? "rgba(8,8,8,0.97)" : "rgba(10,10,10,0.92)";
  }
});

function toggleMenu() {
  const links = document.getElementById("navLinks");
  const ham = document.getElementById("hamburger");
  if (links) links.classList.toggle("open");
  if (ham) ham.classList.toggle("active");
}

function openSearch() {
  const nav = document.getElementById("nav");
  const input = document.getElementById("navSearchInput");
  if (nav) nav.classList.add("search-mode");
  if (input) setTimeout(() => input.focus(), 320);
}

function closeSearch() {
  const nav = document.getElementById("nav");
  const input = document.getElementById("navSearchInput");
  if (nav) nav.classList.remove("search-mode");
  if (input) input.value = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
});


