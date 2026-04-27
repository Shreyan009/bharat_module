(function() {
    'use strict';

    const API_BASE = "http://localhost:4000/api";
    let selectedRole = "buyer";
    let currentEmail = "";
    let otpTimer = 30;
    let timerInterval;

    // Export functions for HTML access
    window.showView = showView;
    window.selectRole = selectRole;
    window.handleRegister = handleRegister;
    window.handleLogin = handleLogin;
    window.handleOTP = handleOTP;
    window.handleOTPBack = handleOTPBack;
    window.resendOTP = resendOTP;
    window.loginWithGoogle = loginWithGoogle;
    window.loginWithApple = loginWithApple;
    window.goBack = goBack;

    document.addEventListener('DOMContentLoaded', () => {
        const hash = window.location.hash.substring(1);
        if (hash && ["selectRole", "login", "register", "otp"].includes(hash)) {
            showView(hash);
        } else {
            showView("selectRole");
        }

        // Clear errors on input
        document.querySelectorAll('input').forEach((input) => {
            input.addEventListener('input', function() {
                const field = this.closest('.form-group-modern');
                if (field) field.classList.remove('error');
            });
        });
    });

    /**
     * Switch between different views (login, register, etc.)
     */
    function showView(view) {
        const views = ["viewSelectRole", "viewLogin", "viewRegister", "viewOTP"];
        views.forEach(v => {
            const el = document.getElementById(v);
            if (el) el.classList.remove("active");
        });

        const targetId = "view" + view.charAt(0).toUpperCase() + view.slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.classList.add("active");
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", `#${view}`);

        if (view === "register") {
            const roleEl = document.getElementById("selectedRoleText");
            if (roleEl) roleEl.textContent = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
        }

        if (view === "otp") {
            startOTPTimer();
            const emailEl = document.getElementById("otpEmailDisplay");
            if (emailEl) emailEl.textContent = currentEmail;
        }
    }

    function selectRole(role) {
        selectedRole = role;
        showView("register");
    }

    // --- AUTH LOGIC ---

    async function handleRegister(event) {
        if (event) event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.role = selectedRole;

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok) {
                currentEmail = data.email;
                showView("otp");
            } else {
                alert(result.message || "Registration failed");
            }
        } catch (err) {
            console.error("Register error:", err);
            alert("Connection error. Is the backend running?");
        }
    }

    async function handleLogin(event) {
        if (event) event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok) {
                try {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("user", JSON.stringify(result.user));
                } catch(e) {}
                
                if (result.user.role === "manufacturer") {
                    window.location.href = "dashboard-vendor.html";
                } else {
                    window.location.href = "dashboard-buyer.html";
                }
            } else {
                alert(result.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Connection error. Is the backend running?");
        }
    }

    // --- OTP LOGIC ---

    function handleOTP(input, index) {
        if (input.value.length === 1 && index < 5) {
            const inputs = document.querySelectorAll(".otp-input-modern");
            if (inputs[index + 1]) inputs[index + 1].focus();
        }
        
        const inputs = document.querySelectorAll(".otp-input-modern");
        const code = Array.from(inputs).map(i => i.value).join("");
        if (code.length === 6) {
            verifyOTP(code);
        }
    }

    function handleOTPBack(event, index) {
        if (event.key === "Backspace" && !event.target.value && index > 0) {
            const inputs = document.querySelectorAll(".otp-input-modern");
            if (inputs[index - 1]) inputs[index - 1].focus();
        }
    }

    async function verifyOTP(code) {
        try {
            const res = await fetch(`${API_BASE}/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: currentEmail, otp: code })
            });

            const result = await res.json();
            if (res.ok) {
                alert("Email verified! Please login.");
                showView("login");
            } else {
                alert(result.message || "Invalid OTP");
                document.querySelectorAll(".otp-input-modern").forEach(i => i.value = "");
                const firstInput = document.querySelectorAll(".otp-input-modern")[0];
                if (firstInput) firstInput.focus();
            }
        } catch (err) {
            console.error("OTP error:", err);
        }
    }

    function startOTPTimer() {
        otpTimer = 30;
        const timerEl = document.getElementById("timer");
        const resendBtn = document.getElementById("btnResend");
        
        if (timerEl) timerEl.textContent = otpTimer;
        if (resendBtn) resendBtn.disabled = true;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            otpTimer--;
            if (timerEl) timerEl.textContent = otpTimer;
            
            if (otpTimer <= 0) {
                clearInterval(timerInterval);
                if (resendBtn) resendBtn.disabled = false;
            }
        }, 1000);
    }

    async function resendOTP() {
        try {
            await fetch(`${API_BASE}/auth/send-email-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: currentEmail })
            });
            startOTPTimer();
        } catch (err) {
            console.error("Resend error:", err);
        }
    }

    // --- SOCIAL AUTH STUBS ---
    function loginWithGoogle() {
        alert("Google Login redirecting to: " + API_BASE + "/auth/google");
    }

    function loginWithApple() {
        alert("Apple Login coming soon!");
    }

    function goBack() {
        window.history.back();
    }
})();

