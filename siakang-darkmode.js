// ==UserScript==
// @name         Siakang Dark Mode
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Dark Mode untuk Siakang Untirta.
// @author       Bitodette
// @match        https://siakang.untirta.ac.id/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://siakang.untirta.ac.id/myunnes/images/logo/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/544583/Siakang%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/544583/Siakang%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Palette
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

        /* Hide Flag Menu */
        #sidebar-menu .menu-title.side-menu-list:last-of-type,
        li.topbar-dropdown:has(img[src*="/images/flags/"]) { display: none !important; }

        /* Custom Logo Font */
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

        /* Flatten Cards */
        .modern-card, .modern-card:hover { background: none !important; box-shadow: none !important; transform: none !important; }
        .modern-card::before { display: none !important; }

        .card, .card-body, .card-header, .modern-card, .widget-rounded-circle .card-body, .tab-card, .info-card-custom, .password-card {
            border: none !important;
            box-shadow: none !important;
        }

        /* Mobile Logo Fix */
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
    `;

    // Dark Mode
    const darkModeCss = `
        body, html, #wrapper, .content-page, .content { background-color: ${darkPalette.primaryBg} !important; color: ${darkPalette.primaryText} !important; }

        /* Card Text Color Fix */
        .card .text-dark,
        .card h5.text-dark,
        .card .fw-semibold.text-dark {
            color: ${darkPalette.primaryText} !important;
        }

        /* Welcome card — perbaikan darkmode:
           - Judul welcome: biru (sama seperti accent)
           - Role/level: putih (readable)
           - Icon juga dibuat accent supaya konsisten */
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

        /* ApexCharts Tooltip Fix */
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

        /* Kendaraan & Widget Fixes */
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

        /* Icon Wrappers */
        .icon-wrapper-custom, .icon-wrapper {
            background-color: ${darkPalette.tertiaryBg} !important;
        }
        .password-card .icon-wrapper.bg-warning {
            background-color: ${darkPalette.tertiaryBg} !important;
        }
        .password-card .icon-wrapper .text-warning {
            color: ${darkPalette.primaryText} !important;
        }

        /* Dashboard Status Icons */
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

        /* Alerts */
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

        /* Accents & Text Colors */
        .text-primary, .bi-laptop, .bi-code-slash, .bi-qr-code, .bi-clock, .bi-people, .bi-person {
            color: ${darkPalette.primaryAccent} !important;
        }

        /* Buttons */
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

        /* Biodata Tabs & Nav Pills */
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

        /* Borders & Opacity */
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

        /* Form & Select2 */
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

        /* Badges */
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

        /* Tables */
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

        /* Modals */
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

        /* Pagination */
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

    // Light Mode
    const lightModeCss = `
        body, html, #wrapper, .content-page, .content { background-color: ${lightPalette.primaryBg} !important; color: ${lightPalette.primaryText} !important; }

        /* Card Text Fix */
        .card .text-dark,
        .card h5.text-dark,
        .card .fw-semibold.text-dark {
            color: ${lightPalette.primaryText} !important;
        }

        .text-muted, .sub-header { color: ${lightPalette.secondaryText} !important; }
        a:not(.nav-link):not(.dropdown-item):not([target="_blank"]) { color: ${lightPalette.linkText} !important; }
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
        .detail-btn {
            color: #ffffff !important;
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

        /* Widget Fixes Light */
        .kendaraan-card-custom, .announcement-card-custom, .password-card {
            background-color: ${lightPalette.secondaryBg} !important;
            border: none !important;
        }
        .kendaraan-item-custom, .announcement-item-custom {
            border-bottom: 1px solid ${lightPalette.primaryBorder} !important;
        }
        .announcement-title-custom { color: ${lightPalette.linkText} !important; }

        /* Biodata Tabs Light */
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

        /* Flatten Cards Light */
        .card.border-top,
        .card.border-primary,
        .card.border-2,
        .card.shadow,
        .card-body.border-top,
        .widget-rounded-circle .card-body {
            border: none !important;
            box-shadow: none !important;
        }

        /* Select2 Fixes Light */
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

        /* Badges Light */
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

    // Schedule Sorting
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

		items.forEach(it => container.appendChild(it.element));
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

function initViewPersistence() {
        const VIEW_KEY = 'siakang_schedule_last_view';
        const setupViewToggle = () => {
            const listViewButton = document.querySelector("button[x-on\\:click*='card']");
            const calendarViewButton = document.querySelector("button[x-on\\:click*='calendar']");
            if (listViewButton && calendarViewButton) {
                const savedView = localStorage.getItem(VIEW_KEY);
                if (savedView === 'card' && !listViewButton.classList.contains('active')) {
                    listViewButton.click();
                }
                if (savedView === 'calendar' && !calendarViewButton.classList.contains('active')) {
                    calendarViewButton.click();
                }
                listViewButton.addEventListener('click', () => localStorage.setItem(VIEW_KEY, 'card'));
                calendarViewButton.addEventListener('click', () => localStorage.setItem(VIEW_KEY, 'calendar'));
                return true;
            }
            return false;
        };
        setTimeout(setupViewToggle, 200);
    }

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

    // Fix Kendaraan Widget Layout
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
        // Responsive Layout Adjustments
        const applyTrenStatusAndAnnouncementSizing = () => {
            const isMobile = window.matchMedia('(max-width: 767.98px)').matches;

            /* Tren Indeks Prestasi */
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

            /* Status Registrasi */
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

            /* Announcement (Pengumuman) */
            const announcementCol = (function(){
                const byClass = document.querySelector('.announcement-card-custom')?.closest('[class*="col-"]');
                if (byClass) return byClass;
                const header = Array.from(document.querySelectorAll('h5')).find(el => /Pengumuman/i.test(el.textContent));
                return header ? header.closest('[class*="col-"]') : null;
            })();

            if (announcementCol) {
                announcementCol.classList.remove(
                    'col-lg-12','col-md-12','col-12',
                    'col-lg-6','col-md-4','col-lg-8','col-md-6'
                );

                if (isMobile) {
                    announcementCol.classList.add('col-lg-6', 'col-md-4');
                    announcementCol.classList.remove('col-12', 'col-md-12');
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

    function runPageSpecificScripts() {
        redirectAfterLogin();
        highlightActiveSidebarLink();
        fixKendaraanWidget();
        adjustCustomLayout();

        if (window.location.href.includes('/jadwal_perkuliahan')) {
            forceListViewOnMobile();
            initScheduleSorter();
            initViewPersistence();
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

        sidebarObserver.observe(body, {
            attributes: true,
            attributeFilter: ['data-leftbar-size']
        });
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