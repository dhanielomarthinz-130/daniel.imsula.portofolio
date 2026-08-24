/**
 * DANIEL IMSULA - PROFESSIONAL PORTFOLIO CONTROLLER
 * Inventory Controller & Warehouse Specialist
 */

// Global Toast Notification Helper
window.showToast = function (message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass = type === 'success' 
    ? 'fa-solid fa-circle-check text-emerald' 
    : type === 'error' 
    ? 'fa-solid fa-circle-exclamation text-pink' 
    : 'fa-solid fa-info-circle text-blue';

  toast.innerHTML = `
    <i class="${iconClass}" style="font-size: 1.1rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light)
  initThemeToggle();

  // 2. Navigation & Mobile Drawer
  initNavigation();

  // 3. Portfolio Projects & Filtering
  initPortfolioData();

  // 4. Modal Triggers (Resume & Project Detail)
  initModals();

  // 5. Contact Form Handler
  initContactForm();

  // 6. Visitor Analytics & Secret PIN (Password 0000 / Triple Click Inventory Icon)
  initVisitorAnalytics();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');
  
  const savedTheme = localStorage.getItem('portfolio_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio_theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Beralih ke Mode Gelap');
        themeToggleBtn.setAttribute('aria-label', 'Beralih ke Mode Gelap');
      }
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Beralih ke Mode Terang');
        themeToggleBtn.setAttribute('aria-label', 'Beralih ke Mode Terang');
      }
    }
  }
}

/* ==========================================================================
   2. Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar') || document.getElementById('main-navbar');
  const mobileBtn = document.getElementById('nav-toggle-btn') || document.getElementById('mobile-menu-btn');
  const navDrawer = document.getElementById('mobile-nav-drawer') || document.getElementById('nav-links');
  const navBackdrop = document.getElementById('mobile-nav-backdrop') || document.getElementById('nav-backdrop');
  const navDrawerClose = document.getElementById('mobile-nav-close') || document.getElementById('nav-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .nav-links a');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function openMobileMenu() {
    if (navDrawer) navDrawer.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'true');
      mobileBtn.classList.add('active');
    }
  }

  function closeMobileMenu() {
    if (navDrawer) navDrawer.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileBtn.classList.remove('active');
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navDrawer && navDrawer.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navDrawerClose) {
    navDrawerClose.addEventListener('click', closeMobileMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer && navDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Navbar Scroll Elevation & Active Link on Scroll
  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopLinks.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${sectionId}`) {
            l.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Portfolio Projects & Filtering
   ========================================================================== */
let allProjectsData = [
  {
    id: "sys-somethinc-qc",
    title: "IMS (Inventory Management System) Inbound QC, Batch & FEFO Control",
    category: "ims-tech",
    badge: "Developed by Daniel • Inbound QC & FEFO",
    author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
    deployedBrands: [
      { name: "Somethinc", logo: "images/logos/logo_somethinc.jpg" },
      { name: "BeautyHaul", logo: "images/logos/logo_beautyhaul.png" }
    ],
    description: "Sistem manajemen mutu penerimaan barang masuk (Inbound QC), validasi nomor batch produksi, dan kontrol otomatis alur FEFO (First Expired, First Out) produk kosmetik & skincare. Menjamin setiap batch yang masuk terverifikasi masa kadaluwarsanya dan teralokasi ke bin rak yang tepat secara otomatis.",
    image: "images/somethinc_inbound_qc_fefo.jpg",
    adminPanel: "Master data registrasi batch SKU kosmetik, ambang batas expired alert (6-12 bulan), dashboard monitoring pass/fail QC harian, persetujuan karantina batch bermasalah, dan rekapitulasi audit kepatuhan FEFO per kategori produk.",
    operatorPanel: "Scanning barcode SKU & input batch number saat receiving di area Inbound, checklist uji fisik produk kosmetik (sealing, tekstur, kemasan), penentuan status Lolos QC/Reject, dan cetak label barcode FEFO langsung via portable Bluetooth printer.",
    technologies: ["Dual Panel (Desktop Admin & Mobile PDA)", "Inbound QC Inspection", "Batch Number Tracking", "FEFO Automation", "Handheld Barcode Scanner", "Expiry Date Alert Engine", "Cosmetics Supply Chain"],
    metrics: "Zero Expired Stock Shipped • 100% Validasi Batch Number",
    problem: "Tingginya volume receiving puluhan ribu item skincare fast-moving dengan variasi nomor batch dan tanggal kadaluwarsa yang berbeda-beda, berisiko besar barang expired terdistribusi ke customer jika dicatat manual.",
    solution: "Membangun ekosistem Dual Panel: Panel Admin Desktop untuk kontrol alert expired & master batch, serta Panel PDA Inbound bagi tim QC lantai gudang untuk scan validasi batch dan penetapan status FEFO secara instan.",
    impact: "Sistem aktif digunakan di operasional Somethinc-Beautyhaul, mengeliminasi 100% risiko pengiriman produk expired, memangkas waktu inspeksi receiving hingga 50%, dan menjamin kepatuhan audit BPOM & standar mutu ritel kecantikan."
  },
  {
    id: "sys-5r",
    title: "Sistem Assign Task 5R & Briefing Tim Per Divisi (Auto Share WA)",
    category: "ai-tech",
    badge: "Developed by Daniel • Sistem 5R & Briefing",
    author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
    deployedBrands: [
      { name: "Somethinc", logo: "images/logos/logo_somethinc.jpg" },
      { name: "BeautyHaul", logo: "images/logos/logo_beautyhaul.png" },
      { name: "PT Royal Pesona Indonesia", logo: "images/logos/logo_royalpesona.jpg" }
    ],
    description: "Aplikasi delegasi tugas 5R (Ringkas, Rapi, Resik, Rawat, Rajin) dan koordinasi briefing harian tim per divisi gudang. Dilengkapi modul unggah foto bukti kerja dan auto-generate format laporan otomatis yang langsung dibagikan ke WhatsApp grup dengan rapi.",
    image: "images/system_5r_briefing.jpg",
    adminPanel: "Monitoring delegasi tugas 5R per divisi, approval validasi foto before-after, evaluasi skor kebersihan area, dan generator otomatis pesan rekapitulasi WhatsApp ke grup manajemen.",
    operatorPanel: "Checklist harian area kerja 5R per shift, ambil & unggah foto bukti kebersihan/kerapian langsung dari kamera HP, konfirmasi penyelesaian task, dan absensi briefing tim.",
    technologies: ["Dual Panel (Desktop Admin & Mobile PIC)", "Sistem 5R / 5S Lean", "Task Assignment", "Team Briefing App", "Photo Evidence Upload", "WhatsApp Web Share", "Standardized SOP Reporting"],
    metrics: "100% Kepatuhan 5R • Otomasi Laporan Foto ke WhatsApp",
    problem: "Briefing harian dan pembagian area 5R yang sering tidak terpantau pertanggungjawabannya, serta pelaporan bukti kebersihan/kerapian yang lambat dan formatnya berantakan saat dilaporkan ke manajemen.",
    solution: "Membangun arsitektur Dual Panel: Panel Admin Desktop untuk delegasi zona & rekap laporan, serta Panel PIC Mobile untuk eksekusi checklist lapangan dan upload foto before-after langsung ke WhatsApp.",
    impact: "Disiplin area kerja 5R meningkat 100%, dokumentasi kebersihan gudang tersentralisasi, dan manajemen menerima laporan foto briefing secara instan setiap pergantian shift."
  },
  {
    id: "sys-patrol",
    title: "Security Patrol Management System & Live Shift Report",
    category: "tms-logistics",
    badge: "Developed by Daniel • Security Patrol",
    author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
    deployedBrands: [
      { name: "Somethinc", logo: "images/logos/logo_somethinc.jpg" },
      { name: "BeautyHaul", logo: "images/logos/logo_beautyhaul.png" },
      { name: "PT Royal Pesona Indonesia", logo: "images/logos/logo_royalpesona.jpg" }
    ],
    description: "Sistem digital patroli keamanan fasilitas gudang & pabrik. Memandu petugas security melakukan kontrol titik pos keliling (checkpoint barcode/NFC), pencatatan insiden mobile, dan pelaporan status patroli shift secara live.",
    image: "images/system_security_patrol.jpg",
    adminPanel: "Command Center interaktif pemetaan rute patroli, monitoring status realtime pos checkpoint fasilitas gudang, log anomali/insiden keamanan, dan arsip digital serah terima shift.",
    operatorPanel: "Pemindaian barcode/NFC pada setiap titik pos keliling, input catatan kondisi/insiden disertai foto temuan, dan submit laporan patroli per shift secara live tanpa buku manual.",
    technologies: ["Dual Panel (Desktop Admin & Mobile Security)", "Security Patrol App", "Checkpoint Verification", "Live Shift Handover", "Incident Photo Report", "Facility Security Log", "Real-Time Monitoring"],
    metrics: "Zero Missed Checkpoints • Live Shift Handover Real-Time",
    problem: "Pencatatan patroli keamanan konvensional dengan buku manual yang rawan dipalsukan, titik rawan gudang yang terlewat, serta serah terima laporan shift antar petugas yang lambat.",
    solution: "Menerapkan sistem Dual Panel: Panel Admin Desktop untuk pantau seluruh rute keamanan dan Panel Security Mobile/PDA untuk verifikasi scan checkpoint serta pelaporan insiden real-time.",
    impact: "Tingkat kepatuhan rute patroli security mencapai 100%, respon penanganan anomali keamanan gudang lebih cepat, dan laporan shift terekam digital tanpa kertas."
  },
  {
    id: "sys-queue",
    title: "Sistem Antrian Serah Terima Kurir Instan (Gojek, Shopee Express, Grab)",
    category: "tms-logistics",
    badge: "Developed by Daniel • Antrian Kurir",
    author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
    deployedBrands: [
      { name: "Somethinc", logo: "images/logos/logo_somethinc.jpg" },
      { name: "BeautyHaul", logo: "images/logos/logo_beautyhaul.png" }
    ],
    description: "Sistem antrian digital serah-terima paket kurir instan dan sameday (Gojek, GoSend, Shopee Express / SPX, Grab), mengeliminasi kerumunan driver di area staging dan mempercepat waktu serah terima hingga 70%.",
    image: "images/instant_courier_queue.jpg",
    adminPanel: "Live monitor antrian slot staging kurir, manajemen nomor antrian driver (Gojek, Grab, SPX), analitik kecepatan dispatch per jam, dan rekapitulasi SLA serah terima.",
    operatorPanel: "Scan barcode resi di staging slot, verifikasi nomor slot paket kurir saat driver tiba, konfirmasi serah terima paket secara instan langsung di pos dispatch.",
    technologies: ["Dual Panel (Desktop Admin & Handheld Operator)", "Queue Management", "Gojek / Grab / SPX Flow", "Sameday Logistics", "Staging Dispatch", "Barcode Handover"],
    metrics: "-70% Waktu Tunggu Driver • Zero Staging Bottleneck",
    problem: "Penumpukan puluhan driver kurir instan di area staging gudang saat jam sibuk promo e-commerce, menyebabkan kekacauan pencarian paket dan keterlambatan pickup.",
    solution: "Menerapkan sistem Dual Panel: Panel Admin Desktop untuk alokasi slot staging dan Panel Handheld Operator untuk scan barcode resi saat kurir tiba di pos serah-terima.",
    impact: "Waktu tunggu kurir berkurang 70%, kapasitas serah terima meningkat 3x lipat, dan area staging menjadi rapi serta bebas dari bottleneck."
  },
  {
    id: "sys-opname",
    title: "System-Driven Stock Opname & Automated Reconciliation Engine",
    category: "opname",
    badge: "Developed by Daniel • Engine Stock Opname",
    author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
    deployedBrands: [
      { name: "Somethinc", logo: "images/logos/logo_somethinc.jpg" },
      { name: "BeautyHaul", logo: "images/logos/logo_beautyhaul.png" }
    ],
    description: "Sistem terotomasi untuk pelaksanaan Wall-to-Wall Stock Opname dan Cycle Count berkala. Memproses validasi hitung fisik vs saldo sistem WMS secara instan tanpa perlu olah manual di spreadsheet.",
    image: "images/stock_opname_system.jpg",
    adminPanel: "Setup master audit & cycle count, pemrosesan algoritma auto-variance matcher, visualisasi peta selisih per zona, approval penyesuaian saldo sistem, dan ekspor laporan selisih resmi.",
    operatorPanel: "Scan barcode lokasi rak/bin, scan barcode SKU produk, input jumlah hitung fisik real-time langsung di lorong gudang tanpa kertas / spreadsheet.",
    technologies: ["Dual Panel (Desktop Admin & Handheld Counter)", "Automated Reconciliation", "Stock Opname System", "Variance Matching", "WMS Realtime Sync", "Loss Prevention"],
    metrics: "Auto-Match Realtime • Zero Manual Spreadsheets",
    problem: "Proses Stock Opname konvensional yang memakan waktu berhari-hari karena rekapitulasi data fisik dilakukan manual di Excel, rawan human error, dan lambat dalam mendeteksi selisih.",
    solution: "Merancang arsitektur Dual Panel: Panel Admin Desktop untuk eksekusi algoritma auto-variance matching dan Panel Handheld PDA bagi tim counter untuk scan fisik di lorong gudang.",
    impact: "Memangkas durasi audit Stock Opname hingga 60%, laporan selisih selesai pada hari yang sama, dan akurasi data aset inventaris terjamin 100% transparan."
  },
  {
    id: "sys-ims",
    title: "Optimasi Picking Logic & Integrasi Handheld Scanner IMS",
    category: "ims-tech",
    badge: "Developed by Daniel • Handheld IMS",
    author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
    deployedBrands: [
      { name: "Somethinc", logo: "images/logos/logo_somethinc.jpg" },
      { name: "BeautyHaul", logo: "images/logos/logo_beautyhaul.png" }
    ],
    description: "Pengembangan alur pemindaian Handheld Scanner (PDA/Barcode) dan perombakan Picking Logic untuk memangkas waktu ambil barang dan menaikkan akurasi stok secara drastis dari 75% ke 99.99%+.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    adminPanel: "Manajemen gelombang pesanan (wave picking), alokasi penugasan picker per zona lorong, pemantauan backlog order, dan live SLA kecepatan picking.",
    operatorPanel: "Pemandu rute lorong terpendek (pathing), validasi scan barcode SKU wajib untuk mencegah salah ambil varian barang, dan konfirmasi penyelesaian picklist.",
    technologies: ["Dual Panel (Desktop Admin & Handheld Picker)", "Handheld Scanner", "Picking Logic", "PDA Barcode", "WMS Sync", "Zero Manual Spreadsheets"],
    metrics: "Akurasi Stok 75% ➔ 99.99%+ • Peningkatan Produktivitas Tim Picker",
    problem: "Tingginya selisih stok fisik vs sistem akibat proses picking manual yang mengandalkan kertas/spreadsheet dan sering terjadi salah ambil varian SKU kosmetik.",
    solution: "Merancang Dual Panel terintegrasi: Panel Admin Desktop untuk alokasi batch order dan Panel Handheld PDA untuk validasi scan barcode wajib saat picking di lorong rak.",
    impact: "Akurasi stok melonjak hingga 99.99%+, waktu pemenuhan pesanan lebih cepat 40%, dan kesalahan salah kirim varian barang turun hingga mendekati nol."
  },
  {
    id: "sys-tms",
    title: "Transportation Management System (TMS) & Driver Live Tracking",
    category: "tms-logistics",
    badge: "Developed by Daniel • TMS Tracking",
    author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
    deployedBrands: [
      { name: "Somethinc", logo: "images/logos/logo_somethinc.jpg" },
      { name: "BeautyHaul", logo: "images/logos/logo_beautyhaul.png" },
      { name: "PT Royal Pesona Indonesia", logo: "images/logos/logo_royalpesona.jpg" }
    ],
    description: "Sistem penjadwalan armada pengiriman barang, koordinasi rute driver, live tracking posisi armada, dan pelaporan bukti kirim digital secara mobile.",
    image: "images/tms_live_tracking.jpg",
    adminPanel: "Penjadwalan ritase armada pengiriman, optimasi rute multi-drop, monitoring GPS live tracking posisi armada di peta digital, dan verifikasi status surat jalan.",
    operatorPanel: "Panduan rute pengiriman harian pada smartphone driver, pencatatan waktu tiba di outlet/cabang, dan upload foto bukti serah terima (e-POD / tanda tangan digital).",
    technologies: ["Dual Panel (Desktop Admin & Mobile Driver)", "TMS Logistics", "Live Tracking GPS", "Delivery Scheduling", "Mobile Driver Report", "Fleet Dispatch"],
    metrics: "100% Visibilitas Pengiriman • On-Time Delivery Terpantau",
    problem: "Sulitnya memonitor status kiriman barang antar cabang/outlet dan estimasi waktu sampai driver yang sering tidak akurat.",
    solution: "Membangun sistem Dual Panel: Panel Admin Desktop untuk manajemen rute & live dispatch, serta Panel Driver Mobile untuk navigasi dan upload bukti e-POD langsung dari HP.",
    impact: "Tingkat ketepatan waktu pengiriman meningkat drastis, keterlambatan terpantau secara proaktif, dan rekonsiliasi surat jalan selesai pada hari yang sama."
  },
  {
    id: "sys-ai",
    title: "Penerapan AI untuk Analisis Discrepancy & Otomasi SOP Gudang",
    category: "ai-tech",
    badge: "Integrasi AI • Discrepancy & SOP",
    author: "Penerapan & Integrasi Tools AI Modern",
    description: "Implementasi ekosistem AI, BI & no-code modern (ChatGPT, Gemini, Claude, Antigravity IDE, Google Stitch, OpenClaw, Google Apps Script, AppSheet, & Looker Studio) untuk analisis anomali selisih stok, pembuatan SOP operasional otomatis, dan otomasi visual workflow data gudang.",
    image: "images/ai_warehouse_analytics.jpg",
    adminPanel: "Dashboard eksekutif Looker Studio, formulasi prompt analisis 5-Why RCA menggunakan Claude/ChatGPT, ekstraksi data OpenClaw, dan pembuatan SOP digital otomatis.",
    operatorPanel: "Form digital AppSheet / Mobile Web untuk input cepat anomali barang rusak/selisih langsung dari lantai gudang serta akses instan panduan SOP interaktif.",
    technologies: ["Dual Panel (Desktop Admin & Mobile AppSheet)", "ChatGPT", "Google Gemini", "Claude", "Antigravity IDE", "Google Stitch", "OpenClaw", "Google Apps Script", "AppSheet", "Looker Studio"],
    metrics: "Analisis RCA Otomatis • Pembuatan SOP 5x Lebih Cepat",
    problem: "Proses pembuatan Standard Operating Procedure (SOP), pelaporan investigasi 5-Why RCA, dan audit data selisih stok yang menyita banyak waktu jika disusun secara manual.",
    solution: "Mengembangkan ekosistem Dual Panel dengan bantuan AI: Dashboard Desktop untuk analisis RCA mendalam dan Form Mobile AppSheet untuk input data anomali langsung oleh tim lapangan.",
    impact: "Efisiensi administrasi meningkat 500%, SOP operasional terdokumentasi presisi, dan mitigasi selisih stok tertangani dengan standar analisa terdepan."
  },
  {
    id: "inv-1",
    title: "Setup WMS & Transformasi Akurasi Stok 99.85% di Somethinc",
    category: "accuracy",
    badge: "Studi Kasus • Somethinc Beautyhaul",
    author: "Studi Kasus & Eksekusi Lapangan",
    description: "Kolaborasi aktif bersama Tim Tech dalam perancangan & setup sistem WMS baru, restrukturisasi Cycle Count rutin, dan pengendalian ketat FEFO produk kosmetik.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    technologies: ["Setup WMS", "Kolaborasi Tim Tech", "Cycle Count", "FEFO System Control", "Omnichannel Fulfillment", "RCA 5-Why"],
    metrics: "Akurasi Stok 99.85% • Sukses Implementasi WMS",
    problem: "Kebutuhan sistem pergudangan modern (WMS) yang presisi untuk menangani puluhan ribu SKU produk kecantikan fast-moving di channel online & retail tanpa risiko selisih stok.",
    solution: "Berkolaborasi langsung dengan Tim Tech dalam merumuskan kebutuhan alur operasional gudang, konfigurasi modul WMS, testing UAT, implementasi live, serta penegakan disiplin Cycle Count & FEFO.",
    impact: "Sistem WMS sukses go-live 100%, akurasi stok konsisten di 99.85%, dan dianugerahi penghargaan 'The Best Admin Excentric'."
  },
  {
    id: "inv-2",
    title: "Administrasi Spare Part, Transfer Stock Produksi & Stock Opname",
    category: "opname",
    badge: "Studi Kasus • PT Aditya Manufaktur",
    author: "Studi Kasus & Eksekusi Lapangan",
    description: "Pengelolaan administrasi spare part mesin manufaktur, eksekusi receipt barang masuk, transfer stock sesuai rencana produksi, monitoring buffer stock, hingga dipromosikan ke Supervisor Warehouse.",
    image: "images/sparepart_warehouse_mgmt.jpg",
    technologies: ["Administrasi Spare Part", "Receipt & Inbound", "Control Stock Suku Cadang", "Transfer Stock Produksi", "Stock Opname"],
    metrics: "Promosi ke Supervisor • Nol Downtime Mesin Produksi",
    problem: "Kritisnya ketersediaan spare part mesin manufaktur dan risiko terhentinya lini produksi jika suplai suku cadang terlambat atau terjadi selisih stok fisik.",
    solution: "Menerapkan sistem administrasi receipt barang masuk yang ketat, kontrol buffer stock spare part, transfer stock terencana sesuai jadwal produksi, dan eksekusi Stock Opname berkala.",
    impact: "Ketersediaan suku cadang mesin tercapai 100% tanpa delay produksi, selisih stok spare part terkendali, dan kinerja diakui dengan promosi jabatan menjadi Supervisor Warehouse."
  },
  {
    id: "inv-3",
    title: "Inbound, Transaksi Produksi Assy & Wall-to-Wall Stock Opname",
    category: "opname",
    badge: "Studi Kasus • PT Kirin Dinamika Sentosa",
    author: "Studi Kasus & Eksekusi Lapangan",
    description: "Pengelolaan administrasi Inbound receiving material, pencatatan transaksi mutasi material untuk perakitan produksi (Assy), pengendalian stok harian, dan eksekusi Wall-to-Wall Stock Opname.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
    technologies: ["Inbound Receiving", "Transaksi Produksi Assy", "Stock Control", "Wall-to-Wall Opname", "Shrinkage Reduction"],
    metrics: "Varians < 0.05% • 100% Suplai Assy Tepat Waktu",
    problem: "Kebutuhan suplai komponen tepat waktu untuk jalur perakitan (Assy) serta tantangan rekonsiliasi selisih stok material pada audit tutup buku pabrik.",
    solution: "Menerapkan administrasi Inbound terintegrasi, verifikasi fisik berkala, standardisasi pencatatan pengeluaran barang ke jalur perakitan produksi, serta skema hitung ganda Stock Opname.",
    impact: "Kelancaran suplai komponen ke lini perakitan (Assy) terjamin 100%, selisih varians stok ditekan hingga < 0.05%, dan administrasi pergudangan terekam akurat."
  }
];

async function initPortfolioData() {
  initProjectFilters();
  try {
    const res = await fetch('data/portfolio.json');
    if (res.ok) {
      const json = await res.json();
      if (json.projects && json.projects.length) {
        allProjectsData = json.projects;
      }
    }
  } catch (err) {
    console.log('Using local fallback data.');
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-grid-container');
  if (!container) return;

  container.innerHTML = projects.map(proj => {
    const isCaseStudy = proj.badge && proj.badge.includes('Studi Kasus');
    const isAi = proj.id === 'sys-ai' || (proj.badge && proj.badge.includes('Integrasi AI'));
    const isSelfMade = !isCaseStudy && !isAi;

    let pillClass = 'pill-self-made';
    let badgeIcon = '<i class="fa-solid fa-code"></i> ';
    let authorClass = 'author-self';
    let authorIcon = '<i class="fa-solid fa-laptop-code"></i> ';

    if (isCaseStudy) {
      pillClass = 'pill-case-study';
      badgeIcon = '<i class="fa-solid fa-building"></i> ';
      authorClass = 'author-case';
      authorIcon = '<i class="fa-solid fa-briefcase"></i> ';
    } else if (isAi) {
      pillClass = 'pill-ai';
      badgeIcon = '<i class="fa-solid fa-brain"></i> ';
      authorClass = 'author-ai';
      authorIcon = '<i class="fa-solid fa-wand-magic-sparkles"></i> ';
    }

    if (proj.companyLogo) {
      badgeIcon = `<img src="${proj.companyLogo}" alt="Logo" style="width: 17px; height: 17px; border-radius: 4px; object-fit: contain; background: #ffffff; padding: 1px; vertical-align: middle; margin-right: 5px;" />`;
      authorIcon = `<img src="${proj.companyLogo}" alt="Logo" style="width: 16px; height: 16px; border-radius: 3px; object-fit: contain; background: #ffffff; padding: 1px; vertical-align: middle; margin-right: 5px;" />`;
    }

    return `
    <div class="project-card" data-category="${proj.category}">
      <div class="project-image-wrapper">
        <img src="${proj.image}" alt="${proj.title}" loading="lazy" onerror="this.src='images/instant_courier_queue.jpg'" />
        <span class="project-badge-pill ${pillClass}">
          ${badgeIcon}${proj.badge || 'Sistem Inovasi'}
        </span>
      </div>
      <div class="project-body">
        ${proj.author ? `
          <div class="project-author-badge ${authorClass}">
            ${authorIcon}<span>${proj.author}</span>
          </div>
        ` : ''}
        <h3>${proj.title}</h3>
        
        ${proj.adminPanel && proj.operatorPanel ? `
          <div class="project-dual-panels">
            <span class="panel-chip"><i class="fa-solid fa-desktop text-blue"></i> <strong>Desktop:</strong> Admin</span>
            <span class="panel-chip"><i class="fa-solid fa-mobile-screen text-emerald"></i> <strong>Mobile/PDA:</strong> PIC/Operator</span>
          </div>
        ` : ''}

        <p>${proj.description}</p>
        
        <div class="project-tech-tags">
          ${proj.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        ${proj.metrics ? `
          <div class="project-metrics-badge">
            <i class="fa-solid fa-chart-line"></i> ${proj.metrics}
          </div>
        ` : ''}

        ${proj.deployedBrands && proj.deployedBrands.length ? `
          <div class="project-deployed-brands">
            <span class="deployed-tag-label"><i class="fa-solid fa-circle-check text-emerald"></i> Sedang Aktif Digunakan di:</span>
            <div class="deployed-brand-logos">
              ${proj.deployedBrands.map(b => `
                <div class="deployed-logo-badge" title="${b.name}">
                  <img src="${b.logo}" alt="Logo ${b.name}" />
                  <span>${b.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="project-footer-links">
          <button class="project-link-btn" onclick="openProjectModal('${proj.id}')">
            <span>Lihat Detail &amp; Solusi Sistem</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const cards = document.querySelectorAll('#projects-grid-container .project-card');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

window.openProjectModal = function (projectId) {
  const project = allProjectsData.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('project-detail-modal');
  const modalContent = document.getElementById('project-modal-content');
  if (!modal || !modalContent) return;

  const isCaseStudy = project.badge && project.badge.includes('Studi Kasus');
  const isAi = project.id === 'sys-ai' || (project.badge && project.badge.includes('Integrasi AI'));
  const isSelfMade = !isCaseStudy && !isAi;

  const roleText = isSelfMade 
    ? 'Perancang Alur & Pengembang Sistem Mandiri (Full In-House Development by Daniel Imsula)'
    : (isAi ? 'Penerapan & Integrasi Tools AI Modern untuk Efisiensi Logistik' : 'Kolaborasi & Eksekusi Operasional Pergudangan Lapangan');

  modalContent.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <span class="section-badge" style="margin-bottom: 0.5rem;">
        ${project.companyLogo ? `<img src="${project.companyLogo}" alt="Logo" style="width: 18px; height: 18px; border-radius: 4px; object-fit: contain; background: #ffffff; padding: 1px; vertical-align: middle; margin-right: 5px;" />` : '<i class="fa-solid fa-trophy"></i>'} 
        ${project.badge}
      </span>
      <h2 style="font-size: 1.5rem; line-height: 1.3; margin-top: 0.25rem;">${project.title}</h2>
    </div>

    <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem; max-height: 240px;">
      <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>

    <div style="display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.94rem; color: var(--text-secondary);">
      <div style="background: var(--bg-tertiary); padding: 0.85rem 1rem; border-radius: var(--radius-sm); border-left: 3px solid ${isSelfMade ? 'var(--accent-emerald)' : (isAi ? 'var(--accent-indigo)' : 'var(--accent-blue)')};">
        <span style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">
          <i class="fa-solid fa-user-check"></i> Status Kepemilikan &amp; Peran:
        </span>
        <strong style="color: var(--text-primary); font-size: 0.92rem;">${roleText}</strong>
      </div>

      ${project.adminPanel && project.operatorPanel ? `
        <div class="modal-dual-panels-box">
          <h4 style="color: var(--text-primary); margin-bottom: 0.75rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.45rem;">
            <i class="fa-solid fa-layer-group text-emerald"></i> Arsitektur 2 Panel (Dual-Panel Interface)
          </h4>
          <div class="dual-panel-columns">
            <div class="panel-col panel-col-admin">
              <div class="panel-header"><i class="fa-solid fa-desktop text-blue"></i> <strong>Panel Admin (Desktop PC / Web)</strong></div>
              <p>${project.adminPanel}</p>
            </div>
            <div class="panel-col panel-col-operator">
              <div class="panel-header"><i class="fa-solid fa-mobile-screen text-emerald"></i> <strong>Panel PIC / Operator (Mobile / Handheld PDA)</strong></div>
              <p>${project.operatorPanel}</p>
            </div>
          </div>
        </div>
      ` : ''}

      <div>
        <h4 style="color: var(--text-primary); margin-bottom: 0.35rem;"><i class="fa-solid fa-triangle-exclamation text-amber"></i> Latar Belakang & Tantangan</h4>
        <p>${project.problem || project.description}</p>
      </div>

      <div>
        <h4 style="color: var(--text-primary); margin-bottom: 0.35rem;"><i class="fa-solid fa-lightbulb text-emerald"></i> Solusi & Implementasi</h4>
        <p>${project.solution || project.description}</p>
      </div>

      <div>
        <h4 style="color: var(--text-primary); margin-bottom: 0.35rem;"><i class="fa-solid fa-chart-line text-blue"></i> Dampak & Hasil Nyata</h4>
        <p><strong style="color: var(--text-primary);">${project.impact || project.metrics}</strong></p>
      </div>

      <div>
        <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-tags text-emerald"></i> Ruang Lingkup & Teknologi</h4>
        <div class="project-tech-tags">
          ${(project.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      ${project.deployedBrands && project.deployedBrands.length ? `
        <div class="modal-deployment-box">
          <h4 style="color: var(--text-primary); margin-bottom: 0.55rem; font-size: 0.92rem; display: flex; align-items: center; gap: 0.45rem;">
            <i class="fa-solid fa-building-circle-check text-emerald"></i> Perusahaan yang Sedang Menjalankan Sistem Ini:
          </h4>
          <div class="deployed-brand-logos">
            ${project.deployedBrands.map(b => `
              <div class="deployed-logo-badge">
                <img src="${b.logo}" alt="Logo ${b.name}" />
                <span>${b.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

/* ==========================================================================
   4. Modal Management (Resume, Project Details, PIN & Analytics)
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resume-modal');
  const projectModal = document.getElementById('project-detail-modal');
  const adminPinModal = document.getElementById('admin-pin-modal');
  const adminAnalyticsModal = document.getElementById('admin-analytics-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtns = document.querySelectorAll('.modal-close-trigger');

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Close when clicking modal backdrop
  [resumeModal, projectModal, adminPinModal, adminAnalyticsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  function closeAllModals() {
    if (resumeModal) resumeModal.classList.remove('open');
    if (projectModal) projectModal.classList.remove('open');
    if (adminPinModal) adminPinModal.classList.remove('open');
    if (adminAnalyticsModal) adminAnalyticsModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   5. Contact Form Submission & Lead Capture
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  const targetEmail = 'dhanielo.marthinz@gmail.com';
  const targetWhatsApp = '6282210703118';

  // Email Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Tawaran Kerja / Penawaran Kerjasama Daniel Imsula';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Harap lengkapi nama, email, dan pesan Anda.', 'error');
      return;
    }

    // Capture into Analytics Leads
    if (typeof window.captureContactInquiry === 'function') {
      window.captureContactInquiry({
        name: name,
        email: email,
        subject: subject,
        message: message,
        company: 'Formulir Penawaran Web'
      });
    }

    const submitBtn = document.getElementById('contact-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Membuka Email...';
    submitBtn.disabled = true;

    const emailBody = `Halo Daniel Imsula,\n\nNama Pengirim: ${name}\nEmail Pengirim: ${email}\nSubjek: ${subject}\n\nPesan:\n${message}\n\n--\nDikirim melalui Formulir Penawaran Portofolio Daniel Imsula`;
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      showToast(`Pesan dialihkan ke email ${targetEmail}. Terima kasih Bapak/Ibu ${name}!`, 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 600);
  });

  // WhatsApp Submit Handler
  const waBtn = document.getElementById('contact-whatsapp-btn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim() || 'Tawaran Kerja / Penawaran Kerjasama';
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !message) {
        showToast('Harap isi minimal Nama dan Isi Pesan Anda untuk chat WhatsApp.', 'error');
        return;
      }

      // Capture into Analytics Leads
      if (typeof window.captureContactInquiry === 'function') {
        window.captureContactInquiry({
          name: name,
          email: email || 'via WhatsApp Chat',
          subject: subject,
          message: message,
          phone: '082210703118',
          company: 'WhatsApp Lead'
        });
      }

      const waText = `*Halo Daniel Imsula,*\n\n*Nama:* ${name}\n*Email:* ${email || '-'}\n*Subjek:* ${subject}\n\n*Pesan:*\n${message}`;
      const waUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(waText)}`;

      window.open(waUrl, '_blank');
      showToast(`Membuka WhatsApp ke nomor 082210703118. Terima kasih Bapak/Ibu ${name}!`, 'success');
    });
  }
}

/* ==========================================================================
   6. Visitor Intelligence & Secret PIN Access (Password: 0000)
   ========================================================================== */
function initVisitorAnalytics() {
  const adminPinModal = document.getElementById('admin-pin-modal');
  const adminAnalyticsModal = document.getElementById('admin-analytics-modal');
  const pinDots = [
    document.getElementById('p-dot-0'),
    document.getElementById('p-dot-1'),
    document.getElementById('p-dot-2'),
    document.getElementById('p-dot-3')
  ];
  const pinErrorMsg = document.getElementById('pin-error-msg');
  const keyBtns = document.querySelectorAll('.pin-key-btn');

  let currentPin = '';
  const SECRET_PIN = '0000';

  // Storage Key (Version 2 - Pure Real Analytics)
  const STORAGE_KEY = 'daniel_portfolio_analytics_real_v2';
  try {
    localStorage.removeItem('daniel_portfolio_analytics_v1');
  } catch (e) {}

  let analyticsData = loadAnalyticsData();

  // Log current session visit
  recordCurrentVisit();

  // --- Triple Click Detection on Inventory Logo (Header & Footer) ---
  let clickCount = 0;
  let clickTimer = null;
  const triggerElements = [
    document.querySelector('.nav-logo-badge'),
    document.getElementById('header-inventory-logo'),
    document.getElementById('footer-inventory-logo'),
    document.querySelector('.footer-brand .nav-logo-badge'),
    document.querySelector('.footer-brand')
  ].filter(Boolean);

  triggerElements.forEach(el => {
    el.addEventListener('click', (e) => {
      clickCount++;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 1800);
      } else if (clickCount >= 3) {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(clickTimer);
        clickCount = 0;
        openPinOrDashboard();
      }
    });
  });

  // --- Global Keyboard Shortcut (Typing 0000) ---
  let typedKeys = '';
  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    if (e.key >= '0' && e.key <= '9') {
      typedKeys += e.key;
      if (typedKeys.endsWith('0000')) {
        typedKeys = '';
        openPinOrDashboard();
      }
      if (typedKeys.length > 8) {
        typedKeys = typedKeys.slice(-4);
      }
    }
  });

  function openPinOrDashboard() {
    if (sessionStorage.getItem('admin_authenticated') === 'true') {
      openAnalyticsDashboard();
    } else {
      openPinModal();
    }
  }

  function openPinModal() {
    currentPin = '';
    updatePinDots();
    if (pinErrorMsg) pinErrorMsg.textContent = '';
    if (adminPinModal) {
      adminPinModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function updatePinDots() {
    pinDots.forEach((dot, idx) => {
      if (dot) {
        if (idx < currentPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      }
    });
  }

  function verifyPin() {
    if (currentPin === SECRET_PIN) {
      sessionStorage.setItem('admin_authenticated', 'true');
      if (pinErrorMsg) pinErrorMsg.textContent = '';
      if (adminPinModal) adminPinModal.classList.remove('open');
      showToast('Akses Pemilik Diterima. Membuka Dashboard Analitik.', 'success');
      setTimeout(() => {
        openAnalyticsDashboard();
      }, 200);
    } else {
      if (pinErrorMsg) pinErrorMsg.textContent = 'Password Salah! Masukkan 0000';
      const pinContainer = document.getElementById('pin-dots-display');
      if (pinContainer) {
        pinContainer.style.animation = 'shake 0.4s ease';
        setTimeout(() => { pinContainer.style.animation = ''; }, 400);
      }
      currentPin = '';
      updatePinDots();
    }
  }

  // Keypad clicks
  keyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (key === 'clear') {
        currentPin = '';
        updatePinDots();
      } else if (key === 'backspace') {
        currentPin = currentPin.slice(0, -1);
        updatePinDots();
      } else if (key && currentPin.length < 4) {
        currentPin += key;
        updatePinDots();
        if (currentPin.length === 4) {
          setTimeout(verifyPin, 150);
        }
      }
    });
  });

  // Physical keyboard when pin modal is open
  document.addEventListener('keydown', (e) => {
    if (!adminPinModal || !adminPinModal.classList.contains('open')) return;

    if (e.key >= '0' && e.key <= '9' && currentPin.length < 4) {
      currentPin += e.key;
      updatePinDots();
      if (currentPin.length === 4) {
        setTimeout(verifyPin, 150);
      }
    } else if (e.key === 'Backspace') {
      currentPin = currentPin.slice(0, -1);
      updatePinDots();
    }
  });

  // --- Analytics Dashboard Renderer ---
  function openAnalyticsDashboard() {
    analyticsData = loadAnalyticsData();
    renderAnalyticsUI();
    if (adminAnalyticsModal) {
      adminAnalyticsModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function renderAnalyticsUI() {
    const totalVisitsEl = document.getElementById('kpi-total-visits');
    const uniqueVisitsEl = document.getElementById('kpi-unique-visitors');
    const topRegionEl = document.getElementById('kpi-top-region');
    const totalInquiriesEl = document.getElementById('kpi-total-inquiries');
    const tabInquiriesCount = document.getElementById('tab-inquiries-count');

    // Calculate dynamic top region from real logs
    let topRegion = '-';
    if (analyticsData.visitorLogs && analyticsData.visitorLogs.length > 0) {
      const counts = {};
      analyticsData.visitorLogs.forEach(l => {
        const reg = l.region ? l.region.replace(/🇮🇩|🌐/g, '').trim() : 'Lokal';
        counts[reg] = (counts[reg] || 0) + 1;
      });
      topRegion = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '-');
    }

    if (totalVisitsEl) totalVisitsEl.textContent = (analyticsData.totalVisits || 0).toLocaleString();
    if (uniqueVisitsEl) uniqueVisitsEl.textContent = (analyticsData.uniqueVisitors || 0).toLocaleString();
    if (topRegionEl) topRegionEl.textContent = topRegion;
    if (totalInquiriesEl) totalInquiriesEl.textContent = (analyticsData.inquiryLogs || []).length;
    if (tabInquiriesCount) tabInquiriesCount.textContent = (analyticsData.inquiryLogs || []).length;

    renderVisitorTable(analyticsData.visitorLogs || []);
    renderInquiriesList(analyticsData.inquiryLogs || []);
    renderGeoAndDevices(analyticsData.visitorLogs || []);
  }

  function renderVisitorTable(logs) {
    const tbody = document.getElementById('visitor-table-body');
    const counter = document.getElementById('visitor-records-counter');
    if (!tbody) return;

    if (counter) counter.textContent = `Menampilkan ${logs.length} data kunjungan nyata`;

    if (!logs || logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            <i class="fa-solid fa-users-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.4;"></i>
            Belum ada kunjungan. Kunjungan baru dari pengunjung nyata akan tercatat otomatis di sini.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = logs.map(log => `
      <tr>
        <td><strong>${log.time}</strong></td>
        <td><i class="fa-solid fa-location-dot text-emerald"></i> ${log.region}</td>
        <td><i class="${(log.device || '').includes('Mobile') ? 'fa-solid fa-mobile-screen text-emerald' : 'fa-solid fa-desktop text-blue'}"></i> ${log.device}</td>
        <td><i class="fa-brands fa-chrome"></i> ${log.browser}</td>
        <td><span class="badge-status-pill" style="font-size: 0.72rem; padding: 0.18rem 0.55rem; background: rgba(16,185,129,0.12); color: #10b981;">${log.action}</span></td>
      </tr>
    `).join('');
  }

  function renderInquiriesList(inquiries) {
    const container = document.getElementById('inquiries-container');
    if (!container) return;

    if (!inquiries || inquiries.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.8rem 1rem; color: var(--text-muted);">
          <i class="fa-regular fa-envelope-open" style="font-size: 2.5rem; margin-bottom: 0.75rem; display: block; opacity: 0.4;"></i>
          Belum ada pesan / email penawaran yang masuk.<br />
          <span style="font-size: 0.83rem; opacity: 0.85; margin-top: 0.35rem; display: inline-block;">Pesan nyata yang dikirim pengunjung melalui formulir kontak atau WhatsApp akan otomatis tercatat di sini.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = inquiries.map(inq => `
      <div class="inquiry-card-item">
        <div class="inquiry-header-row">
          <span class="inquiry-sender-name">
            <i class="fa-solid fa-user-check text-emerald"></i> ${inq.name}
          </span>
          <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); background: var(--bg-tertiary); padding: 0.2rem 0.6rem; border-radius: var(--radius-full);">
            <i class="fa-regular fa-clock"></i> ${inq.time}
          </span>
        </div>

        <div class="inquiry-meta-row">
          <span><i class="fa-regular fa-envelope text-blue"></i> <strong>${inq.email}</strong></span>
          ${inq.phone && inq.phone !== '-' ? `<span><i class="fa-brands fa-whatsapp text-emerald"></i> <a href="https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #25D366;">${inq.phone}</a></span>` : ''}
          ${inq.company ? `<span><i class="fa-solid fa-building text-amber"></i> ${inq.company}</span>` : ''}
          <span><i class="fa-solid fa-location-dot text-pink"></i> ${inq.region || 'Jabodetabek'}</span>
        </div>

        ${inq.subject ? `<div style="font-size: 0.88rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-primary);">Subjek: ${inq.subject}</div>` : ''}
        <div class="inquiry-msg-box">
          "${inq.message}"
        </div>
      </div>
    `).join('');
  }

  function renderGeoAndDevices(logs) {
    const geoContainer = document.getElementById('geo-distribution-container');
    const deviceContainer = document.getElementById('device-distribution-container');

    if (!logs || logs.length === 0) {
      if (geoContainer) {
        geoContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.88rem;"><i class="fa-solid fa-earth-asia" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.4;"></i>Belum ada data wilayah pengunjung.</div>';
      }
      if (deviceContainer) {
        deviceContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.88rem;"><i class="fa-solid fa-laptop" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.4;"></i>Belum ada data perangkat pengunjung.</div>';
      }
      return;
    }

    const total = logs.length;

    // Real dynamic region breakdown
    if (geoContainer) {
      const regCounts = {};
      logs.forEach(l => {
        const reg = l.region || 'Lokal / Lainnya';
        regCounts[reg] = (regCounts[reg] || 0) + 1;
      });

      const sortedRegions = Object.entries(regCounts)
        .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }))
        .sort((a, b) => b.percent - a.percent);

      geoContainer.innerHTML = sortedRegions.map(r => `
        <div class="geo-progress-row">
          <div class="geo-progress-label">
            <span>${r.name}</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">${r.percent}%</span>
          </div>
          <div class="geo-progress-bar-bg">
            <div class="geo-progress-bar-fill" style="width: ${r.percent}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // Real dynamic device breakdown
    if (deviceContainer) {
      let desktopCount = 0;
      let mobileCount = 0;
      logs.forEach(l => {
        if ((l.device || '').includes('Mobile')) mobileCount++;
        else desktopCount++;
      });

      const desktopPct = Math.round((desktopCount / total) * 100);
      const mobilePct = 100 - desktopPct;

      deviceContainer.innerHTML = `
        <div class="geo-progress-row">
          <div class="geo-progress-label">
            <span><i class="fa-solid fa-desktop text-blue"></i> Desktop (Windows / Mac PC)</span>
            <span style="color: var(--text-primary); font-weight: 700;">${desktopPct}%</span>
          </div>
          <div class="geo-progress-bar-bg">
            <div class="geo-progress-bar-fill" style="width: ${desktopPct}%; background: linear-gradient(90deg, #38BDF8, #818CF8);"></div>
          </div>
        </div>
        <div class="geo-progress-row">
          <div class="geo-progress-label">
            <span><i class="fa-solid fa-mobile-screen text-emerald"></i> Mobile Smartphone (Android / iOS)</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">${mobilePct}%</span>
          </div>
          <div class="geo-progress-bar-bg">
            <div class="geo-progress-bar-fill" style="width: ${mobilePct}%; background: linear-gradient(90deg, #10B981, #34D399);"></div>
          </div>
        </div>
      `;
    }
  }

  // --- Tab Navigation inside Analytics Modal ---
  const tabBtns = document.querySelectorAll('.analytics-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.analytics-tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // --- Search Input Filter ---
  const searchInput = document.getElementById('visitor-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = analyticsData.visitorLogs.filter(log => 
        log.region.toLowerCase().includes(query) ||
        log.device.toLowerCase().includes(query) ||
        log.browser.toLowerCase().includes(query) ||
        log.time.toLowerCase().includes(query)
      );
      renderVisitorTable(filtered);
    });
  }

  // --- Reset Analytics Button ---
  const resetBtn = document.getElementById('btn-reset-analytics');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mereset seluruh data kunjungan dan email ke 0?')) {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem('visited_session');
        analyticsData = getDefaultAnalyticsData();
        recordCurrentVisit();
        renderAnalyticsUI();
        showToast('Data analitik berhasil direset ke 0 (kunjungan asli dimulai).', 'info');
      }
    });
  }

  // --- Lock Button ---
  const lockBtn = document.getElementById('btn-lock-analytics');
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_authenticated');
      if (adminAnalyticsModal) adminAnalyticsModal.classList.remove('open');
      document.body.style.overflow = '';
      showToast('Dashboard terkunci kembali.', 'info');
    });
  }

  // --- Export CSV Button ---
  const exportBtn = document.getElementById('btn-export-analytics');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Kategori,Waktu,Nama/IP,Email/Daerah,Perusahaan/Perangkat,Pesan/Aksi\n";

      analyticsData.inquiryLogs.forEach(i => {
        csvContent += `"LEAD","${i.time}","${i.name}","${i.email}","${i.company || '-'}","${(i.message || '').replace(/"/g, '""')}"\n`;
      });

      analyticsData.visitorLogs.forEach(v => {
        csvContent += `"VISIT","${v.time}","${v.region}","${v.device}","${v.browser}","${v.action}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Visitor_Analytics_Daniel_Imsula_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('File CSV berhasil di-download.', 'success');
    });
  }

  // --- Storage Helper Functions ---
  function getDefaultAnalyticsData() {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      topRegion: '-',
      visitorLogs: [],
      inquiryLogs: []
    };
  }

  function loadAnalyticsData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return getDefaultAnalyticsData();
  }

  function saveAnalyticsData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyticsData));
    } catch (e) {}
  }

  function recordCurrentVisit() {
    const isNewSession = !sessionStorage.getItem('visited_session');
    if (isNewSession) {
      sessionStorage.setItem('visited_session', 'true');
      analyticsData.totalVisits = (analyticsData.totalVisits || 0) + 1;
      analyticsData.uniqueVisitors = (analyticsData.uniqueVisitors || 0) + 1;

      // Detect Device & OS
      const ua = navigator.userAgent;
      let device = 'Desktop (Windows)';
      if (/Android/i.test(ua)) device = 'Mobile (Android)';
      else if (/iPhone|iPad|iPod/i.test(ua)) device = 'Mobile (iOS iPhone)';
      else if (/Macintosh|Mac OS X/i.test(ua)) device = 'Desktop (Mac OS)';

      // Detect Browser
      let browser = 'Chrome';
      if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
      else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
      else if (ua.indexOf('Edg') > -1) browser = 'Edge';

      const now = new Date();
      const timeStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + 
        ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      let detectedRegion = 'Jakarta / Tangerang, Indonesia 🇮🇩';
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Jakarta')) detectedRegion = 'Jakarta / Banten, Indonesia 🇮🇩';
      else if (tz.includes('Makassar') || tz.includes('Pontianak')) detectedRegion = 'Indonesia Bagian Tengah 🇮🇩';

      const newLog = {
        time: timeStr,
        region: detectedRegion,
        device: device,
        browser: browser,
        action: 'Kunjungan Halaman Portofolio'
      };

      analyticsData.visitorLogs.unshift(newLog);
      if (analyticsData.visitorLogs.length > 50) {
        analyticsData.visitorLogs.pop();
      }

      saveAnalyticsData();

      // Async IP Geo check without blocking
      fetch('https://api.country.is/')
        .then(res => res.json())
        .then(data => {
          if (data && data.country) {
            newLog.region = data.country === 'ID' ? 'Jakarta / Tangerang, Indonesia 🇮🇩' : `${data.country} Global Visitor 🌐`;
            saveAnalyticsData();
          }
        })
        .catch(() => {});
    }
  }

  // Global helper to capture new contact form inquiries
  window.captureContactInquiry = function (inquiry) {
    const now = new Date();
    const timeStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + 
      ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    analyticsData.inquiryLogs.unshift({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || '-',
      company: inquiry.company || 'Perusahaan Pengirim',
      region: inquiry.region || 'Jakarta / Tangerang 🇮🇩',
      subject: inquiry.subject,
      message: inquiry.message,
      time: timeStr
    });

    saveAnalyticsData();
  };
}

