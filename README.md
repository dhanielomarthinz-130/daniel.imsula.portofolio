# 🚀 Developer Portfolio & NoteJS Studio (Node.js)

Website Portofolio Developer Modern berestetika tinggi (Ultra-Modern Glassmorphism & High-Contrast Cyber Dark Theme) yang didukung oleh backend **Node.js REST API** serta dilengkapi dengan fitur interaktif **NoteJS Studio** untuk pencatatan dan manajemen snippet kode.

---

## ✨ Fitur Utama

- 🎨 **Ultra-Modern Glassmorphism UI**: Desain gelap futuristik dengan aksen neon (Electric Indigo, Cyan, Emerald), kartu transparan blur (*backdrop-filter*), border gradien berpendar, dan transisi mulus.
- 🌓 **Dark & Light Mode Switcher**: Dukungan tema ganda dengan penyimpanan preferensi otomatis di LocalStorage.
- ⚡ **Node.js REST API Backend**:
  - `GET /api/profile` — Mengambil data profil, bio, dan keahlian developer.
  - `GET /api/projects?category=all` — Mengambil daftar proyek dengan filter dinamis.
  - `GET /api/notes` — Mengambil semua catatan / code snippet NoteJS.
  - `POST /api/notes` — Membuat catatan baru ke server JSON storage.
  - `PUT /api/notes/:id` — Mengubah / menyematkan (pin) catatan.
  - `DELETE /api/notes/:id` — Menghapus catatan.
  - `POST /api/contact` — Menerima formulir pesan kontak.
  - `GET /api/health` — Status kesehatan dan uptime server.
- 📝 **Live Interactive Feature: NoteJS Studio**:
  - Dukungan format: **Markdown Text**, **Code Snippet**, dan **Plain Text**.
  - Syntax code highlighting & copy-to-clipboard instan dengan notifikasi toast.
  - Tag kategori & filter pencarian realtime.
  - Ekspor catatan ke file format JSON.
- 📱 **100% Responsif & Mobile-Friendly**: Tampilan fleksibel untuk desktop, tablet, maupun smartphone dengan navigasi mobile menu.
- 📄 **Resume / CV Modal**: Pratinjau CV profesional langsung dengan tombol cetak/simpan PDF.
- 🔄 **Hybrid Resilience**: Bekerja maksimal dengan server Node.js, dan otomatis beralih ke penyimpanan client (*LocalStorage*) jika dibuka langsung melalui browser tanpa server aktif.

---

## 📁 Struktur Direktori

```text
portfolio-nodejs/
├── server.js               # Backend HTTP Server & REST API (Zero-dependency Node.js)
├── package.json            # Konfigurasi proyek & skrip npm
├── README.md               # Dokumentasi lengkap
├── data/
│   ├── portfolio.json      # Data profil, bio, skills, dan proyek
│   ├── notes.json          # Data catatan NoteJS
│   └── messages.json       # Penyimpanan pesan dari formulir kontak
└── public/
    ├── index.html          # Halaman utama aplikasi
    ├── css/
    │   └── style.css       # Design system, glassmorphism, dan animasi
    └── js/
        ├── app.js          # Controller UI, scroll spy, tema, dan fetch API
        └── notes-module.js # Modul interaktif NoteJS Studio
```

---

## 🛠️ Cara Menjalankan

### Cara 1: Menggunakan Node.js (Direkomendasikan)
1. Buka terminal pada folder proyek:
   ```bash
   cd C:\Users\IEG\.gemini\antigravity-ide\scratch\portfolio-nodejs
   ```
2. Jalankan server:
   ```bash
   node server.js
   ```
   *(atau `npm start` jika npm tersedia)*
3. Buka browser pada alamat:
   ```text
   http://localhost:3000
   ```

### Cara 2: Membuka Langsung di Browser (Tanpa Server)
Anda juga dapat membuka berkas `public/index.html` langsung dengan klik dua kali di File Explorer atau browser pilihan Anda. Sistem secara otomatis menggunakan penyimpanan client-side.

---

## ✏️ Cara Kustomisasi Data Portofolio

Cukup edit file `data/portfolio.json`:
- Ubah nama, jabatan, email, lokasi, dan link sosial media di objek `profile`.
- Sesuaikan skill dan persentase di array `skills`.
- Tambahkan atau ubah portofolio proyek di array `projects`.

---

## 💼 Menjadikan Active Workspace di Antigravity IDE

Untuk kenyamanan pengembangan di Antigravity IDE:
1. Buka menu **File** > **Open Folder...** (atau tekan `Ctrl + K, Ctrl + O`).
2. Pilih folder: `C:\Users\IEG\.gemini\antigravity-ide\scratch\portfolio-nodejs`.
