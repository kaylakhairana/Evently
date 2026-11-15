// Evently - LocalStorage Data Store & State Management

class EventStore {
  constructor() {
    this.STORAGE_KEY = 'evently_events_data_v1';
    this.ACTIVE_ID_KEY = 'evently_active_event_id_v1';
    this.CURRENCY_KEY = 'evently_currency_v1';
    this.currency = localStorage.getItem(this.CURRENCY_KEY) || 'IDR'; // 'IDR' or 'USD'
    this.rateIDRtoUSD = 16000;
    this.events = [];
    this.activeEventId = null;
    this.init();
  }

  init() {
    const rawData = localStorage.getItem(this.STORAGE_KEY);
    if (rawData) {
      try {
        this.events = JSON.parse(rawData);
      } catch (e) {
        console.error("Failed to parse stored events, resetting with sample data", e);
        this.events = [];
      }
    }

    if (!this.events || this.events.length === 0) {
      this.loadSampleData();
    }

    this.activeEventId = localStorage.getItem(this.ACTIVE_ID_KEY);
    if (!this.activeEventId || !this.getEventById(this.activeEventId)) {
      this.activeEventId = this.events[0].id;
      localStorage.setItem(this.ACTIVE_ID_KEY, this.activeEventId);
    }
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    localStorage.setItem(this.ACTIVE_ID_KEY, this.activeEventId);
    window.dispatchEvent(new CustomEvent('eventDataChanged', { detail: { activeEvent: this.getActiveEvent() } }));
  }

