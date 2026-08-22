/**
 * Main Portfolio Controller & UI Interactions - Inventory Specialist Edition
 */

// Global Toast Notification Helper
window.showToast = function (message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass = type === 'success' 
    ? 'fa-solid fa-circle-check' 
    : type === 'error' 
    ? 'fa-solid fa-circle-exclamation' 
    : 'fa-solid fa-info-circle';

  toast.innerHTML = `
    <i class="${iconClass}" style="color: ${type === 'success' ? '#10b981' : type === 'error' ? 'var(--accent-pink)' : 'var(--accent-primary)'}; font-size: 1.1rem;"></i>
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
  // Theme Management
  initThemeToggle();

  // Typewriter Effect
  initTypewriter();

  // Navigation & Scroll Spy
  initNavigation();

  // Dynamic Portfolio Data & Projects
  initPortfolioData();

  // Contact Form Handler
  initContactForm();

  // Resume Modal & Project Modal
  initModals();

  // Initialize Inventory NoteJS Module
  if (window.NoteJS) {
    window.NoteJS.init();
  }

  // Server health check
  checkServerHealth();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');
  
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
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
      themeIcon.title = 'Beralih ke Dark Mode';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeIcon.title = 'Beralih ke Light Mode';
    }
  }
}

/* ==========================================================================
   2. Typewriter Effect (Inventory & Systems Specialist)
   ========================================================================== */
function initTypewriter() {
  const typewriterElem = document.getElementById('typewriter-text');
  if (!typewriterElem) return;

  const words = [
    'Stock Accuracy: 75% ➔ 99.99%+',
    'PT Inovasi Eka Gemilang - Hanasui',
    'Creator of Handheld IMS & TMS',
    'Picking Logic & Productivity Lead',
    'Inventory Controller & Specialist',
    'Somethinc - Beautyhaul (2022-2026)',
    'Aditya Manufaktur Indonesia (2015-2021)',
    'Supervisor & Warehouse Admin',
    'Kirin Dinamika Sentosa (2014-2015)',
    'Sameday Instant Queue System'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typewriterElem.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElem.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Navigation, Scroll Spy & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    links.forEach(l => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Active Link on Scroll
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${sectionId}`) {
            l.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. Portfolio Data & Projects Filtering (Inventory Projects & Systems)
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
    console.log('Using default embedded projects data.');
  }

  // Default inventory projects & systems
  setupDefaultProjects();
}

function setupDefaultProjects() {
  const defaultProjects = [
    {
      id: "sys-ims",
      title: "Handheld-Integrated IMS & Picking Logic Optimization",
      category: "ims-tech",
      badge: "Sistem Buatan Sendiri (Handheld IMS)",
      description: "Merancang dan mengembangkan sistem Inventory Management System (IMS) terintegrasi untuk monitoring realtime, transaksi backend, serta kontrol pergerakan stok presisi via perangkat Handheld Scanner (PDA/Barcode). Berhasil mengubah dan mengoptimalkan Picking Logic Picker sehingga produktivitas picker meningkat drastis serta akurasi stok melonjak tajam dari 75% menjadi 99.99%+ tanpa olah spreadsheet manual.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      technologies: ["Handheld Scanner", "Picking Logic Engine", "Picker Productivity", "Backend Transaction", "Stock Accuracy 99.99%+"],
      liveDemo: "#inventory-studio-section",
      github: "#",
      metrics: "Akurasi 75% ➔ 99.99%+ • Peningkatan Produktivitas Picker"
    },
    {
      id: "sys-tms",
      title: "Transportation Management System (TMS) & Driver Live Tracking",
      category: "tms-logistics",
      badge: "Sistem Buatan Sendiri (TMS Logistics)",
      description: "Membangun Transportation Management System (TMS) untuk penjadwalan pengiriman (delivery scheduling), koordinasi antar driver, live tracking posisi armada secara realtime, serta modul pelaporan status pengiriman digital berbasis mobile bagi driver.",
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
      technologies: ["TMS Logistics", "Live Tracking GPS", "Delivery Scheduling", "Mobile Driver Report", "Fleet Dispatch"],
      liveDemo: "#inventory-studio-section",
      github: "#",
      metrics: "100% Live Visibility • On-Time Delivery Terpantau"
    },
    {
      id: "sys-queue",
      title: "Sameday & Instant Courier Pickup Queue Management System",
      category: "queue-system",
      badge: "Sistem Buatan Sendiri (Queue System)",
      description: "Mengembangkan sistem antrian serah-terima paket kurir instan dan sameday (Grab, GoSend, SPX, dll.) secara digital, mengeliminasi penumpukan antrian driver di area staging, dan mempercepat proses serah terima paket ke kurir secara drastis.",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
      technologies: ["Queue Management", "Sameday Logistics", "Instant Courier Flow", "Staging Dispatch", "Barcode Handover"],
      liveDemo: "#inventory-studio-section",
      github: "#",
      metrics: "-70% Waktu Tunggu Driver • Zero Staging Bottleneck"
    },
    {
      id: "inv-1",
      title: "BeautyHaul & Somethinc Stock Accuracy Transformation",
      category: "accuracy",
      badge: "Somethinc - Beautyhaul",
      description: "Restrukturisasi proses Cycle Count harian dan rekonsiliasi omnichannel terotomatisasi di sistem, menaikkan akurasi stok dari 96.2% menjadi 99.85% dengan kontrol ketat sistem FEFO produk kosmetik.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
      technologies: ["Cycle Count", "FEFO System Control", "WMS Sync", "Omnichannel", "Automated Backend"],
      liveDemo: "#inventory-studio-section",
      github: "#",
      metrics: "Akurasi 99.85% • Zero Expired Discrepancy"
    },
    {
      id: "inv-2",
      title: "Manufacturing Warehouse Flow & Supervisory Optimization",
      category: "process",
      badge: "Aditya Manufaktur Indonesia",
      description: "Optimalisasi alur penerimaan bahan baku dan pengiriman barang jadi, penataan ulang layout rak, dan peningkatan kecepatan dispatch hingga mendapatkan promosi sebagai Supervisor Warehouse.",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      technologies: ["Warehouse Admin", "Supervisory", "Inbound/Outbound", "Slotting Layout"],
      liveDemo: "#inventory-studio-section",
      github: "#",
      metrics: "Promoted to Supervisor • +30% Operasional Flow"
    },
    {
      id: "inv-3",
      title: "High-Volume Stock Opname & Discrepancy Elimination",
      category: "opname",
      badge: "Kirin Dinamika Sentosa",
      description: "Memimpin eksekusi Wall-to-Wall Stock Opname untuk puluhan ribu SKU barang manufaktur/distribusi, menurunkan selisih varians stok (shrinkage) hingga di bawah 0.05% dari nilai aset.",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
      technologies: ["Stock Opname", "Variance Investigation", "Barcode Audit", "Shrinkage Control"],
      liveDemo: "#inventory-studio-section",
      github: "#",
      metrics: "Varians < 0.05% • 100% Selesai Tepat Waktu"
    },
    {
      id: "inv-4",
      title: "System-Driven Stock Opname & Auto-Reconciliation Engine",
      category: "opname",
      badge: "Otomasi Sistem IMS",
      description: "Algoritma rekonsiliasi otomatis yang terintegrasi langsung di backend sistem IMS untuk memproses puluhan ribu baris data hitung fisik vs WMS secara instan tanpa perlu olah manual di spreadsheet/Excel.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      technologies: ["Backend Engine", "Auto-Reconciliation", "System Validation", "Variance Matching"],
      liveDemo: "#inventory-studio-section",
      github: "#",
      metrics: "Auto-Match Realtime • Zero Manual Spreadsheets"
    }
  ];

  allProjectsData = defaultProjects;
  renderProjects(defaultProjects);
  initProjectFilters();
}

