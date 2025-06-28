// ==UserScript==
// @name          Siakang Custom Dark Mode
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   Menerapkan tema gelap kustom untuk Siakang Untirta dan optimisasi UI.
// @author        Bitodette
// @match         https://siakang.untirta.ac.id/*
// @grant         GM_addStyle
// @run-at        document-start
// ==/UserScript==

(function() {
    'use strict';

    const primaryBg = '#1e1e1e';
    const secondaryBg = '#2d2d2d';
    const tertiaryBg = '#3c3c3c';
    const primaryText = '#e0e0e0';
    const secondaryText = '#a0a0a0';
    const primaryBorder = '#444444';
    const primaryAccent = '#02a8b5';

    const customCss = `
        body, html, #wrapper, .content-page, .content {
            background-color: ${primaryBg} !important;
            color: ${primaryText} !important;
        }

        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, p, .page-title, .text-dark, .text-black, .dropdown-header {
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
        .breadcrumb-item.active {
            color: ${secondaryText} !important;
        }
        .breadcrumb-item+.breadcrumb-item::before {
            color: ${secondaryText} !important;
        }

        .card, .card-body, .card-header, .modal-content, .dropdown-menu {
            background-color: ${secondaryBg} !important;
            color: ${primaryText} !important;
            border-color: ${primaryBorder} !important;
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
        .dropdown-divider {
            border-top-color: ${primaryBorder} !important;
        }
        hr {
            background-color: ${primaryBorder} !important;
        }

        .navbar-custom, .left-side-menu {
            background-color: ${secondaryBg} !important;
            border-bottom: 1px solid ${primaryBorder} !important;
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
        .user-box a, .user-box .dropdown-toggle {
            color: ${primaryText} !important;
        }
        .menu-title {
            color: ${primaryAccent} !important;
            opacity: 0.8 !important;
        }

        .left-side-menu {
            position: fixed !important;
            height: 100vh !important;
            top: 70px !important;
            overflow-y: auto !important;
        }

        body[data-leftbar-size='condensed'] .logo-box {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        .content-page {
            margin-left: 250px !important;
            transition: margin-left .2s !important;
        }

        body[data-leftbar-size='condensed'] .content-page {
            margin-left: 70px !important;
        }

        #sidebar-menu .menu-title.side-menu-list:last-of-type {
            display: none !important;
        }

        .navbar-custom .topnav-menu.float-end li.dropdown.topbar-dropdown:has(img[alt="user-image"][height="16"]) {
             display: none !important;
        }

        .navbar-custom .topnav-menu.float-end li.dropdown.topbar-dropdown:has(span:contains("id"), span:contains("en")):not(:has(i.bi-shield-lock-fill)):not(:has(i.bi-calendar-heart-fill)) {
            display: none !important;
        }

        .navbar-custom .nav-link.nav-user .rounded-circle.img-fill {
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

        tbody tr:nth-of-type(even) {
            background-color: ${secondaryBg} !important;
        }
        tbody tr:nth-of-type(odd) {
            background-color: ${primaryBg} !important;
        }

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
    `;

    GM_addStyle(customCss);

    const SIDEBAR_STATUS_KEY = 'siakang_sidebar_size';

    const applySavedSidebarStatus = (bodyElement) => {
        const savedStatus = localStorage.getItem(SIDEBAR_STATUS_KEY);
        if (savedStatus) {
            bodyElement.setAttribute('data-leftbar-size', savedStatus);
        }
    };

    const manageBodyAttributes = () => {
        const body = document.body;
        if (body) {
            if (body.getAttribute('data-theme') !== 'dark') {
                body.setAttribute('data-theme', 'dark');
            }
            if (body.getAttribute('data-topbar-color') !== 'dark') {
                body.setAttribute('data-topbar-color', 'dark');
            }
            if (body.getAttribute('data-leftbar-color') !== 'dark') {
                body.setAttribute('data-leftbar-color', 'dark');
            }

            const currentLeftbarSize = body.getAttribute('data-leftbar-size');
            if (currentLeftbarSize) {
                localStorage.setItem(SIDEBAR_STATUS_KEY, currentLeftbarSize);
            }
        }
    };

    const observer = new MutationObserver(manageBodyAttributes);

    new MutationObserver((_, obs) => {
        const body = document.body;
        if (body) {
            applySavedSidebarStatus(body);
            manageBodyAttributes();
            observer.observe(body, { attributes: true, attributeFilter: ['data-theme', 'data-topbar-color', 'data-leftbar-color', 'data-leftbar-size'] });
            obs.disconnect();
        }
        hideEmptyPascaperkuliahanMenu();
    }).observe(document.documentElement, { childList: true, subtree: true });

    const hideEmptyPascaperkuliahanMenu = () => {
        const pascaLi = document.querySelector('#sidebar-menu .menu-title.side-menu-list:has(span:contains("Pascaperkuliahan"))');

        if (pascaLi) {
            let nextSibling = pascaLi.nextElementSibling;
            let hasSubmenu = false;

            while (nextSibling && !nextSibling.classList.contains('menu-title')) {
                if ((nextSibling.tagName === 'LI' || nextSibling.tagName === 'UL') && nextSibling.querySelector('a')) {
                     hasSubmenu = true;
                     break;
                }
                nextSibling = nextSibling.nextElementSibling;
            }

            if (!hasSubmenu) {
                pascaLi.style.display = 'none';
            }
        }
    };

})();