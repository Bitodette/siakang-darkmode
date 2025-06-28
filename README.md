# Siakang Custom Dark Mode (Tampermonkey UserScript)

**Siakang Custom Dark Mode** adalah userscript Tampermonkey yang menerapkan tema gelap kustom dengan tampilan lebih modern dan rapi untuk [Siakang Untirta](https://siakang.untirta.ac.id/). Script ini melakukan penyesuaian warna secara menyeluruh pada antarmuka, menyembunyikan elemen yang mengganggu, serta mengingat preferensi sidebar agar pengalaman pengguna lebih nyaman.

---

## Fitur

- 🌑 **Tema Gelap Menyeluruh**  
  Mengubah seluruh tampilan Siakang ke mode dark yang konsisten, termasuk latar, teks, tabel, navbar, sidebar, dialog, hingga tombol dan pagination.
- 🧹 **UI Lebih Bersih**  
  Menyembunyikan beberapa menu dan elemen seperti menu "System Setting", opsi "Ubah Bahasa", serta foto profil mahasiswa di navbar.
- 🧠 **Sidebar Pintar**  
  Preferensi ukuran sidebar (penuh atau condensed) otomatis disimpan dan diterapkan kembali saat reload halaman.
- 🗄️ **Tabel Lebih Nyaman Dibaca**  
  Tabel dan datatables tampil gelap, rapi, serta warna baris selang-seling.
- 🎛️ **Penyesuaian Otomatis**  
  Script tetap berjalan walau ada perubahan DOM (AJAX, SPA, dsb).

---

## Cara Instalasi

1. **Pasang [Tampermonkey](https://tampermonkey.net/)**  
   Install ekstensi Tampermonkey di browser Anda.

2. **Install Script**  
   - Klik [di sini untuk install](https://github.com/Bitodette/siakang-darkmode/raw/main/siakang-custom-darkmode.user.js) (atau copy kode pada file `siakang-custom-darkmode.user.js` ke Tampermonkey).
   - Pastikan script aktif untuk domain: `https://siakang.untirta.ac.id/*`.

3. **Refresh Siakang**  
   Setelah script aktif, refresh halaman Siakang. Tema gelap akan langsung diterapkan.

---

## Perhatian & Catatan

- Script ini **tidak mengubah/memodifikasi data** apapun di Siakang, hanya mengubah tampilan di sisi browser Anda.
- Jika ada elemen yang tidak tampil sempurna, silakan laporkan melalui [issue GitHub](https://github.com/Bitodette/siakang-darkmode/issues) atau hubungi penulis.

---

## Cuplikan Kode Utama

```javascript
// ==UserScript==
// @name          Siakang Custom Dark Mode
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   Menerapkan tema gelap kustom untuk Siakang Untirta dengan UI yang lebih rapi.
// @author        Bitodette
// @match         https://siakang.untirta.ac.id/*
// @grant         GM_addStyle
// @run-at        document-start
// ==/UserScript==

// ... (lihat file utama untuk kode lengkap)
```

---

## Kontribusi

Masukan, saran, atau pull request sangat diterima!  
Jangan ragu untuk fork repository ini dan submit perubahan.

---