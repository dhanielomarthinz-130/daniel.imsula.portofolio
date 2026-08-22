/**
 * Inventory Studio & Stock Audit Log Controller
 * Manages Stock Opname logs, discrepancy audit notes, SOP guidelines, and formulas.
 */

const NoteJS = (function () {
  // State
  let notes = [];
  let currentTag = 'all';
  let searchQuery = '';
  let isConnectedToServer = false;

  // DOM Elements cache
  const elements = {
    form: document.getElementById('note-create-form'),
    titleInput: document.getElementById('note-title-input'),
    tagInput: document.getElementById('note-tag-input'),
    typeInput: document.getElementById('note-type-input'),
    langInput: document.getElementById('note-lang-input'),
    contentInput: document.getElementById('note-content-input'),
    pinnedInput: document.getElementById('note-pinned-input'),
    cardsContainer: document.getElementById('notes-cards-list'),
    tagsContainer: document.getElementById('note-tags-filter-group'),
    searchInput: document.getElementById('notes-search-box'),
    countBadge: document.getElementById('notes-total-count'),
    syncBadge: document.getElementById('notejs-sync-status'),
    exportBtn: document.getElementById('export-notes-btn')
  };

  // Sample default inventory logs & SOPs
  const initialDefaultNotes = [
    {
      id: 'inv_note_1',
      title: '📋 SOP Cycle Counting & Target Akurasi 99.8%',
      content: "Standar Operasional Prosedur Cycle Count Harian:\n\n1. **Kategori A (Fast-Moving)**: Dihitung setiap 1 minggu sekali (Target: 100% akurasi).\n2. **Kategori B (Medium-Moving)**: Dihitung setiap 2 minggu sekali.\n3. **Kategori C (Slow-Moving)**: Dihitung setiap 1 bulan sekali.\n4. **Prosedur Selisih**: Jika ditemukan selisih > 0 unit, lakukan cek riwayat transaksi picking, receiving, dan audit lokasi bay terdekat dalam 24 jam.",
      tag: 'SOP Inventory',
      type: 'markdown',
      language: 'text',
      pinned: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'inv_note_2',
      title: '🔍 Checklist Investigasi Selisih Stok (Discrepancy RCA)',
      content: "Langkah-langkah investigasi jika terjadi selisih stok fisik vs WMS:\n- 1. Cek riwayat Inbound / PO receiving yang belum ter-putaway.\n- 2. Cek order picking yang sedang berjalan (stok tertahan di staging area).\n- 3. Cek barang retur / barang rusak yang belum di-adjust di sistem.\n- 4. Audit lokasi bin di sebelah kiri dan kanan untuk antisipasi misplaced item.\n- 5. Verifikasi barcode dan batch number (apakah ada salah scan antar varian).",
      tag: 'Investigasi',
      type: 'markdown',
      language: 'text',
      pinned: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'inv_note_3',
      title: '⚙️ Arsitektur Logika Otomasi Rekonsiliasi Sistem (IMS Backend)',
      content: "-- Algoritma Otomasi Rekonsiliasi Stok Sistem Terintegrasi:\n-- 1. Auto-Reconcile: Membandingkan scanning Handheld fisik vs snapshot database WMS secara realtime\n-- 2. Auto-Discrepancy Trigger: Flagging otomatis saat selisih > 0 unit tanpa intervensi manual spreadsheet\n-- 3. Dynamic Safety Stock & ROP Calculator Engine terintegrasi langsung di backend database sistem\nSELECT \n    i.sku_code, \n    i.system_qty, \n    h.scanned_qty, \n    (h.scanned_qty - i.system_qty) AS variance_qty,\n    CASE WHEN h.scanned_qty = i.system_qty THEN 'MATCH_100' ELSE 'AUTO_DISCREPANCY_FLAG' END AS audit_status\nFROM inventory_master i\nINNER JOIN handheld_scans h ON i.sku_code = h.sku_code;",
      tag: 'Otomasi Sistem',
      type: 'code',
      language: 'sql',
      pinned: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Markdown to HTML simple parser
  function parseMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code `code`
    escaped = escaped.replace(/`(.*?)`/g, '<code class="tech-tag">$1</code>');
    // Line breaks
    escaped = escaped.replace(/\n/g, '<br/>');

    return escaped;
  }

  // Escape HTML helper
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Load notes from Server API or LocalStorage
  async function loadNotes() {
    try {
      const res = await fetch('data/notes.json');
      if (res.ok) {
        const result = await res.json();
        if (Array.isArray(result)) {
          notes = result;
          updateSyncIndicator(true);
          render();
          return;
        }
      }
    } catch (err) {
      console.log('Using LocalStorage inventory notes.');
    }

    // Fallback to LocalStorage
    updateSyncIndicator(false);
    const local = localStorage.getItem('inventory_portfolio_logs');
    if (local) {
      try {
        notes = JSON.parse(local);
      } catch (e) {
        notes = initialDefaultNotes;
      }
    } else {
      notes = initialDefaultNotes;
      localStorage.setItem('inventory_portfolio_logs', JSON.stringify(notes));
    }
    render();
  }

  function saveToLocal() {
    localStorage.setItem('inventory_portfolio_logs', JSON.stringify(notes));
  }

  function updateSyncIndicator(online) {
    if (!elements.syncBadge) return;
    elements.syncBadge.innerHTML = '<i class="fa-solid fa-check"></i> Data Audit Siap';
    elements.syncBadge.style.color = '#10b981';
  }

  // Create Note
  async function handleCreateNote(e) {
    e.preventDefault();
    const title = elements.titleInput.value.trim();
    const tag = elements.tagInput.value.trim() || 'General';
    const type = elements.typeInput.value;
    const language = elements.langInput.value;
    const content = elements.contentInput.value.trim();
    const pinned = elements.pinnedInput.checked;

    if (!title || !content) {
      if (window.showToast) window.showToast('Judul dan konten tidak boleh kosong!', 'error');
      return;
    }

    const payload = {
      id: 'inv_' + Date.now(),
      title,
      tag,
      type,
      language,
      content,
      pinned,
      createdAt: new Date().toISOString()
    };

    notes.unshift(payload);
    saveToLocal();
    if (window.showToast) window.showToast('Catatan audit berhasil disimpan!', 'success');

    elements.form.reset();
    render();
  }

  // Delete Note
  function deleteNote(id) {
    if (!confirm('Yakin ingin menghapus catatan audit ini?')) return;
    notes = notes.filter(n => n.id !== id);
    saveToLocal();
    render();
    if (window.showToast) window.showToast('Catatan audit dihapus.', 'success');
  }

  // Toggle Pin Note
  function togglePin(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    note.pinned = !note.pinned;
    saveToLocal();
    render();
  }

  // Copy Snippet Code to Clipboard
  function copySnippet(text) {
    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast('Formula / teks disalin ke clipboard!', 'success');
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  }

  // Export Notes to JSON
  function exportNotes() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Inventory_Audit_Logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (window.showToast) window.showToast('Berkas log audit berhasil diekspor!', 'success');
  }

  // Filter & Render
  function render() {
    if (!elements.cardsContainer) return;

    const tags = ['all', ...new Set(notes.map(n => n.tag).filter(Boolean))];
    renderTagsBar(tags);

    let filtered = notes.slice();

    if (currentTag !== 'all') {
      filtered = filtered.filter(n => n.tag && n.tag.toLowerCase() === currentTag.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) || 
        (n.content && n.content.toLowerCase().includes(q)) ||
        (n.tag && n.tag.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.pinned ? -1 : 1;
    });

    if (elements.countBadge) {
      elements.countBadge.innerText = `${filtered.length} Catatan`;
    }

    if (filtered.length === 0) {
      elements.cardsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-boxes-packing" style="font-size: 2.5rem; margin-bottom: 0.8rem; opacity: 0.5;"></i>
          <p>Tidak ada catatan audit yang cocok.</p>
        </div>
      `;
      return;
    }

    elements.cardsContainer.innerHTML = filtered.map(note => {
      const isCode = note.type === 'code';
      const formattedDate = new Date(note.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return `
        <div class="note-item-card glass-card ${note.pinned ? 'pinned' : ''}" data-id="${note.id}">
          <div class="note-card-header">
            <h4 class="note-card-title">${escapeHtml(note.title)}</h4>
            <div class="note-card-actions">
              <button class="note-action-btn pin-btn" title="${note.pinned ? 'Lepas Sematan' : 'Sematkan'}" onclick="NoteJS.togglePin('${note.id}')" style="color: ${note.pinned ? 'var(--accent-amber)' : 'inherit'};">
                <i class="fa-${note.pinned ? 'solid' : 'regular'} fa-thumbtack"></i>
              </button>
              ${isCode ? `
                <button class="note-action-btn copy-btn" title="Salin Formula" onclick="NoteJS.copySnippet(\`${escapeHtml(note.content.replace(/`/g, '\\`'))}\`)">
                  <i class="fa-regular fa-copy"></i>
                </button>
              ` : ''}
              <button class="note-action-btn delete-btn" title="Hapus" onclick="NoteJS.deleteNote('${note.id}')">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>

          <div class="note-card-body">
            ${isCode ? `
              <pre class="note-code-preview" style="color: #38bdf8; background: rgba(0, 0, 0, 0.45);"><code>${escapeHtml(note.content)}</code></pre>
            ` : `
              <div>${parseMarkdown(note.content)}</div>
            `}
          </div>

          <div class="note-card-footer">
            <span class="note-tag-badge" style="color: #10b981; background: rgba(16, 185, 129, 0.12);">
              <i class="fa-solid fa-tag"></i> ${escapeHtml(note.tag || 'General')}
            </span>
            <span><i class="fa-regular fa-clock"></i> ${formattedDate}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTagsBar(tags) {
    if (!elements.tagsContainer) return;
    elements.tagsContainer.innerHTML = tags.map(tag => `
      <button class="tag-pill-btn ${currentTag === tag ? 'active' : ''}" onclick="NoteJS.filterByTag('${tag}')">
        ${tag === 'all' ? 'Semua Kategori' : '#' + tag}
      </button>
    `).join('');
  }

  function filterByTag(tag) {
    currentTag = tag;
    render();
  }

  function init() {
    if (elements.form) {
      elements.form.addEventListener('submit', handleCreateNote);
    }

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        render();
      });
    }

    if (elements.exportBtn) {
      elements.exportBtn.addEventListener('click', exportNotes);
    }

    loadNotes();
  }

  return {
    init,
    deleteNote,
    togglePin,
    copySnippet,
    filterByTag,
    exportNotes
  };
})();
