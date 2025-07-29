// ==UserScript==
// @name         Siakang Dark Mode
// @namespace    http://tampermonkey.net/
// @version      3.0
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

    const darkPalette = {
        primaryBg: '#1e1e1e', secondaryBg: '#2d2d2d', tertiaryBg: '#3c3c3c',
        primaryText: '#e0e0e0', secondaryText: '#a0a0a0', primaryBorder: '#555555',
        primaryAccent: '#02a8b5'
    };
    const lightPalette = {
        primaryBg: '#f4f7f9', secondaryBg: '#ffffff', tertiaryBg: '#e9ecef',
        primaryText: '#212529', secondaryText: '#6c757d', primaryBorder: '#dee2e6',
        primaryAccent: '#02a8b5', linkText: '#444'
    };

    const permanentCss = `
        #sidebar-menu .menu-title.side-menu-list:last-of-type,
        li.topbar-dropdown:has(img[src*="/images/flags/"]) { display: none !important; }
        @media (min-width: 992px) {
            .navbar-custom .nav-link.nav-user .rounded-circle.img-fill { display: none !important; }
        }
    `;

    const darkModeCss = `
        body, html, #wrapper, .content-page, .content { background-color: ${darkPalette.primaryBg} !important; color: ${darkPalette.primaryText} !important; }
        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, p, .page-title, .text-dark, .text-black, .dropdown-header, .fw-bold { color: ${darkPalette.primaryText} !important; }
        .text-muted, .sub-header { color: ${darkPalette.secondaryText} !important; }
        a, a:hover { color: #fff !important; }
        .pro-user-name, .pro-user-name i, .nav-link, .dropdown-item { color: ${darkPalette.primaryText} !important; }
        .breadcrumb-item.active, .breadcrumb-item+.breadcrumb-item::before { color: ${darkPalette.secondaryText} !important; }
        .card, .card-body, .card-header, .modal-content, .dropdown-menu { background-color: ${darkPalette.secondaryBg} !important; color: ${darkPalette.primaryText} !important; border-color: ${darkPalette.primaryBorder} !important; border-radius: 12px !important; }
        .row:has(.page-title-box) { margin-bottom: 0.5rem !important; }
        .info-card-custom, .password-card { box-shadow: none !important; transition: none !important; }
        .info-card-custom:hover, .password-card:hover { transform: none !important; }
        .announcement-item-custom:hover { background-color: ${darkPalette.tertiaryBg} !important; }
        .apexcharts-tooltip.apexcharts-theme-light { background: ${darkPalette.tertiaryBg} !important; border: 1px solid ${darkPalette.primaryBorder} !important; }
        .apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title { background: ${darkPalette.secondaryBg} !important; border-bottom: 1px solid ${darkPalette.primaryBorder} !important; color: ${darkPalette.primaryText} !important; }
        .apexcharts-tooltip-text-value, .apexcharts-tooltip-text-z-value { color: ${darkPalette.primaryText} !important; }
        .apexcharts-tooltip-text-y-label { color: ${darkPalette.secondaryText} !important; }
        .apexcharts-xaxis-label, .apexcharts-yaxis-label { fill: ${darkPalette.secondaryText} !important; }
        .apexcharts-gridline { display: none !important; }
        .apexcharts-datalabels-group text { fill: #fff !important; stroke: ${darkPalette.secondaryBg}; stroke-width: 5px; stroke-opacity: 1; paint-order: stroke; }
        .form-control, .form-control:focus { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; border-color: ${darkPalette.primaryBorder} !important; box-shadow: none !important; }
        .form-control::placeholder { color: ${darkPalette.secondaryText} !important; }
        .page-title-box { background-color: ${darkPalette.primaryBg} !important; color: ${darkPalette.primaryText} !important; }
        .bg-light { background-color: ${darkPalette.tertiaryBg} !important; }
        .footer { background-color: ${darkPalette.primaryBg} !important; border-top: 1px solid ${darkPalette.primaryBorder} !important; color: ${darkPalette.secondaryText} !important; }
        .dropdown-item:hover, .dropdown-item:focus { background-color: ${darkPalette.tertiaryBg} !important; }
        .dropdown-divider, hr { border-top-color: ${darkPalette.primaryBorder} !important; }
        .navbar-custom, .left-side-menu { background-color: ${darkPalette.secondaryBg} !important; border-bottom: 1px solid ${darkPalette.primaryBorder} !important; }
        .logo-box { border-bottom: 1px solid ${darkPalette.primaryBorder} !important; display: flex !important; justify-content: center !important; align-items: center !important; height: 70px !important; }
        body[data-leftbar-color="dark"]:not([data-layout-mode="detached"]) .logo-box { background-color: #2d2d2d !important; }
        #sidebar-menu .nav-link { color: ${darkPalette.primaryText} !important; }
        #sidebar-menu .nav-link.active, #sidebar-menu .nav-link:hover { background-color: ${darkPalette.primaryAccent} !important; color: #fff !important; }
        .logo-box p, .button-menu-mobile i { color: #fff !important; }
        .logo-box .logo-lg p { margin: 0 !important; }
        .button-menu-mobile { width: 45px !important; }
        .user-box a, .user-box .dropdown-toggle { color: ${darkPalette.primaryText} !important; }
        .menu-title { color: ${darkPalette.primaryAccent} !important; opacity: 0.8 !important; }
        table, table th, table td { color: ${darkPalette.primaryText} !important; border-color: ${darkPalette.primaryBorder} !important; }
        thead, thead th { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; }
        tbody, tbody tr { background-color: ${darkPalette.secondaryBg} !important; }
        tbody tr:nth-of-type(even) { background-color: ${darkPalette.secondaryBg} !important; }
        tbody tr:nth-of-type(odd) { background-color: ${darkPalette.primaryBg} !important; }
        .dataTables_wrapper .dataTables_info, .dataTables_wrapper .dataTables_paginate .paginate_button { color: ${darkPalette.secondaryText} !important; }
        .dataTables_wrapper .dataTables_filter input { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; border-color: ${darkPalette.primaryBorder} !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button { background-color: ${darkPalette.secondaryBg} !important; border-color: ${darkPalette.primaryBorder} !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover { background-color: ${darkPalette.primaryAccent} !important; color: #fff !important; border-color: ${darkPalette.primaryAccent} !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.current) { background-color: ${darkPalette.tertiaryBg} !important; }
        @media (min-width: 992px) { .left-side-menu { position: fixed !important; height: 100vh !important; top: 70px !important; overflow-y: auto !important; } .content-page { margin-left: 250px !important; transition: margin-left .2s !important; } body[data-leftbar-size='condensed'] .content-page { margin-left: 70px !important; } }
        @media (min-width: 1400px) { .container-fluid { max-width: 1600px !important; } }
        @media (max-width: 991.98px) { .content-page { margin-left: 0 !important; } .left-side-menu { position: fixed !important; top: 70px !important; height: calc(100vh - 70px) !important; z-index: 1050 !important; } }
    `;

    const lightModeCss = `
        body, html, #wrapper, .content-page, .content { background-color: ${lightPalette.primaryBg} !important; color: ${lightPalette.primaryText} !important; }
        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, p, .page-title, .text-dark, .text-black, .dropdown-header, .fw-bold { color: ${lightPalette.primaryText} !important; }
        .text-muted, .sub-header { color: ${lightPalette.secondaryText} !important; }
        a:not(.nav-link):not(.dropdown-item):not([target="_blank"]) { color: ${lightPalette.linkText} !important; }
        .pro-user-name, .pro-user-name i, .nav-link, .dropdown-item, .user-box a, .user-box .dropdown-toggle { color: ${lightPalette.primaryText} !important; }
        .breadcrumb-item.active, .breadcrumb-item+.breadcrumb-item::before { color: ${lightPalette.secondaryText} !important; }
        .card, .card-body, .card-header, .modal-content, .dropdown-menu { background-color: ${lightPalette.secondaryBg} !important; color: ${lightPalette.primaryText} !important; border-color: ${lightPalette.primaryBorder} !important; border-radius: 12px !important; }
        .row:has(.page-title-box) { margin-bottom: 0.5rem !important; }
        .info-card-custom, .password-card { box-shadow: none !importan; transition: none !important; }
        .info-card-custom:hover, .password-card:hover { transform: none !important; }
        .announcement-item-custom:hover { background-color: ${lightPalette.tertiaryBg} !important; }
        .form-control, .form-control:focus { background-color: ${lightPalette.tertiaryBg} !important; color: ${lightPalette.primaryText} !important; border-color: ${lightPalette.primaryBorder} !important; box-shadow: none !important; }
        .form-control::placeholder { color: ${lightPalette.secondaryText} !important; }
        .page-title-box { background-color: ${lightPalette.primaryBg} !important; color: ${lightPalette.primaryText} !important; }
        .bg-light { background-color: ${lightPalette.tertiaryBg} !important; }
        .footer { background-color: ${lightPalette.primaryBg} !important; border-top: 1px solid ${lightPalette.primaryBorder} !important; color: ${lightPalette.secondaryText} !important; }
        .dropdown-item:hover, .dropdown-item:focus { background-color: ${lightPalette.tertiaryBg} !important; }
        .dropdown-divider, hr { border-top-color: ${lightPalette.primaryBorder} !important; }
        .navbar-custom, .left-side-menu { background-color: ${lightPalette.secondaryBg} !important; border-bottom: 1px solid ${lightPalette.primaryBorder} !important; }
        .logo-box { border-bottom: 1px solid ${lightPalette.primaryBorder} !important; display: flex !important; justify-content: center !important; align-items: center !important; height: 70px !important; }
        /* === SATU-SATUNYA BARIS YANG DIPERBAIKI === */
        body:not([data-leftbar-size='condensed']) .logo-box .logo-lg { display: flex !important; justify-content: center !important; align-items: center !important; width: 100% !important; }
        #sidebar-menu .nav-link { color: ${lightPalette.primaryText} !important; }
        #sidebar-menu .nav-link.active, #sidebar-menu .nav-link:hover { background-color: ${lightPalette.primaryAccent} !important; color: #fff !important; }
        .logo-box p { color: ${lightPalette.primaryText} !important; }
        .button-menu-mobile i { color: ${lightPalette.secondaryText} !important; }
        .logo-box .logo-lg p { margin: 0 !important; }
        .button-menu-mobile { width: 45px !important; }
        .menu-title { color: ${lightPalette.primaryAccent} !important; opacity: 0.8 !important; }
        table, table th, table td { color: ${lightPalette.primaryText} !important; border-color: ${lightPalette.primaryBorder} !important; }
        thead, thead th { background-color: ${lightPalette.tertiaryBg} !important; color: ${lightPalette.primaryText} !important; }
        tbody, tbody tr { background-color: ${lightPalette.secondaryBg} !important; }
        tbody tr:nth-of-type(even) { background-color: ${lightPalette.secondaryBg} !important; }
        tbody tr:nth-of-type(odd) { background-color: ${lightPalette.primaryBg} !important; }
        .dataTables_wrapper .dataTables_info, .dataTables_wrapper .dataTables_paginate .paginate_button { color: ${lightPalette.secondaryText} !important; }
        .dataTables_wrapper .dataTables_filter input { background-color: ${lightPalette.tertiaryBg} !important; color: ${lightPalette.primaryText} !important; border-color: ${lightPalette.primaryBorder} !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button { background-color: ${lightPalette.secondaryBg} !important; border-color: ${lightPalette.primaryBorder} !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover { background-color: ${lightPalette.primaryAccent} !important; color: #fff !important; border-color: ${lightPalette.primaryAccent} !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.current) { background-color: ${lightPalette.tertiaryBg} !important; }
        @media (min-width: 992px) { .left-side-menu { position: fixed !important; height: 100vh !important; top: 70px !important; overflow-y: auto !important; } .content-page { margin-left: 250px !important; transition: margin-left .2s !important; } body[data-leftbar-size='condensed'] .content-page { margin-left: 70px !important; } }
        @media (min-width: 1400px) { .container-fluid { max-width: 1600px !important; } }
        @media (max-width: 991.98px) { .content-page { margin-left: 0 !important; } .left-side-menu { position: fixed !important; top: 70px !important; height: calc(100vh - 70px) !important; z-index: 1050 !important; } }
    `;


    let darkModeStyleElement = null;
    let lightModeStyleElement = null;

    function applyTheme(isDark) {
        const body = document.body;
        if (!body) return;

        if (isDark) {
            if (lightModeStyleElement) {
                lightModeStyleElement.remove();
                lightModeStyleElement = null;
            }
            if (!darkModeStyleElement) {
                darkModeStyleElement = GM_addStyle(darkModeCss);
            }
            body.setAttribute('data-theme', 'dark');
            body.setAttribute('data-topbar-color', 'dark');
            body.setAttribute('data-leftbar-color', 'dark');
        } else {
            if (darkModeStyleElement) {
                darkModeStyleElement.remove();
                darkModeStyleElement = null;
            }
            if (!lightModeStyleElement) {
                lightModeStyleElement = GM_addStyle(lightModeCss);
            }
            body.setAttribute('data-theme', 'light');
            body.setAttribute('data-topbar-color', 'light');
            body.setAttribute('data-leftbar-color', 'light');
        }
    }

    const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMatcher.addEventListener('change', event => {
        applyTheme(event.matches);
    });

    function initializeScript() {
        GM_addStyle(permanentCss);
        applyTheme(darkModeMatcher.matches);
        manageSidebar();
        redirectAfterLogin();
        modifyFooter();
        if (window.location.href.includes('/jadwal_perkuliahan')) {
            forceListViewOnMobile();
        }
    }

    function manageSidebar() {
        const SIDEBAR_STATUS_KEY = 'siakang_sidebar_size';
        const body = document.body;
        const savedStatus = localStorage.getItem(SIDEBAR_STATUS_KEY);
        if (savedStatus) { body.setAttribute('data-leftbar-size', savedStatus); }
        const sidebarObserver = new MutationObserver(() => {
            const currentSize = body.getAttribute('data-leftbar-size');
            if (currentSize) { localStorage.setItem(SIDEBAR_STATUS_KEY, currentSize); }
        });
        sidebarObserver.observe(body, { attributes: true, attributeFilter: ['data-leftbar-size'] });
    }
    function redirectAfterLogin() {
        if (window.location.pathname === '/home') {
            window.location.href = 'https://siakang.untirta.ac.id/dashboard/dashboard-akademik';
        }
    }
    function forceListViewOnMobile() {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        const interval = setInterval(() => {
            const calendarButton = document.querySelector('button[x-on\\:click*="calendar"]');
            const listViewButton = document.querySelector('button[x-on\\:click*="card"]');
            if (calendarButton && listViewButton && calendarButton.classList.contains('active')) {
                listViewButton.click();
                clearInterval(interval);
            }
        }, 200);
        setTimeout(() => clearInterval(interval), 5000);
    }
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

    new MutationObserver((_, obs) => {
        if (document.body) {
            initializeScript();
            obs.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

})();