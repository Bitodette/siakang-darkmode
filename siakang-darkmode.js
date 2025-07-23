// ==UserScript==
// @name         Siakang Dark Mode
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Dark Mode untuk Siakang Untirta.
// @author       Bitodette
// @match        https://siakang.untirta.ac.id/*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/Bitodette/siakang-darkmode/main/siakang-darkmode.js
// @downloadURL  https://raw.githubusercontent.com/Bitodette/siakang-darkmode/main/siakang-darkmode.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const primaryBg = '#1e1e1e'; // Main background
    const secondaryBg = '#2d2d2d'; // Cards, sidebars, etc.
    const tertiaryBg = '#3c3c3c'; // Hover effects, input fields
    const primaryText = '#e0e0e0'; // Main text color
    const secondaryText = '#a0a0a0'; // Muted text
    const primaryBorder = '#555555'; // Borders for cards and tables
    const primaryAccent = '#02a8b5'; // Accent color for active links, buttons

    const customCss = `
        body, html, #wrapper, .content-page, .content {
            background-color: ${primaryBg} !important;
            color: ${primaryText} !important;
        }

        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, p, .page-title, .text-dark, .text-black, .dropdown-header, .fw-bold {
            color: ${primaryText} !important;
        }

        .text-muted, .sub-header {
            color: ${secondaryText} !important;
        }

        a, a:hover {
            color: #fff !important;
        }

        .pro-user-name, .pro-user-name i, .nav-link, .dropdown-item {
            color: ${primaryText} !important;
        }

        .breadcrumb-item.active, .breadcrumb-item+.breadcrumb-item::before {
            color: ${secondaryText} !important;
        }

        .card, .card-body, .card-header, .modal-content, .dropdown-menu {
            background-color: ${secondaryBg} !important;
            color: ${primaryText} !important;
            border-color: ${primaryBorder} !important;
            border-radius: 12px !important;
        }

        .row:has(.page-title-box) {
            margin-bottom: 0.5rem !important;
        }

        /* Disable hover-lift effect on some dashboard cards */
        .info-card-custom, .password-card {
            box-shadow: none !important;
            transition: none !important;
        }

        .info-card-custom:hover, .password-card:hover {
            transform: none !important;
        }

        /* Fix the hover effect on announcement items (blank white) */
        .announcement-item-custom:hover {
            background-color: ${tertiaryBg} !important;
        }

        /* Chart (ApexCharts) Fixes */
        .apexcharts-tooltip.apexcharts-theme-light {
            background: ${tertiaryBg} !important;
            border: 1px solid ${primaryBorder} !important;
        }
        .apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title {
            background: ${secondaryBg} !important;
            border-bottom: 1px solid ${primaryBorder} !important;
            color: ${primaryText} !important;
        }
        .apexcharts-tooltip-text-value, .apexcharts-tooltip-text-z-value {
            color: ${primaryText} !important;
        }
        .apexcharts-tooltip-text-y-label {
            color: ${secondaryText} !important;
        }
        .apexcharts-xaxis-label, .apexcharts-yaxis-label {
            fill: ${secondaryText} !important;
        }
        .apexcharts-gridline {
            display: none !important; /* Hides distracting grid lines */
        }
        .apexcharts-datalabels-group text {
            fill: #fff !important;
            stroke: ${secondaryBg};
            stroke-width: 5px;
            stroke-opacity: 1;
            paint-order: stroke;
        }

        .form-control, .form-control:focus {
             background-color: ${tertiaryBg} !important;
             color: ${primaryText} !important;
             border-color: ${primaryBorder} !important;
             box-shadow: none !important;
        }

        .form-control::placeholder {
             color: ${secondaryText} !important;
        }

        .page-title-box {
            background-color: ${primaryBg} !important;
            color: ${primaryText} !important;
        }

        .bg-light {
            background-color: ${tertiaryBg} !important;
        }

        .footer {
            background-color: ${primaryBg} !important;
            border-top: 1px solid ${primaryBorder} !important;
            color: ${secondaryText} !important;
        }

        .dropdown-item:hover, .dropdown-item:focus {
            background-color: ${tertiaryBg} !important;
        }

        .dropdown-divider, hr {
            border-top-color: ${primaryBorder} !important;
        }

        .navbar-custom, .left-side-menu {
            background-color: ${secondaryBg} !important;
            border-bottom: 1px solid ${primaryBorder} !important;
        }

        /* Sidebar & Logo */
        .logo-box {
             border-bottom: 1px solid ${primaryBorder} !important;
             display: flex !important;
             justify-content: center !important;
             align-items: center !important;
             height: 70px !important;
        }

        body[data-leftbar-color="dark"]:not([data-layout-mode="detached"]) .logo-box {
            background-color: #2d2d2d !important;
        }

        #sidebar-menu .nav-link {
            color: ${primaryText} !important;
        }

        #sidebar-menu .nav-link.active, #sidebar-menu .nav-link:hover {
            background-color: ${primaryAccent} !important;
            color: #fff !important;
        }

        .logo-box p, .button-menu-mobile i {
            color: #fff !important;
        }

        .logo-box .logo-lg p {
            margin: 0 !important;
        }

        .button-menu-mobile {
            width: 45px !important;
        }

        .user-box a, .user-box .dropdown-toggle {
            color: ${primaryText} !important;
        }

        .menu-title {
            color: ${primaryAccent} !important;
            opacity: 0.8 !important;
        }

        /* Hide unnecessary menu */
        #sidebar-menu .menu-title.side-menu-list:last-of-type,
        li.topbar-dropdown:has(img[src*="/images/flags/"]) {
            display: none !important;
        }

        table, table th, table td {
            color: ${primaryText} !important;
            border-color: ${primaryBorder} !important;
        }

        thead, thead th {
            background-color: ${tertiaryBg} !important;
            color: ${primaryText} !important;
        }

        tbody, tbody tr {
            background-color: ${secondaryBg} !important;
        }

        tbody tr:nth-of-type(even) { background-color: ${secondaryBg} !important; }
        tbody tr:nth-of-type(odd) { background-color: ${primaryBg} !important; }

        .dataTables_wrapper .dataTables_info,
        .dataTables_wrapper .dataTables_paginate .paginate_button {
            color: ${secondaryText} !important;
        }

        .dataTables_wrapper .dataTables_filter input {
            background-color: ${tertiaryBg} !important;
            color: ${primaryText} !important;
            border-color: ${primaryBorder} !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button {
            background-color: ${secondaryBg} !important;
            border-color: ${primaryBorder} !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button.current,
        .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
            background-color: ${primaryAccent} !important;
            color: #fff !important;
            border-color: ${primaryAccent} !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.current) {
            background-color: ${tertiaryBg} !important;
        }

        /* Responsive Fixes */
        @media (min-width: 992px) {
            .left-side-menu {
                position: fixed !important;
                height: 100vh !important;
                top: 70px !important;
                overflow-y: auto !important;
            }

            .content-page {
                margin-left: 250px !important;
                transition: margin-left .2s !important;
            }

            body[data-leftbar-size='condensed'] .content-page {
                margin-left: 70px !important;
            }

            .navbar-custom .nav-link.nav-user .rounded-circle.img-fill {
                display: none !important;
            }
        }

        @media (min-width: 1400px) {
            .container-fluid {
                max-width: 1600px !important;
            }
        }

        @media (max-width: 991.98px) {
            .content-page {
                margin-left: 0 !important;
            }

            .left-side-menu {
                position: fixed !important;
                top: 70px !important;
                height: calc(100vh - 70px) !important;
                z-index: 1050 !important;
            }
        }
    `;

    // Apply CSS changes
    GM_addStyle(customCss);

    // saving sidebar in local storage
    const SIDEBAR_STATUS_KEY = 'siakang_sidebar_size';

    // apply the saved sidebar when page loads
    const applySavedSidebarStatus = (bodyElement) => {
        const savedStatus = localStorage.getItem(SIDEBAR_STATUS_KEY);
        if (savedStatus) {
            bodyElement.setAttribute('data-leftbar-size', savedStatus);
        }
    };

    const manageBodyAttributes = () => {
        const body = document.body;
        if (body) {
            // Force dark theme
            if (body.getAttribute('data-theme') !== 'dark') body.setAttribute('data-theme', 'dark');
            if (body.getAttribute('data-topbar-color') !== 'dark') body.setAttribute('data-topbar-color', 'dark');
            if (body.getAttribute('data-leftbar-color') !== 'dark') body.setAttribute('data-leftbar-color', 'dark');

            // condense the sidebar on mobile
            const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
            const currentSize = body.getAttribute('data-leftbar-size');

            if (isMobile && currentSize === 'default') {
                body.setAttribute('data-leftbar-size', 'condensed');
                localStorage.setItem(SIDEBAR_STATUS_KEY, 'condensed');
            }
            // Save user's choice
            else if (!isMobile && currentSize) {
                localStorage.setItem(SIDEBAR_STATUS_KEY, currentSize);
            }
        }
    };

    // force re-apply theme
    const observer = new MutationObserver(manageBodyAttributes);

    new MutationObserver((_, obs) => {
        const body = document.body;
        if (body) {
            applySavedSidebarStatus(body);
            manageBodyAttributes();
            observer.observe(body, {
                attributes: true,
                attributeFilter: ['data-theme', 'data-topbar-color', 'data-leftbar-color', 'data-leftbar-size']
            });
            obs.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    function autoLogin() {
        const email = 'EMAIL_DIHAPUS';
        const password = 'PASSWORD_DIHAPUS';

        if (window.location.href.includes('https://siakang.untirta.ac.id/auth/login')) {
            const emailField = document.querySelector('input[name="email"]');
            const passwordField = document.querySelector('input[name="password"]');
            const loginButton = document.querySelector('button[type="submit"].btn-submit');

            if (emailField && passwordField && loginButton) {
                emailField.value = email;
                passwordField.value = password;
                emailField.dispatchEvent(new Event('input', { bubbles: true }));
                emailField.dispatchEvent(new Event('change', { bubbles: true }));
                passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                passwordField.dispatchEvent(new Event('change', { bubbles: true }));
                loginButton.click();
            }
        }
    }

    // Redirect to dashboard.
    function redirectAfterLogin() {
        if (window.location.pathname === '/home') {
            window.location.href = 'https://siakang.untirta.ac.id/dashboard/dashboard-akademik';
        }
    }

    // (mobile) force schedule page to show (List View)
    function forceListViewOnMobile() {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (!isMobile) return;

        const interval = setInterval(() => {
            const calendarButton = document.querySelector('button[x-on\\:click*="calendar"]');
            const listViewButton = document.querySelector('button[x-on\\:click*="card"]');

            if (calendarButton && listViewButton) {
                clearInterval(interval);
                if (calendarButton.classList.contains('active')) {
                    listViewButton.click();
                }
            }
        }, 200);

        // prevent infinite loops
        setTimeout(() => clearInterval(interval), 5000);
    }

    // footer
    function modifyFooter() {
        const interval = setInterval(() => {
            const footer = document.querySelector('.footer .col-md-12');
            if (footer && footer.textContent.includes('UPA TIK')) {
                clearInterval(interval);
                footer.innerHTML = `2025 &copy; Siakang by <a href="https://untirta.ac.id" target="_blank">UPA TIK</a> & <a href="https://github.com/Bitodette" target="_blank">Bitodette</a>`;
            }
        }, 500);

        setTimeout(() => clearInterval(interval), 7000);
    }

    // Run redirect and footer
    window.addEventListener('DOMContentLoaded', () => {
        autoLogin();
        redirectAfterLogin();
        modifyFooter();
    });

    // Run force schedule page on mobile
    if (window.location.href.includes('/jadwal_perkuliahan')) {
        forceListViewOnMobile();
    }

})();