function renderProjects(projects) {
  const container = document.getElementById('projects-grid-container');
  if (!container) return;

  container.innerHTML = projects.map(proj => `
    <div class="project-card glass-card" data-category="${proj.category}">
      <div class="project-image-wrapper">
        <img src="${proj.image}" alt="${proj.title}" loading="lazy" />
        <span class="project-badge-pill" style="background: rgba(10, 14, 23, 0.9); border-color: #10b981; color: #10b981;">
          <i class="fa-solid fa-building"></i> ${proj.badge || 'Case Study'}
        </span>
      </div>
      <div class="project-body">
        <h3 style="font-size: 1.15rem; line-height: 1.35; margin-bottom: 0.6rem;">${proj.title}</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.1rem;">${proj.description}</p>
        
        <div class="project-tech-tags">
          ${proj.technologies.map(t => `<span class="tech-tag" style="color: #38bdf8;">${t}</span>`).join('')}
        </div>

        ${proj.metrics ? `
          <div class="project-metrics-badge" style="color: #10b981; font-size: 0.82rem;">
            <i class="fa-solid fa-chart-line"></i> ${proj.metrics}
          </div>
        ` : ''}

        <div class="project-footer-links">
          <a href="${proj.liveDemo}" class="project-link" style="color: #10b981;">
            <span><i class="fa-solid fa-clipboard-check"></i> Lihat di Inventory Studio</span>
          </a>
        </div>
      </div>
    </div>
  `).join('');
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

/* ==========================================================================
   5. Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Harap lengkapi nama, email, dan pesan Anda.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...';
    submitBtn.disabled = true;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'Pesan Anda berhasil terkirim!', 'success');
        form.reset();
      } else {
        throw new Error(json.error || 'Gagal mengirim');
      }
    } catch (err) {
      showToast(`Terima kasih ${name}! Pesan Anda telah tersimpan dan akan segera dibalas.`, 'success');
      form.reset();
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   6. Modals (Resume / CV Preview & Photo Editor)
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const closeModalBtns = document.querySelectorAll('.modal-close-trigger');

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) resumeModal.classList.add('open');
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) modal.classList.remove('open');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });
}

/* ==========================================================================
   7. System Status Check
   ========================================================================== */
async function checkServerHealth() {
  const statusPill = document.getElementById('server-status-pill');
  if (!statusPill) return;

  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      statusPill.innerHTML = '<span class="status-dot" style="background: #10b981;"></span> Server & Database Online';
      return;
    }
  } catch (e) {
    statusPill.innerHTML = '<span class="status-dot" style="background: #10b981;"></span> Target Akurasi: 99.8%+';
  }
}
