(function() {
    'use strict';

    // Export functions to window for global access (HTML onclick handlers)
    window.toggleMenu = toggleMenu;
    window.openSearch = openSearch;
    window.closeSearch = closeSearch;
    window.scrollToTop = scrollToTop;

    document.addEventListener('DOMContentLoaded', () => {
        // Theme Management
        initTheme();

        // Nav Scroll Effect
        const nav = document.getElementById('nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 40) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }, { passive: true });
        }

        // Initialize Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', toggleMenu);
        }

        // Highlight Active Link
        highlightActiveLink();
    });

    /**
     * Auto-highlight the active link in the navigation based on current URL
     */
    function highlightActiveLink() {
        try {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const links = document.querySelectorAll('.nav-links a');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } catch (err) {
            console.warn('Navigation highlighting failed:', err);
        }
    }

    /**
     * Initialize and handle theme switching with inverse logic
     */
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        let savedTheme = 'light';
        
        try {
            savedTheme = localStorage.getItem('theme') || 'light';
        } catch (e) {
            console.warn('LocalStorage access restricted. Defaulting to light mode.');
        }
        
        // Apply saved theme on load
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        if (themeToggle) {
            // Remove any existing listener to avoid duplicates if initTheme is called twice
            themeToggle.replaceWith(themeToggle.cloneNode(true));
            const newToggle = document.getElementById('themeToggle');
            
            newToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const isDark = currentTheme === 'dark';
                const newTheme = isDark ? 'light' : 'dark';
                
                if (newTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                }
                
                try {
                    localStorage.setItem('theme', newTheme);
                } catch (e) {}

                // Dispatch custom event for other components (like Radar) to react
                window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
            });
        }
    }

    /**
     * Toggle mobile menu visibility
     */
    function toggleMenu() {
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks && hamburger) {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        }
    }

    /**
     * Open search overlay
     */
    function openSearch() {
        const searchBar = document.getElementById('navSearchBar');
        const searchInput = document.getElementById('navSearchInput');
        if (searchBar) {
            searchBar.classList.add('active');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }
    }

    /**
     * Close search overlay
     */
    function closeSearch() {
        const searchBar = document.getElementById('navSearchBar');
        if (searchBar) {
            searchBar.classList.remove('active');
        }
    }

    /**
     * Smooth scroll to top
     */
    function scrollToTop(e) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
})();

