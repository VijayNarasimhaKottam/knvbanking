/* ============================================================
   KVN BANK — UTILS.JS
   Toast, Modal, Spinner, Formatters, Generators
   ============================================================ */

/* ========== TOAST NOTIFICATIONS ========== */
let toastCounter = 0;

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} [title] - Optional title
 * @param {number} [duration] - Auto-dismiss in ms (0 = no auto-dismiss)
 */
function showToast(message, type = 'info', title, duration) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const titles = {
    success: title || 'Success',
    error: title || 'Error',
    warning: title || 'Warning',
    info: title || 'Information'
  };

  const durations = {
    success: 3000,
    error: 5000,
    warning: 4000,
    info: 3000
  };

  const toastId = `toast-${++toastCounter}`;
  const autoDismiss = duration !== undefined ? duration : durations[type];

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.id = toastId;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-body">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="hideToast('${toastId}')" aria-label="Close notification">&times;</button>
    ${autoDismiss > 0 ? `<div class="toast-progress" style="--toast-duration: ${autoDismiss}ms;"></div>` : ''}
  `;

  container.appendChild(toast);

  if (autoDismiss > 0) {
    setTimeout(() => hideToast(toastId), autoDismiss);
  }

  return toastId;
}

function hideToast(id) {
  const toast = document.getElementById(id);
  if (!toast) return;
  toast.classList.add('toast-exit');
  setTimeout(() => toast.remove(), 300);
}


/* ========== MODAL ========== */
/**
 * Show a modal dialog
 * @param {Object} config
 * @param {string} config.title
 * @param {string} config.body - HTML content
 * @param {Array} [config.buttons] - { text, class, onClick, testId }
 * @param {boolean} [config.closeOnOverlay] - Close when clicking overlay
 * @param {string} [config.size] - 'sm' | 'md' | 'lg'
 */
function showModal(config) {
  hideModal(); // Remove existing

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-container';
  overlay.setAttribute('data-testid', 'modal-overlay');

  const sizeMap = { sm: '380px', md: '480px', lg: '640px' };
  const maxWidth = sizeMap[config.size] || sizeMap.md;

  let buttonsHTML = '';
  if (config.buttons && config.buttons.length > 0) {
    buttonsHTML = `<div class="modal-footer">
      ${config.buttons.map(btn => 
        `<button class="btn ${btn.class || 'btn-primary'}" 
                 ${btn.testId ? `data-testid="${btn.testId}"` : ''}
                 ${btn.id ? `id="${btn.id}"` : ''}>${btn.text}</button>`
      ).join('')}
    </div>`;
  }

  overlay.innerHTML = `
    <div class="modal-container" role="dialog" aria-modal="true" aria-label="${config.title}" style="max-width: ${maxWidth};">
      <div class="modal-header">
        <h3 class="modal-title">${config.title}</h3>
        <button class="modal-close" aria-label="Close dialog">&times;</button>
      </div>
      <div class="modal-body">${config.body}</div>
      ${buttonsHTML}
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Close button
  overlay.querySelector('.modal-close').addEventListener('click', hideModal);

  // Close on overlay click
  if (config.closeOnOverlay !== false) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideModal();
    });
  }

  // Bind button events
  if (config.buttons) {
    const btns = overlay.querySelectorAll('.modal-footer .btn');
    config.buttons.forEach((btnConfig, i) => {
      if (btnConfig.onClick) {
        btns[i].addEventListener('click', btnConfig.onClick);
      }
    });
  }

  // Trap focus
  overlay.querySelector('.modal-close').focus();

  // Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      hideModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return overlay;
}

function hideModal() {
  const overlay = document.getElementById('modal-container');
  if (!overlay) return;
  overlay.classList.remove('active');
  setTimeout(() => overlay.remove(), 250);
}


/* ========== LOADING STATES ========== */
function showSpinner(elementId, text = 'Loading...') {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.style.position = 'relative';
  const loader = document.createElement('div');
  loader.className = 'loading-overlay';
  loader.id = `${elementId}-loader`;
  loader.innerHTML = `
    <div class="spinner spinner-lg"></div>
    <span class="loading-text">${text}</span>
  `;
  element.appendChild(loader);
  element.setAttribute('data-loaded', 'false');
}

