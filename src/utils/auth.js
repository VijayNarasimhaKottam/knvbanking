/* ============================================================
   KVN BANK — AUTH.JS
   Session Management, Login/Logout, Lockout
   ============================================================ */

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const LOCKOUT_DURATION = 5 * 60 * 1000;  // 5 minutes
const MAX_LOGIN_ATTEMPTS = 3;

/**
 * Validate credentials and create a session
 * @returns {{ success: boolean, error?: string, attemptsLeft?: number }}
 */
function login(username, password) {
  const user = getUserByUsername(username);
  
  if (!user) {
    return { success: false, error: 'Invalid username or password.' };
  }

  // Check lockout
  if (user.lockoutUntil) {
    const lockoutTime = new Date(user.lockoutUntil).getTime();
    if (Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      return { 
        success: false, 
        error: `Account is locked. Try again in ${formatSeconds(remaining)}.`,
        locked: true,
        lockoutRemaining: remaining
      };
    } else {
      // Lockout expired, reset
      updateUser(user.id, { loginAttempts: 0, lockoutUntil: null, status: 'active' });
      user.loginAttempts = 0;
      user.lockoutUntil = null;
    }
  }

  // Check if account is inactive
  if (user.status === 'inactive') {
    return { success: false, error: 'Your account has been deactivated. Contact the administrator.' };
  }

  // Validate password
  const decodedPassword = atob(user.passwordHash);
  if (password !== decodedPassword) {
    const attempts = (user.loginAttempts || 0) + 1;
    const attemptsLeft = MAX_LOGIN_ATTEMPTS - attempts;
    
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      // Lock the account
      const lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION).toISOString();
      updateUser(user.id, { 
        loginAttempts: attempts, 
        lockoutUntil: lockoutUntil,
        status: 'locked'
      });
      return { 
        success: false, 
        error: 'Account locked due to too many failed attempts. Try again in 5 minutes.',
        locked: true,
        lockoutRemaining: LOCKOUT_DURATION / 1000
      };
    } else {
      updateUser(user.id, { loginAttempts: attempts });
      return { 
        success: false, 
        error: `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
        attemptsLeft: attemptsLeft
      };
    }
  }

  // Successful login - reset attempts and create session
  const now = new Date();
  updateUser(user.id, { 
    loginAttempts: 0, 
    lockoutUntil: null, 
    lastLogin: now.toISOString(),
    status: 'active'
  });

  const session = {
    userId: user.id,
    username: user.username,
    role: user.role,
    fullName: user.fullName,
    accountNumber: user.accountNumber,
    loginTime: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_DURATION).toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return { success: true, session: session };
}

/**
 * Clear session and redirect to login
 */
function logout(reason) {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
  window.location.href = `login.html${params}`;
}

/**
 * Get current session object
 */
function getSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Check if user is logged in with a valid (non-expired) session
 */
function isLoggedIn() {
  const session = getSession();
  if (!session) return false;
  
  const expiresAt = new Date(session.expiresAt).getTime();
  if (Date.now() > expiresAt) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return false;
  }
  
  return true;
}

/**
 * Check if current user is admin
 */
function isAdmin() {
  const session = getSession();
  return session && session.role === 'admin';
}

/**
 * Extend session expiry by SESSION_DURATION (activity refresh)
 */
function refreshSession() {
  const session = getSession();
  if (!session) return;
  
  session.expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

/**
 * Check session expiry and show timeout modal if needed
 */
function checkSessionExpiry() {
  const session = getSession();
  if (!session) return;

  const expiresAt = new Date(session.expiresAt).getTime();
  const timeLeft = expiresAt - Date.now();

  if (timeLeft <= 0) {
    logout('timeout');
    return;
  }

  // Show warning 60 seconds before expiry
  if (timeLeft <= 60000) {
    showSessionTimeoutModal(Math.ceil(timeLeft / 1000));
  }
}

/**
 * Session timeout modal
 */
function showSessionTimeoutModal(secondsLeft) {
  const existing = document.getElementById('session-timeout-modal');
  if (existing && existing.classList.contains('active')) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.id = 'session-timeout-modal';
  overlay.setAttribute('data-testid', 'session-timeout-modal');
  overlay.innerHTML = `
    <div class="modal-container" role="dialog" aria-modal="true" aria-label="Session Timeout Warning">
      <div class="modal-header">
        <h3 class="modal-title">⏰ Session Expiring</h3>
      </div>
      <div class="modal-body" style="text-align: center;">
        <p style="margin-bottom: var(--space-4); color: var(--color-text-secondary);">
          Your session will expire in
        </p>
        <div id="timeout-countdown" style="font-size: var(--text-3xl); font-weight: 700; color: var(--color-danger); font-family: var(--font-mono);">
          ${secondsLeft}s
        </div>
        <p style="margin-top: var(--space-4); font-size: var(--text-sm); color: var(--color-text-muted);">
          Click "Continue" to extend your session.
        </p>
      </div>
      <div class="modal-footer" style="justify-content: center;">
        <button class="btn btn-secondary" onclick="logout()" data-testid="timeout-logout-btn">Logout</button>
        <button class="btn btn-primary" onclick="continueSession()" data-testid="timeout-continue-btn">Continue Session</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Countdown
  let count = secondsLeft;
  const countdownEl = overlay.querySelector('#timeout-countdown');
  const timer = setInterval(() => {
    count--;
    if (countdownEl) countdownEl.textContent = `${count}s`;
    if (count <= 0) {
      clearInterval(timer);
      logout('timeout');
    }
  }, 1000);

  overlay._timer = timer;
}

function continueSession() {
  refreshSession();
  const modal = document.getElementById('session-timeout-modal');
  if (modal) {
    if (modal._timer) clearInterval(modal._timer);
    modal.remove();
  }
}

/**
 * Helper to format seconds into MM:SS
 */
function formatSeconds(totalSeconds) {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  if (min > 0) {
    return `${min}m ${sec}s`;
  }
  return `${sec}s`;
}

/**
 * Start session monitoring (call on every protected page)
 */
function startSessionMonitor() {
  // Check every 10 seconds
  setInterval(checkSessionExpiry, 10000);

  // Refresh on user activity
  let activityTimer = null;
  const refreshOnActivity = () => {
    if (activityTimer) clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      if (isLoggedIn()) refreshSession();
    }, 1000);
  };

  document.addEventListener('mousemove', refreshOnActivity, { passive: true });
  document.addEventListener('keydown', refreshOnActivity, { passive: true });
  document.addEventListener('click', refreshOnActivity, { passive: true });
  document.addEventListener('scroll', refreshOnActivity, { passive: true });
}

/**
 * Get remember me username
 */
function getRememberedUsername() {
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) || '';
}

/**
 * Set remember me username
 */
function setRememberedUsername(username) {
  if (username) {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, username);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }
}
