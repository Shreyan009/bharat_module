(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // --- Intersection Observer (Scroll Animations) ---
        const scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        const counterElement = entry.target.querySelector('[data-target]');
                        if (counterElement && !counterElement.dataset.counted) {
                            counterElement.dataset.counted = 'true';
                            animateCounter(counterElement);
                        }
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll('[data-observe]').forEach((el) => {
            scrollObserver.observe(el);
        });

        // Fallback for counters if observer fails or is delayed
        setTimeout(() => {
            document.querySelectorAll('.metric-value[data-target]').forEach((val) => {
                if (!val.dataset.counted) {
                    val.dataset.counted = 'true';
                    val.closest('.metric-card')?.classList.add('visible');
                    animateCounter(val);
                }
            });
        }, 2000);

        // --- Keyboard Shortcuts ---
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (typeof window.closeSearch === 'function') window.closeSearch();
                if (typeof window.closePopup === 'function') window.closePopup();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (typeof window.openSearch === 'function') window.openSearch();
            }
        });
    });

    // --- Counter Animation ---
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // EaseOutExpo curve
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(ease * target);

            el.textContent = current.toLocaleString('en-IN') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('en-IN') + suffix;
            }
        }
        requestAnimationFrame(update);
    }
})();


// ── Auto-open popup from URL param ──
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("register") === "manufacturer") {
    setTimeout(() => {
      openPopup();
      chooseManufacturer();
    }, 400);
  }
})();

// ── Popup Logic ──
function openPopup() {
  const overlay = document.getElementById("popupOverlay");
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closePopup() {
  const overlay = document.getElementById("popupOverlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      goBackToChoose();
    }, 320);
  }
}

const pOverlay = document.getElementById("popupOverlay");
if (pOverlay) {
  pOverlay.addEventListener("click", function (e) {
    if (e.target === this) closePopup();
  });
}

function chooseBuyer() {
  closePopup();
  window.location.href = "login.html";
}

function chooseManufacturer() {
  closePopup();
  window.location.href = "register.html";
}

function goBackToChoose() {
  const c = document.getElementById("popupChoose");
  const f = document.getElementById("popupForm");
  const b = document.getElementById("popupBackBtn");
  if (c) c.style.display = "flex";
  if (f) f.classList.remove("active");
  if (b) b.style.display = "none";
}

// ── Input Formatting ──
(function () {
  const phoneInput = document.getElementById("inputPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
    });
    phoneInput.addEventListener("paste", function (e) {
      e.preventDefault();
      let pasted = (e.clipboardData || window.clipboardData).getData("text");
      pasted = pasted.replace(/^\+91/, "").replace(/[^0-9]/g, "").slice(0, 10);
      this.value = pasted;
    });
  }
  document.querySelectorAll("#popupForm input").forEach((inp) => {
    inp.addEventListener("input", function () {
      const field = this.closest(".form-field");
      if (field) {
        field.classList.remove("error");
        field.classList.remove("valid");
      }
    });
  });
})();

function submitForm() {
  let valid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameField = document.getElementById("fieldName");
  const nameVal = document.getElementById("inputName")?.value.trim();
  if (nameField) {
    nameField.classList.remove("error", "valid");
    if (!nameVal) {
      nameField.classList.add("error");
      valid = false;
    } else {
      nameField.classList.add("valid");
    }
  }

  const bizField = document.getElementById("fieldBusiness");
  const bizVal = document.getElementById("inputBusiness")?.value.trim();
  if (bizField) {
    bizField.classList.remove("error", "valid");
    if (!bizVal) {
      bizField.classList.add("error");
      valid = false;
    } else {
      bizField.classList.add("valid");
    }
  }

  const emailField = document.getElementById("fieldEmail");
  const emailVal = document.getElementById("inputEmail")?.value.trim();
  if (emailField) {
    emailField.classList.remove("error", "valid");
    if (!emailVal || !emailRegex.test(emailVal)) {
      emailField.classList.add("error");
      const err = document.getElementById("errorEmail");
      if (err) err.textContent = !emailVal ? "Email address is required" : "Enter a valid email address";
      valid = false;
    } else {
      emailField.classList.add("valid");
    }
  }

  const phoneField = document.getElementById("fieldPhone");
  let phoneVal = document.getElementById("inputPhone")?.value.trim();
  if (phoneField) {
    phoneField.classList.remove("error", "valid");
    phoneVal = phoneVal.replace(/^\+91/, "").replace(/[^0-9]/g, "");
    if (phoneVal.length !== 10) {
      phoneField.classList.add("error");
      const err = document.getElementById("errorPhone");
      if (err) err.textContent = phoneVal.length === 0 ? "Mobile number is required" : "Enter 10 digits";
      valid = false;
    } else {
      phoneField.classList.add("valid");
    }
  }

  if (!valid) return;

  const data = { name: nameVal, business: bizVal, email: emailVal, phone: "+91" + phoneVal };
  localStorage.setItem("bharat_modules_registration", JSON.stringify(data));
  closePopup();
  window.location.href = "register.html";
}