function hideSpinner(elementId) {
  const loader = document.getElementById(`${elementId}-loader`);
  if (loader) loader.remove();
  const element = document.getElementById(elementId);
  if (element) element.setAttribute('data-loaded', 'true');
}

function showSkeleton(elementId, rows = 3) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let html = '';
  for (let i = 0; i < rows; i++) {
    html += `
      <div style="display: flex; gap: 12px; margin-bottom: 16px;">
        <div class="skeleton skeleton-avatar"></div>
        <div style="flex: 1;">
          <div class="skeleton skeleton-heading" style="width: ${60 + Math.random() * 30}%;"></div>
          <div class="skeleton skeleton-text" style="width: ${70 + Math.random() * 25}%;"></div>
        </div>
      </div>
    `;
  }
  element.innerHTML = html;
  element.setAttribute('data-loaded', 'false');
}


/* ========== FORMATTERS ========== */
/**
 * Format number as Indian currency
 * @param {number} amount
 * @returns {string} e.g., "₹1,25,000.00"
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0.00';
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
  return amount < 0 ? `-${formatted}` : formatted;
}

/**
 * Format date string
 * @param {string} dateStr - ISO date string
 * @param {string} [format] - 'short' | 'long' | 'datetime'
 * @returns {string} e.g., "12 Aug 2026"
 */
function formatDate(dateStr, format = 'short') {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  
  if (format === 'long') {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  }
  
  if (format === 'datetime') {
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });
}

/**
 * Format account number with spaces
 * @param {string} accNo
 * @returns {string} e.g., "NRB0 0100 001"
 */
function formatAccountNo(accNo) {
  if (!accNo) return '-';
  return accNo.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Generate transaction reference number
 * @returns {string} e.g., "TXN20260812XXXXXX"
 */
function generateTxnRef(prefix = 'TXN') {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const random = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  return `${prefix}${dateStr}${random}`;
}

/**
 * Generate a 6-digit OTP
 * @returns {string}
 */
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Generate CAPTCHA question
 * @returns {{ question: string, answer: number }}
 */
function generateCaptcha() {
  const operators = ['+', '-', '×'];
  const op = operators[Math.floor(Math.random() * operators.length)];
  let a, b, answer;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a * b;
      break;
  }

  return { question: `${a} ${op} ${b} = ?`, answer: answer };
}

/**
 * Validate password strength
 * @returns {{ score: number, label: string, color: string }}
 */
function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Weak', color: '#C00000' };
  if (score <= 3) return { score: 2, label: 'Fair', color: '#E87722' };
  if (score <= 4) return { score: 3, label: 'Good', color: '#C9A84C' };
  if (score <= 5) return { score: 4, label: 'Strong', color: '#1A7F4E' };
  return { score: 5, label: 'Very Strong', color: '#0E6B3A' };
}

/**
 * Validate password meets requirements
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('Minimum 8 characters required.');
  if (!/[A-Z]/.test(password)) errors.push('At least 1 uppercase letter required.');
  if (!/[a-z]/.test(password)) errors.push('At least 1 lowercase letter required.');
  if (!/[0-9]/.test(password)) errors.push('At least 1 number required.');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('At least 1 special character required.');
  return { valid: errors.length === 0, errors };
}

/**
 * Validate email format
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate mobile number (10 digits, starts with 6-9)
 */
function validateMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Validate PAN card
 */
function validatePAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
}

/**
 * Validate Aadhaar (12 digits)
 */
function validateAadhaar(aadhaar) {
  const clean = aadhaar.replace(/[\s-]/g, '');
  return /^\d{12}$/.test(clean);
}

/**
 * Validate IFSC code
 */
function validateIFSC(ifsc) {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
}

/**
 * Validate pincode (6 digits)
 */
function validatePincode(pincode) {
  return /^[1-9]\d{5}$/.test(pincode);
}

/**
 * Debounce function
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Generate unique ID
 */
function generateId(prefix = 'ID') {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/**
 * Mask account number (show last 4 digits)
 */
function maskAccountNo(accNo) {
  if (!accNo || accNo.length < 4) return accNo;
  return 'XXXX' + accNo.slice(-4);
}

/**
 * Mask balance
 */
function maskBalance() {
  return '₹ ****.**';
}

/**
 * Get greeting based on time
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Get current date time formatted
 */
function getCurrentDateTime() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Download content as CSV
 */
function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Get initials from full name
 */
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
