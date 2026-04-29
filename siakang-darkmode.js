// ==UserScript==
// @name         Siakang Dark Mode
// @namespace    http://tampermonkey.net/
// @version      6.2.0
// @description  Dark Theme + new UI + fix Dashboard + QR Drag&Drop/paste/upload.
// @author       Bitodette
// @match        https://siakang.untirta.ac.id/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://siakang.untirta.ac.id/myunnes/images/logo/favicon.png
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @downloadURL  https://update.greasyfork.org/scripts/544583/Siakang%20Dark%20Mode.user.js
// @updateURL    https://update.greasyfork.org/scripts/544583/Siakang%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // palette & css
    const darkPalette = {
        primaryBg: '#131314',
        secondaryBg: '#1e1f20',
        tertiaryBg: '#282a2c',
        primaryText: '#e3e3e3',
        secondaryText: '#c4c7c5',
        primaryBorder: '#444746',
        primaryAccent: '#8ab4f8'
    };
    const lightPalette = {
        primaryBg: '#f8fafc',
        secondaryBg: '#ffffff',
        tertiaryBg: '#f1f5f9',
        primaryText: '#0f172a',
        secondaryText: '#64748b',
        primaryBorder: '#e2e8f0',
        primaryAccent: '#0284c7',
        linkText: '#334155'
    };

    const permanentCss = `
        /* font manrope */
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        @font-face {
            font-family: 'Striper';
            src: url('https://cdn.jsdelivr.net/gh/Bitodette/siakang-darkmode@main/font/Striper-Regular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
        }

        /* apply manrope */
        body, html, h1, h2, h3, h4, h5, h6, p, a, td, th, button, input, select, textarea, .nav-link, .dropdown-item, .badge, .form-control {
            font-family: 'Manrope', sans-serif !important;
        }

        #sidebar-menu .menu-title.side-menu-list:last-of-type,
        li.topbar-dropdown:has(img[src*="/images/flags/"]) { display: none !important; }

        .logo-box .logo-lg p {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            /* logo font */
            font-family: 'Striper', sans-serif !important;
            font-size: 25px !important;
            font-weight: normal !important;
            text-transform: uppercase !important;
            line-height: 1 !important;
            letter-spacing: 1px !important;
        }

        .modern-card::before { display: none !important; }

        @media (max-width: 991.98px) {
            .logo-box .logo-lg p {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
            }
            .logo-box .logo-sm {
                display: inline-block !important;
            }
        }

        @media (min-width: 992px) {
            .navbar-custom .nav-link.nav-user .rounded-circle.img-fill { display: none !important; }
        }

        .border { border: none !important; }

        /* modal qr drag & drop / paste css */
        #qr-modal-overlay {
            display: none; position: fixed; z-index: 1050; left: 0; top: 0;
            width: 100%; height: 100%; background: rgba(19, 19, 20, 0.75);
            align-items: center; justify-content: center; backdrop-filter: blur(5px);
        }
        #qr-drop-zone {
            border: 2px dashed var(--accent-color, #8ab4f8); border-radius: 16px; padding: 3rem 1rem;
            text-align: center; cursor: pointer; transition: all 0.3s ease;
            background: rgba(138, 180, 248, 0.05);
        }
        #qr-drop-zone:hover, #qr-drop-zone.dragover {
            background-color: rgba(138, 180, 248, 0.15); border-color: var(--accent-color, #8ab4f8);
        }
        #qr-drop-zone i { font-size: 4rem; color: var(--accent-color, #8ab4f8); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        #qr-drop-zone:hover i, #qr-drop-zone.dragover i { transform: translateY(-8px) scale(1.1); }
    `;

    const darkModeCss = `
        :root { --accent-color: ${darkPalette.primaryAccent}; }
        body, html, #wrapper, .content-page, .content { background-color: ${darkPalette.primaryBg} !important; color: ${darkPalette.primaryText} !important; }

        .card .text-dark, .card h5.text-dark, .card .fw-semibold.text-dark { color: ${darkPalette.primaryText} !important; }

        .welcome-card-custom .card-body h4.mb-1 { color: ${darkPalette.primaryAccent} !important; }
        .welcome-card-custom .card-body p.mb-0   { color: ${darkPalette.primaryText} !important; }
        .welcome-card-custom .fa-user-circle     { color: ${darkPalette.primaryAccent} !important; }

        .text-muted, .sub-header { color: ${darkPalette.secondaryText} !important; }
        a, a:hover { color: ${darkPalette.primaryAccent} !important; transition: color 0.2s ease; }
        .pro-user-name, .pro-user-name i, .nav-link, .dropdown-item { color: ${darkPalette.primaryText} !important; }
        .breadcrumb-item.active, .breadcrumb-item+.breadcrumb-item::before { color: ${darkPalette.secondaryText} !important; }

        /* card style */
        .card, .card-body, .card-header, .modern-card, .widget-rounded-circle .card-body, .tab-card, .info-card-custom, .password-card {
            background-color: ${darkPalette.secondaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important; /* shadow kembali */
            transform: none !important; /* tetap diam */
            transition: none !important;
        }

        /* hapus efek hover */
        .modern-card:hover, .info-card-custom:hover, .password-card:hover {
            transform: none !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
        }

        .modal-content, .dropdown-menu {
            background-color: ${darkPalette.secondaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            border: 1px solid ${darkPalette.primaryBorder} !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
        }

        .row:has(.page-title-box) { margin-bottom: 0.5rem !important; }

        .apexcharts-tooltip.apexcharts-theme-light { background: ${darkPalette.tertiaryBg} !important; border: 1px solid ${darkPalette.primaryBorder} !important; box-shadow: 0 4px 6px rgba(0,0,0,0.3) !important; border-radius: 8px !important; }
        .apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title { background: ${darkPalette.secondaryBg} !important; border-bottom: 1px solid ${darkPalette.primaryBorder} !important; color: ${darkPalette.primaryText} !important; }
        .apexcharts-tooltip-text-value, .apexcharts-tooltip-text-z-value { color: ${darkPalette.primaryText} !important; }
        .apexcharts-tooltip-text-y-label { color: ${darkPalette.secondaryText} !important; }
        .apexcharts-xaxis-label, .apexcharts-yaxis-label { fill: ${darkPalette.secondaryText} !important; }
        .apexcharts-gridline { display: none !important; }
        .apexcharts-datalabels-group text { fill: #fff !important; stroke: ${darkPalette.secondaryBg}; stroke-width: 4px; stroke-opacity: 1; paint-order: stroke; }

        .form-control, .form-control:focus { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; border: 1px solid ${darkPalette.primaryBorder} !important; border-radius: 8px !important; box-shadow: none !important; transition: border-color 0.2s; }
        .form-control:focus { border-color: ${darkPalette.primaryAccent} !important; }
        .form-control::placeholder { color: ${darkPalette.secondaryText} !important; }
        .page-title-box { background-color: transparent !important; color: ${darkPalette.primaryText} !important; }
        .bg-light { background-color: ${darkPalette.tertiaryBg} !important; border-radius: 8px !important; }
        .footer { background-color: ${darkPalette.primaryBg} !important; border-top: 1px solid ${darkPalette.primaryBorder} !important; color: ${darkPalette.secondaryText} !important; }
        .dropdown-item:hover, .dropdown-item:focus { background-color: ${darkPalette.tertiaryBg} !important; border-radius: 6px; margin: 0 4px; width: calc(100% - 8px); }
        .dropdown-divider, hr { border-top-color: ${darkPalette.primaryBorder} !important; }

        .navbar-custom, .left-side-menu { background-color: ${darkPalette.secondaryBg} !important; border-bottom: 1px solid ${darkPalette.primaryBorder} !important; }
        .left-side-menu { border-right: 1px solid ${darkPalette.primaryBorder} !important; }
        .logo-box { border-bottom: 1px solid ${darkPalette.primaryBorder} !important; display: flex !important; justify-content: center !important; align-items: center !important; height: 70px !important; }
        body[data-leftbar-color="dark"]:not([data-layout-mode="detached"]) .logo-box { background-color: ${darkPalette.secondaryBg} !important; }
        body:not([data-leftbar-size='condensed']) #side-menu > li > a {
            border-radius: 8px; margin: 2px 10px; padding: 12px 15px !important; transition: all 0.2s;
        }
        #side-menu li a { color: ${darkPalette.primaryText} !important; }
        #side-menu li a.active,
        #side-menu li a:hover,
        body[data-leftbar-size='condensed'] #sidebar-menu > ul > li:hover > a {
            background-color: ${darkPalette.tertiaryBg} !important;
            color: ${darkPalette.primaryAccent} !important;
            font-weight: 600;
        }

        /* title hidden pas shrink */
        body[data-leftbar-size='condensed'] #sidebar-menu .menu-title,
        body[data-leftbar-size='condensed'] .user-box {
            display: none !important;
        }

        .logo-box p, .button-menu-mobile i { color: ${darkPalette.primaryText} !important; }
        .logo-box .logo-lg p { margin: 0 !important; }
        .button-menu-mobile { width: 45px !important; }
        .user-box a, .user-box .dropdown-toggle { color: ${darkPalette.primaryText} !important; }
        .menu-title { color: ${darkPalette.secondaryText} !important; font-weight: 700 !important; letter-spacing: 1px; margin-top: 15px !important; }

        table { border-collapse: separate !important; border-spacing: 0 !important; }
        table th, table td { color: ${darkPalette.primaryText} !important; border-color: ${darkPalette.primaryBorder} !important; }
        thead, thead th { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; font-weight: 600 !important; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
        thead th:first-child { border-top-left-radius: 12px; }
        thead th:last-child { border-top-right-radius: 12px; }
        tbody tr { background-color: ${darkPalette.secondaryBg} !important; transition: background-color 0.2s; }
        tbody tr:nth-of-type(even) { background-color: rgba(255,255,255,0.02) !important; }
        tbody tr:hover { background-color: ${darkPalette.tertiaryBg} !important; }

        .dataTables_wrapper .dataTables_info, .dataTables_wrapper .dataTables_paginate .paginate_button { color: ${darkPalette.secondaryText} !important; }
        .dataTables_wrapper .dataTables_filter input { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; border: 1px solid ${darkPalette.primaryBorder} !important; border-radius: 6px !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button { background-color: ${darkPalette.secondaryBg} !important; border: 1px solid ${darkPalette.primaryBorder} !important; border-radius: 6px !important; margin: 0 2px !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover { background-color: ${darkPalette.primaryAccent} !important; color: #131314 !important; border-color: ${darkPalette.primaryAccent} !important; font-weight: bold; }
        .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.current) { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important;}

        .fc-event { background-color: ${darkPalette.primaryAccent} !important; border-color: ${darkPalette.primaryAccent} !important; border-radius: 4px; }
        .fc-event .fc-event-main, .fc-event .fc-event-main .fc-event-time, .fc-event .fc-event-main .fc-event-title { color: #131314 !important; font-weight: 600; }

        @media (min-width: 992px) { .left-side-menu { position: fixed !important; height: 100vh !important; top: 70px !important; overflow-y: auto !important; } .content-page { transition: margin-left .2s !important; } body[data-leftbar-size='condensed'] .content-page { margin-left: 70px !important; } }
        @media (max-width: 991.98px) { .content-page { margin-left: 0 !important; } .left-side-menu { position: fixed !important; top: 70px !important; height: calc(100vh - 70px) !important; z-index: 1050 !important; } }

        .authentication-bg { background-color: ${darkPalette.primaryBg} !important; background-size: cover !important; background-position: center !important; min-height: 100vh !important; }
        .mt-5 { margin-top: 0 !important; margin-bottom: 0 !important; }
        .col-md-8.col-lg-6.col-xl-4 { margin-top: 4.5rem !important; }
        .justify-content-end { justify-content: flex-start !important; }
        .row.g-4{margin-top: calc(-1.3 * var(--ct-gutter-y)) !important;}
        .row g-4.mb-4{margin-top: calc(-1.4 * var(--ct-gutter-y)) !important;}
        .col-lg-8.col-md-6 {padding-right: 9px !important;}
        .col-lg-8 {padding-right: 9px !important;}
        .row.g-4 > .col-md-6:first-child{padding-right: 9px !important;}
        .row:has(.page-title-box) {margin-bottom: 0rem !important;}

        .kendaraan-item-custom, .announcement-item-custom {
            border-bottom: 1px solid ${darkPalette.primaryBorder} !important;
            color: ${darkPalette.primaryText} !important;
        }
        .kendaraan-item-custom:hover, .announcement-item-custom:hover {
            background-color: ${darkPalette.tertiaryBg} !important;
            border-radius: 8px;
        }
        .plat-nomor-display {
            color: ${darkPalette.primaryAccent} !important;
            font-family: monospace !important;
            background: rgba(138, 180, 248, 0.1) !important;
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid rgba(138, 180, 248, 0.2) !important;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .announcement-title-custom { color: ${darkPalette.primaryText} !important; font-weight: 600 !important; }
        .announcement-content-custom { color: ${darkPalette.secondaryText} !important; }

        .badge-roda-dua { background-color: rgba(138, 180, 248, 0.15) !important; color: ${darkPalette.primaryAccent} !important; border: 1px solid rgba(138, 180, 248, 0.3); }
        .badge-roda-empat { background-color: rgba(167, 139, 250, 0.15) !important; color: #c4b5fd !important; border: 1px solid rgba(167, 139, 250, 0.3); }

        .icon-wrapper-custom, .icon-wrapper { background-color: ${darkPalette.tertiaryBg} !important; border-radius: 12px !important; }
        .password-card .icon-wrapper.bg-warning { background-color: rgba(250, 204, 21, 0.15) !important; }
        .password-card .icon-wrapper .text-warning { color: #fde047 !important; }

        .icon-wrapper-custom.bg-success-subtle { background-color: rgba(74, 222, 128, 0.15) !important; }
        .icon-wrapper-custom.text-success { color: #4ade80 !important; }
        .icon-wrapper-custom.bg-info-subtle { background-color: rgba(138, 180, 248, 0.15) !important; }
        .icon-wrapper-custom.text-info { color: #8ab4f8 !important; }
        .icon-wrapper-custom.bg-warning-subtle { background-color: rgba(250, 204, 21, 0.15) !important; }
        .icon-wrapper-custom.text-warning { color: #fde047 !important; }

        .alert-danger {
            background-color: rgba(248, 113, 113, 0.15) !important;
            border: 1px solid rgba(248, 113, 113, 0.3) !important;
            color: #fca5a5 !important;
            border-radius: 12px !important;
        }
        .alert-danger .alert-heading, .alert-danger li, .alert-danger b, .alert-danger strong { color: #fca5a5 !important; }

        .text-primary, .bi-laptop, .bi-code-slash, .bi-qr-code, .bi-clock, .bi-people, .bi-person {
            color: ${darkPalette.primaryAccent} !important;
        }

        /* button style */
        .btn { border-radius: 8px !important; font-weight: 600 !important; transform: none !important; }
        .btn-primary { background-color: ${darkPalette.primaryAccent} !important; border-color: ${darkPalette.primaryAccent} !important; color: #131314 !important; }
        .btn-primary:hover, .btn-primary:active, .btn-primary:focus { background-color: #aecbfa !important; border-color: #aecbfa !important; color: #131314 !important; transform: none !important; box-shadow: 0 2px 4px rgba(138, 180, 248, 0.2); }

        .btn-outline-primary { color: ${darkPalette.primaryAccent} !important; border-color: ${darkPalette.primaryAccent} !important; }
        .btn-outline-primary:hover { background-color: ${darkPalette.primaryAccent} !important; color: #131314 !important; transform: none !important; }
        .btn-outline-info { color: ${darkPalette.primaryText} !important; border-color: ${darkPalette.secondaryText} !important; }
        .btn-outline-info:hover { background-color: ${darkPalette.tertiaryBg} !important; color: #fff !important; transform: none !important; }
        .btn-outline-secondary { color: ${darkPalette.secondaryText} !important; border-color: ${darkPalette.primaryBorder} !important; }
        .btn-outline-secondary:hover { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; transform: none !important; }

        .btn-soft-primary { background-color: rgba(138, 180, 248, 0.15) !important; color: ${darkPalette.primaryAccent} !important; border: 1px solid transparent !important; }
        .btn-soft-primary:hover, .btn-soft-primary.active { background-color: ${darkPalette.primaryAccent} !important; color: #131314 !important; transform: none !important; box-shadow: none !important; }

        .breadcrumb-item a { color: ${darkPalette.primaryAccent} !important; }

        .badge { padding: 5px 8px !important; border-radius: 6px !important; font-weight: 600 !important; }
        .badge.text-bg-primary, .badge.bg-primary { background-color: rgba(138, 180, 248, 0.15) !important; color: ${darkPalette.primaryAccent} !important; border: 1px solid rgba(138, 180, 248, 0.3) !important; }
        .badge.bg-success, .badge.text-bg-success, .badge.bg-soft-success { background-color: rgba(74, 222, 128, 0.15) !important; color: #4ade80 !important; border: 1px solid rgba(74, 222, 128, 0.3) !important; }
        .badge.bg-warning, .badge.text-bg-warning { background-color: rgba(250, 204, 21, 0.15) !important; color: #fde047 !important; border: 1px solid rgba(250, 204, 21, 0.3) !important; }
        .badge.bg-danger, .badge.text-bg-danger, .badge.bg-soft-danger { background-color: rgba(248, 113, 113, 0.15) !important; color: #fca5a5 !important; border: 1px solid rgba(248, 113, 113, 0.3) !important; }

        /* biodata nav style*/
        .biodata-nav, .nav-pills { gap: 8px; }
        .biodata-nav .nav-link, .nav-pills .nav-link {
            transform: none !important; transition: background-color 0.2s ease !important;
            background-color: ${darkPalette.secondaryBg} !important; color: ${darkPalette.primaryText} !important;
            border: 1px solid ${darkPalette.primaryBorder} !important; border-radius: 8px !important; margin-bottom: 5px !important;
        }
        .biodata-nav .nav-link:hover, .nav-pills .nav-link:hover { background-color: ${darkPalette.tertiaryBg} !important; border-color: ${darkPalette.primaryAccent} !important; color: ${darkPalette.primaryAccent} !important; transform: none !important; }
        .biodata-nav .nav-link.active, .nav-pills .nav-link.active { background-color: ${darkPalette.primaryAccent} !important; border-color: ${darkPalette.primaryAccent} !important; color: #131314 !important; font-weight: bold; transform: none !important; box-shadow: none !important; }

        .select2-container--default .select2-selection--single { background-color: ${darkPalette.tertiaryBg} !important; border: 1px solid ${darkPalette.primaryBorder} !important; border-radius: 8px !important; height: 38px !important; display: flex !important; align-items: center !important; }
        .select2-container--default .select2-selection--single .select2-selection__rendered { color: ${darkPalette.primaryText} !important; line-height: normal !important; }
        .select2-container--default .select2-selection--single .select2-selection__arrow { height: 36px !important; }
        .select2-dropdown { background-color: ${darkPalette.secondaryBg} !important; border: 1px solid ${darkPalette.primaryBorder} !important; border-radius: 8px !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important; }
        .select2-search__field { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; border: 1px solid ${darkPalette.primaryBorder} !important; border-radius: 6px !important; }
        .select2-results__option { color: ${darkPalette.primaryText} !important; }
        .select2-results__option--highlighted[aria-selected] { background-color: ${darkPalette.primaryAccent} !important; color: #131314 !important; font-weight: bold; }
        .select2-container--default .select2-selection--single .select2-selection__placeholder { color: ${darkPalette.secondaryText} !important; }

        .col-form-label { color: ${darkPalette.secondaryText} !important; font-weight: 500 !important; }

        .modal-header { border-bottom: 1px solid ${darkPalette.primaryBorder} !important; background-color: transparent !important; border-radius: 16px 16px 0 0 !important;}
        .modal-footer { border-top: 1px solid ${darkPalette.primaryBorder} !important; background-color: transparent !important; border-radius: 0 0 16px 16px !important;}
    `;

    const lightModeCss = `
        :root { --accent-color: ${lightPalette.primaryAccent}; }
        body, html, #wrapper, .content-page, .content { background-color: ${lightPalette.primaryBg} !important; color: ${lightPalette.primaryText} !important; }

        .card .text-dark, .card h5.text-dark, .card .fw-semibold.text-dark { color: ${lightPalette.primaryText} !important; }
        .text-muted, .sub-header { color: ${lightPalette.secondaryText} !important; }

        /* normal links dark, buttons stay white */
        a:not(.nav-link):not(.dropdown-item):not([target="_blank"]) { color: ${lightPalette.linkText} !important; transition: color 0.2s ease; }
        a:not(.nav-link):not(.dropdown-item):not([target="_blank"]):hover { color: ${lightPalette.primaryAccent} !important; }
        a.btn, .detail-btn { color: #ffffff !important; }

        .pro-user-name, .pro-user-name i, .nav-link, .dropdown-item, .user-box a, .user-box .dropdown-toggle { color: ${lightPalette.primaryText} !important; }
        .breadcrumb-item.active, .breadcrumb-item+.breadcrumb-item::before { color: ${lightPalette.secondaryText} !important; }

        /* hapus efek hover */
        .card, .card-body, .card-header {
            background-color: ${lightPalette.secondaryBg} !important;
            color: ${lightPalette.primaryText} !important;
            border: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
            transition: none !important;
            transform: none !important;
        }

        .modern-card:hover, .info-card-custom:hover, .password-card:hover {
            transform: none !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
        }

        .modal-content, .dropdown-menu {
            background-color: ${lightPalette.secondaryBg} !important;
            color: ${lightPalette.primaryText} !important;
            border: 1px solid ${lightPalette.primaryBorder} !important;
            border-radius: 16px !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }
        .row:has(.page-title-box) { margin-bottom: 0.5rem !important; }
        .announcement-item-custom:hover { background-color: ${lightPalette.tertiaryBg} !important; border-radius: 8px; }
        .form-control, .form-control:focus { background-color: ${lightPalette.secondaryBg} !important; color: ${lightPalette.primaryText} !important; border: 1px solid ${lightPalette.primaryBorder} !important; border-radius: 8px !important; box-shadow: none !important; transition: border-color 0.2s;}
        .form-control:focus { border-color: ${lightPalette.primaryAccent} !important; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1) !important; }
        .form-control::placeholder { color: ${lightPalette.secondaryText} !important; }
        .page-title-box { background-color: transparent !important; color: ${lightPalette.primaryText} !important; }
        .bg-light { background-color: ${lightPalette.tertiaryBg} !important; border-radius: 8px !important; }
        .footer { background-color: ${lightPalette.primaryBg} !important; border-top: 1px solid ${lightPalette.primaryBorder} !important; color: ${lightPalette.secondaryText} !important; }
        .dropdown-item:hover, .dropdown-item:focus { background-color: ${lightPalette.tertiaryBg} !important; border-radius: 6px; margin: 0 4px; width: calc(100% - 8px); }
        .dropdown-divider, hr { border-top-color: ${lightPalette.primaryBorder} !important; }

        .navbar-custom, .left-side-menu { background-color: ${lightPalette.secondaryBg} !important; border-bottom: 1px solid ${lightPalette.primaryBorder} !important; }
        .left-side-menu { border-right: 1px solid ${lightPalette.primaryBorder} !important; }
        .logo-box { border-bottom: 1px solid ${lightPalette.primaryBorder} !important; display: flex !important; justify-content: center !important; align-items: center !important; height: 70px !important; }
        body:not([data-leftbar-size='condensed']) .logo-box .logo-lg { display: flex !important; justify-content: center !important; align-items: center !important; width: 100% !important; }

        /* sidebar flat */
        body:not([data-leftbar-size='condensed']) #side-menu > li > a {
            border-radius: 8px; margin: 2px 10px; padding: 12px 15px !important; transform: none !important;
        }

        #side-menu li a { color: ${lightPalette.primaryText} !important; transform: none !important; }

        #side-menu li a.active,
        #side-menu li a:hover,
        body[data-leftbar-size='condensed'] #sidebar-menu > ul > li:hover > a {
            background-color: ${lightPalette.tertiaryBg} !important;
            color: ${lightPalette.primaryAccent} !important;
            font-weight: 600;
            transform: none !important;
        }

        body[data-leftbar-size='condensed'] #sidebar-menu .menu-title,
        body[data-leftbar-size='condensed'] .user-box {
            display: none !important;
        }

        .logo-box p { color: ${lightPalette.primaryText} !important; }
        .button-menu-mobile i { color: ${lightPalette.secondaryText} !important; }
        .logo-box .logo-lg p { margin: 0 !important; }
        .button-menu-mobile { width: 45px !important; }
        .menu-title { color: ${lightPalette.primaryAccent} !important; opacity: 0.9 !important; font-weight: 700 !important; letter-spacing: 1px; margin-top: 15px !important; }

        table { border-collapse: separate !important; border-spacing: 0 !important; }
        table th, table td { color: ${lightPalette.primaryText} !important; border-color: ${lightPalette.primaryBorder} !important; }
        thead, thead th { background-color: ${lightPalette.tertiaryBg} !important; color: ${lightPalette.primaryText} !important; font-weight: 600 !important; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
        thead th:first-child { border-top-left-radius: 12px; }
        thead th:last-child { border-top-right-radius: 12px; }
        tbody tr { background-color: ${lightPalette.secondaryBg} !important; transition: background-color 0.2s; }
        tbody tr:nth-of-type(even) { background-color: #fafafa !important; }
        tbody tr:hover { background-color: ${lightPalette.tertiaryBg} !important; }

        .dataTables_wrapper .dataTables_info, .dataTables_wrapper .dataTables_paginate .paginate_button { color: ${lightPalette.secondaryText} !important; }
        .dataTables_wrapper .dataTables_filter input { background-color: ${lightPalette.secondaryBg} !important; color: ${lightPalette.primaryText} !important; border: 1px solid ${lightPalette.primaryBorder} !important; border-radius: 6px !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button { background-color: ${lightPalette.secondaryBg} !important; border: 1px solid ${lightPalette.primaryBorder} !important; border-radius: 6px !important; margin: 0 2px !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover { background-color: ${lightPalette.primaryAccent} !important; color: #fff !important; border-color: ${lightPalette.primaryAccent} !important; font-weight: bold; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2); }
        .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.current) { background-color: ${lightPalette.tertiaryBg} !important; color: ${lightPalette.primaryText} !important;}
        .info-section span[style*="background"] { background: ${lightPalette.tertiaryBg} !important; color: ${lightPalette.primaryText} !important; }

        @media (min-width: 992px) { .left-side-menu { position: fixed !important; height: 100vh !important; top: 70px !important; overflow-y: auto !important; } .content-page { transition: margin-left .2s !important; } body[data-leftbar-size='condensed'] .content-page { margin-left: 70px !important; } }
        @media (max-width: 991.98px) { .content-page { margin-left: 0 !important; } .left-side-menu { position: fixed !important; top: 70px !important; height: calc(100vh - 70px) !important; z-index: 1050 !important; } }
        .authentication-bg { background-color: ${lightPalette.primaryBg} !important; background-size: cover !important; background-position: center !important; min-height: 100vh !important; }
        .mt-5 { margin-top: 0 !important; margin-bottom: 0 !important; }
        .col-md-8.col-lg-6.col-xl-4 { margin-top: 4.5rem !important; }
        .justify-content-end { justify-content: flex-start !important; }
        .row.g-4{margin-top: calc(-1.3 * var(--ct-gutter-y)) !important;}
        .row g-4.mb-4{margin-top: calc(-1.4 * var(--ct-gutter-y)) !important;}
        .col-lg-8.col-md-6 {padding-right: 9px !important;}
        .col-lg-8 {padding-right: 9px !important;}
        .row.g-4 > .col-md-6:first-child{padding-right: 9px !important;}
        .row:has(.page-title-box) {margin-bottom: 0rem !important;}

        .kendaraan-item-custom, .announcement-item-custom { border-bottom: 1px solid ${lightPalette.primaryBorder} !important; }
        .announcement-title-custom { color: ${lightPalette.primaryText} !important; font-weight: 600 !important; transition: color 0.2s ease;}
        .announcement-title-custom:hover { color: ${lightPalette.primaryAccent} !important; }

        .biodata-nav .nav-link, .nav-pills .nav-link {
            transform: none !important; transition: background-color 0.2s ease !important;
            background-color: ${lightPalette.secondaryBg} !important; color: ${lightPalette.primaryText} !important;
            border: 1px solid ${lightPalette.primaryBorder} !important; border-radius: 8px !important; margin-bottom: 5px !important; margin-right: 5px !important;
        }
        .biodata-nav .nav-link:hover, .nav-pills .nav-link:hover { background-color: ${lightPalette.tertiaryBg} !important; border-color: ${lightPalette.primaryBorder} !important; transform: none !important; }
        .biodata-nav .nav-link.active, .nav-pills .nav-link.active {
            background-color: ${lightPalette.primaryAccent} !important; color: #fff !important;
            border-color: ${lightPalette.primaryAccent} !important; font-weight: bold; transform: none !important; box-shadow: none !important;
        }

        .select2-container--default .select2-selection--single { background-color: ${lightPalette.secondaryBg} !important; border: 1px solid ${lightPalette.primaryBorder} !important; height: 38px !important; border-radius: 8px !important; display: flex !important; align-items: center !important; }
        .select2-container--default .select2-selection--single .select2-selection__rendered { line-height: normal !important; }
        .select2-container--default .select2-selection--single .select2-selection__arrow { height: 36px !important; }

        .btn { border-radius: 8px !important; font-weight: 600 !important; transform: none !important; }
        .btn-primary { background-color: ${lightPalette.primaryAccent} !important; border-color: ${lightPalette.primaryAccent} !important; color: #fff !important; }
        .btn-primary:hover { background-color: #0369a1 !important; border-color: #0369a1 !important; transform: none !important; box-shadow: none !important; }

        .badge { padding: 5px 8px !important; border-radius: 6px !important; font-weight: 600 !important; }
        .badge.bg-primary { background-color: ${lightPalette.primaryAccent} !important; color: #fff !important; }
        .badge.bg-success { background-color: #d1e7dd !important; color: #0f5132 !important; border: 1px solid #badbcc !important; }
        .badge.badge-soft-success { background-color: #d1e7dd !important; color: #0f5132 !important; }

        .modal-header { border-bottom: 1px solid ${lightPalette.primaryBorder} !important; background-color: transparent !important; border-radius: 16px 16px 0 0 !important;}
        .modal-footer { border-top: 1px solid ${lightPalette.primaryBorder} !important; background-color: transparent !important; border-radius: 0 0 16px 16px !important;}
    `;

    // theme and auto detect mode
    let darkModeStyleElement = null;
    let lightModeStyleElement = null;

    function applyTheme(isDark) {
        const body = document.body;
        if (!body) return;
        if (isDark) {
            if (lightModeStyleElement) { lightModeStyleElement.remove(); lightModeStyleElement = null; }
            if (!darkModeStyleElement) { darkModeStyleElement = GM_addStyle(darkModeCss); }
            body.setAttribute('data-theme', 'dark'); body.setAttribute('data-topbar-color', 'dark'); body.setAttribute('data-leftbar-color', 'dark');
        } else {
            if (darkModeStyleElement) { darkModeStyleElement.remove(); darkModeStyleElement = null; }
            if (!lightModeStyleElement) { lightModeStyleElement = GM_addStyle(lightModeCss); }
            body.setAttribute('data-theme', 'light'); body.setAttribute('data-topbar-color', 'light'); body.setAttribute('data-leftbar-color', 'light');
        }
    }

    const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMatcher.addEventListener('change', event => applyTheme(event.matches));

    // fix dashboard n/a (compatible firefox & chrome)
    async function fixDashboardData() {
        if (!window.location.pathname.includes('/dashboard/dashboard-akademik')) return;

        // fix status lunas & semester visual
        const statusHeader = Array.from(document.querySelectorAll('h5')).find(el => /Status Registrasi/i.test(el.textContent));
        if (statusHeader) {
            const card = statusHeader.closest('.card');
            const semEl = card.querySelector('h6.fw-semibold');
            const badge = card.querySelector('.badge');

            // ubah Error jadi semester berjalan
            if (semEl && semEl.textContent.trim() === "Error") semEl.textContent = "2025/2026 Genap";

            // ubah belum lunas jadi lunas
            if (badge && badge.textContent.includes("Belum Lunas")) {
                badge.textContent = "Lunas"; badge.className = "badge text-bg-success";
            }
        }

        // fetch & inject jadwal n/a
        const table = document.querySelector('.table-modern-custom');
        if (!table) return;
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        // cek kalau beneran ada n/a di firefox
        if (!rows.some(r => r.textContent.includes('N/A'))) return;

        try {
            // ambil data jadwal
            const res = await fetch('https://siakang.untirta.ac.id/jadwal_perkuliahan');
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const scheduleMap = new Map();

            // ambil data dari halaman jadwal
            doc.querySelectorAll('.card, .modern-card').forEach(card => {
                const title = card.querySelector('h5')?.textContent.trim();
                const jam = card.querySelector('.bi-clock')?.parentElement.textContent.replace(/\s+/g, ' ').trim();
                const ruang = card.querySelector('.bi-geo-alt')?.parentElement.textContent.replace(/\s+/g, ' ').trim();
                if (title) scheduleMap.set(title, { jam, ruang });
            });

            // timpa n/a
            rows.forEach(row => {
                const mkName = row.querySelector('td:first-child .fw-semibold')?.textContent.replace(/\s+/g, ' ').trim();
                const data = scheduleMap.get(mkName);
                if (data) {
                    const cells = row.querySelectorAll('td');
                    if (cells[2] && cells[2].textContent.includes('N/A')) {
                        const jamClean = data.jam.split(',').map(s => s.trim());
                        cells[2].innerHTML = `<div class="fw-semibold">${jamClean[0]}</div><small class="text-muted">${jamClean[1] || ''}</small>`;
                    }
                    if (cells[3] && cells[3].textContent.includes('N/A')) {
                        cells[3].innerHTML = `<span class="text-muted">${data.ruang}</span>`;
                    }
                }
            });
        } catch (e) {
            console.error("Auto-sync dashboard gagal", e);
        }
    }

    // fitur schedule sorter
    function initScheduleSorter() {
        const DAY_MAP = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 7 };
        let lastSortedDay = null;
        let _debounceTimer = null;
        let observer = null;

        const debounce = (fn, ms = 120) => {
            clearTimeout(_debounceTimer);
            _debounceTimer = setTimeout(fn, ms);
        };

        function findContainer() {
            return document.querySelector('.row.g-3') ||
                   document.querySelector('.row:has(.bi-clock)') ||
                   Array.from(document.querySelectorAll('.row')).find(r => r.querySelector('.card .bi-clock')) ||
                   null;
        }

        function parseDayAndTime(text = '') {
            const dayRe = /\b(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu)\b/i;
            const timeRe = /([01]?\d|2[0-3])[:.]([0-5]\d)/;
            const dayMatch = text.match(dayRe);
            const timeMatch = text.match(timeRe);
            if (!dayMatch) return null;
            return {
                day: dayMatch[1],
                dayNum: DAY_MAP[dayMatch[1]] || 8,
                startTime: timeMatch ? parseInt(timeMatch[1].padStart(2,'0') + timeMatch[2], 10) : 9999
            };
        }

        function extractBestEntry(cardEl) {
            const clockEls = Array.from(cardEl.querySelectorAll('.bi-clock'));
            const today = new Date();
            const todayNum = today.getDay() === 0 ? 7 : today.getDay();
            let best = { sortOrder: 99, startTime: 9999 };

            clockEls.forEach(ce => {
                const textContainer = ce.closest('span,div,li') || ce.parentElement;
                if (!textContainer) return;
                const txt = (textContainer.textContent || '').replace(/\s+/g, ' ').trim();
                const parsed = parseDayAndTime(txt);
                if (!parsed) return;
                const sortOrder = (parsed.dayNum - todayNum + 7) % 7;
                if (sortOrder < best.sortOrder || (sortOrder === best.sortOrder && parsed.startTime < best.startTime)) {
                    best = { sortOrder, startTime: parsed.startTime };
                }
            });

            return best;
        }

        function collectCardColumns(container) {
            const cards = Array.from(container.querySelectorAll('.card')).map(card => card.closest('[class*="col-"]')).filter(Boolean);
            return Array.from(new Set(cards));
        }

        function sortScheduleCards() {
            const container = findContainer();
            if (!container) return;
            const cols = collectCardColumns(container);
            if (!cols.length) return;

            const today = new Date();
            lastSortedDay = today.getDay();

            const items = cols.map(col => {
                const card = col.querySelector('.card') || col;
                const best = extractBestEntry(card);
                return { element: col, sortOrder: best.sortOrder, startTime: best.startTime };
            });

            items.sort((a, b) => {
                if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
                return a.startTime - b.startTime;
            });

            // fix flicker button
            let isSorted = true;
            const currentChildren = Array.from(container.children).filter(child => cols.includes(child));
            for (let i = 0; i < items.length; i++) {
                if (currentChildren[i] !== items[i].element) {
                    isSorted = false;
                    break;
                }
            }

            if (!isSorted) {
                items.forEach(it => container.appendChild(it.element));
            }
        }

        function bindObserver() {
            const container = findContainer();
            if (!container) return;
            if (observer) observer.disconnect();
            observer = new MutationObserver(() => debounce(sortScheduleCards, 120));
            observer.observe(container, { childList: true, subtree: true, attributes: false });
        }

        window.addEventListener('load', () => {
            debounce(() => {
                sortScheduleCards();
                bindObserver();
            }, 80);
        });

        setInterval(() => {
            if (new Date().getDay() !== lastSortedDay) sortScheduleCards();
        }, 60_000);

        debounce(() => {
            sortScheduleCards();
            bindObserver();
        }, 200);
    }

    //  view persistence (blm tau jalan apa engga)
    function initViewPersistence() {
        const VIEW_KEY = 'siakang_schedule_last_view';

        const applyView = () => {
            const listViewButton = document.querySelector("button[x-on\\:click*='card']");
            const calendarViewButton = document.querySelector("button[x-on\\:click*='calendar']");

            if (listViewButton && calendarViewButton) {
                const savedView = localStorage.getItem(VIEW_KEY);
                if (savedView === 'card' && !listViewButton.classList.contains('active')) {
                    listViewButton.click();
                } else if (savedView === 'calendar' && !calendarViewButton.classList.contains('active')) {
                    calendarViewButton.click();
                }

                listViewButton.addEventListener('click', () => localStorage.setItem(VIEW_KEY, 'card'), { once: false });
                calendarViewButton.addEventListener('click', () => localStorage.setItem(VIEW_KEY, 'calendar'), { once: false });
            }
        };

        // livewire error protector
        if (typeof document.addEventListener !== 'undefined') {
            document.addEventListener('livewire:init', () => {
                if(window.Livewire) {
                    window.Livewire.hook('request', ({ fail }) => {
                        fail(({ status, preventDefault }) => {
                            if (status === 500 || status === 419) {
                                console.warn("Livewire Session Error Terdeteksi. Mereset state...");
                                localStorage.removeItem(VIEW_KEY);
                            }
                        });
                    });
                }
            });
        }

        const checkReady = setInterval(() => {
            if (typeof window.Livewire !== 'undefined') {
                clearInterval(checkReady);
                setTimeout(applyView, 1500);
            }
        }, 200);

        setTimeout(() => clearInterval(checkReady), 8000);
    }

    // fitur qr presensi drag & drop / paste
    function initQRPresensi() {
        if (!window.location.href.includes('/presensi-mahasiswa')) return;

        const check = setInterval(() => {
            const scanBtn = document.getElementById('btn-scan');
            if (scanBtn) {
                clearInterval(check);
                if (document.getElementById('btn-upload-qr')) return;

                // inject modal ui
                const modalHtml = `
                    <div id="qr-modal-overlay">
                        <div class="card shadow-lg" style="width: 90%; max-width: 450px;">
                            <div class="card-body p-4 text-center">
                                <h4 class="fw-bold mb-1 text-dark">Upload QR Presensi</h4>
                                <p class="text-muted small mb-4">Sistem pintar ini menerima file dengan cepat</p>

                                <div id="qr-drop-zone">
                                    <i class="bi bi-cloud-arrow-up"></i>
                                    <h5 class="mt-3 mb-1 fw-semibold text-dark">Drag & Drop foto QR</h5>
                                    <p class="text-muted small mb-0">Atau <b>Paste (Ctrl+V)</b> gambar di area ini<br>Bisa juga diklik untuk membuka explorer.</p>
                                </div>

                                <button id="btn-close-qr-modal" class="btn btn-outline-secondary w-100 mt-4 fw-semibold">Batal</button>
                                <input type="file" id="qr-file-input" accept="image/*" style="display: none;">
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);

                //prepare dom refs
                const overlay = document.getElementById('qr-modal-overlay');
                const dropZone = document.getElementById('qr-drop-zone');
                const fileInput = document.getElementById('qr-file-input');
                const closeBtn = document.getElementById('btn-close-qr-modal');

                // main button untuk modal
                const upBtn = document.createElement('button');
                upBtn.id = 'btn-upload-qr';
                upBtn.className = 'btn btn-warning btn-lg fw-semibold ms-2';
                upBtn.innerHTML = '<i class="bi bi-file-earmark-image me-2"></i>Upload QR';
                upBtn.onclick = () => { overlay.style.display = 'flex'; }; // show modal

                // append button next to scan
                scanBtn.parentNode.appendChild(upBtn);

                // modal + drag/drop listeners
                closeBtn.onclick = () => { overlay.style.display = 'none'; };
                overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = 'none'; };
                dropZone.onclick = () => fileInput.click();

                dropZone.addEventListener('dragover', (e) => {
                    e.preventDefault(); dropZone.classList.add('dragover');
                });
                dropZone.addEventListener('dragleave', (e) => {
                    e.preventDefault(); dropZone.classList.remove('dragover');
                });
                dropZone.addEventListener('drop', (e) => {
                    e.preventDefault(); dropZone.classList.remove('dragover');
                    if (e.dataTransfer.files.length) {
                        overlay.style.display = 'none';
                        processQR(e.dataTransfer.files[0]);
                    }
                });

                // paste event listener
                document.addEventListener('paste', (e) => {
                    // paste kalo modal kebuka
                    if (overlay.style.display === 'flex') {
                        const items = e.clipboardData.items;
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].type.indexOf('image') !== -1) {
                                const blob = items[i].getAsFile();
                                overlay.style.display = 'none'; // close modal
                                processQR(blob); // process image
                                break;
                            }
                        }
                    }
                });

                // desktop file picker
                fileInput.onchange = e => {
                    if (e.target.files[0]) {
                        overlay.style.display = 'none';
                        processQR(e.target.files[0]);
                        fileInput.value = '';
                    }
                };
            }
        }, 500);
    }

    async function processQR(file) {
        if (typeof jsQR !== 'function') {
            alert('Library jsQR gagal dimuat. Coba refresh halaman.');
            return;
        }

        const image = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    submitPresensi(code.data);
                } else {
                    alert("Gagal membaca QR Code. Pastikan gambarnya jelas, terang, dan tidak terpotong!");
                }
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function submitPresensi(token) {
        const pelaksanaanId = document.getElementById('pelaksanaan-id')?.value || '';
        const urlParams = new URLSearchParams(window.location.search);
        const jadwalId = urlParams.get('jadwal_id') || '';

        let csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrf) {
            const tokenInput = document.querySelector('input[name="_token"]');
            if (tokenInput) csrf = tokenInput.value;
        }

        if (!csrf) {
            alert("Sistem tidak dapat menemukan Token Keamanan (CSRF). Silakan refresh halaman ini lalu coba lagi.");
            return;
        }

        const formData = new FormData();
        formData.append('_token', csrf);
        formData.append('token', token);
        if (pelaksanaanId) formData.append('pelaksanaan_kuliah_id', pelaksanaanId);

        fetch(`https://siakang.untirta.ac.id/presensi-mahasiswa/store?jadwal_id=${jadwalId}`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf,
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(async r => {
            if (r.status === 419 || r.status === 500) {
                alert("Sesi Anda telah kedaluwarsa atau terjadi gangguan server. Halaman akan dimuat ulang.");
                location.reload();
                return;
            }
            const json = await r.json();
            if (json.success) {
                alert("Berhasil! " + (json.message || 'Presensi tercatat.'));
                location.reload();
            } else {
                alert("Gagal: " + (json.message || 'Token tidak valid.'));
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            alert("Error koneksi saat mengirim data presensi.");
        });
    }

    // fungsi utilitas & layout
    function highlightActiveSidebarLink() {
        setTimeout(() => {
            const currentPath = window.location.pathname;
            const sidebarLinks = document.querySelectorAll('#side-menu li a');
            document.querySelectorAll('#side-menu li a.active').forEach(el => el.classList.remove('active'));
            let bestMatch = null;
            let longestMatchLength = 0;
            sidebarLinks.forEach(link => {
                if (!link.href || link.href.includes('javascript:')) return;
                try {
                    let linkPath = new URL(link.href).pathname;
                    if (linkPath === '/home') linkPath = '/dashboard/dashboard-akademik';
                    if (linkPath === '/' && currentPath !== '/home' && currentPath !== '/') return;
                    if (currentPath.startsWith(linkPath) && linkPath.length > longestMatchLength) {
                        longestMatchLength = linkPath.length;
                        bestMatch = link;
                    }
                } catch (e) {}
            });
            if (bestMatch) {
                bestMatch.classList.add('active');
            }
        }, 500);
    }

    function fixKendaraanWidget() {
        const kendaraanCard = document.querySelector('.kendaraan-card-custom');
        if (kendaraanCard) {
            kendaraanCard.classList.add('mt-4', 'mb-0');
            const parentCol = kendaraanCard.closest('.col-lg-12.col-md-6');
            if (parentCol) {
                parentCol.classList.remove('col-md-6');
                parentCol.classList.add('col-lg-12');
            }
        }
    }

    function adjustCustomLayout() {
        const applyTrenStatusAndAnnouncementSizing = () => {
            const isMobile = window.matchMedia('(max-width: 767.98px)').matches;

            const trenChartHeader = Array.from(document.querySelectorAll('h5')).find(el => /Tren Indeks Prestasi/i.test(el.textContent));
            if (trenChartHeader) {
                const trenCard = trenChartHeader.closest('.card');
                if (trenCard) {
                    const trenCol = trenCard.closest('[class*="col-"]');
                    if (trenCol) {
                        if (isMobile) {
                            trenCol.classList.remove('col-lg-8', 'col-lg-12', 'col-md-6');
                            trenCol.classList.add('col-12', 'col-md-12');
                        } else {
                            trenCol.classList.remove('col-12', 'col-md-12', 'col-md-6', 'col-lg-12');
                            trenCol.classList.add('col-lg-8');
                        }
                    }
                }
            }

            const statusRegHeader = Array.from(document.querySelectorAll('h5')).find(el => /Status Registrasi/i.test(el.textContent));
            if (statusRegHeader) {
                const statusCard = statusRegHeader.closest('.card');
                if (statusCard) {
                    const statusCol = statusCard.closest('[class*="col-"]');
                    if (statusCol) {
                        if (isMobile) {
                            statusCol.classList.remove('col-md-6', 'col-md-12', 'col-12');
                            statusCol.classList.add('col-md-4');
                        } else {
                            statusCol.classList.remove('col-md-4', 'col-md-12', 'col-12');
                            statusCol.classList.add('col-md-6');
                        }
                    }
                }
            }

            const announcementCol = (function(){
                const byClass = document.querySelector('.announcement-card-custom')?.closest('[class*="col-"]');
                if (byClass) return byClass;
                const header = Array.from(document.querySelectorAll('h5')).find(el => /Pengumuman/i.test(el.textContent));
                return header ? header.closest('[class*="col-"]') : null;
            })();

            if (announcementCol) {
                announcementCol.classList.remove('col-lg-12','col-md-12','col-12','col-lg-6','col-md-4','col-lg-8','col-md-6');
                if (isMobile) {
                    announcementCol.classList.add('col-lg-6', 'col-md-4');
                } else {
                    announcementCol.classList.add('col-lg-8', 'col-md-6');
                }
            }
        };

        applyTrenStatusAndAnnouncementSizing();

        if (!window.__siakang_tren_resize_bound) {
            let _siakang_tren_resize_timer = null;
            window.addEventListener('resize', () => {
                clearTimeout(_siakang_tren_resize_timer);
                _siakang_tren_resize_timer = setTimeout(applyTrenStatusAndAnnouncementSizing, 150);
            });
            window.__siakang_tren_resize_bound = true;
        }
    }

    function manageSidebar() {
        const SIDEBAR_STATUS_KEY = 'siakang_sidebar_size';
        const body = document.body;
        const isMobile = () => window.matchMedia("(max-width: 991.98px)").matches;

        if (isMobile()) {
            body.setAttribute('data-leftbar-size', 'default');
        } else {
            const savedStatus = localStorage.getItem(SIDEBAR_STATUS_KEY);
            if (savedStatus) {
                body.setAttribute('data-leftbar-size', savedStatus);
            }
        }

        const sidebarObserver = new MutationObserver(() => {
            if (isMobile()) {
                if (body.getAttribute('data-leftbar-size') !== 'default') {
                    body.setAttribute('data-leftbar-size', 'default');
                }
            } else {
                const currentSize = body.getAttribute('data-leftbar-size');
                if (currentSize) {
                    localStorage.setItem(SIDEBAR_STATUS_KEY, currentSize);
                }
            }
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

    // jalanin script spesifik halaman (buat ngefix elemen yang di load setelah navigasi livewire)

    function runPageSpecificScripts() {
        redirectAfterLogin();
        highlightActiveSidebarLink();
        fixKendaraanWidget();
        adjustCustomLayout();

        // call fix dashboard n/a globally, it checks its own route
        fixDashboardData();

        if (window.location.href.includes('/jadwal_perkuliahan')) {
            forceListViewOnMobile();
            initScheduleSorter();
            initViewPersistence();
        }

        if (window.location.href.includes('/presensi-mahasiswa')) {
            setTimeout(initQRPresensi, 500);
        }
    }

    function initializeScript() {
        GM_addStyle(permanentCss);
        applyTheme(darkModeMatcher.matches);
        manageSidebar();
        modifyFooter();
        runPageSpecificScripts();

        document.addEventListener('livewire:navigated', runPageSpecificScripts);
    }

    new MutationObserver((_, obs) => {
        if (document.body) {
            initializeScript();
            obs.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

})();