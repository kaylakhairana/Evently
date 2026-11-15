# ✨ Evently — Modern Event Planner Platform

**Evently** adalah platform web event planner modern, minimalis, dan elegan yang dirancang untuk membantu pengguna merencanakan berbagai jenis acara (pernikahan, ulang tahun, seminar/corporate, konser, perayaan hari jadi, dan lainnya) secara rapi, efisien, dan menyenangkan.

---

## 🎨 Desain & Estetika
- **Palet Warna Modern & Aesthetic**:
  - Dominan Putih (`#FFFFFF`, `#F9FAFD`)
  - Lavender & Soft Purple (`#EDE9FE`, `#DDD6FE`, `#8B5CF6`, `#7C3AED`)
  - Baby Blue (`#E0F2FE`, `#BAE6FD`, `#38BDF8`, `#0284C7`)
  - Deep Indigo text (`#1E1B4B`)
- **UI/UX Elegan & Bersih**:
  - Glassmorphism navigation bar dengan efek blur (`backdrop-filter`)
  - Card rounded dengan bayangan bertingkat yang lembut (*soft shadows*)
  - Tipografi modern menggunakan font Google **Outfit** dan **Plus Jakarta Sans**
  - Transisi halus dan micro-interactions pada tombol, progress bar, dan checkbox
- **Responsif Penuh**:
  - Tampilan optimal baik di layar laptop/desktop maupun smartphone (HP) dengan sidebar drawer adaptif.
- **Dukungan 2 Bahasa (Bilingual)**:
  - Tersedia pilihan Bahasa Indonesia (🇮🇩) dan English (🇬🇧) dengan toggle instan di sidebar.

---

## 🚀 Fitur Utama

### 1. Dashboard Ringkasan Acara
- **Hero Banner Acara Aktif**: Menampilkan nama acara, kategori, tanggal, waktu, lokasi, target tamu, dan **hitungan mundur (*countdown timer*)** dinamis ("X hari lagi", "Hari-H", atau "Selesai").
- **4 Kartu Statistik Finansial & Kesiapan**:
  - **Total Anggaran**: Pagu alokasi dana dan jumlah pos pengeluaran.
  - **Pengeluaran Real**: Akumulasi biaya yang sudah dikeluarkan dilengkapi persentase dan progress bar.
  - **Sisa Dana**: Sisa anggaran dengan indikator status otomatis (*Aman*, *Mendekati Batas*, atau *Defisit*).
  - **Progress Persiapan**: Rasio tugas checklist yang telah diselesaikan (persentase & jumlah tugas).
- **Aksi Cepat (*Quick Actions*)**: Pintasan satu klik untuk mencatat pengeluaran, menambah to-do checklist, menambah agenda rundown, atau membuat acara baru.
- **Tugas Kritis Terdekat**: Daftar tugas prioritas tinggi yang belum selesai dengan checkbox instan langsung dari dashboard.
- **Highlight Rundown Hari-H**: Menampilkan agenda kegiatan terdekat.
- **Distribusi Pengeluaran**: Visualisasi persentase penggunaan dana per kategori (Venue, Katering, Dekorasi, dll).

### 2. Manajemen Multi-Acara (Kelola Acara)
- Menyimpan dan mengelola lebih dari satu acara sekaligus.
- Pembuat acara baru (*Create New Event Modal*) dengan form lengkap:
  - Nama acara, kategori (Pernikahan, Ulang Tahun, Corporate, Konser, Pesta, dll)
  - Pilihan tema warna (*Lavender Dream*, *Sky Horizon*, *Velvet Pastel*)
  - Tanggal & waktu mulai
  - Estimasi jumlah tamu & target total anggaran
  - Lokasi & deskripsi konsep
- Ganti acara aktif (*Set Active Event*) secara instan dari dropdown sidebar maupun halaman Kelola Acara.
- Edit dan Hapus acara dengan modal konfirmasi aman.

### 3. Budget Planner (Pencatatan Anggaran & Pengeluaran)
- Ringkasan total alokasi, realisasi pengeluaran, sisa dana, dan persentase terpakai dengan alert otomatis jika *over budget*.
- Tabel data pengeluaran terstruktur:
  - Nama pengeluaran / vendor
  - Kategori biaya (Venue, Katering, Dekorasi, Busana & MUA, Foto & Video, Hiburan, Souvenir, Logistik, Promosi, Tak Terduga)
  - Biaya estimasi vs realisasi aktual
  - Status pembayaran dengan badge warna (*Lunas*, *DP / Uang Muka*, *Belum Dibayar*)
  - Catatan pembayaran & nomor invoice/kontak vendor