  setCurrency(curr) {
    this.currency = curr;
    localStorage.setItem(this.CURRENCY_KEY, curr);
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: curr } }));
  }

  formatMoney(amount) {
    const num = Number(amount) || 0;
    if (this.currency === 'USD') {
      const inUSD = num / this.rateIDRtoUSD;
      return '$' + inUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    } else {
      return 'Rp ' + Math.round(num).toLocaleString('id-ID');
    }
  }

  parseMoneyInput(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    // Remove Rp, $, spaces, commas/dots
    const cleaned = str.toString().replace(/[^0-9.]/g, '');
    const val = parseFloat(cleaned) || 0;
    if (this.currency === 'USD') {
      return val * this.rateIDRtoUSD;
    }
    return val;
  }

  getEvents() {
    return this.events;
  }

  getActiveEvent() {
    return this.getEventById(this.activeEventId) || this.events[0];
  }

  setActiveEvent(id) {
    if (this.getEventById(id)) {
      this.activeEventId = id;
      localStorage.setItem(this.ACTIVE_ID_KEY, id);
      this.save();
      return true;
    }
    return false;
  }

  getEventById(id) {
    return this.events.find(ev => ev.id === id);
  }

  addEvent(eventData) {
    const newId = 'event-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const newEvent = {
      id: newId,
      title: eventData.title || 'Untitled Event',
      category: eventData.category || 'other',
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '10:00',
      location: eventData.location || '',
      guests: Number(eventData.guests) || 100,
      targetBudget: Number(eventData.targetBudget) || 50000000,
      description: eventData.description || '',
      theme: eventData.theme || 'lavender',
      expenses: [],
      checklist: [],
      rundown: []
    };
    this.events.unshift(newEvent);
    this.activeEventId = newId;
    this.save();
    return newEvent;
  }

  updateEvent(id, updatedData) {
    const event = this.getEventById(id);
    if (!event) return null;
    Object.assign(event, {
      title: updatedData.title !== undefined ? updatedData.title : event.title,
      category: updatedData.category !== undefined ? updatedData.category : event.category,
      date: updatedData.date !== undefined ? updatedData.date : event.date,
      time: updatedData.time !== undefined ? updatedData.time : event.time,
      location: updatedData.location !== undefined ? updatedData.location : event.location,
      guests: updatedData.guests !== undefined ? Number(updatedData.guests) : event.guests,
      targetBudget: updatedData.targetBudget !== undefined ? Number(updatedData.targetBudget) : event.targetBudget,
      description: updatedData.description !== undefined ? updatedData.description : event.description,
      theme: updatedData.theme !== undefined ? updatedData.theme : event.theme,
    });
    this.save();
    return event;
  }

  deleteEvent(id) {
    const index = this.events.findIndex(ev => ev.id === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    if (this.events.length === 0) {
      this.loadSampleData();
    }
    if (this.activeEventId === id) {
      this.activeEventId = this.events[0].id;
    }
    this.save();
    return true;
  }

  // --- Expenses Management for Active Event ---
  addExpense(item) {
    const active = this.getActiveEvent();
    if (!active) return null;
    if (!active.expenses) active.expenses = [];
    const newExpense = {
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: item.name || 'Expense Item',
      category: item.category || 'other',
      estimated: Number(item.estimated) || 0,
      actual: Number(item.actual) || 0,
      status: item.status || 'unpaid', // 'paid', 'deposit', 'unpaid'
      notes: item.notes || '',
      createdAt: new Date().toISOString()
    };
    active.expenses.push(newExpense);
    this.save();
    return newExpense;
  }

  updateExpense(expId, updated) {
    const active = this.getActiveEvent();
    if (!active || !active.expenses) return null;
    const item = active.expenses.find(e => e.id === expId);
    if (!item) return null;
    Object.assign(item, updated);
    this.save();
    return item;
  }

  deleteExpense(expId) {
    const active = this.getActiveEvent();
    if (!active || !active.expenses) return false;
    const idx = active.expenses.findIndex(e => e.id === expId);
    if (idx === -1) return false;
    active.expenses.splice(idx, 1);
    this.save();
    return true;
  }

  getBudgetSummary(event = null) {
    const ev = event || this.getActiveEvent();
    if (!ev) return { target: 0, spent: 0, remaining: 0, percentSpent: 0, count: 0, isOver: false };
    const target = Number(ev.targetBudget) || 0;
    const expenses = ev.expenses || [];
    let spent = 0;
    let estimatedTotal = 0;
    expenses.forEach(item => {
      spent += Number(item.actual) || 0;
      estimatedTotal += Number(item.estimated) || 0;
    });
    const remaining = target - spent;
    const percentSpent = target > 0 ? Math.min(Math.round((spent / target) * 100), 999) : 0;
    return {
      target,
      spent,
      estimatedTotal,
      remaining,
      percentSpent,
      count: expenses.length,
      isOver: remaining < 0
    };
  }

  // --- Checklist Management for Active Event ---
  addTask(task) {
    const active = this.getActiveEvent();
    if (!active) return null;
    if (!active.checklist) active.checklist = [];
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: task.title || 'New Task',
      stage: task.stage || 'h90', // 'h90', 'h30', 'h7', 'hday', 'post'
      priority: task.priority || 'medium', // 'high', 'medium', 'low'
      due: task.due || '',
      pic: task.pic || '',
      notes: task.notes || '',
      completed: !!task.completed,
      createdAt: new Date().toISOString()
    };
    active.checklist.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(taskId, updated) {
    const active = this.getActiveEvent();
    if (!active || !active.checklist) return null;
    const task = active.checklist.find(t => t.id === taskId);
    if (!task) return null;
    Object.assign(task, updated);
    this.save();
    return task;
  }

  toggleTaskCompleted(taskId) {
    const active = this.getActiveEvent();
    if (!active || !active.checklist) return false;
    const task = active.checklist.find(t => t.id === taskId);
    if (!task) return false;
    task.completed = !task.completed;
    this.save();
    return task.completed;
  }

  deleteTask(taskId) {
    const active = this.getActiveEvent();
    if (!active || !active.checklist) return false;
    const idx = active.checklist.findIndex(t => t.id === taskId);
    if (idx === -1) return false;
    active.checklist.splice(idx, 1);
    this.save();
    return true;
  }

  getChecklistSummary(event = null) {
    const ev = event || this.getActiveEvent();
    if (!ev || !ev.checklist) return { total: 0, completed: 0, pending: 0, percent: 0 };
    const list = ev.checklist;
    const total = list.length;
    const completed = list.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percent };
  }

  // --- Rundown Management for Active Event ---
  addRundown(item) {
    const active = this.getActiveEvent();
    if (!active) return null;
    if (!active.rundown) active.rundown = [];
    const newRundown = {
      id: 'rd-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      day: item.day || '1',
      startTime: item.startTime || '09:00',
      endTime: item.endTime || '10:00',
      title: item.title || 'Agenda Item',
      location: item.location || '',
      pic: item.pic || '',
      notes: item.notes || '',
      status: item.status || 'upcoming' // 'upcoming', 'ongoing', 'done'
    };
    active.rundown.push(newRundown);
    // Sort chronologically by start time
    active.rundown.sort((a, b) => a.startTime.localeCompare(b.startTime));
    this.save();
    return newRundown;
  }

  updateRundown(rdId, updated) {
    const active = this.getActiveEvent();
    if (!active || !active.rundown) return null;
    const item = active.rundown.find(r => r.id === rdId);
    if (!item) return null;
    Object.assign(item, updated);
    active.rundown.sort((a, b) => a.startTime.localeCompare(b.startTime));
    this.save();
    return item;
  }

  deleteRundown(rdId) {
    const active = this.getActiveEvent();
    if (!active || !active.rundown) return false;
    const idx = active.rundown.findIndex(r => r.id === rdId);
    if (idx === -1) return false;
    active.rundown.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Sample Data Generator with Realistic Dynamic Dates ---
  loadSampleData() {
    const now = new Date();
    const plusDays = (d) => {
      const target = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
      return target.toISOString().split('T')[0];
    };

    const weddingEvent = {
      id: 'event-wedding-demo',
      title: "Luna & Adrian's Enchanted Wedding",
      category: "wedding",
      date: plusDays(42),
      time: "15:30",
      location: "The Glass House Garden & Ballroom, Jakarta",
      guests: 350,
      targetBudget: 150000000,
      description: "Pernikahan tema modern romantic botanical dengan sentuhan lavender, soft lilies, fairy lights, dan acoustic ambient.",
      theme: "lavender",
      expenses: [
        {
          id: 'exp-1',
          name: 'The Glass House Grand Ballroom & Garden',
          category: 'venue',
          estimated: 45000000,
          actual: 45000000,
          status: 'paid',
          notes: 'Full package venue indoor-outdoor 10 jam + VIP lounge'
        },
        {
          id: 'exp-2',
          name: 'Lavender Royal Catering (Buffet 350 pax + 4 Food Stalls)',
          category: 'catering',
          estimated: 55000000,
          actual: 52500000,
          status: 'paid',
          notes: 'Menu nusantara fusion, Roast beef stall, Zuppa soup, Dessert bar'
        },
        {
          id: 'exp-3',
          name: 'Floral & Fairy Lights Backdrop Decoration',
          category: 'decor',
          estimated: 25000000,
          actual: 20000000,
          status: 'deposit',
          notes: 'Pelaminan botanical lavender, entrance archway & table centerpieces'
        },
        {
          id: 'exp-4',
          name: 'Bridal Gown, Tuxedo & Flawless MUA Package',
          category: 'attire',
          estimated: 12000000,
          actual: 12000000,
          status: 'paid',
          notes: 'Includes dress fitting, touch up sesi resepsi, and makeup for mothers'
        },
        {
          id: 'exp-5',
          name: 'Aetheria Photography & Cinematic Teaser Video',
          category: 'photo',
          estimated: 10000000,
          actual: 5000000,
          status: 'deposit',
          notes: '2 Photographers, 1 Videographer, 1-min teaser Reels, Full album'
        },
        {
          id: 'exp-6',
          name: 'Acoustic Quartet Band & Sound System 5000W',
          category: 'entertainment',
          estimated: 7500000,
          actual: 3500000,
          status: 'deposit',
          notes: 'Vocalist, Baby Grand Piano, Cello, Violin + Wireless mics'
        },
        {
          id: 'exp-7',
          name: 'Aesthetic Scented Candle Favors & Digital QR Invites',
          category: 'souvenir',
          estimated: 5500000,
          actual: 5200000,
          status: 'paid',
          notes: '350 custom candle boxes lavender scented + RSVP website'
        }
      ],
      checklist: [
        {
          id: 'chk-1',
          title: 'Booking Venue & Pembayaran DP 50%',
          stage: 'h90',
          priority: 'high',
          due: plusDays(-30),
          pic: 'Adrian',
          notes: 'Kontrak venue sudah ditandatangani dan kwitansi tersimpan aman.',
          completed: true
        },
        {
          id: 'chk-2',
          title: 'Finalisasi Moodboard Palet Warna & Konsep Dekorasi',
          stage: 'h90',
          priority: 'medium',
          due: plusDays(-15),
          pic: 'Luna',
          notes: 'Kombinasi warna Lavender (#8B5CF6) dan Baby Blue (#38BDF8).',
          completed: true
        },
        {
          id: 'chk-3',
          title: 'Food Tasting Katering & Seleksi Menu Stall',
          stage: 'h30',
          priority: 'high',
          due: plusDays(-5),
          pic: 'Luna & Adrian',
          notes: 'Menu disetujui bersama orang tua kedua belah pihak.',
          completed: true
        },
        {
          id: 'chk-4',
          title: 'Fitting Busana Pengantin Tahap Akhir',
          stage: 'h30',
          priority: 'high',
          due: plusDays(7),
          pic: 'Desainer Gaun',
          notes: 'Jadwal fitting final hari Sabtu jam 14:00.',
          completed: false
        },
        {
          id: 'chk-5',
          title: 'Distribusi Undangan Digital & Rekapitulasi RSVP',
          stage: 'h30',
          priority: 'medium',
          due: plusDays(12),
          pic: 'Adrian',
          notes: 'Pantau respon konfirmasi kehadiran tamu via dashboard.',
          completed: false
        },
        {
          id: 'chk-6',
          title: 'Technical Meeting Gabungan Seluruh Vendor & WO',
          stage: 'h7',
          priority: 'high',
          due: plusDays(35),
          pic: 'Event Organizer',
          notes: 'Sinkronisasi rundown, layout meja, dan load in sound system.',
          completed: false
        },
        {
          id: 'chk-7',
          title: 'Gladi Resik & Briefing Pengiring Pengantin (Bridesmaids/Groomsmen)',
          stage: 'h7',
          priority: 'medium',
          due: plusDays(40),
          pic: 'Luna',
          notes: 'Briefing urutan barisan jalan dan penyerahan cincin.',
          completed: false
        },
        {
          id: 'chk-8',
          title: 'Sesi Make Up & Hair Styling Pengantin Pagi',
          stage: 'hday',
          priority: 'high',
          due: plusDays(42),
          pic: 'MUA Team',
          notes: 'Mulai tepat pukul 05:30 pagi di Bridal Suite.',
          completed: false
        },
        {
          id: 'chk-9',
          title: 'Serah Terima Souvenir & Booth Photobooth',
          stage: 'hday',
          priority: 'medium',
          due: plusDays(42),
          pic: 'Tim Logistik',
          notes: 'Pastikan 350 kotak souvenir tersusun rapi di meja registrasi.',
          completed: false
        }
      ],
      rundown: [
        {
          id: 'rd-1',
          day: '1',
          startTime: '05:30',
          endTime: '08:30',
          title: 'Make Up & Hair Styling Pengantin dan Keluarga Inti',
          location: 'Bridal Suite Room 301',
          pic: 'Tim MUA & Stylist',
          notes: 'Sediakan sarapan hangat dan kopi untuk tim pengantin.',
          status: 'upcoming'
        },
        {
          id: 'rd-2',
          day: '1',
          startTime: '08:30',
          endTime: '09:30',
          title: 'Sesi Foto First Look & Detail Gaun Pengantin',
          location: 'Outdoor Secret Garden',
          pic: 'Fotografer & Videografer',
          notes: 'Pengambilan gambar cincin pernikahan, gaun gantung, dan momen haru.',
          status: 'upcoming'
        },
        {
          id: 'rd-3',
          day: '1',
          startTime: '09:30',
          endTime: '11:00',
          title: 'Upacara Pemberkatan / Akad Nikah Khidmat',
          location: 'The Glass Pavilion',
          pic: 'Penghulu / Pemimpin Ibadah & MC',
          notes: 'Keluarga inti duduk di barisan depan, musik instrumental lembut.',
          status: 'upcoming'
        },
        {
          id: 'rd-4',
          day: '1',
          startTime: '11:00',
          endTime: '12:30',
          title: 'Sesi Foto Keluarga Inti & Makan Siang Intim',
          location: 'VIP Lounge Pavilion',
          pic: 'Koordinator Keluarga',
          notes: 'Hidangan katering khusus keluarga inti 40 orang.',
          status: 'upcoming'
        },
        {
          id: 'rd-5',
          day: '1',
          startTime: '15:30',
          endTime: '16:15',
          title: 'Touch Up Riasan & Briefing Resepsi Senja',
          location: 'Bridal Suite',
          pic: 'Event Organizer',
          notes: 'Ganti gaun resepsi malam bergaya glamour pastel.',
          status: 'upcoming'
        },
        {
          id: 'rd-6',
          day: '1',
          startTime: '16:30',
          endTime: '17:00',
          title: 'Open Gate Resepsi & Registrasi Tamu Undangan',
          location: 'Foyer & Entrance Area',
          pic: 'Penerima Tamu & Usher',
          notes: 'Scan QR undangan digital, pembagian souvenir aromaterapi.',
          status: 'upcoming'
        },
        {
          id: 'rd-7',
          day: '1',
          startTime: '17:00',
          endTime: '17:30',
          title: 'Grand Entrance Pengantin & First Dance',
          location: 'Grand Ballroom Main Stage',
          pic: 'MC, Stage Director & Band',
          notes: 'Lampu dimmed, spotlight mengarah ke lorong utama dengan dry ice.',
          status: 'upcoming'
        },
        {
          id: 'rd-8',
          day: '1',
          startTime: '17:30',
          endTime: '20:00',
          title: 'Ramah Tamah, Dinner Buffet, & Live Acoustic Performance',
          location: 'Grand Ballroom & Garden Area',
          pic: 'Stage Manager & Katering',
          notes: 'Sesi ucapan selamat dan foto bersama bergantian per grup tamu.',
          status: 'upcoming'
        },
        {
          id: 'rd-9',
          day: '1',
          startTime: '20:00',
          endTime: '20:30',
          title: 'Bouquet Toss & Sparkler Send-off Celebration',
          location: 'Courtyard Garden',
          pic: 'MC & WO Crew',
          notes: 'Tamu memegang sparklers saat pengantin berjalan keluar.',
          status: 'upcoming'
        }
      ]
    };

    const techEvent = {
      id: 'event-tech-summit',
      title: "TechForward International Summit 2027",
      category: "corporate",
      date: plusDays(78),
      time: "08:30",
      location: "Grand Convention Center, Jakarta",
      guests: 600,
      targetBudget: 280000000,
      description: "Annual conference on Next-Gen Artificial Intelligence, Cloud Infrastructure, and Product Engineering.",
      theme: "babyblue",
      expenses: [
        {
          id: 'exp-corp-1',
          name: 'Main Auditorium & Exhibition Hall Rental',
          category: 'venue',
          estimated: 110000000,
          actual: 110000000,
          status: 'paid',
          notes: 'Capacity 800 seats, stage LED screen 12x4m included'
        },
        {
          id: 'exp-corp-2',
          name: 'All-Day Executive Catering & Coffee Break (600 pax)',
          category: 'catering',
          estimated: 85000000,
          actual: 80000000,
          status: 'paid',
          notes: 'Morning coffee break, hot lunch buffet, afternoon snacks'
        },
        {
          id: 'exp-corp-3',
          name: 'Audiovisual, Giant LED Wall, & High-Speed WiFi 1Gbps',
          category: 'entertainment',
          estimated: 40000000,
          actual: 38000000,
          status: 'paid',
          notes: 'Dedicated enterprise bandwidth for live streaming'
        },
        {
          id: 'exp-corp-4',
          name: 'Attendee Welcome Kits, Lanyards & RFID Badges',
          category: 'souvenir',
          estimated: 20000000,
          actual: 18500000,
          status: 'paid',
          notes: 'Custom canvas totes, thermal tumblers, premium notebooks'
        }
      ],
      checklist: [
        {
          id: 'chk-corp-1',
          title: 'Konfirmasi 6 Keynote Speakers Internasional',
          stage: 'h90',
          priority: 'high',
          due: plusDays(-20),
          pic: 'Program Committee',
          notes: 'Semua pembicara telah menandatangani kesepakatan.',
          completed: true
        },
        {
          id: 'chk-corp-2',
          title: 'Peluncuran Website Registrasi & Tiket Early Bird',
          stage: 'h90',
          priority: 'high',
          due: plusDays(-10),
          pic: 'Marketing Team',
          notes: 'Tiket batch 1 habis terjual dalam 48 jam.',
          completed: true
        },
        {
          id: 'chk-corp-3',
          title: 'Kurasi 20 Startup Exhibitor untuk Innovation Booth',
          stage: 'h30',
          priority: 'medium',
          due: plusDays(15),
          pic: 'Partnership Lead',
          notes: '16 booth telah terisi oleh sponsor tech.',
          completed: false
        }
      ],
      rundown: [
        {
          id: 'rd-corp-1',
          day: '1',
          startTime: '08:00',
          endTime: '09:00',
          title: 'Registrasi Peserta, Morning Coffee, & Networking',
          location: 'Grand Foyer',
          pic: 'Front Desk Staff',
          notes: 'Scan badge RFID peserta.',
          status: 'upcoming'
        },
        {
          id: 'rd-corp-2',
          day: '1',
          startTime: '09:00',
          endTime: '10:15',
          title: 'Opening Ceremony & Keynote Speech: Future of AI Systems',
          location: 'Main Stage Auditorium',
          pic: 'Keynote Speaker & Host',
          notes: 'Live stream broadcast aktif ke YouTube.',
          status: 'upcoming'
        }
      ]
    };

    const birthdayEvent = {
      id: 'event-sweet-17',
      title: "Aria's Pastel Wonderland 17th Birthday",
      category: "birthday",
      date: plusDays(18),
      time: "18:00",
      location: "Skyline Lounge & Rooftop, Bandung",
      guests: 80,
      targetBudget: 35000000,
      description: "Pesta ulang tahun ke-17 dengan dekorasi pastel dreamy, live DJ acoustic, dan 360 photo booth.",
      theme: "softpurple",
      expenses: [
        {
          id: 'exp-bday-1',
          name: 'Rooftop Cafe & Dining Space Booking',
          category: 'venue',
          estimated: 12000000,
          actual: 12000000,
          status: 'paid',
          notes: 'Exclusive rooftop booking 17:00 - 22:00'
        },
        {
          id: 'exp-bday-2',
          name: 'Pastel Dream Decoration, Balloon Arch & Stage',
          category: 'decor',
          estimated: 8000000,
          actual: 7500000,
          status: 'paid',
          notes: 'Lighting neon pink-purple with floral backdrop'
        },
        {
          id: 'exp-bday-3',
          name: 'Custom 3-Tier Fondant Birthday Cake',
          category: 'catering',
          estimated: 3000000,
          actual: 2800000,
          status: 'paid',
          notes: 'Lavender velvet flavor with macarons topping'
        }
      ],
      checklist: [
        {
          id: 'chk-bday-1',
          title: 'Pesan Custom Kue Ulang Tahun 3 Tingkat',
          stage: 'h30',
          priority: 'high',
          due: plusDays(-2),
          pic: 'Mama Aria',
          notes: 'Desain cake pastel dengan lilin sparklers.',
          completed: true
        },
        {
          id: 'chk-bday-2',
          title: 'Fitting Dress Ulang Tahun Aria',
          stage: 'h7',
          priority: 'medium',
          due: plusDays(10),
          pic: 'Aria',
          notes: 'Dress lavender tulle sudah siap diambil.',
          completed: true
        }
      ],
      rundown: [
        {
          id: 'rd-bday-1',
          day: '1',
          startTime: '18:00',
          endTime: '18:30',
          title: 'Guest Arrival & 360 Spin Photo Booth',
          location: 'Rooftop Entrance',
          pic: 'Crew Organizer',
          notes: 'Welcome mocktail pastel blue served.',
          status: 'upcoming'
        },
        {
          id: 'rd-bday-2',
          day: '1',
          startTime: '19:00',
          endTime: '19:45',
          title: 'Candle Blowing & 17 Wishes Ceremony',
          location: 'Central Stage',
          pic: 'MC & Family',
          notes: 'Pemotongan kue dan pemberian suapan pertama.',
          status: 'upcoming'
        }
      ]
    };

    this.events = [weddingEvent, techEvent, birthdayEvent];
    this.activeEventId = weddingEvent.id;
    this.save();
  }
}

const store = new EventStore();
