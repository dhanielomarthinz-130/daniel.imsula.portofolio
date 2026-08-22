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
let allProjectsData = [];

async function initPortfolioData() {
  try {
    const res = await fetch('data/portfolio.json');
    if (res.ok) {
      const json = await res.json();
      allProjectsData = json.projects || [];
      renderProjects(allProjectsData);
      initProjectFilters();
      return;
    }
  } catch (err) {
    console.log('Fetching portfolio.json fallback.');
  }

  // Fallback if fetch is unavailable
  allProjectsData = [
    {
      id: "sys-queue",
      title: "Sistem Antrian Serah Terima Kurir Instan (Gojek, Shopee Express, Grab)",
      category: "tms-logistics",
      badge: "Developed by Daniel • Antrian Kurir",
      author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
      description: "Sistem antrian digital serah-terima paket kurir instan dan sameday (Gojek, GoSend, Shopee Express / SPX, Grab), mengeliminasi kerumunan driver di area staging dan mempercepat waktu serah terima hingga 70%.",
      image: "images/instant_courier_queue.jpg",
      technologies: ["Queue Management", "Gojek / Grab / SPX Flow", "Sameday Logistics", "Staging Dispatch", "Barcode Handover"],
      metrics: "-70% Waktu Tunggu Driver • Zero Staging Bottleneck",
      problem: "Penumpukan puluhan driver kurir instan di area staging gudang saat jam sibuk promo e-commerce, menyebabkan kekacauan pencarian paket dan keterlambatan pickup.",
      solution: "Menerapkan sistem antrian berbasis pemindaian nomor resi dan penomoran slot staging sehingga paket langsung siap saat kurir tiba di pos serah-terima.",
      impact: "Waktu tunggu kurir berkurang 70%, kapasitas serah terima meningkat 3x lipat, dan area staging menjadi rapi serta bebas dari bottleneck."
    },
    {
      id: "sys-opname",
      title: "System-Driven Stock Opname & Automated Reconciliation Engine",
      category: "opname",
      badge: "Developed by Daniel • Engine Stock Opname",
      author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
      description: "Sistem terotomasi untuk pelaksanaan Wall-to-Wall Stock Opname dan Cycle Count berkala. Memproses validasi hitung fisik vs saldo sistem WMS secara instan tanpa perlu olah manual di spreadsheet.",
      image: "images/stock_opname_system.jpg",
      technologies: ["Automated Reconciliation", "Stock Opname System", "Variance Matching", "WMS Realtime Sync", "Loss Prevention"],
      metrics: "Auto-Match Realtime • Zero Manual Spreadsheets",
      problem: "Proses Stock Opname konvensional yang memakan waktu berhari-hari karena rekapitulasi data fisik dilakukan manual di Excel, rawan human error, dan lambat dalam mendeteksi selisih.",
      solution: "Merancang sistem rekonsiliasi berbasis algoritma pencocokan otomatis (auto-variance matcher) yang langsung membandingkan hasil scan tim hitung dengan data sistem secara instan.",
      impact: "Memangkas durasi audit Stock Opname hingga 60%, laporan selisih selesai pada hari yang sama, dan akurasi data aset inventaris terjamin 100% transparan."
    },
    {
      id: "sys-ims",
      title: "Optimasi Picking Logic & Integrasi Handheld Scanner IMS",
      category: "ims-tech",
      badge: "Developed by Daniel • Handheld IMS",
      author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
      description: "Pengembangan alur pemindaian Handheld Scanner (PDA/Barcode) dan perombakan Picking Logic untuk memangkas waktu ambil barang dan menaikkan akurasi stok secara drastis dari 75% ke 99.99%+.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      technologies: ["Handheld Scanner", "Picking Logic", "PDA Barcode", "WMS Sync", "Zero Manual Spreadsheets"],
      metrics: "Akurasi Stok 75% ➔ 99.99%+ • Peningkatan Produktivitas Tim Picker",
      problem: "Tingginya selisih stok fisik vs sistem akibat proses picking manual yang mengandalkan kertas/spreadsheet dan sering terjadi salah ambil varian SKU kosmetik.",
      solution: "Merancang alur validasi barcode wajib pada tiap item menggunakan perangkat Handheld PDA terintegrasi WMS, serta mengoptimalkan rute jalan (pathing) picker di area lorong rak gudang.",
      impact: "Akurasi stok melonjak hingga 99.99%+, waktu pemenuhan pesanan lebih cepat 40%, dan kesalahan salah kirim varian barang turun hingga mendekati nol."
    },
    {
      id: "sys-tms",
      title: "Transportation Management System (TMS) & Driver Live Tracking",
      category: "tms-logistics",
      badge: "Developed by Daniel • TMS Tracking",
      author: "Sistem Dikembangkan Sendiri oleh Daniel Imsula",
      description: "Sistem penjadwalan armada pengiriman barang, koordinasi rute driver, live tracking posisi armada, dan pelaporan bukti kirim digital secara mobile.",
      image: "images/tms_live_tracking.jpg",
      technologies: ["TMS Logistics", "Live Tracking GPS", "Delivery Scheduling", "Mobile Driver Report", "Fleet Dispatch"],
      metrics: "100% Visibilitas Pengiriman • On-Time Delivery Terpantau",
      problem: "Sulitnya memonitor status kiriman barang antar cabang/outlet dan estimasi waktu sampai driver yang sering tidak akurat.",
      solution: "Membangun sistem TMS dengan modul rute harian, pelacakan koordinat GPS real-time, dan fitur upload bukti serah terima (e-POD) langsung dari smartphone driver.",
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
      technologies: ["ChatGPT", "Google Gemini", "Claude", "Antigravity IDE", "Google Stitch", "OpenClaw", "Google Apps Script", "AppSheet", "Looker Studio", "Prompt Engineering"],
      metrics: "Analisis RCA Otomatis • Pembuatan SOP 5x Lebih Cepat",
      problem: "Proses pembuatan Standard Operating Procedure (SOP), pelaporan investigasi 5-Why RCA, dan audit data selisih stok yang menyita banyak waktu jika disusun secara manual.",
      solution: "Memanfaatkan Claude dan ChatGPT untuk formulasi Root Cause Analysis mendalam, Gemini untuk pemindaian dokumen faktur/manifest, Antigravity & Antigravity IDE untuk pembuatan script otomasi sistem, Google Stitch untuk visual prototyping, OpenClaw untuk ekstraksi data marketplace, Google Apps Script & AppSheet untuk otomasi data internal, serta Looker Studio untuk dashboard analitik real-time.",
      impact: "Efisiensi administrasi meningkat 500%, SOP operasional terdokumentasi presisi, dan mitigasi selisih stok tertangani dengan standar analisa terdepan."
    },
    {
      id: "inv-1",
      "title": "Setup WMS & Transformasi Akurasi Stok 99.85% di Somethinc",
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

  renderProjects(allProjectsData);
  initProjectFilters();
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
        <p>${proj.description}</p>
        
        <div class="project-tech-tags">
          ${proj.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        ${proj.metrics ? `
          <div class="project-metrics-badge">
            <i class="fa-solid fa-chart-line"></i> ${proj.metrics}
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
      if (filter === 'all') {
        renderProjects(allProjectsData);
      } else {
        const filtered = allProjectsData.filter(p => p.category === filter);
        renderProjects(filtered);
      }
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
      <span class="section-badge" style="margin-bottom: 0.5rem;"><i class="fa-solid fa-trophy"></i> ${project.badge}</span>
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
          ${project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

/* ==========================================================================
   4. Modal Management (Resume & Project Details)
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resume-modal');
  const projectModal = document.getElementById('project-detail-modal');
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
  [resumeModal, projectModal].forEach(modal => {
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
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   5. Contact Form Submission
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

      const waText = `*Halo Daniel Imsula,*\n\n*Nama:* ${name}\n*Email:* ${email || '-'}\n*Subjek:* ${subject}\n\n*Pesan:*\n${message}`;
      const waUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(waText)}`;

      window.open(waUrl, '_blank');
      showToast(`Membuka WhatsApp ke nomor 082210703118. Terima kasih Bapak/Ibu ${name}!`, 'success');
    });
  }
}
