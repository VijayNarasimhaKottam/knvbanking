/* ============================================================
   KVN BANK — ROUTER.JS
   Page Routing, Layout Injection, Auth Guards
   ============================================================ */

const PUBLIC_PAGES = [
  'index.html',
  'login.html',
  'register.html',
  'forgot-password.html',
  'contact.html',
  'locator.html'
];

/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize data layer (first time only)
  initializeApp();

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const isPublic = PUBLIC_PAGES.includes(page);
  const loggedIn = isLoggedIn();

  // 2. Auth Guards
  if (!isPublic && !loggedIn) {
    // Redirect unauthenticated user trying to access protected page
    window.location.replace(`login.html?redirect=${encodeURIComponent(page)}`);
    return;
  }

  if (page === 'login.html' && loggedIn) {
    // Redirect logged in user trying to access login page
    window.location.replace('dashboard.html');
    return;
  }

  // 3. Layout Injection for Authenticated Pages
  if (!isPublic && loggedIn) {
    injectAuthenticatedLayout();
    startSessionMonitor();
    updateNavigationState(page);
  }

  // 4. Trigger View Transitions API if supported
  if (!document.startViewTransition) {
    document.body.classList.add('page-loaded');
  } else {
    // Basic fallback since we don't have true SPA routing
    document.body.classList.add('page-loaded');
  }
});

/**
 * Injects the common sidebar and topnav layout for authenticated pages
 */
function injectAuthenticatedLayout() {
  const session = getSession();
  if (!session) return;

  // Save the original page content
  const pageContent = document.body.innerHTML;
  document.body.innerHTML = '';

  // Create layout wrapper
  const layout = document.createElement('div');
  layout.className = 'app-layout';

  // Sidebar HTML
  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="dashboard.html" class="topnav-brand">
          <img src="assets/logo.svg" alt="KVN Bank Logo">
          <span class="topnav-brand-name">KVN <span>Bank</span></span>
        </a>
      </div>
      
      <div class="sidebar-label">Main Menu</div>
      <nav class="nav-menu">
        <div class="nav-item">
          <a href="dashboard.html" class="nav-link" data-page="dashboard.html">
            <span class="nav-link-icon">📊</span>
            <span class="nav-link-text">Dashboard</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="transfer.html" class="nav-link" data-page="transfer.html">
            <span class="nav-link-icon">💸</span>
            <span class="nav-link-text">Fund Transfer</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="statement.html" class="nav-link" data-page="statement.html">
            <span class="nav-link-icon">📄</span>
            <span class="nav-link-text">Account Statement</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-label">Services</div>
      <nav class="nav-menu">
        <div class="nav-item">
          <a href="bill-payment.html" class="nav-link" data-page="bill-payment.html">
            <span class="nav-link-icon">🧾</span>
            <span class="nav-link-text">Bill Payments</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="fixed-deposit.html" class="nav-link" data-page="fixed-deposit.html">
            <span class="nav-link-icon">💰</span>
            <span class="nav-link-text">Fixed Deposits</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="upi.html" class="nav-link" data-page="upi.html">
            <span class="nav-link-icon">📱</span>
            <span class="nav-link-text">UPI Management</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="beneficiaries.html" class="nav-link" data-page="beneficiaries.html">
            <span class="nav-link-icon">👥</span>
            <span class="nav-link-text">Beneficiaries</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-label">Settings</div>
      <nav class="nav-menu">
        <div class="nav-item">
          <a href="profile.html" class="nav-link" data-page="profile.html">
            <span class="nav-link-icon">👤</span>
            <span class="nav-link-text">My Profile</span>
          </a>
        </div>
        ${session.role === 'admin' ? `
        <div class="nav-item">
          <a href="admin.html" class="nav-link" data-page="admin.html">
            <span class="nav-link-icon">⚙️</span>
            <span class="nav-link-text">Admin Panel</span>
          </a>
        </div>
        ` : ''}
      </nav>
    </aside>
  `;

  // Main Content Area wrapper
  const mainWrapperHTML = `
    <div class="main-wrapper">
      <header class="topnav">
        <div class="topnav-left">
          <button class="hamburger" id="mobile-sidebar-toggle" aria-label="Toggle Sidebar">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div class="topnav-actions">
          <div class="topnav-datetime" id="live-datetime"></div>
          
          <button class="topnav-notification" id="notification-btn" aria-label="Notifications">
            🔔
            <span class="badge-count" id="notification-count" style="display: none;">0</span>
          </button>
          
          <div class="topnav-user" id="user-menu-btn" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
            <div class="topnav-avatar">${getInitials(session.fullName)}</div>
            <div class="topnav-user-info">
              <span class="topnav-user-name">${session.fullName}</span>
              <span class="topnav-user-role">${session.role === 'admin' ? 'Administrator' : 'Customer'}</span>
            </div>
            
            <div class="user-dropdown" id="user-dropdown">
              <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border-light); margin-bottom: 8px;">
                <div style="font-weight: 600; font-size: 14px;">${session.fullName}</div>
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">AC: ${maskAccountNo(session.accountNumber) || 'N/A'}</div>
              </div>
              <button class="dropdown-item" onclick="window.location.href='profile.html'">
                <span class="dropdown-item-icon">👤</span> Profile Settings
              </button>
              <button class="dropdown-item" onclick="window.location.href='locator.html'">
                <span class="dropdown-item-icon">📍</span> Branch Locator
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" onclick="logout('user_initiated')" data-testid="logout-btn">
                <span class="dropdown-item-icon">🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main class="main-content" id="main-content">
        ${pageContent}
      </main>
    </div>
  `;

  layout.innerHTML = sidebarHTML + mainWrapperHTML;
  document.body.appendChild(layout);

  // Setup layout interactions
  setupLayoutInteractions();
}

/**
 * Setup event listeners for the injected layout
 */
function setupLayoutInteractions() {
  // Mobile sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('mobile-sidebar-toggle');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      toggleBtn.classList.toggle('open');
    });
  }

  // User menu dropdown
  const userBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');
  
  if (userBtn && dropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open');
      userBtn.setAttribute('aria-expanded', !isOpen);
    });
  }

  // Close menus on outside click
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('open');
      toggleBtn.classList.remove('open');
    }
    
    if (dropdown && dropdown.classList.contains('open') && !userBtn.contains(e.target)) {
      dropdown.classList.remove('open');
      userBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Live datetime clock
  const datetimeEl = document.getElementById('live-datetime');
  if (datetimeEl) {
    const updateTime = () => { datetimeEl.textContent = getCurrentDateTime(); };
    updateTime();
    setInterval(updateTime, 60000); // update every minute
  }

  // Initialize notifications counter
  updateNotificationCounter();
}

/**
 * Highlights the current page in the sidebar navigation
 */
function updateNavigationState(currentPage) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });
}

/**
 * Updates the unread notifications badge in the topnav
 */
function updateNotificationCounter() {
  const session = getSession();
  if (!session) return;
  
  const notifications = getNotifications(session.userId);
  const unread = notifications.filter(n => !n.read).length;
  
  const badge = document.getElementById('notification-count');
  if (badge) {
    if (unread > 0) {
      badge.textContent = unread > 99 ? '99+' : unread;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}
