// ==UserScript==
// @name         Siakang Dark Mode
// @namespace    http://tampermonkey.net/
// @version      6.3.1
// @description  Dark Mode Siakang + Fix Firefox Dashboard N/A + QR Drag&Drop.
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

    // =========================================================================
    // 1. PALETTE & CSS
    // =========================================================================

    const darkPalette = {
        primaryBg: '#1e1e1b', secondaryBg: '#2d2d2d', tertiaryBg: '#3c3c3c',
        primaryText: '#e0e0e0', secondaryText: '#a0a0a0', primaryBorder: '#555555',
        primaryAccent: '#02a8b5'
    };
    const lightPalette = {
        primaryBg: '#f4f7f9', secondaryBg: '#ffffff', tertiaryBg: '#e9ecef',
        primaryText: '#212529', secondaryText: '#6c757d', primaryBorder: '#dee2e6',
        primaryAccent: '#02a8b5', linkText: '#444'
    };

    const permanentCss = `
        @font-face {
            font-family: 'Striper';
            src: url('https://cdn.jsdelivr.net/gh/Bitodette/siakang-darkmode@main/font/Striper-Regular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
        }

        #sidebar-menu .menu-title.side-menu-list:last-of-type,
        li.topbar-dropdown:has(img[src*="/images/flags/"]) { display: none !important; }

        .logo-box .logo-lg p {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            font-family: 'Striper', sans-serif !important;
            font-size: 25px !important;
            font-weight: normal !important;
            text-transform: uppercase !important;
            line-height: 1 !important;
            letter-spacing: 1px !important;
        }

        .modern-card, .modern-card:hover { background: none !important; box-shadow: none !important; transform: none !important; }
        .modern-card::before { display: none !important; }

        .card, .card-body, .card-header, .modern-card, .widget-rounded-circle .card-body, .tab-card, .info-card-custom, .password-card {
            border: none !important;
            box-shadow: none !important;
        }

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
        .tab-card { box-shadow: none !important; }

        /* MODAL QR DRAG & DROP / PASTE CSS */
        #qr-modal-overlay {
            display: none; position: fixed; z-index: 1050; left: 0; top: 0;
            width: 100%; height: 100%; background: rgba(0,0,0,0.55);
            align-items: center; justify-content: center; backdrop-filter: blur(3px);
        }
        #qr-drop-zone {
            border: 2px dashed #02a8b5; border-radius: 12px; padding: 2.5rem 1rem;
            text-align: center; cursor: pointer; transition: all 0.2s ease-in-out;
        }
        #qr-drop-zone:hover, #qr-drop-zone.dragover {
            background-color: rgba(2, 168, 181, 0.1); border-color: #028a95;
        }
        #qr-drop-zone i { font-size: 3.5rem; color: #02a8b5; transition: transform 0.2s; }
        #qr-drop-zone:hover i, #qr-drop-zone.dragover i { transform: translateY(-5px); }
        #btn-upload-qr, #btn-upload-qr i { color: #fff !important; }
    `;

    const darkModeCss = `
        body, html, #wrapper, .content-page, .content { background-color: ${darkPalette.primaryBg} !important; color: ${darkPalette.primaryText} !important; }

        .card .text-dark,
        .card h5.text-dark,
        .card .fw-semibold.text-dark {
            color: ${darkPalette.primaryText} !important;
        }

        .welcome-card-custom .card-body h4.mb-1 { color: ${darkPalette.primaryAccent} !important; }
        .welcome-card-custom .card-body p.mb-0   { color: ${darkPalette.primaryText} !important; }
        .welcome-card-custom .fa-user-circle     { color: ${darkPalette.primaryAccent} !important; }

        .text-muted, .sub-header { color: ${darkPalette.secondaryText} !important; }
        a, a:hover { color: #fff !important; }
        .pro-user-name, .pro-user-name i, .nav-link, .dropdown-item { color: ${darkPalette.primaryText} !important; }
        .breadcrumb-item.active, .breadcrumb-item+.breadcrumb-item::before { color: ${darkPalette.secondaryText} !important; }

        .card, .card-body, .card-header {
            background-color: ${darkPalette.secondaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            border: none !important;
            border-radius: 12px !important;
        }
        .modal-content, .dropdown-menu {
            background-color: ${darkPalette.secondaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            border-color: ${darkPalette.primaryBorder} !important;
            border-radius: 12px !important;
        }

        .tab-card { background: #202020 !important; }

        .row:has(.page-title-box) { margin-bottom: 0.5rem !important; }
        .info-card-custom, .password-card { box-shadow: none !important; transition: none !important; }
        .info-card-custom:hover, .password-card:hover { transform: none !important; }

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
        #side-menu li a { color: ${darkPalette.primaryText} !important; }
        #side-menu li a.active, #side-menu li a:hover {
            background-color: #464646 !important;
            color: #fff !important;
        }
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
        .fc-event { background-color: ${darkPalette.primaryAccent} !important; border-color: ${darkPalette.primaryAccent} !important; }
        .fc-event .fc-event-main, .fc-event .fc-event-main .fc-event-time, .fc-event .fc-event-main .fc-event-title { color: #ffffff !important; }

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

        .kendaraan-card-custom, .announcement-card-custom, .password-card {
            background-color: ${darkPalette.secondaryBg} !important;
            border: none !important;
            box-shadow: none !important;
        }
        .kendaraan-item-custom, .announcement-item-custom {
            border-bottom: 1px solid ${darkPalette.primaryBorder} !important;
            color: ${darkPalette.primaryText} !important;
        }
        .kendaraan-item-custom:hover, .announcement-item-custom:hover {
            background-color: ${darkPalette.tertiaryBg} !important;
        }
        .plat-nomor-display {
            color: ${darkPalette.primaryText} !important;
            font-family: monospace !important;
            background: ${darkPalette.tertiaryBg} !important;
            padding: 2px 5px;
            border-radius: 4px;
            border: 1px solid ${darkPalette.primaryBorder} !important;
        }
        .announcement-title-custom { color: ${darkPalette.primaryText} !important; }
        .announcement-content-custom { color: ${darkPalette.secondaryText} !important; }
        .badge-roda-dua { background-color: rgba(25, 118, 210, 0.2) !important; color: #90caf9 !important; border: 1px solid rgba(144, 202, 249, 0.3); }
        .badge-roda-empat { background-color: rgba(123, 31, 162, 0.2) !important; color: #ce93d8 !important; border: 1px solid rgba(206, 147, 216, 0.3); }

        .icon-wrapper-custom, .icon-wrapper {
            background-color: ${darkPalette.tertiaryBg} !important;
        }
        .password-card .icon-wrapper.bg-warning {
            background-color: ${darkPalette.tertiaryBg} !important;
        }
        .password-card .icon-wrapper .text-warning {
            color: ${darkPalette.primaryText} !important;
        }

        .icon-wrapper-custom.bg-success-subtle,
        .icon-wrapper-custom.bg-info-subtle,
        .icon-wrapper-custom.bg-warning-subtle {
            background-color: ${darkPalette.tertiaryBg} !important;
        }
        .icon-wrapper-custom.text-success,
        .icon-wrapper-custom.text-info,
        .icon-wrapper-custom.text-warning {
            color: ${darkPalette.primaryText} !important;
        }

        .alert-danger {
            background-color: rgba(220, 53, 69, 0.15) !important;
            border-color: rgba(220, 53, 69, 0.3) !important;
            color: #ffc9c9 !important;
        }
        .alert-danger .alert-heading,
        .alert-danger li,
        .alert-danger b,
        .alert-danger strong {
            color: #ffc9c9 !important;
        }

        .text-primary, .bi-laptop, .bi-code-slash, .bi-qr-code, .bi-clock, .bi-people, .bi-person {
            color: ${darkPalette.primaryAccent} !important;
        }

        .btn-primary {
            background-color: ${darkPalette.primaryAccent} !important;
            border-color: ${darkPalette.primaryAccent} !important;
            color: #fff !important;
        }
        .btn-primary:hover, .btn-primary:active, .btn-primary:focus {
            background-color: #028a95 !important;
            border-color: #028a95 !important;
        }
        .btn-outline-primary { color: ${darkPalette.primaryAccent} !important; border-color: ${darkPalette.primaryAccent} !important; }
        .btn-outline-primary:hover { background-color: ${darkPalette.primaryAccent} !important; color: #fff !important; }
        .btn-outline-info { color: ${darkPalette.primaryText} !important; border-color: ${darkPalette.secondaryText} !important; }
        .btn-outline-info:hover { background-color: ${darkPalette.tertiaryBg} !important; color: #fff !important; }
        .btn-outline-secondary { color: ${darkPalette.secondaryText} !important; border-color: ${darkPalette.primaryBorder} !important; }
        .btn-outline-secondary:hover { background-color: ${darkPalette.tertiaryBg} !important; color: ${darkPalette.primaryText} !important; }

        .btn-soft-primary {
            background-color: rgba(2, 168, 181, 0.15) !important;
            color: ${darkPalette.primaryAccent} !important;
            border: 1px solid transparent !important;
        }
        .btn-soft-primary:hover, .btn-soft-primary.active {
            background-color: ${darkPalette.primaryAccent} !important;
            color: #fff !important;
        }

        .breadcrumb-item a {
            color: ${darkPalette.primaryAccent} !important;
        }

        .badge.text-bg-primary {
            background-color: ${darkPalette.primaryAccent} !important;
            color: #fff !important;
        }

        .biodata-nav, .nav-pills { gap: 5px; }
        .biodata-nav .nav-link, .nav-pills .nav-link {
            transform: none !important;
            transition: all 0.2s ease !important;
            background-color: ${darkPalette.secondaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            border: 1px solid ${darkPalette.primaryBorder} !important;
            border-radius: 8px !important;
            margin-bottom: 5px !important;
        }
        .biodata-nav .nav-link:hover, .nav-pills .nav-link:hover {
            background-color: ${darkPalette.tertiaryBg} !important;
            border-color: ${darkPalette.primaryAccent} !important;
            color: ${darkPalette.primaryAccent} !important;
        }
        .biodata-nav .nav-link.active, .nav-pills .nav-link.active {
            background-color: ${darkPalette.primaryAccent} !important;
            border-color: ${darkPalette.primaryAccent} !important;
            color: #fff !important;
        }

        .card.border-top,
        .card.border-primary,
        .card.border-success,
        .card.border-secondary,
        .card.border-2,
        .card.shadow,
        .card-body.border-top,
        .widget-rounded-circle .card-body {
            border: none !important;
            box-shadow: none !important;
        }
        .border-opacity-50 {
            opacity: 1 !important;
            border-color: ${darkPalette.primaryBorder} !important;
        }
        .border-dark, .border-warning, .border-success, .border-secondary {
            border-color: ${darkPalette.primaryBorder} !important;
        }

        .card-header {
            background-color: ${darkPalette.tertiaryBg} !important;
            border-bottom: 1px solid ${darkPalette.primaryBorder} !important;
        }
        .card-title {
            color: ${darkPalette.primaryAccent} !important;
            font-weight: 600 !important;
        }
        .select2-container--default .select2-selection--single {
            background-color: ${darkPalette.tertiaryBg} !important;
            border: 1px solid ${darkPalette.primaryBorder} !important;
            border-radius: 0.25rem !important;
            height: 38px !important;
            display: flex !important;
            align-items: center !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            color: ${darkPalette.primaryText} !important;
            line-height: normal !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 36px !important;
        }
        .select2-dropdown {
            background-color: ${darkPalette.secondaryBg} !important;
            border: 1px solid ${darkPalette.primaryBorder} !important;
        }
        .select2-search__field {
            background-color: ${darkPalette.tertiaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            border: 1px solid ${darkPalette.primaryBorder} !important;
        }
        .select2-results__option {
            color: ${darkPalette.primaryText} !important;
        }
        .select2-results__option--highlighted[aria-selected] {
            background-color: ${darkPalette.primaryAccent} !important;
            color: #fff !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__placeholder {
            color: ${darkPalette.secondaryText} !important;
        }
        .form-control, .form-control[readonly] {
            background-color: ${darkPalette.tertiaryBg} !important;
            border-color: ${darkPalette.primaryBorder} !important;
            color: ${darkPalette.primaryText} !important;
        }
        .col-form-label {
            color: ${darkPalette.secondaryText} !important;
            font-weight: 500 !important;
        }

        .badge.bg-primary {
            background-color: #00737d !important;
            color: #ffffff !important;
        }
        .badge.bg-success {
            background-color: rgba(16, 185, 129, 0.2) !important;
            color: #6ee7b7 !important;
            border: 1px solid rgba(16, 185, 129, 0.3) !important;
        }
        .badge.badge-soft-success {
            background-color: rgba(16, 185, 129, 0.15) !important;
            color: #6ee7b7 !important;
        }

        .table-light {
            background-color: ${darkPalette.tertiaryBg} !important;
            color: ${darkPalette.primaryText} !important;
        }
        .table-light th {
            background-color: ${darkPalette.tertiaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            border-color: ${darkPalette.primaryBorder} !important;
        }
        .table-striped > tbody > tr:nth-of-type(odd) > * {
            background-color: ${darkPalette.tertiaryBg} !important;
            color: ${darkPalette.primaryText} !important;
            box-shadow: none !important;
        }
        .table-striped > tbody > tr > td, .table-hover > tbody > tr > td {
             border-color: ${darkPalette.primaryBorder} !important;
        }
        .table-hover > tbody > tr:hover > * {
             background-color: ${darkPalette.tertiaryBg} !important;
             color: ${darkPalette.primaryText} !important;
        }
        .table td a {
            color: ${darkPalette.primaryAccent} !important;
            text-decoration: none !important;
        }
        .table td a:hover {
            text-decoration: underline !important;
        }

        .modal-content {
             background-color: ${darkPalette.secondaryBg} !important;
             border: 1px solid ${darkPalette.primaryBorder} !important;
        }
        .modal-header, .modal-footer {
             border-color: ${darkPalette.primaryBorder} !important;
             background-color: ${darkPalette.tertiaryBg} !important;
        }
        .modal-title { color: ${darkPalette.primaryText} !important; }
        .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }

        .page-link {
             background-color: ${darkPalette.secondaryBg} !important;
             border-color: ${darkPalette.primaryBorder} !important;
             color: ${darkPalette.primaryText} !important;
        }
        .page-link:hover {
             background-color: ${darkPalette.tertiaryBg} !important;
             border-color: ${darkPalette.primaryAccent} !important;
             color: ${darkPalette.primaryAccent} !important;
        }
        .page-item.active .page-link {
             background-color: ${darkPalette.primaryAccent} !important;
             border-color: ${darkPalette.primaryAccent} !important;
             color: #fff !important;
        }
        .page-item.disabled .page-link {
             background-color: ${darkPalette.tertiaryBg} !important;
             color: ${darkPalette.secondaryText} !important;
             border-color: ${darkPalette.primaryBorder} !important;
        }
    `;

    const lightModeCss = `
        body, html, #wrapper, .content-page, .content { background-color: ${lightPalette.primaryBg} !important; color: ${lightPalette.primaryText} !important; }

        .card .text-dark,
        .card h5.text-dark,
        .card .fw-semibold.text-dark {
            color: ${lightPalette.primaryText} !important;
        }

        .text-muted, .sub-header { color: ${lightPalette.secondaryText} !important; }

        /* Tautan biasa gelap, tombol dipaksa putih */
        a:not(.nav-link):not(.dropdown-item):not([target="_blank"]) { color: ${lightPalette.linkText} !important; }
        a.btn { color: #ffffff !important; }
        .detail-btn { color: #ffffff !important; }

        .pro-user-name, .pro-user-name i, .nav-link, .dropdown-item, .user-box a, .user-box .dropdown-toggle { color: ${lightPalette.primaryText} !important; }
        .breadcrumb-item.active, .breadcrumb-item+.breadcrumb-item::before { color: ${lightPalette.secondaryText} !important; }

        .card, .card-body, .card-header {
            background-color: ${lightPalette.secondaryBg} !important;
            color: ${lightPalette.primaryText} !important;
            border: none !important;
            border-radius: 12px !important;
        }
        .modal-content, .dropdown-menu {
            background-color: ${lightPalette.secondaryBg} !important;
            color: ${lightPalette.primaryText} !important;
            border-color: ${lightPalette.primaryBorder} !important;
            border-radius: 12px !important;
        }
        .row:has(.page-title-box) { margin-bottom: 0.5rem !important; }
        .info-card-custom, .password-card { box-shadow: none !important; transition: none !important; }
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
        body:not([data-leftbar-size='condensed']) .logo-box .logo-lg { display: flex !important; justify-content: center !important; align-items: center !important; width: 100% !important; }
        #side-menu li a { color: ${lightPalette.primaryText} !important; }
        #side-menu li a.active, #side-menu li a:hover {
            background-color: #e7e7e7ff !important;
            color: #1e1e1e !important;
        }
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
        .info-section span[style*="background"] {
            background: ${lightPalette.tertiaryBg} !important;
            color: ${lightPalette.primaryText} !important;
        }
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

        .kendaraan-card-custom, .announcement-card-custom, .password-card {
            background-color: ${lightPalette.secondaryBg} !important;
            border: none !important;
        }
        .kendaraan-item-custom, .announcement-item-custom {
            border-bottom: 1px solid ${lightPalette.primaryBorder} !important;
        }
        .announcement-title-custom { color: ${lightPalette.linkText} !important; }

        .biodata-nav .nav-link, .nav-pills .nav-link {
            transform: none !important;
            transition: all 0.2s ease !important;
            background-color: ${lightPalette.secondaryBg} !important;
            border: 1px solid ${lightPalette.primaryBorder} !important;
            margin-bottom: 5px !important;
            margin-right: 5px !important;
            border-radius: 8px !important;
        }
        .biodata-nav .nav-link.active, .nav-pills .nav-link.active {
            background-color: ${lightPalette.primaryAccent} !important;
            color: #fff !important;
            border-color: ${lightPalette.primaryAccent} !important;
        }

        .card.border-top,
        .card.border-primary,
        .card.border-2,
        .card.shadow,
        .card-body.border-top,
        .widget-rounded-circle .card-body {
            border: none !important;
            box-shadow: none !important;
        }

        .select2-container--default .select2-selection--single {
            background-color: ${lightPalette.tertiaryBg} !important;
            border: 1px solid ${lightPalette.primaryBorder} !important;
            height: 38px !important;
            display: flex !important;
            align-items: center !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: normal !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 36px !important;
        }

        .badge.bg-primary {
            background-color: ${lightPalette.primaryAccent} !important;
            color: #fff !important;
        }
        .badge.bg-success {
            background-color: #d1e7dd !important;
            color: #0f5132 !important;
            border: 1px solid #badbcc !important;
        }
        .badge.badge-soft-success {
            background-color: #d1e7dd !important;
            color: #0f5132 !important;
        }
    `;

    // =========================================================================
    // 2. TEMA
    // =========================================================================

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


    // =========================================================================
    // 3. FITUR: AUTO FIX DASHBOARD N/A (Sekarang kompatibel dgn Firefox)
    // =========================================================================

    async function fixDashboardData() {
        if (!window.location.pathname.includes('/dashboard/dashboard-akademik')) return;

        // 1. Fix Status Lunas & Semester Visual
        const statusHeader = Array.from(document.querySelectorAll('h5')).find(el => /Status Registrasi/i.test(el.textContent));
        if (statusHeader) {
            const card = statusHeader.closest('.card');
            const semEl = card.querySelector('h6.fw-semibold');
            const badge = card.querySelector('.badge');

            // Ubah tulisan Error jadi Semester berjalan
            if (semEl && semEl.textContent.trim() === "Error") semEl.textContent = "2025/2026 Genap";

            // Ubah Belum Lunas jadi Lunas
            if (badge && badge.textContent.includes("Belum Lunas")) {
                badge.textContent = "Lunas"; badge.className = "badge text-bg-success";
            }
        }

        // 2. Fetch & Suntik Jadwal yang N/A
        const table = document.querySelector('.table-modern-custom');
        if (!table) return;
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        // Cek kalau beneran ada yang N/A (pakai textContent agar aman di Firefox)
        if (!rows.some(r => r.textContent.includes('N/A'))) return;

        try {
            // Ngambil data ke URL Jadwal diem-diem
            const res = await fetch('https://siakang.untirta.ac.id/jadwal_perkuliahan');
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const scheduleMap = new Map();

            // Scrape/nyontek dari hasil fetch halaman jadwal (pakai textContent untuk Firefox)
            doc.querySelectorAll('.card, .modern-card').forEach(card => {
                const title = card.querySelector('h5')?.textContent.trim();
                const jam = card.querySelector('.bi-clock')?.parentElement.textContent.replace(/\s+/g, ' ').trim();
                const ruang = card.querySelector('.bi-geo-alt')?.parentElement.textContent.replace(/\s+/g, ' ').trim();
                if (title) scheduleMap.set(title, { jam, ruang });
            });

            // Timpa N/A di tabel dashboard pakai data yang udah dicontek
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


    // =========================================================================
    // 4. FITUR: SCHEDULE SORTER (Anti Flicker + Kompatibel Firefox)
    // =========================================================================

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

            // Anti Flicker Logic: Hanya pindahkan DOM jika urutannya salah
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


    // =========================================================================
    // 5. FITUR: VIEW PERSISTENCE (Anti 404 Livewire)
    // =========================================================================

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

        const checkReady = setInterval(() => {
            if (typeof window.Livewire !== 'undefined') {
                clearInterval(checkReady);
                setTimeout(applyView, 300);
            }
        }, 100);

        setTimeout(() => clearInterval(checkReady), 5000);
    }


    // =========================================================================
    // 6. FITUR: QR PRESENSI DRAG & DROP / PASTE
    // =========================================================================

    function initQRPresensi() {
        if (!window.location.href.includes('/presensi-mahasiswa')) return;

        const check = setInterval(() => {
            const scanBtn = document.getElementById('btn-scan');
            if (scanBtn) {
                clearInterval(check);
                if (document.getElementById('btn-upload-qr')) return;

                const statusValue = document.getElementById('status-card-value')?.textContent?.trim().toLowerCase();
                const actionTitle = document.getElementById('scan-action-title')?.textContent?.trim().toLowerCase();
                const isAlreadyPresensi = scanBtn.disabled || statusValue === 'sudah' || actionTitle?.includes('sudah presensi');
                if (isAlreadyPresensi) {
                    return;
                }

                // 1. Suntikkan UI Modal ke dalam Body
                const modalHtml = `
                    <div id="qr-modal-overlay">
                        <div class="card shadow-lg" style="width: 90%; max-width: 450px;">
                            <div class="card-body p-4 text-center">
                                <h4 class="fw-bold mb-1">Upload QR Presensi</h4>
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

                // 2. Siapkan Variabel DOM
                const overlay = document.getElementById('qr-modal-overlay');
                const dropZone = document.getElementById('qr-drop-zone');
                const fileInput = document.getElementById('qr-file-input');
                const closeBtn = document.getElementById('btn-close-qr-modal');

                // 3. Buat Tombol Utama Pemicu Modal
                const upBtn = document.createElement('button');
                upBtn.id = 'btn-upload-qr';
                upBtn.className = 'btn btn-warning btn-lg fw-semibold ms-2';
                upBtn.innerHTML = '<i class="bi bi-file-earmark-image me-2"></i>Upload QR';
                upBtn.onclick = () => { overlay.style.display = 'flex'; }; // Munculkan Modal

                // Masukkan tombol ke sebelah tombol "Scan"
                scanBtn.parentNode.appendChild(upBtn);

                // 4. Event Listeners untuk Modal & Drag Drop
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

                // 5. Event Listener untuk Paste (Clipboard)
                document.addEventListener('paste', (e) => {
                    // Hanya izinkan paste jika modal upload sedang terbuka
                    if (overlay.style.display === 'flex') {
                        const items = e.clipboardData.items;
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].type.indexOf('image') !== -1) {
                                const blob = items[i].getAsFile();
                                overlay.style.display = 'none'; // Tutup modal
                                processQR(blob); // Proses gambar
                                break;
                            }
                        }
                    }
                });

                // 6. Event jika user klik manual pakai explorer
                fileInput.onchange = e => {
                    if (e.target.files[0]) {
                        overlay.style.display = 'none';
                        processQR(e.target.files[0]);
                        fileInput.value = ''; // Reset input file
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

    function searchTextForCSRF(html) {
        const patterns = [
            /csrfToken\s*[:=]\s*["']([^"']+)["']/i,
            /csrf_token\s*[:=]\s*["']([^"']+)["']/i,
            /XSRF_TOKEN\s*[:=]\s*["']([^"']+)["']/i,
            /_token\s*[:=]\s*["']([^"']+)["']/i,
            /window\.Laravel\s*=\s*\{[^}]*csrfToken\s*:\s*["']([^"']+)["']/i,
            /window\.csrfToken\s*=\s*["']([^"']+)["']/i,
            /window\.XSRF_TOKEN\s*=\s*["']([^"']+)["']/i,
            /"_token"\s*:\s*"([^"]+)"/i,
            /"csrf_token"\s*:\s*"([^"]+)"/i,
            /name\s*=\s*['"]_token['"]\s+value\s*=\s*['"]([^'"]+)['"]/i,
            /name\s*=\s*['"]csrf_token['"]\s+value\s*=\s*['"]([^'"]+)['"]/i,
            /name\s*=\s*['"]csrf-token['"]\s+value\s*=\s*['"]([^'"]+)['"]/i
        ];
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match?.[1]) {
                return match[1];
            }
        }
        return null;
    }

    function getCSRFTokenSource() {
        const meta = document.querySelector('meta[name="csrf-token"], meta[name="csrf_token"]');
        if (meta?.getAttribute('content')) {
            return { token: meta.getAttribute('content'), source: 'meta' };
        }

        const tokenInput = document.querySelector('input[name="_token"], input[name="csrf_token"], input[name="csrf-token"], input[name="token"]');
        if (tokenInput?.value) {
            return { token: tokenInput.value, source: 'input' };
        }

        const hiddenToken = Array.from(document.querySelectorAll('input[type="hidden"]')).find(input => /csrf|_token|token/i.test(input.name));
        if (hiddenToken?.value) {
            return { token: hiddenToken.value, source: 'hidden-input' };
        }

        const scriptToken = searchTextForCSRF(Array.from(document.scripts).map(s => s.textContent).join('\n'));
        if (scriptToken) {
            return { token: scriptToken, source: 'script' };
        }

        const pageToken = searchTextForCSRF(document.documentElement.innerHTML);
        if (pageToken) {
            return { token: pageToken, source: 'page-html' };
        }

        const cookieToken = (() => {
            const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/i);
            return match ? decodeURIComponent(match[1]) : null;
        })();
        if (cookieToken) {
            return { token: cookieToken, source: 'cookie' };
        }

        if (typeof window.Laravel === 'object' && window.Laravel.csrfToken) {
            return { token: window.Laravel.csrfToken, source: 'window.Laravel.csrfToken' };
        }
        if (window.csrfToken) {
            return { token: window.csrfToken, source: 'window.csrfToken' };
        }
        if (window.XSRF_TOKEN) {
            return { token: window.XSRF_TOKEN, source: 'window.XSRF_TOKEN' };
        }
        if (window.Livewire?.csrf) {
            return { token: window.Livewire.csrf, source: 'window.Livewire.csrf' };
        }
        if (window.livewireScriptConfig?.csrf) {
            return { token: window.livewireScriptConfig.csrf, source: 'window.livewireScriptConfig.csrf' };
        }

        return null;
    }

    async function fetchCSRFTokenFromPage(url) {
        try {
            const res = await fetch(url, { method: 'GET', credentials: 'same-origin' });
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const meta = doc.querySelector('meta[name="csrf-token"], meta[name="csrf_token"]');
            if (meta?.getAttribute('content')) {
                return { token: meta.getAttribute('content'), source: 'fetched-meta' };
            }

            const tokenInput = doc.querySelector('input[name="_token"], input[name="csrf_token"], input[name="csrf-token"], input[name="token"]');
            if (tokenInput?.value) {
                return { token: tokenInput.value, source: 'fetched-input' };
            }

            const hiddenToken = Array.from(doc.querySelectorAll('input[type="hidden"]')).find(input => /csrf|_token|token/i.test(input.name));
            if (hiddenToken?.value) {
                return { token: hiddenToken.value, source: 'fetched-hidden-input' };
            }

            const scriptToken = searchTextForCSRF(html);
            if (scriptToken) {
                return { token: scriptToken, source: 'fetched-script' };
            }
        } catch (error) {
            console.warn('Failed to fetch CSRF token from page', error);
        }

        return null;
    }

    async function submitPresensi(token) {
        const pelaksanaanId = document.getElementById('pelaksanaan-id')?.value || '';
        const urlParams = new URLSearchParams(window.location.search);
        const jadwalId = urlParams.get('jadwal_id') || '';
        const url = `https://siakang.untirta.ac.id/presensi-mahasiswa/store?jadwal_id=${jadwalId}`;

        const cookieToken = (() => {
            const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/i);
            return match ? decodeURIComponent(match[1]) : null;
        })();
        let csrfSource = getCSRFTokenSource();

        if (!csrfSource || csrfSource.source === 'cookie') {
            const fetchedSource = await fetchCSRFTokenFromPage(window.location.href);
            if (fetchedSource?.token) {
                csrfSource = fetchedSource;
            }
        }

        if (!csrfSource) {
            console.warn('CSRF token lookup failed', {
                cookie: document.cookie,
                meta: document.querySelector('meta[name="csrf-token"], meta[name="csrf_token"]'),
                tokenInput: document.querySelector('input[name="_token"], input[name="csrf_token"], input[name="csrf-token"], input[name="token"]')
            });
            alert("Sistem tidak dapat menemukan Token Keamanan (CSRF). Silakan refresh halaman ini lalu coba lagi.");
            return;
        }

        const isCookieSource = csrfSource.source === 'cookie';
        console.log('CSRF token source', csrfSource, { cookieToken, isCookieSource });

        const sendPresensi = async (source, allowRetry) => {
            const isCookieOnly = source.source === 'cookie';
            const csrf = source.token;
            const useXsrfHeader = Boolean(cookieToken);
            const formData = new FormData();
            formData.append('token', token);
            if (pelaksanaanId) formData.append('pelaksanaan_kuliah_id', pelaksanaanId);
            if (!isCookieOnly && !useXsrfHeader) {
                formData.append('_token', csrf);
            }

            const headers = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            };
            if (!isCookieOnly && !useXsrfHeader) {
                headers['X-CSRF-TOKEN'] = csrf;
            }
            if (useXsrfHeader) {
                headers['X-XSRF-TOKEN'] = cookieToken;
            }

            const response = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                headers,
                body: formData
            });

            const text = await response.text();
            console.log('Presensi store response', { status: response.status, body: text });

            if (response.status === 419 && allowRetry) {
                const refreshed = await fetchCSRFTokenFromPage(window.location.href);
                if (refreshed?.token) {
                    return sendPresensi(refreshed, false);
                }
            }

            let json = null;
            try {
                json = text ? JSON.parse(text) : null;
            } catch (parseError) {
                console.warn('Failed to parse presensi response JSON', parseError, text);
            }

            if (response.status === 419) {
                alert("Sesi Anda telah kedaluwarsa (Error 419). Halaman akan dimuat ulang otomatis untuk mendapatkan sesi baru.");
                location.reload();
                return;
            }

            if (json?.success) {
                location.reload();
            } else {
                alert("Gagal: " + (json?.message || 'Token tidak valid.'));
            }
        };

        sendPresensi(csrfSource, true).catch(err => {
            console.error("Fetch error:", err);
            alert("Error koneksi saat mengirim data presensi.");
        });
    }

    // =========================================================================
    // 7. FUNGSI UTILITAS & LAYOUT
    // =========================================================================

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

    // =========================================================================
    // 8. INISIALISASI UTAMA
    // =========================================================================

    function runPageSpecificScripts() {
        redirectAfterLogin();
        highlightActiveSidebarLink();
        fixKendaraanWidget();
        adjustCustomLayout();

        // Panggil Fix Dashboard N/A secara global, dia akan mengecek jalurnya sendiri
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