- **Filter & Pencarian**: Filter berdasarkan status pembayaran (*Semua*, *Lunas*, *DP*, *Belum Dibayar*) dan input pencarian real-time.
- **Export Data**: Fitur **Export CSV** untuk backup ke Excel/Google Sheets dan fitur **Cetak / PDF** yang rapi.
- Dukungan konversi mata uang fleksibel (**IDR** dan **USD**).

### 4. Checklist Persiapan Acara (Task Tracker)
- **Progress Bar Kesiapan**: Indikator persentase penyelesaian keseluruhan tugas dengan ucapan selamat saat mencapai 100%.
- **Quick Add Inline**: Tambahkan to-do list baru secara cepat hanya dengan mengetik dan menekan tombol Enter.
- Pengelompokan tugas berdasarkan tahapan persiapan:
  - **H-90**: Persiapan Awal
  - **H-30**: 1 Bulan Sebelumnya
  - **H-7**: 1 Minggu Terakhir
  - **Hari-H**: D-Day Execution
  - **Pasca Acara**: Serah terima & evaluasi
- Label prioritas tugas (*Tinggi/Urgent*, *Sedang*, *Rendah*), PIC (penanggung jawab), dan batas waktu target (*due date*).
- Checkbox interaktif dengan animasi coret (*strikethrough*) dan pembaruan progress instan.
- Filter tugas (*Semua*, *Belum Selesai*, *Selesai*) dan fitur pencarian tugas.

### 5. Timeline / Rundown Acara
- Penyusunan jadwal kegiatan hari-H menit demi menit.
- Tampilan timeline visual vertikal dengan titik simpul (*nodes*) dan kartu kegiatan.
- Setiap agenda mencakup:
  - Waktu mulai & selesai
  - Nama kegiatan / sesi
  - Area / lokasi (Panggung, Ruang Rias, Foyer, dll)
  - Penanggung Jawab / PIC (MC, Tim MUA, EO, dll)
  - Instruksi teknis / brief detail kegiatan
- Filter pencarian kegiatan dan selector hari (*Hari 1* / *Hari 2*).
- Tombol **Cetak Rundown** berformat bersih khusus cetak fisik untuk dibagikan kepada panitia/vendor di lapangan.

---

## 📁 Struktur Berkas

```
Evently/
├── index.html            # Markup semantik antarmuka utama & seluruh modal dialog
├── css/
│   └── style.css         # Design system, CSS variables, layout, komponen, responsif & print style
├── js/
│   ├── i18n.js           # Mesin translasi bilingual (Bahasa Indonesia & English)
│   ├── store.js          # State management, LocalStorage persistence, & sample data loader
│   └── app.js            # Controller UI, event listeners, filter, modal, kalkulasi & toast
└── README.md             # Panduan dan dokumentasi aplikasi
```

---

## 💻 Cara Menjalankan Website

Aplikasi ini dibuat murni dengan **HTML, CSS, dan JavaScript murni (Vanilla JS)** tanpa *framework build step* yang rumit, sehingga dapat langsung dijalankan di browser manapun:

1. **Buka Langsung Berkas**:
   - Klik ganda berkas `index.html` di komputer Anda, atau
   - Buka browser favorit Anda (Google Chrome, Safari, Firefox, Edge), tekan `Ctrl + O` (atau `Cmd + O` di Mac), lalu pilih berkas `index.html`.

2. **Atau Menggunakan Live Server**:
   - Jika Anda menggunakan VS Code, cukup klik kanan pada `index.html` lalu pilih **"Open with Live Server"**.
   - Atau menggunakan perintah terminal:
     ```bash
     python3 -m http.server 8000
     ```
     Lalu buka `http://localhost:8000` di browser.

---

## 💾 Penyimpanan Data Lokal
Semua data acara, pengeluaran, checklist, dan rundown disimpan secara otomatis di **LocalStorage** browser Anda. Data tidak akan hilang saat halaman dimuat ulang (*refresh*). Saat pertama kali dibuka, Evently dilengkapi dengan 3 data sampel yang realistis (Pernikahan, Konferensi Teknologi, dan Ulang Tahun) yang siap dicoba dan diedit.
