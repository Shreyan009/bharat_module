(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initRadarAnimation();
        initIntersectionObserver();
        initFormLogic();
    });

    /* ─── RADAR / SONAR CANVAS ANIMATION ─── */
    function initRadarAnimation() {
        const canvas = document.getElementById('radarCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let W, H, cx, cy, radius;
        let angle = 0;
        const SPEED = 0.004;
        const TRAIL_ALPHA = 0.042;

        let blips = [];
        let radarPoints = [];
        let gridDots = [];

        // Theme-aware colors
        let colors = {
            bg: 'rgba(6,6,8,0.042)',
            accent: 'rgba(232,107,0,0.5)',
            grid: 'rgba(255,255,255,0.028)',
            rings: 'rgba(255,255,255,0.05)'
        };

        function updateThemeColors(themeName) {
            const isDark = themeName ? (themeName === 'dark') : (document.documentElement.getAttribute('data-theme') === 'dark');
            if (isDark) {
                colors.bg = `rgba(10,10,12,${TRAIL_ALPHA})`;
                colors.grid = 'rgba(255,255,255,0.035)';
                colors.rings = 'rgba(255,255,255,0.06)';
            } else {
                colors.bg = `rgba(255,255,255,${TRAIL_ALPHA})`;
                colors.grid = 'rgba(0,0,0,0.04)';
                colors.rings = 'rgba(0,0,0,0.07)';
            }
        }

        function resize() {
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = W * window.devicePixelRatio;
            canvas.height = H * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            cx = W / 2;
            cy = H / 2;
            radius = Math.min(W, H) * 0.42;
            buildGrid();
            buildRadarPoints();
            updateThemeColors();
        }

        function buildGrid() {
            gridDots = [];
            const cols = Math.floor(W / 52);
            const rows = Math.floor(H / 52);
            for (let r = 0; r <= rows; r++) {
                for (let c = 0; c <= cols; c++) {
                    gridDots.push({ x: c * (W / cols), y: r * (H / rows) });
                }
            }
        }

        function buildRadarPoints() {
            radarPoints = [];
            const textSafeRadius = radius * 0.28;
            const maxR = radius * 0.92;
            const minR = radius * 0.3;
            let attempts = 0;
            while (radarPoints.length < 55 && attempts < 400) {
                attempts++;
                const a = Math.random() * Math.PI * 2;
                const r = minR + Math.random() * (maxR - minR);
                const px = cx + Math.cos(a) * r;
                const py = cy + Math.sin(a) * r;
                const distC = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
                if (distC < textSafeRadius) continue;
                radarPoints.push({ x: px, y: py, angle: a });
            }
        }

        function drawGrid() {
            ctx.strokeStyle = colors.grid;
            ctx.lineWidth = 0.5;
            const stepX = W / Math.floor(W / 52);
            const stepY = H / Math.floor(H / 52);
            for (let x = 0; x <= W; x += stepX) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y <= H; y += stepY) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            ctx.fillStyle = colors.rings;
            gridDots.forEach(d => {
                ctx.beginPath(); ctx.arc(d.x, d.y, 1, 0, Math.PI * 2); ctx.fill();
            });
        }

        function drawRings() {
            const rings = 5;
            for (let i = 1; i <= rings; i++) {
                const r = (radius / rings) * i;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = colors.rings;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
            ctx.strokeStyle = colors.rings;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius); ctx.stroke();
        }

        function drawSweep() {
            const len = radius * 1.1;
            const fanSpan = Math.PI * 0.3;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);

            const arcGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, len);
            arcGrad.addColorStop(0, 'rgba(232,92,13,0.08)');
            arcGrad.addColorStop(0.6, 'rgba(232,92,13,0.03)');
            arcGrad.addColorStop(1, 'rgba(232,92,13,0)');
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, len, -fanSpan, 0);
            ctx.closePath();
            ctx.fillStyle = arcGrad;
            ctx.fill();
            ctx.restore();
        }

        function checkBlips() {
            radarPoints.forEach(pt => {
                const diff = ((angle - pt.angle) + Math.PI * 2) % (Math.PI * 2);
                if (diff < SPEED * 2.5 && Math.random() < 0.45) {
                    blips.push({ x: pt.x, y: pt.y, age: 0, maxAge: 14 + Math.random() * 10 });
                }
            });
        }

        function drawBlips() {
            blips = blips.filter(b => b.age < b.maxAge);
            blips.forEach(b => {
                b.age++;
                const progress = b.age / b.maxAge;
                const alpha = (1 - progress) * 0.55;
                const r = 1.5 + progress * 3;
                ctx.beginPath();
                ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(232,92,13,${alpha * 0.4})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(b.x, b.y, 1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232,92,13,${alpha * 0.6})`;
                ctx.fill();
            });
        }

        function tick() {
            ctx.fillStyle = colors.bg;
            ctx.fillRect(0, 0, W, H);

            drawGrid();
            drawRings();
            drawSweep();
            checkBlips();
            drawBlips();

            angle += SPEED;
            if (angle > Math.PI * 2) angle -= Math.PI * 2;

            requestAnimationFrame(tick);
        }

        window.addEventListener('resize', resize);
        
        // Use custom event for theme changes (better performance than polling)
        window.addEventListener('themeChanged', (e) => {
            updateThemeColors(e.detail.theme);
        });

        resize();
        tick();
    }

    /* ─── INTERSECTION OBSERVER — FADE UPS ─── */
    function initIntersectionObserver() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }

    /* ─── FORM VALIDATION & SUBMISSION ─── */
    function initFormLogic() {
        const queryForm = document.getElementById('queryForm');
        if (!queryForm) return;

        const transmitBtn = document.querySelector('.btn-transmit');
        if (transmitBtn) {
            transmitBtn.addEventListener('click', transmitQuery);
        }

        ['inp-name', 'inp-org', 'inp-email', 'inp-type', 'inp-msg'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    const field = this.closest('.form-field');
                    if (field) field.classList.remove('error');
                });
                el.addEventListener('change', function() {
                    const field = this.closest('.form-field');
                    if (field) field.classList.remove('error');
                });
            }
        });
    }

    const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com', 'icloud.com'];

    function validateEmail(val) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) return 'A valid work email address is required.';
        if (!re.test(val)) return 'Enter a valid email address.';
        const domain = val.split('@')[1].toLowerCase();
        if (BLOCKED_DOMAINS.includes(domain)) {
            return 'Please use an official work email address.';
        }
        return null;
    }

    function setFieldState(fieldId, errId, errorMsg) {
        const field = document.getElementById(fieldId);
        const errEl = document.getElementById(errId);
        if (errorMsg) {
            if (field) field.classList.add('error');
            if (errEl) errEl.textContent = errorMsg;
            return false;
        } else {
            if (field) field.classList.remove('error');
            return true;
        }
    }

    function transmitQuery() {
        let isValid = true;
        const nameEl = document.getElementById('inp-name');
        const orgEl = document.getElementById('inp-org');
        const emailEl = document.getElementById('inp-email');
        const typeEl = document.getElementById('inp-type');
        const msgEl = document.getElementById('inp-msg');

        if (!nameEl || !orgEl || !emailEl || !typeEl || !msgEl) return;

        const name = nameEl.value.trim();
        const org = orgEl.value.trim();
        const email = emailEl.value.trim();
        const type = typeEl.value;
        const msg = msgEl.value.trim();

        isValid &= setFieldState('ff-name', 'err-name', name ? null : 'Full name is required.');
        isValid &= setFieldState('ff-org', 'err-org', org ? null : 'Organisation name is required.');
        isValid &= setFieldState('ff-email', 'err-email', validateEmail(email));
        isValid &= setFieldState('ff-type', 'err-type', type ? null : 'Please select an inquiry type.');
        isValid &= setFieldState('ff-msg', 'err-msg', msg ? null : 'Message cannot be empty.');

        if (!isValid) return;

        console.log('[BM] Query transmitted:', { name, org, email, type, msg });
        
        const btn = document.querySelector('.btn-transmit');
        const originalContent = btn.innerHTML;
        btn.innerHTML = 'Transmitting...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Query transmitted successfully. Our team will respond within 24 hours.');
            btn.innerHTML = originalContent;
            btn.disabled = false;
            document.getElementById('queryForm').reset();
        }, 1500);
    }
})();



