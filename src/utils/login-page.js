/* ============================================================
   KVN BANK — LOGIN-PAGE.JS
   Handles login form submission, CAPTCHA, Remember Me
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Check URL params for messages
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect') || 'dashboard.html';
  const reason = urlParams.get('reason');
  
  if (reason === 'timeout') {
    showToast('Your session has expired due to inactivity. Please log in again.', 'warning');
  } else if (reason === 'user_initiated') {
    showToast('You have been successfully logged out.', 'success');
  }

  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const captchaInput = document.getElementById('captcha-answer');
  const captchaQuestion = document.getElementById('captcha-q');
  const refreshCaptchaBtn = document.getElementById('refresh-captcha');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const rememberMeCheck = document.getElementById('remember-me');
  const submitBtn = document.getElementById('login-submit');

  // Prevent default submission immediately to avoid native reload bugs
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }

  let currentCaptchaAnswer = 0;

  // Initialize CAPTCHA
  function loadCaptcha() {
    const captcha = generateCaptcha();
    captchaQuestion.textContent = captcha.question;
    currentCaptchaAnswer = captcha.answer;
    captchaInput.value = '';
    captchaInput.classList.remove('is-valid', 'is-invalid');
  }

  // Initialize Remember Me
  const remembered = getRememberedUsername();
  if (remembered) {
    usernameInput.value = remembered;
    rememberMeCheck.checked = true;
    passwordInput.focus();
  } else {
    usernameInput.focus();
  }

  loadCaptcha();

  // Event Listeners
  refreshCaptchaBtn.addEventListener('click', loadCaptcha);

  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🔒';
    togglePasswordBtn.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
  });

  // Real-time CAPTCHA validation visual feedback
  captchaInput.addEventListener('input', () => {
    if (captchaInput.value === '') {
      captchaInput.classList.remove('is-valid', 'is-invalid');
      return;
    }
    if (parseInt(captchaInput.value, 10) === currentCaptchaAnswer) {
      captchaInput.classList.remove('is-invalid');
      captchaInput.classList.add('is-valid');
    } else {
      captchaInput.classList.remove('is-valid');
      captchaInput.classList.add('is-invalid');
    }
  });

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const answer = parseInt(captchaInput.value, 10);

    // Basic Validation
    if (!username || !password) {
      showToast('Please enter both username and password.', 'error');
      return;
    }

    if (isNaN(answer) || answer !== currentCaptchaAnswer) {
      showToast('Incorrect CAPTCHA answer. Please try again.', 'error');
      captchaInput.classList.add('is-invalid');
      loadCaptcha();
      captchaInput.focus();
      return;
    }

    // Set Loading State
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.textContent = 'Authenticating...';
    
    // Simulate network delay
    setTimeout(() => {
      const result = login(username, password);

      submitBtn.removeAttribute('data-loading');
      submitBtn.textContent = 'Login Securely';

      if (result.success) {
        // Handle Remember Me
        if (rememberMeCheck.checked) {
          setRememberedUsername(username);
        } else {
          setRememberedUsername(null);
        }
        
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.replace(redirect);
        }, 1000);
      } else {
        showToast(result.error, 'error');
        passwordInput.value = '';
        loadCaptcha();
        
        if (result.locked) {
          usernameInput.disabled = true;
          passwordInput.disabled = true;
          captchaInput.disabled = true;
          submitBtn.disabled = true;
          
          let remaining = result.lockoutRemaining;
          const lockTimer = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
              clearInterval(lockTimer);
              usernameInput.disabled = false;
              passwordInput.disabled = false;
              captchaInput.disabled = false;
              submitBtn.disabled = false;
              showToast('Account unlocked. You may try logging in again.', 'info');
            }
          }, 1000);
        }
      }
    }, 800); // 800ms simulated delay
  });
});
