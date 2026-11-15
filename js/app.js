// ===================================================================
// EVENTLY - MAIN APPLICATION CONTROLLER
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let currentView = 'dashboard';
  let budgetFilterStatus = 'all';
  let budgetSearchQuery = '';
  let checklistFilterStatus = 'all';
  let checklistSearchQuery = '';
  let rundownDay = '1';
  let rundownSearchQuery = '';

  // DOM Elements
  const appSidebar = document.getElementById('appSidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Navigation Links
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');

  // Language & Currency Buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  const currButtons = document.querySelectorAll('.curr-btn');

  // =================================================================
  // TOAST NOTIFICATIONS
  // =================================================================
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="flex-shrink: 0; display: flex; align-items: center;">${iconSvg}</div>
      <div style="flex: 1;">${message}</div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3500);
  }

  // =================================================================
  // VIEW SWITCHING
  // =================================================================
  function switchView(viewName) {
    currentView = viewName;

    navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    viewSections.forEach(sec => {
      if (sec.id === `view-${viewName}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (appSidebar) {
      appSidebar.classList.remove('show');
    }

    // Render corresponding view
    renderCurrentView();
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      switchView(targetView);
    });
  });

  // Quick navigation buttons with data-nav attribute
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      const target = navBtn.getAttribute('data-nav');
      switchView(target);
    }
  });

  // Mobile menu open / close
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      appSidebar.classList.add('show');
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => {
      appSidebar.classList.remove('show');
    });
  }

  // =================================================================
  // I18N & CURRENCY CONTROLLERS
  // =================================================================
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      i18n.setLanguage(lang);
      renderAll();
    });
  });

  currButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const curr = btn.getAttribute('data-curr');
      store.setCurrency(curr);
      currButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAll();
    });
  });

  // Set active currency button on init
  currButtons.forEach(btn => {
    if (btn.getAttribute('data-curr') === store.currency) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // =================================================================
  // HELPER FORMATTERS
  // =================================================================
  function formatDateNice(dateStr) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      const locale = i18n.currentLang === 'id' ? 'id-ID' : 'en-US';
      return d.toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }

  function getCategoryName(catKey) {
    const dictKey = 'cat_' + catKey;
    return i18n.t(dictKey, catKey);
  }

  function getExpenseCategoryName(catKey) {
    const dictKey = 'exp_cat_' + catKey;
    return i18n.t(dictKey, catKey);
  }

  function getStageName(stageKey) {
    const dictKey = 'checklist_stage_' + stageKey;
    return i18n.t(dictKey, stageKey);
  }

  function getPriorityBadge(priority) {
    if (priority === 'high') {
      return `<span class="badge badge-danger">${i18n.t('checklist_priority_high')}</span>`;
    } else if (priority === 'medium') {
      return `<span class="badge badge-warning">${i18n.t('checklist_priority_medium')}</span>`;
    } else {
      return `<span class="badge badge-babyblue">${i18n.t('checklist_priority_low')}</span>`;
    }
  }

  function calculateCountdown(dateStr) {
    if (!dateStr) return { number: 0, label: i18n.t('dash_countdown_days') };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr + 'T00:00:00');
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { number: '🎉', label: i18n.t('dash_countdown_today') };
    } else if (diffDays < 0) {
      return { number: Math.abs(diffDays), label: i18n.t('dash_countdown_past') };
    } else {
      return { number: diffDays, label: i18n.t('dash_countdown_days') };
    }
  }

  // =================================================================
  // HEADER & SIDEBAR INFO RENDERING
  // =================================================================
  function renderHeaderAndSidebar() {
    const active = store.getActiveEvent();
    if (!active) return;

    // Sidebar
    const sidebarName = document.getElementById('sidebarActiveEventName');
    if (sidebarName) sidebarName.textContent = active.title;

    const sidebarDays = document.getElementById('sidebarEventDaysBadge');
    if (sidebarDays) {
      const cd = calculateCountdown(active.date);
      sidebarDays.textContent = typeof cd.number === 'number' ? `${cd.number} d` : 'Hari-H';
    }

    // Top Header
    const topTitle = document.getElementById('topHeaderEventTitle');
    if (topTitle) topTitle.textContent = active.title;
  }

  // =================================================================
  // DASHBOARD VIEW RENDERING
  // =================================================================
  function renderDashboard() {
    const active = store.getActiveEvent();
    if (!active) return;

    // 1. Hero Banner
    const catBadge = document.getElementById('dashCategoryBadge');
    if (catBadge) catBadge.textContent = getCategoryName(active.category);

    const guestsBadge = document.getElementById('dashGuestsBadge');
    if (guestsBadge) guestsBadge.textContent = `${active.guests} ${i18n.currentLang === 'id' ? 'Tamu' : 'Guests'}`;

    const titleEl = document.getElementById('dashEventTitle');
    if (titleEl) titleEl.textContent = active.title;

    const dateEl = document.getElementById('dashEventDate');
    if (dateEl) dateEl.textContent = formatDateNice(active.date);

    const timeEl = document.getElementById('dashEventTime');
    if (timeEl) timeEl.textContent = `${active.time || '10:00'} ${i18n.currentLang === 'id' ? 'WIB' : ''}`;

    const locEl = document.getElementById('dashEventLocation');
    if (locEl) locEl.textContent = active.location || '-';

    const cd = calculateCountdown(active.date);
    const cdNum = document.getElementById('dashCountdownNumber');
    if (cdNum) cdNum.textContent = cd.number;

    const cdLbl = document.getElementById('dashCountdownLabel');
    if (cdLbl) cdLbl.textContent = cd.label;

    // 2. Budget Stats Cards
    const bSummary = store.getBudgetSummary(active);
    const targetEl = document.getElementById('dashStatTargetBudget');
    if (targetEl) targetEl.textContent = store.formatMoney(bSummary.target);

    const spentEl = document.getElementById('dashStatActualSpent');
    if (spentEl) spentEl.textContent = store.formatMoney(bSummary.spent);

    const remEl = document.getElementById('dashStatRemainingFunds');
    if (remEl) remEl.textContent = store.formatMoney(bSummary.remaining);

    const budgetCountBadge = document.getElementById('dashBudgetCountBadge');
    if (budgetCountBadge) {
      budgetCountBadge.textContent = `${bSummary.count} ${i18n.currentLang === 'id' ? 'pos' : 'items'}`;
    }

    const spentPercentText = document.getElementById('dashStatSpentPercentText');
    if (spentPercentText) {
      spentPercentText.textContent = `${bSummary.percentSpent}% ${i18n.currentLang === 'id' ? 'terpakai' : 'used'}`;
    }

    const spentProgressBar = document.getElementById('dashSpentProgressBar');
    if (spentProgressBar) {
      spentProgressBar.style.width = `${Math.min(bSummary.percentSpent, 100)}%`;
      if (bSummary.percentSpent > 100) {
        spentProgressBar.className = 'progress-bar-fill danger';
      } else if (bSummary.percentSpent > 85) {
        spentProgressBar.className = 'progress-bar-fill warning';
      } else {
        spentProgressBar.className = 'progress-bar-fill';
      }
    }

    const spentStatus = document.getElementById('dashStatSpentStatus');
    if (spentStatus) {
      if (bSummary.percentSpent > 100) {
        spentStatus.textContent = i18n.t('dash_status_over');
        spentStatus.className = 'stat-pill badge-danger';
      } else if (bSummary.percentSpent > 85) {
        spentStatus.textContent = i18n.t('dash_status_warning');
        spentStatus.className = 'stat-pill badge-warning';
      } else {
        spentStatus.textContent = i18n.t('dash_status_safe');
        spentStatus.className = 'stat-pill badge-babyblue';
      }
    }

    const remBadge = document.getElementById('dashRemainingBadge');
    const remIcon = document.getElementById('dashRemainingIcon');
    if (remBadge) {
      if (bSummary.remaining < 0) {
        remBadge.textContent = i18n.t('dash_status_over');
        remBadge.className = 'stat-pill badge-danger';
        if (remIcon) remIcon.className = 'stat-icon amber';
      } else {
        remBadge.textContent = i18n.t('dash_status_safe');
        remBadge.className = 'stat-pill badge-success';
        if (remIcon) remIcon.className = 'stat-icon green';
      }
    }

    // 3. Checklist Stats Card
    const cSummary = store.getChecklistSummary(active);
    const ratioEl = document.getElementById('dashStatChecklistRatio');
    if (ratioEl) ratioEl.textContent = `${cSummary.completed} / ${cSummary.total}`;

    const chkPercentText = document.getElementById('dashChecklistPercentText');
    if (chkPercentText) {
      chkPercentText.textContent = `${cSummary.percent}% ${i18n.currentLang === 'id' ? 'selesai' : 'done'}`;
    }

    const chkProgressBar = document.getElementById('dashChecklistProgressBar');
    if (chkProgressBar) {
      chkProgressBar.style.width = `${cSummary.percent}%`;
    }

    const chkBadge = document.getElementById('dashChecklistBadge');
    if (chkBadge) {
      if (cSummary.percent === 100 && cSummary.total > 0) {
        chkBadge.textContent = '100% Ready!';
        chkBadge.className = 'stat-pill badge-success';
      } else {
        chkBadge.textContent = `${cSummary.pending} ${i18n.currentLang === 'id' ? 'tersisa' : 'left'}`;
        chkBadge.className = 'stat-pill badge-warning';
      }
    }

    // 4. Critical Tasks List (Pending tasks top 4)
    const taskContainer = document.getElementById('dashUpcomingTasksList');
    if (taskContainer) {
      const pendingTasks = (active.checklist || []).filter(t => !t.completed).slice(0, 4);
      if (pendingTasks.length === 0) {
        taskContainer.innerHTML = `
          <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.88rem;">
            ✨ ${i18n.t('dash_no_tasks')}
          </div>
        `;
      } else {
        taskContainer.innerHTML = pendingTasks.map(task => `
          <div class="dash-task-item">
            <div class="dash-task-left">
              <div class="task-checkbox-custom" data-toggle-task="${task.id}" title="Tandai selesai">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="display: none;">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <div class="dash-task-title">${escapeHtml(task.title)}</div>
                <div class="dash-task-due">
                  <span>📅 ${task.due ? formatDateNice(task.due) : '-'}</span>
                  <span>•</span>
                  <span>👤 ${escapeHtml(task.pic || 'PIC')}</span>
                </div>
              </div>
            </div>
            <div>
              ${getPriorityBadge(task.priority)}
            </div>
          </div>
        `).join('');
      }
    }

    // 5. Highlight Rundown List (Top 3 items)
    const rundownContainer = document.getElementById('dashUpcomingRundownList');
    if (rundownContainer) {
      const rundowns = (active.rundown || []).slice(0, 3);
      if (rundowns.length === 0) {
        rundownContainer.innerHTML = `
          <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.88rem;">
            ${i18n.t('dash_no_agenda')}
          </div>
        `;
      } else {
        rundownContainer.innerHTML = rundowns.map(rd => `
          <div class="dash-task-item" style="border-left: 3px solid var(--secondary);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-family: 'Outfit'; font-weight: 700; color: var(--primary); font-size: 0.88rem; min-width: 85px;">
                ${escapeHtml(rd.startTime)} - ${escapeHtml(rd.endTime)}
              </span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${escapeHtml(rd.title)}</div>
                <div style="font-size: 0.74rem; color: var(--text-muted);">
                  📍 ${escapeHtml(rd.location || '-')} • 👤 ${escapeHtml(rd.pic || '-')}
                </div>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // 6. Category Breakdown Progress Bars
    const catBreakdownContainer = document.getElementById('dashBudgetCategoryList');
    if (catBreakdownContainer) {
      const expenses = active.expenses || [];
      const catTotals = {};
      let totalSpent = 0;
      expenses.forEach(e => {
        const cat = e.category || 'other';
        const cost = Number(e.actual) || 0;
        catTotals[cat] = (catTotals[cat] || 0) + cost;
        totalSpent += cost;
      });

      const categoriesSorted = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a]);

      if (categoriesSorted.length === 0) {
        catBreakdownContainer.innerHTML = `
          <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.84rem;">
            ${i18n.t('budget_empty')}
          </div>
        `;
      } else {
        catBreakdownContainer.innerHTML = categoriesSorted.slice(0, 5).map(catKey => {
          const amount = catTotals[catKey];
          const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
          return `
            <div class="category-stat-row">
              <div class="category-stat-header">
                <span>${getExpenseCategoryName(catKey)}</span>
                <span style="color: var(--primary); font-weight: 700;">${store.formatMoney(amount)} (${pct}%)</span>
              </div>
              <div class="progress-bar-container" style="height: 6px;">
                <div class="progress-bar-fill" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 7. Event Details Card
    const descEl = document.getElementById('dashEventDescription');
    if (descEl) descEl.textContent = active.description || (i18n.currentLang === 'id' ? 'Tidak ada deskripsi acara.' : 'No description provided.');

    const catNameEl = document.getElementById('dashEventCatName');
    if (catNameEl) catNameEl.textContent = getCategoryName(active.category);

    const venueEl = document.getElementById('dashEventVenue');
    if (venueEl) venueEl.textContent = active.location || '-';

    const guestsEl = document.getElementById('dashEventTargetGuests');
    if (guestsEl) guestsEl.textContent = `${active.guests} ${i18n.currentLang === 'id' ? 'Orang' : 'Guests'}`;
  }

  // =================================================================
  // EVENTS MANAGEMENT VIEW RENDERING
  // =================================================================
  function renderEventsList() {
    const eventsContainer = document.getElementById('eventsListGrid');
    if (!eventsContainer) return;

    const allEvents = store.getEvents();
    const activeId = store.activeEventId;

    if (allEvents.length === 0) {
      eventsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
            </svg>
          </div>
          <h3>${i18n.t('events_empty')}</h3>
        </div>
      `;
      return;
    }

    eventsContainer.innerHTML = allEvents.map(ev => {
      const isActive = ev.id === activeId;
      const cd = calculateCountdown(ev.date);
      const bSum = store.getBudgetSummary(ev);
      const cSum = store.getChecklistSummary(ev);

      return `
        <div class="event-card ${isActive ? 'active-event-card' : ''}" data-event-id="${ev.id}">
          <div class="event-card-cover theme-${ev.theme || 'lavender'}">
            <span class="badge" style="background: rgba(255, 255, 255, 0.9); color: var(--text-primary);">
              ${getCategoryName(ev.category)}
            </span>
            ${isActive ? `
              <span class="badge badge-success">
                ● ${i18n.t('events_active_badge')}
              </span>
            ` : `
              <span class="badge" style="background: rgba(255, 255, 255, 0.75); color: var(--text-secondary); font-size: 0.72rem;">
                ${typeof cd.number === 'number' ? `${cd.number} ${i18n.t('dash_countdown_days')}` : cd.label}
              </span>
            `}
          </div>

          <div class="event-card-body">
            <h3 class="event-card-title">${escapeHtml(ev.title)}</h3>
            <p class="event-card-desc">${escapeHtml(ev.description || '-')}</p>

            <div class="event-card-meta">
              <div>📅 <strong>${i18n.t('events_date_label')}</strong> ${formatDateNice(ev.date)} (${ev.time || '10:00'})</div>
              <div>📍 <strong>${i18n.t('events_location_label')}</strong> ${escapeHtml(ev.location || '-')}</div>
              <div>👥 <strong>${i18n.t('events_guest_count')}</strong> ${ev.guests} ${i18n.currentLang === 'id' ? 'tamu' : 'guests'}</div>
              <div>💰 <strong>${i18n.t('events_budget_target')}</strong> ${store.formatMoney(ev.targetBudget)}</div>
            </div>

            <!-- Mini Progress for Budget & Readiness -->
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
                <span>${i18n.t('dash_stat_spent')} (${bSum.percentSpent}%)</span>
                <span>${store.formatMoney(bSum.spent)}</span>
              </div>
              <div class="progress-bar-container" style="height: 6px;">
                <div class="progress-bar-fill ${bSum.isOver ? 'danger' : ''}" style="width: ${Math.min(bSum.percentSpent, 100)}%;"></div>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
                <span>${i18n.t('events_progress_label')} (${cSum.percent}%)</span>
                <span>${cSum.completed}/${cSum.total}</span>
              </div>
              <div class="progress-bar-container" style="height: 6px;">
                <div class="progress-bar-fill success" style="width: ${cSum.percent}%;"></div>
              </div>
            </div>

            <div class="event-card-footer">
              ${isActive ? `
                <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.8; cursor: default;">
                  ✓ ${i18n.t('events_active_badge')}
                </button>
              ` : `
                <button class="btn btn-primary btn-sm" data-switch-event="${ev.id}">
                  ${i18n.t('events_switch_btn')}
                </button>
              `}
              
              <div style="display: flex; gap: 6px;">
                <button class="btn-icon" data-edit-event="${ev.id}" title="${i18n.t('btn_edit_event')}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="btn-icon" data-delete-event="${ev.id}" title="${i18n.t('btn_delete_event')}" style="color: var(--status-danger);">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =================================================================
  // BUDGET PLANNER VIEW RENDERING
  // =================================================================
  function renderBudgetPlanner() {
    const active = store.getActiveEvent();
    if (!active) return;

    const bSum = store.getBudgetSummary(active);

    // Summary Hero
    const targetEl = document.getElementById('budgetPageTarget');
    if (targetEl) targetEl.textContent = store.formatMoney(bSum.target);

    const spentEl = document.getElementById('budgetPageSpent');
    if (spentEl) spentEl.textContent = store.formatMoney(bSum.spent);

    const remEl = document.getElementById('budgetPageRemaining');
    if (remEl) {
      remEl.textContent = store.formatMoney(bSum.remaining);
      remEl.className = bSum.isOver ? 'metric-number highlight-red' : 'metric-number highlight-green';
    }

    const pctEl = document.getElementById('budgetPagePercent');
    if (pctEl) pctEl.textContent = `${bSum.percentSpent}%`;

    const pBar = document.getElementById('budgetPageProgressBar');
    if (pBar) {
      pBar.style.width = `${Math.min(bSum.percentSpent, 100)}%`;
      pBar.className = bSum.isOver ? 'progress-bar-fill danger' : (bSum.percentSpent > 85 ? 'progress-bar-fill warning' : 'progress-bar-fill');
    }

    // Filter expenses
    const tableBody = document.getElementById('budgetTableBody');
    if (!tableBody) return;

    let items = active.expenses || [];

    // Filter by status
    if (budgetFilterStatus !== 'all') {
      items = items.filter(it => it.status === budgetFilterStatus);
    }

    // Filter by search query
    if (budgetSearchQuery.trim() !== '') {
      const q = budgetSearchQuery.toLowerCase();
      items = items.filter(it =>
        (it.name && it.name.toLowerCase().includes(q)) ||
        (it.notes && it.notes.toLowerCase().includes(q)) ||
        (it.category && it.category.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            ${i18n.t('budget_empty')}
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items.map(exp => {
      let statusBadge = '';
      if (exp.status === 'paid') {
        statusBadge = `<span class="badge badge-success">${i18n.t('budget_status_paid')}</span>`;
      } else if (exp.status === 'deposit') {
        statusBadge = `<span class="badge badge-warning">${i18n.t('budget_status_deposit')}</span>`;
      } else {
        statusBadge = `<span class="badge badge-danger">${i18n.t('budget_status_unpaid')}</span>`;
      }

      return `
        <tr>
          <td>
            <span class="table-item-name">${escapeHtml(exp.name)}</span>
          </td>
          <td>
            <span class="badge badge-lavender">${getExpenseCategoryName(exp.category)}</span>
          </td>
          <td>
            <strong>${store.formatMoney(exp.estimated)}</strong>
          </td>
          <td>
            <strong style="color: var(--primary);">${store.formatMoney(exp.actual)}</strong>
          </td>
          <td>
            ${statusBadge}
          </td>
          <td>
            <span class="table-item-sub">${escapeHtml(exp.notes || '-')}</span>
          </td>
          <td style="text-align: right;">
            <div class="cell-actions" style="justify-content: flex-end;">
              <button class="btn-icon" data-edit-expense="${exp.id}" title="${i18n.t('btn_save')}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-icon" data-delete-expense="${exp.id}" title="${i18n.t('btn_delete_event')}" style="color: var(--status-danger);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Budget Filter Pills Listeners
  const budgetPillsContainer = document.getElementById('budgetStatusFilterPills');
  if (budgetPillsContainer) {
    budgetPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (pill) {
        budgetPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        budgetFilterStatus = pill.getAttribute('data-status');
        renderBudgetPlanner();
      }
    });
  }

  const budgetSearchInput = document.getElementById('budgetSearchInput');
  if (budgetSearchInput) {
    budgetSearchInput.addEventListener('input', (e) => {
      budgetSearchQuery = e.target.value;
      renderBudgetPlanner();
    });
  }

  // Export CSV
  const exportCsvBtn = document.getElementById('budgetExportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const active = store.getActiveEvent();
      if (!active) return;
      const expenses = active.expenses || [];
      if (expenses.length === 0) {
        showToast(i18n.t('budget_empty'), 'warning');
        return;
      }

      let csv = 'No,Deskripsi,Kategori,Estimasi,Realisasi,Status,Catatan\n';
      expenses.forEach((item, idx) => {
        csv += `"${idx + 1}","${(item.name || '').replace(/"/g, '""')}","${getExpenseCategoryName(item.category)}","${item.estimated}","${item.actual}","${item.status}","${(item.notes || '').replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `evently-budget-${active.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('File CSV berhasil diunduh!', 'success');
    });
  }

  // =================================================================
  // CHECKLIST VIEW RENDERING
  // =================================================================
  function renderChecklist() {
    const active = store.getActiveEvent();
    if (!active) return;

    const cSum = store.getChecklistSummary(active);
    const countEl = document.getElementById('checklistCompletionCountText');
    if (countEl) {
      countEl.textContent = `${cSum.completed} ${i18n.currentLang === 'id' ? 'dari' : 'of'} ${cSum.total} ${i18n.currentLang === 'id' ? 'tugas telah selesai' : 'tasks completed'}`;
    }

    const pctEl = document.getElementById('checklistCompletionPercent');
    if (pctEl) pctEl.textContent = `${cSum.percent}%`;

    const pBar = document.getElementById('checklistMainProgressBar');
    if (pBar) pBar.style.width = `${cSum.percent}%`;

    const container = document.getElementById('checklistTasksContainer');
    if (!container) return;

    let tasks = active.checklist || [];

    // Filter by completed status
    if (checklistFilterStatus === 'completed') {
      tasks = tasks.filter(t => t.completed);
    } else if (checklistFilterStatus === 'pending') {
      tasks = tasks.filter(t => !t.completed);
    }

    // Filter by search
    if (checklistSearchQuery.trim() !== '') {
      const q = checklistSearchQuery.toLowerCase();
      tasks = tasks.filter(t =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.pic && t.pic.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <h3>${i18n.t('checklist_empty')}</h3>
        </div>
      `;
      return;
    }

    // Group by Stage
    const stages = ['h90', 'h30', 'h7', 'hday', 'post'];
    let html = '';

    stages.forEach(stageKey => {
      const stageTasks = tasks.filter(t => (t.stage || 'h90') === stageKey);
      if (stageTasks.length > 0) {
        html += `
          <div class="stage-group-container">
            <div class="stage-group-header">
              <span class="stage-group-title">${getStageName(stageKey)}</span>
              <span class="badge badge-lavender">${stageTasks.length} ${i18n.currentLang === 'id' ? 'tugas' : 'tasks'}</span>
            </div>
            <div>
              ${stageTasks.map(task => `
                <div class="task-card-item ${task.completed ? 'completed-task' : ''}" data-task-id="${task.id}">
                  <div class="task-main-info">
                    <div class="task-checkbox-custom ${task.completed ? 'checked' : ''}" data-toggle-task="${task.id}">
                      ${task.completed ? `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ` : ''}
                    </div>
                    <div>
                      <div class="task-title-text">${escapeHtml(task.title)}</div>
                      <div class="task-badges">
                        ${getPriorityBadge(task.priority)}
                        ${task.pic ? `<span style="font-size: 0.75rem; color: var(--text-muted);">👤 ${escapeHtml(task.pic)}</span>` : ''}
                        ${task.due ? `<span style="font-size: 0.75rem; color: var(--text-muted);">📅 ${formatDateNice(task.due)}</span>` : ''}
                      </div>
                      ${task.notes ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">${escapeHtml(task.notes)}</div>` : ''}
                    </div>
                  </div>

                  <div class="task-right-meta">
                    <button class="btn-icon" data-edit-task="${task.id}" title="${i18n.t('btn_save')}">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button class="btn-icon" data-delete-task="${task.id}" title="${i18n.t('btn_delete_event')}" style="color: var(--status-danger);">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  }

  // Quick Inline Task Add Form
  const checklistQuickForm = document.getElementById('checklistQuickForm');
  const checklistQuickInput = document.getElementById('checklistQuickInput');
  if (checklistQuickForm) {
    checklistQuickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = checklistQuickInput.value.trim();
      if (!text) return;

      store.addTask({
        title: text,
        stage: 'h30',
        priority: 'medium',
        due: '',
        pic: '',
        notes: '',
        completed: false
      });

      checklistQuickInput.value = '';
      showToast(i18n.t('toast_task_added'), 'success');
      renderChecklist();
      renderDashboard();
    });
  }

  // Checklist Filter Status Pills
  const checklistStatusPills = document.getElementById('checklistStatusPills');
  if (checklistStatusPills) {
    checklistStatusPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (pill) {
        checklistStatusPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        checklistFilterStatus = pill.getAttribute('data-filter');
        renderChecklist();
      }
    });
  }

  const checklistSearchInput = document.getElementById('checklistSearchInput');
  if (checklistSearchInput) {
    checklistSearchInput.addEventListener('input', (e) => {
      checklistSearchQuery = e.target.value;
      renderChecklist();
    });
  }

  // Task Checkbox Toggle Delegator
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-toggle-task]');
    if (toggleBtn) {
      const taskId = toggleBtn.getAttribute('data-toggle-task');
      store.toggleTaskCompleted(taskId);
      showToast(i18n.t('toast_task_status'), 'info');
      renderChecklist();
      renderDashboard();
      renderEventsList();
    }
  });

  // =================================================================
  // TIMELINE & RUNDOWN VIEW RENDERING
  // =================================================================
  function renderRundown() {
    const active = store.getActiveEvent();
    if (!active) return;

    const container = document.getElementById('rundownTimelineContainer');
    if (!container) return;

    let items = (active.rundown || []).filter(r => (r.day || '1') === rundownDay);

    // Search query filter
    if (rundownSearchQuery.trim() !== '') {
      const q = rundownSearchQuery.toLowerCase();
      items = items.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.pic && r.pic.toLowerCase().includes(q)) ||
        (r.location && r.location.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3>${i18n.t('rundown_empty')}</h3>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(rd => `
      <div class="timeline-item" data-rundown-id="${rd.id}">
        <div class="timeline-time-box">
          <div class="time-start">${escapeHtml(rd.startTime)}</div>
          <div class="time-end">s/d ${escapeHtml(rd.endTime)}</div>
        </div>

        <div class="timeline-node"></div>

        <div class="timeline-content-card">
          <div class="timeline-content-header">
            <h4 class="timeline-activity-title">${escapeHtml(rd.title)}</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn-icon" data-edit-rundown="${rd.id}" title="${i18n.t('btn_save')}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-icon" data-delete-rundown="${rd.id}" title="${i18n.t('btn_delete_event')}" style="color: var(--status-danger);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="timeline-details-row">
            ${rd.location ? `<span>📍 <strong>Lokasi:</strong> ${escapeHtml(rd.location)}</span>` : ''}
            ${rd.pic ? `<span>👤 <strong>PIC:</strong> ${escapeHtml(rd.pic)}</span>` : ''}
          </div>

          ${rd.notes ? `
            <div class="timeline-notes">
              ${escapeHtml(rd.notes)}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // Rundown Day Pills Listener
  const rundownDayPills = document.getElementById('rundownDayPills');
  if (rundownDayPills) {
    rundownDayPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (pill) {
        rundownDayPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        rundownDay = pill.getAttribute('data-day');
        renderRundown();
      }
    });
  }

  const rundownSearchInput = document.getElementById('rundownSearchInput');
  if (rundownSearchInput) {
    rundownSearchInput.addEventListener('input', (e) => {
      rundownSearchQuery = e.target.value;
      renderRundown();
    });
  }

  // =================================================================
  // MODALS HANDLING
  // =================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Close modals on clicking backdrop or close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  // =================================================================
  // EVENT CREATE / EDIT MODAL LOGIC
  // =================================================================
  const eventModal = document.getElementById('eventModal');
  const eventForm = document.getElementById('eventForm');
  const eventModalTitle = document.getElementById('eventModalTitle');

  function openCreateEventModal() {
    eventForm.reset();
    document.getElementById('eventFormId').value = '';
    document.getElementById('eventFormDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('eventFormBudget').value = store.currency === 'USD' ? '10000' : '50000000';
    if (eventModalTitle) eventModalTitle.textContent = i18n.t('modal_title_new_event');
    openModal('eventModal');
  }

  function openEditEventModal(eventId) {
    const ev = store.getEventById(eventId);
    if (!ev) return;
    document.getElementById('eventFormId').value = ev.id;
    document.getElementById('eventFormTitle').value = ev.title || '';
    document.getElementById('eventFormCategory').value = ev.category || 'other';
    document.getElementById('eventFormTheme').value = ev.theme || 'lavender';
    document.getElementById('eventFormDate').value = ev.date || '';
    document.getElementById('eventFormTime').value = ev.time || '10:00';
    document.getElementById('eventFormGuests').value = ev.guests || 100;
    document.getElementById('eventFormBudget').value = ev.targetBudget || 50000000;
    document.getElementById('eventFormLocation').value = ev.location || '';
    document.getElementById('eventFormDesc').value = ev.description || '';
    if (eventModalTitle) eventModalTitle.textContent = i18n.t('modal_title_edit_event');
    openModal('eventModal');
  }

  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('eventFormId').value;
    const title = document.getElementById('eventFormTitle').value.trim();
    const category = document.getElementById('eventFormCategory').value;
    const theme = document.getElementById('eventFormTheme').value;
    const date = document.getElementById('eventFormDate').value;
    const time = document.getElementById('eventFormTime').value;
    const guests = document.getElementById('eventFormGuests').value;
    const budgetRaw = document.getElementById('eventFormBudget').value;
    const location = document.getElementById('eventFormLocation').value.trim();
    const desc = document.getElementById('eventFormDesc').value.trim();

    const targetBudget = store.parseMoneyInput(budgetRaw);

    if (id) {
      store.updateEvent(id, {
        title, category, theme, date, time, guests, targetBudget, location, description: desc
      });
      showToast(i18n.t('toast_event_updated'), 'success');
    } else {
      const created = store.addEvent({
        title, category, theme, date, time, guests, targetBudget, location, description: desc
      });
      showToast(i18n.t('toast_event_created'), 'success');
    }

    closeModal('eventModal');
    renderAll();
  });

  // Buttons triggering Event Modal
  document.getElementById('headerNewEventBtn').addEventListener('click', openCreateEventModal);
  document.getElementById('dashQuickAddEventBtn').addEventListener('click', openCreateEventModal);
  document.getElementById('eventsCreateBtn').addEventListener('click', openCreateEventModal);
  document.getElementById('dashEditEventBtn').addEventListener('click', () => {
    openEditEventModal(store.activeEventId);
  });

  // Switch Event Modal (Quick selection)
  function openSwitchEventModal() {
    const listContainer = document.getElementById('switchEventList');
    if (!listContainer) return;
    const all = store.getEvents();
    listContainer.innerHTML = all.map(ev => {
      const isActive = ev.id === store.activeEventId;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: ${isActive ? 'var(--primary-subtle)' : 'var(--bg-card-subtle)'}; border: 1px solid ${isActive ? 'var(--primary)' : 'var(--border-light)'}; border-radius: var(--radius-md); cursor: pointer;" data-select-event-id="${ev.id}">
          <div>
            <div style="font-weight: 700; color: var(--text-primary);">${escapeHtml(ev.title)}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${formatDateNice(ev.date)} • ${getCategoryName(ev.category)}</div>
          </div>
          ${isActive ? `<span class="badge badge-success">● Aktif</span>` : `<button class="btn btn-secondary btn-sm" style="pointer-events: none;">Pilih</button>`}
        </div>
      `;
    }).join('');
    openModal('switchEventModal');
  }

  document.getElementById('quickSelectEventBtn').addEventListener('click', openSwitchEventModal);
  document.getElementById('headerSwitchEventBtn').addEventListener('click', openSwitchEventModal);
  document.getElementById('switchModalNewEventBtn').addEventListener('click', () => {
    closeModal('switchEventModal');
    openCreateEventModal();
  });

  document.getElementById('switchEventList').addEventListener('click', (e) => {
    const item = e.target.closest('[data-select-event-id]');
    if (item) {
      const eventId = item.getAttribute('data-select-event-id');
      store.setActiveEvent(eventId);
      closeModal('switchEventModal');
      const active = store.getActiveEvent();
      showToast(`${i18n.t('toast_switched_event')} ${active.title}`, 'info');
      renderAll();
    }
  });

  // =================================================================
  // EXPENSE MODAL LOGIC
  // =================================================================
  const expenseModal = document.getElementById('expenseModal');
  const expenseForm = document.getElementById('expenseForm');
  const expenseModalTitle = document.getElementById('expenseModalTitle');

  function openAddExpenseModal() {
    expenseForm.reset();
    document.getElementById('expenseFormId').value = '';
    if (expenseModalTitle) expenseModalTitle.textContent = i18n.t('modal_title_new_expense');
    openModal('expenseModal');
  }

  function openEditExpenseModal(expId) {
    const active = store.getActiveEvent();
    if (!active || !active.expenses) return;
    const item = active.expenses.find(e => e.id === expId);
    if (!item) return;

    document.getElementById('expenseFormId').value = item.id;
    document.getElementById('expenseFormName').value = item.name || '';
    document.getElementById('expenseFormCategory').value = item.category || 'other';
    document.getElementById('expenseFormStatus').value = item.status || 'unpaid';
    document.getElementById('expenseFormEstimated').value = item.estimated || 0;
    document.getElementById('expenseFormActual').value = item.actual || 0;
    document.getElementById('expenseFormNotes').value = item.notes || '';

    if (expenseModalTitle) expenseModalTitle.textContent = i18n.t('modal_title_edit_expense');
    openModal('expenseModal');
  }

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('expenseFormId').value;
    const name = document.getElementById('expenseFormName').value.trim();
    const category = document.getElementById('expenseFormCategory').value;
    const status = document.getElementById('expenseFormStatus').value;
    const estimatedRaw = document.getElementById('expenseFormEstimated').value;
    const actualRaw = document.getElementById('expenseFormActual').value;
    const notes = document.getElementById('expenseFormNotes').value.trim();

    const estimated = store.parseMoneyInput(estimatedRaw);
    const actual = store.parseMoneyInput(actualRaw);

    if (id) {
      store.updateExpense(id, { name, category, status, estimated, actual, notes });
      showToast(i18n.t('toast_expense_updated'), 'success');
    } else {
      store.addExpense({ name, category, status, estimated, actual, notes });
      showToast(i18n.t('toast_expense_added'), 'success');
    }

    closeModal('expenseModal');
    renderBudgetPlanner();
    renderDashboard();
    renderEventsList();
  });

  document.getElementById('budgetAddExpenseBtn').addEventListener('click', openAddExpenseModal);
  document.getElementById('dashQuickAddExpenseBtn').addEventListener('click', openAddExpenseModal);

  // =================================================================
  // TASK MODAL LOGIC
  // =================================================================
  const taskModal = document.getElementById('taskModal');
  const taskForm = document.getElementById('taskForm');
  const taskModalTitle = document.getElementById('taskModalTitle');

  function openAddTaskModal() {
    taskForm.reset();
    document.getElementById('taskFormId').value = '';
    if (taskModalTitle) taskModalTitle.textContent = i18n.t('modal_title_new_task');
    openModal('taskModal');
  }

  function openEditTaskModal(taskId) {
    const active = store.getActiveEvent();
    if (!active || !active.checklist) return;
    const item = active.checklist.find(t => t.id === taskId);
    if (!item) return;

    document.getElementById('taskFormId').value = item.id;
    document.getElementById('taskFormTitle').value = item.title || '';
    document.getElementById('taskFormStage').value = item.stage || 'h30';
    document.getElementById('taskFormPriority').value = item.priority || 'medium';
    document.getElementById('taskFormDue').value = item.due || '';
    document.getElementById('taskFormPic').value = item.pic || '';
    document.getElementById('taskFormNotes').value = item.notes || '';

    if (taskModalTitle) taskModalTitle.textContent = i18n.t('modal_title_edit_task');
    openModal('taskModal');
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('taskFormId').value;
    const title = document.getElementById('taskFormTitle').value.trim();
    const stage = document.getElementById('taskFormStage').value;
    const priority = document.getElementById('taskFormPriority').value;
    const due = document.getElementById('taskFormDue').value;
    const pic = document.getElementById('taskFormPic').value.trim();
    const notes = document.getElementById('taskFormNotes').value.trim();

    if (id) {
      store.updateTask(id, { title, stage, priority, due, pic, notes });
      showToast(i18n.t('toast_task_updated'), 'success');
    } else {
      store.addTask({ title, stage, priority, due, pic, notes, completed: false });
      showToast(i18n.t('toast_task_added'), 'success');
    }

    closeModal('taskModal');
    renderChecklist();
    renderDashboard();
    renderEventsList();
  });

  document.getElementById('checklistAddTaskBtn').addEventListener('click', openAddTaskModal);
  document.getElementById('dashQuickAddTaskBtn').addEventListener('click', openAddTaskModal);

  // =================================================================
  // RUNDOWN MODAL LOGIC
  // =================================================================
  const rundownModal = document.getElementById('rundownModal');
  const rundownForm = document.getElementById('rundownForm');
  const rundownModalTitle = document.getElementById('rundownModalTitle');

  function openAddRundownModal() {
    rundownForm.reset();
    document.getElementById('rundownFormId').value = '';
    document.getElementById('rundownFormDay').value = rundownDay;
    if (rundownModalTitle) rundownModalTitle.textContent = i18n.t('modal_title_new_rundown');
    openModal('rundownModal');
  }

  function openEditRundownModal(rdId) {
    const active = store.getActiveEvent();
    if (!active || !active.rundown) return;
    const item = active.rundown.find(r => r.id === rdId);
    if (!item) return;

    document.getElementById('rundownFormId').value = item.id;
    document.getElementById('rundownFormTitle').value = item.title || '';
    document.getElementById('rundownFormDay').value = item.day || '1';
    document.getElementById('rundownFormStart').value = item.startTime || '09:00';
    document.getElementById('rundownFormEnd').value = item.endTime || '10:00';
    document.getElementById('rundownFormLocation').value = item.location || '';
    document.getElementById('rundownFormPic').value = item.pic || '';
    document.getElementById('rundownFormNotes').value = item.notes || '';

    if (rundownModalTitle) rundownModalTitle.textContent = i18n.t('modal_title_edit_rundown');
    openModal('rundownModal');
  }

  rundownForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('rundownFormId').value;
    const title = document.getElementById('rundownFormTitle').value.trim();
    const day = document.getElementById('rundownFormDay').value;
    const startTime = document.getElementById('rundownFormStart').value;
    const endTime = document.getElementById('rundownFormEnd').value;
    const location = document.getElementById('rundownFormLocation').value.trim();
    const pic = document.getElementById('rundownFormPic').value.trim();
    const notes = document.getElementById('rundownFormNotes').value.trim();

    if (id) {
      store.updateRundown(id, { title, day, startTime, endTime, location, pic, notes });
      showToast(i18n.t('toast_rundown_updated'), 'success');
    } else {
      store.addRundown({ title, day, startTime, endTime, location, pic, notes });
      showToast(i18n.t('toast_rundown_added'), 'success');
    }

    closeModal('rundownModal');
    renderRundown();
    renderDashboard();
  });

  document.getElementById('rundownAddBtn').addEventListener('click', openAddRundownModal);
  document.getElementById('dashQuickAddRundownBtn').addEventListener('click', openAddRundownModal);

  // =================================================================
  // GLOBAL ACTION HANDLER (EDIT & DELETE DELEGATION)
  // =================================================================
  let pendingDeleteAction = null;

  function askConfirmation(message, actionFn) {
    const msgEl = document.getElementById('confirmModalMessage');
    if (msgEl) msgEl.textContent = message;
    pendingDeleteAction = actionFn;
    openModal('confirmModal');
  }

  document.getElementById('confirmModalActionBtn').addEventListener('click', () => {
    if (typeof pendingDeleteAction === 'function') {
      pendingDeleteAction();
      pendingDeleteAction = null;
    }
    closeModal('confirmModal');
  });

  document.addEventListener('click', (e) => {
    // 1. Switch active event button on events page
    const switchBtn = e.target.closest('[data-switch-event]');
    if (switchBtn) {
      const eventId = switchBtn.getAttribute('data-switch-event');
      store.setActiveEvent(eventId);
      showToast(`${i18n.t('toast_switched_event')} ${store.getActiveEvent().title}`, 'info');
      renderAll();
      return;
    }

    // 2. Edit event
    const editEventBtn = e.target.closest('[data-edit-event]');
    if (editEventBtn) {
      const eventId = editEventBtn.getAttribute('data-edit-event');
      openEditEventModal(eventId);
      return;
    }

    // 3. Delete event
    const delEventBtn = e.target.closest('[data-delete-event]');
    if (delEventBtn) {
      const eventId = delEventBtn.getAttribute('data-delete-event');
      askConfirmation(i18n.t('confirm_delete_event'), () => {
        store.deleteEvent(eventId);
        showToast(i18n.t('toast_event_deleted'), 'warning');
        renderAll();
      });
      return;
    }

    // 4. Edit Expense
    const editExpBtn = e.target.closest('[data-edit-expense]');
    if (editExpBtn) {
      const expId = editExpBtn.getAttribute('data-edit-expense');
      openEditExpenseModal(expId);
      return;
    }

    // 5. Delete Expense
    const delExpBtn = e.target.closest('[data-delete-expense]');
    if (delExpBtn) {
      const expId = delExpBtn.getAttribute('data-delete-expense');
      askConfirmation(i18n.t('confirm_delete_item'), () => {
        store.deleteExpense(expId);
        showToast(i18n.t('toast_expense_deleted'), 'warning');
        renderBudgetPlanner();
        renderDashboard();
        renderEventsList();
      });
      return;
    }

    // 6. Edit Task
    const editTaskBtn = e.target.closest('[data-edit-task]');
    if (editTaskBtn) {
      const taskId = editTaskBtn.getAttribute('data-edit-task');
      openEditTaskModal(taskId);
      return;
    }

    // 7. Delete Task
    const delTaskBtn = e.target.closest('[data-delete-task]');
    if (delTaskBtn) {
      const taskId = delTaskBtn.getAttribute('data-delete-task');
      askConfirmation(i18n.t('confirm_delete_item'), () => {
        store.deleteTask(taskId);
        showToast(i18n.t('toast_task_deleted'), 'warning');
        renderChecklist();
        renderDashboard();
        renderEventsList();
      });
      return;
    }

    // 8. Edit Rundown
    const editRundownBtn = e.target.closest('[data-edit-rundown]');
    if (editRundownBtn) {
      const rdId = editRundownBtn.getAttribute('data-edit-rundown');
      openEditRundownModal(rdId);
      return;
    }

    // 9. Delete Rundown
    const delRundownBtn = e.target.closest('[data-delete-rundown]');
    if (delRundownBtn) {
      const rdId = delRundownBtn.getAttribute('data-delete-rundown');
      askConfirmation(i18n.t('confirm_delete_item'), () => {
        store.deleteRundown(rdId);
        showToast(i18n.t('toast_rundown_deleted'), 'warning');
        renderRundown();
        renderDashboard();
      });
      return;
    }
  });

  // =================================================================
  // UTILITY ESCAPE HTML
  // =================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =================================================================
  // MASTER RENDER DISPATCHER
  // =================================================================
  function renderCurrentView() {
    switch (currentView) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'events':
        renderEventsList();
        break;
      case 'budget':
        renderBudgetPlanner();
        break;
      case 'checklist':
        renderChecklist();
        break;
      case 'rundown':
        renderRundown();
        break;
      default:
        renderDashboard();
    }
  }

  function renderAll() {
    i18n.applyTranslations();
    renderHeaderAndSidebar();
    renderCurrentView();
  }

  // Initialize
  renderAll();
});
