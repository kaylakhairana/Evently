// Evently - Bilingual Internationalization Engine (English & Indonesian)
const translations = {
  id: {
    // Brand & Tagline
    app_title: "Evently",
    app_tagline: "Platform Event Planner Modern",
    app_subtitle: "Rencanakan setiap momen berharga dengan mudah, rapi, dan elegan.",

    // Navigation
    nav_dashboard: "Dashboard",
    nav_events: "Kelola Acara",
    nav_budget: "Budget Planner",
    nav_checklist: "Checklist Acara",
    nav_rundown: "Rundown & Timeline",
    nav_switch_event: "Pilih Acara",
    nav_new_event: "Acara Baru",

    // Header & Controls
    active_event_label: "Acara Aktif:",
    btn_create_event: "+ Buat Acara Baru",
    btn_edit_event: "Edit Acara",
    btn_delete_event: "Hapus",
    btn_export_pdf: "Cetak / Simpan PDF",
    btn_export_csv: "Export CSV",
    btn_add_quick: "+ Tambah Cepat",
    currency_switch: "Mata Uang:",
    search_placeholder: "Cari data...",

    // Dashboard Overview
    dash_welcome: "Selamat Datang di Evently ✨",
    dash_countdown_days: "hari lagi",
    dash_countdown_today: "Hari ini adalah Hari-H!",
    dash_countdown_past: "Acara telah selesai",
    dash_stat_budget: "Total Anggaran",
    dash_stat_spent: "Pengeluaran Real",
    dash_stat_remaining: "Sisa Dana",
    dash_stat_checklist: "Progress Persiapan",
    dash_stat_rundown: "Total Agenda",
    dash_status_safe: "Aman",
    dash_status_warning: "Mendekati Batas",
    dash_status_over: "Defisit / Melebihi Budget",
    dash_quick_actions: "Aksi Cepat",
    dash_quick_expense: "+ Pengeluaran",
    dash_quick_task: "+ Checklist",
    dash_quick_rundown: "+ Rundown",
    dash_upcoming_tasks: "Tugas Kritis Terdekat",
    dash_no_tasks: "Tidak ada tugas mendesak saat ini. Semuanya terkendali!",
    dash_upcoming_agenda: "Highlight Agenda Hari-H",
    dash_no_agenda: "Belum ada rundown yang ditambahkan.",
    dash_budget_distribution: "Distribusi Anggaran",

    // Events Page
    events_heading: "Kelola Semua Acara",
    events_subheading: "Atur berbagai perayaan, konferensi, atau pesta dalam satu tempat.",
    events_btn_new: "+ Buat Acara Baru",
    events_active_badge: "Sedang Aktif",
    events_switch_btn: "Jadikan Aktif",
    events_guest_count: "Tamu:",
    events_budget_target: "Target Budget:",
    events_date_label: "Tanggal:",
    events_location_label: "Lokasi:",
    events_progress_label: "Kesiapan:",
    events_empty: "Belum ada acara yang tersimpan. Buat acara pertamamu sekarang!",

    // Event Categories
    cat_wedding: "Pernikahan",
    cat_birthday: "Ulang Tahun",
    cat_corporate: "Corporate / Seminar",
    cat_concert: "Konser / Musik",
    cat_anniversary: "Ulang Tahun Pernikahan",
    cat_party: "Pesta & Gathering",
    cat_exhibition: "Pameran & Bazar",
    cat_other: "Acara Lainnya",

    // Budget Planner
    budget_heading: "Budget & Expense Planner",
    budget_subheading: "Pantau setiap rupiah pengeluaran secara akurat dan transparan.",
    budget_summary_total: "Alokasi Anggaran",
    budget_summary_spent: "Total Terpakai",
    budget_summary_remaining: "Sisa Anggaran",
    budget_summary_percent: "Persentase Terpakai",
    budget_filter_all: "Semua Kategori",
    budget_filter_status: "Semua Status",
    budget_status_paid: "Lunas",
    budget_status_deposit: "DP / Uang Muka",
    budget_status_unpaid: "Belum Dibayar",
    budget_btn_add: "+ Catat Pengeluaran",
    budget_th_item: "Deskripsi Pengeluaran",
    budget_th_category: "Kategori",
    budget_th_estimated: "Estimasi",
    budget_th_actual: "Realisasi / Bayar",
    budget_th_status: "Status Bayar",
    budget_th_notes: "Catatan",
    budget_th_action: "Aksi",
    budget_empty: "Belum ada catatan anggaran. Klik tombol Tambah untuk memulai.",
    budget_over_alert: "Perhatian: Total pengeluaran telah melebihi alokasi anggaran yang ditetapkan!",

    // Expense Categories
    exp_cat_venue: "Venue & Gedung",
    exp_cat_catering: "Katering & Makanan",
    exp_cat_decor: "Dekorasi & Bunga",
    exp_cat_attire: "Busana & Rias (MUA)",
    exp_cat_photo: "Dokumentasi (Foto & Video)",
    exp_cat_entertainment: "Hiburan & Sound System",
    exp_cat_souvenir: "Undangan & Souvenir",
    exp_cat_logistic: "Logistik & Transportasi",
    exp_cat_marketing: "Promosi & Publikasi",
    exp_cat_other: "Kebutuhan Tak Terduga",

    // Checklist Page
    checklist_heading: "Checklist Persiapan Acara",
    checklist_subheading: "Pastikan seluruh tahapan persiapan selesai tepat waktu tanpa terlewat.",
    checklist_all_filter: "Semua",
    checklist_pending_filter: "Belum Selesai",
    checklist_completed_filter: "Selesai",
    checklist_stage_h90: "Persiapan Awal (H-90)",
    checklist_stage_h30: "1 Bulan Sebelumnya (H-30)",
    checklist_stage_h7: "1 Minggu Terakhir (H-7)",
    checklist_stage_hday: "Hari-H (D-Day)",
    checklist_stage_post: "Pasca Acara",
    checklist_priority_all: "Semua Prioritas",
    checklist_priority_high: "Tinggi (Urgent)",
    checklist_priority_medium: "Sedang",
    checklist_priority_low: "Rendah",
    checklist_btn_add: "+ Tambah Tugas",
    checklist_quick_placeholder: "Ketik tugas baru lalu tekan Enter...",
    checklist_due_label: "Batas Waktu:",
    checklist_pic_label: "PIC:",
    checklist_completed_congrats: "Hebat! Semua tugas persiapan acara ini sudah selesai 100%! 🎉",
    checklist_empty: "Belum ada tugas checklist untuk kategori ini.",

    // Timeline / Rundown Page
    rundown_heading: "Timeline & Rundown Acara",
    rundown_subheading: "Susun jadwal kegiatan hari-H secara terstruktur menit demi menit.",
    rundown_btn_add: "+ Tambah Agenda",
    rundown_day_label: "Jadwal:",
    rundown_day_1: "Hari 1 / Utama",
    rundown_day_2: "Hari 2 (Lanjutan)",
    rundown_th_time: "Waktu",
    rundown_th_duration: "Durasi",
    rundown_th_activity: "Nama Kegiatan",
    rundown_th_pic: "Penanggung Jawab (PIC)",
    rundown_th_location: "Area / Lokasi",
    rundown_th_status: "Status",
    rundown_th_notes: "Keterangan / Brief",
    rundown_th_action: "Aksi",
    rundown_status_upcoming: "Mendatang",
    rundown_status_ongoing: "Sedang Berlangsung",
    rundown_status_done: "Selesai",
    rundown_empty: "Belum ada susunan rundown. Tambahkan agenda pertamamu!",
    rundown_print_header: "RUNDOWN RESMI ACARA",

    // Modals & Forms
    modal_title_new_event: "Buat Acara Baru",
    modal_title_edit_event: "Edit Informasi Acara",
    modal_title_new_expense: "Tambah Pos Anggaran / Pengeluaran",
    modal_title_edit_expense: "Edit Data Pengeluaran",
    modal_title_new_task: "Tambah Checklist Persiapan",
    modal_title_edit_task: "Edit Tugas Checklist",
    modal_title_new_rundown: "Tambah Agenda Rundown",
    modal_title_edit_rundown: "Edit Agenda Rundown",

    // Form Field Labels
    field_event_title: "Nama Acara",
    field_event_category: "Kategori Acara",
    field_event_date: "Tanggal Acara",
    field_event_time: "Waktu Mulai",
    field_event_location: "Lokasi / Tempat",
    field_event_guests: "Estimasi Jumlah Tamu",
    field_event_budget: "Target Total Anggaran (Rp)",
    field_event_desc: "Deskripsi Acara",
    field_event_theme: "Warna Aksen",

    field_expense_name: "Nama Pengeluaran / Vendor",
    field_expense_category: "Kategori Anggaran",
    field_expense_estimated: "Biaya Estimasi",
    field_expense_actual: "Biaya Realisasi",
    field_expense_status: "Status Pembayaran",
    field_expense_notes: "Catatan Pembayaran / No. Kontak Vendor",

    field_task_title: "Nama Tugas / Hal yang Harus Disiapkan",
    field_task_stage: "Tahapan Persiapan",
    field_task_priority: "Prioritas",
    field_task_due: "Tanggal Target Selesai",
    field_task_pic: "PIC / Penanggung Jawab",
    field_task_notes: "Detail & Catatan",

    field_rundown_title: "Nama Kegiatan / Sesi",
    field_rundown_start: "Waktu Mulai",
    field_rundown_end: "Waktu Selesai",
    field_rundown_location: "Lokasi / Panggung / Ruangan",
    field_rundown_pic: "PIC / Penanggung Jawab",
    field_rundown_notes: "Instruksi / Catatan Teknis",
    field_rundown_status: "Status",

    // Action Buttons
    btn_save: "Simpan",
    btn_cancel: "Batal",
    btn_delete_confirm: "Ya, Hapus",
    btn_close: "Tutup",

    // Confirm Dialogs & Alerts
    confirm_delete_event: "Apakah Anda yakin ingin menghapus acara ini beserta seluruh data budget, checklist, dan rundown di dalamnya?",
    confirm_delete_item: "Apakah Anda yakin ingin menghapus data ini?",
    toast_event_created: "Acara baru berhasil dibuat!",
    toast_event_updated: "Informasi acara berhasil diperbarui!",
    toast_event_deleted: "Acara berhasil dihapus.",
    toast_expense_added: "Pos pengeluaran berhasil disimpan!",
    toast_expense_updated: "Pengeluaran berhasil diperbarui!",
    toast_expense_deleted: "Pengeluaran berhasil dihapus.",
    toast_task_added: "Tugas checklist berhasil ditambahkan!",
    toast_task_updated: "Tugas checklist diperbarui!",
    toast_task_deleted: "Tugas berhasil dihapus.",
    toast_task_status: "Status tugas diperbarui.",
    toast_rundown_added: "Agenda rundown berhasil ditambahkan!",
    toast_rundown_updated: "Agenda berhasil diperbarui!",
    toast_rundown_deleted: "Agenda berhasil dihapus.",
    toast_switched_event: "Beralih ke acara:",
    toast_copied: "Berhasil disalin ke clipboard!"
  },

  en: {
    // Brand & Tagline
    app_title: "Evently",
    app_tagline: "Modern Event Planner Platform",
    app_subtitle: "Plan every special moment effortlessly, neatly, and with elegance.",

    // Navigation
    nav_dashboard: "Dashboard",
    nav_events: "My Events",
    nav_budget: "Budget Planner",
    nav_checklist: "Event Checklist",
    nav_rundown: "Timeline & Rundown",
    nav_switch_event: "Select Event",
    nav_new_event: "New Event",

    // Header & Controls
    active_event_label: "Active Event:",
    btn_create_event: "+ Create New Event",
    btn_edit_event: "Edit Event",
    btn_delete_event: "Delete",
    btn_export_pdf: "Print / Save PDF",
    btn_export_csv: "Export CSV",
    btn_add_quick: "+ Quick Add",
    currency_switch: "Currency:",
    search_placeholder: "Search data...",

    // Dashboard Overview
    dash_welcome: "Welcome to Evently ✨",
    dash_countdown_days: "days left",
    dash_countdown_today: "Today is the Big Day!",
    dash_countdown_past: "Event has ended",
    dash_stat_budget: "Total Budget",
    dash_stat_spent: "Actual Spent",
    dash_stat_remaining: "Remaining Funds",
    dash_stat_checklist: "Prep Progress",
    dash_stat_rundown: "Total Agendas",
    dash_status_safe: "On Track",
    dash_status_warning: "Near Limit",
    dash_status_over: "Deficit / Over Budget",
    dash_quick_actions: "Quick Actions",
    dash_quick_expense: "+ Expense",
    dash_quick_task: "+ Checklist",
    dash_quick_rundown: "+ Rundown",
    dash_upcoming_tasks: "Upcoming Critical Tasks",
    dash_no_tasks: "No urgent tasks pending. Everything is under control!",
    dash_upcoming_agenda: "Event Day Agenda Highlights",
    dash_no_agenda: "No rundown items added yet.",
    dash_budget_distribution: "Budget Breakdown",

    // Events Page
    events_heading: "Manage All Events",
    events_subheading: "Organize weddings, conferences, or parties seamlessly in one hub.",
    events_btn_new: "+ Create New Event",
    events_active_badge: "Active",
    events_switch_btn: "Set Active",
    events_guest_count: "Guests:",
    events_budget_target: "Target Budget:",
    events_date_label: "Date:",
    events_location_label: "Venue:",
    events_progress_label: "Readiness:",
    events_empty: "No events found. Create your first event now!",

    // Event Categories
    cat_wedding: "Wedding",
    cat_birthday: "Birthday",
    cat_corporate: "Corporate / Conference",
    cat_concert: "Concert / Music",
    cat_anniversary: "Anniversary",
    cat_party: "Party & Gathering",
    cat_exhibition: "Exhibition & Bazaar",
    cat_other: "Other Event",

    // Budget Planner
    budget_heading: "Budget & Expense Planner",
    budget_subheading: "Track every dollar/rupiah spent with clarity and transparency.",
    budget_summary_total: "Budget Allocation",
    budget_summary_spent: "Total Spent",
    budget_summary_remaining: "Remaining Balance",
    budget_summary_percent: "Budget Used",
    budget_filter_all: "All Categories",
    budget_filter_status: "All Statuses",
    budget_status_paid: "Paid",
    budget_status_deposit: "Deposit / Down Payment",
    budget_status_unpaid: "Unpaid",
    budget_btn_add: "+ Record Expense",
    budget_th_item: "Expense Description",
    budget_th_category: "Category",
    budget_th_estimated: "Estimated",
    budget_th_actual: "Actual Paid",
    budget_th_status: "Payment Status",
    budget_th_notes: "Notes",
    budget_th_action: "Actions",
    budget_empty: "No budget entries recorded yet. Click Add to get started.",
    budget_over_alert: "Warning: Total actual spending has exceeded your allocated budget!",

    // Expense Categories
    exp_cat_venue: "Venue & Hall",
    exp_cat_catering: "Catering & Beverages",
    exp_cat_decor: "Decoration & Flowers",
    exp_cat_attire: "Attire & Beauty (MUA)",
    exp_cat_photo: "Photography & Videography",
    exp_cat_entertainment: "Entertainment & Sound",
    exp_cat_souvenir: "Invitations & Favors",
    exp_cat_logistic: "Logistics & Transport",
    exp_cat_marketing: "Marketing & Promo",
    exp_cat_other: "Contingency / Miscellaneous",

    // Checklist Page
    checklist_heading: "Event Preparation Checklist",
    checklist_subheading: "Ensure every milestone is executed on schedule without missing a beat.",
    checklist_all_filter: "All Tasks",
    checklist_pending_filter: "Pending",
    checklist_completed_filter: "Completed",
    checklist_stage_h90: "Early Prep (H-90)",
    checklist_stage_h30: "1 Month Before (H-30)",
    checklist_stage_h7: "1 Week Before (H-7)",
    checklist_stage_hday: "Event Day (D-Day)",
    checklist_stage_post: "Post-Event",
    checklist_priority_all: "All Priorities",
    checklist_priority_high: "High (Urgent)",
    checklist_priority_medium: "Medium",
    checklist_priority_low: "Low",
    checklist_btn_add: "+ Add Task",
    checklist_quick_placeholder: "Type a new task and press Enter...",
    checklist_due_label: "Target Date:",
    checklist_pic_label: "Assigned PIC:",
    checklist_completed_congrats: "Awesome! All preparation tasks for this event are 100% complete! 🎉",
    checklist_empty: "No checklist tasks found in this section.",

    // Timeline / Rundown Page
    rundown_heading: "Timeline & Event Rundown",
    rundown_subheading: "Structure your event day schedule minute-by-minute with precision.",
    rundown_btn_add: "+ Add Agenda Item",
    rundown_day_label: "Day:",
    rundown_day_1: "Day 1 / Main Event",
    rundown_day_2: "Day 2 (Follow-up)",
    rundown_th_time: "Time",
    rundown_th_duration: "Duration",
    rundown_th_activity: "Activity / Session",
    rundown_th_pic: "In Charge (PIC)",
    rundown_th_location: "Area / Stage",
    rundown_th_status: "Status",
    rundown_th_notes: "Instructions / Notes",
    rundown_th_action: "Actions",
    rundown_status_upcoming: "Upcoming",
    rundown_status_ongoing: "In Progress",
    rundown_status_done: "Completed",
    rundown_empty: "No rundown entries yet. Add your first agenda item!",
    rundown_print_header: "OFFICIAL EVENT RUNDOWN",

    // Modals & Forms
    modal_title_new_event: "Create New Event",
    modal_title_edit_event: "Edit Event Details",
    modal_title_new_expense: "Add Budget / Expense Item",
    modal_title_edit_expense: "Edit Expense Item",
    modal_title_new_task: "Add Preparation Task",
    modal_title_edit_task: "Edit Preparation Task",
    modal_title_new_rundown: "Add Rundown Agenda",
    modal_title_edit_rundown: "Edit Rundown Agenda",

    // Form Field Labels
    field_event_title: "Event Name",
    field_event_category: "Event Category",
    field_event_date: "Event Date",
    field_event_time: "Start Time",
    field_event_location: "Venue / Location",
    field_event_guests: "Estimated Guests",
    field_event_budget: "Target Budget",
    field_event_desc: "Event Description",
    field_event_theme: "Theme Accent Color",

    field_expense_name: "Expense Name / Vendor",
    field_expense_category: "Budget Category",
    field_expense_estimated: "Estimated Cost",
    field_expense_actual: "Actual Cost",
    field_expense_status: "Payment Status",
    field_expense_notes: "Payment Notes / Vendor Contact",

    field_task_title: "Task Title / Action Item",
    field_task_stage: "Preparation Stage",
    field_task_priority: "Priority",
    field_task_due: "Due Date",
    field_task_pic: "Person in Charge (PIC)",
    field_task_notes: "Details & Notes",

    field_rundown_title: "Activity / Session Name",
    field_rundown_start: "Start Time",
    field_rundown_end: "End Time",
    field_rundown_location: "Location / Stage / Hall",
    field_rundown_pic: "PIC / Coordinator",
    field_rundown_notes: "Brief / Technical Notes",
    field_rundown_status: "Status",

    // Action Buttons
    btn_save: "Save",
    btn_cancel: "Cancel",
    btn_delete_confirm: "Yes, Delete",
    btn_close: "Close",

    // Confirm Dialogs & Alerts
    confirm_delete_event: "Are you sure you want to delete this event and all its budget, checklist, and rundown data?",
    confirm_delete_item: "Are you sure you want to delete this item?",
    toast_event_created: "New event created successfully!",
    toast_event_updated: "Event details updated successfully!",
    toast_event_deleted: "Event deleted successfully.",
    toast_expense_added: "Expense entry saved successfully!",
    toast_expense_updated: "Expense entry updated!",
    toast_expense_deleted: "Expense entry deleted.",
    toast_task_added: "Checklist task added successfully!",
    toast_task_updated: "Checklist task updated!",
    toast_task_deleted: "Task deleted successfully.",
    toast_task_status: "Task status updated.",
    toast_rundown_added: "Rundown item added successfully!",
    toast_rundown_updated: "Agenda item updated!",
    toast_rundown_deleted: "Agenda item deleted.",
    toast_switched_event: "Switched to event:",
    toast_copied: "Copied to clipboard!"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('evently_lang') || 'id';
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('evently_lang', lang);
      document.documentElement.lang = lang;
      this.applyTranslations();
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }

  t(key, fallback = '') {
    const dict = translations[this.currentLang] || translations.id;
    return dict[key] !== undefined ? dict[key] : (fallback || key);
  }

  applyTranslations() {
    // Translate data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        el.textContent = text;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = this.t(key);
      if (text) {
        el.setAttribute('placeholder', text);
      }
    });

    // Translate title/tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const text = this.t(key);
      if (text) {
        el.setAttribute('title', text);
      }
    });

    // Update active state in language toggles
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

const i18n = new I18nManager();
