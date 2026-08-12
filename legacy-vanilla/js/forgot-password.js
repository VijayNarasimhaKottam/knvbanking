/* ============================================================
   KVN BANK — FORGOT-PASSWORD.JS
   Multi-step password reset flow
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  let targetUser = null;
  let expectedOTP = null;
  let otpTimerInterval = null;

  // Step 1: Identify
  const form1 = document.getElementById('fp-form-1');
  const btn1 = document.getElementById('btn-next-1');
  
  // Step 2: Verify (Security Q + OTP)
  const form2 = document.getElementById('fp-form-2');
  const btn2 = document.getElementById('btn-next-2');
  const otpInputs = document.querySelectorAll('.otp-input');
  
  // Step 3: Reset
  const form3 = document.getElementById('fp-form-3');
  const btn3 = document.getElementById('btn-reset');
  const passwordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-new-password');

  function showStep(stepNum) {
    document.querySelectorAll('.fp-step').forEach((el, idx) => {
      if (idx + 1 === stepNum) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  // --- Step 1: Identify User ---
  form1.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    if (!username) return;

    btn1.setAttribute('data-loading', 'true');

    setTimeout(() => {
      btn1.removeAttribute('data-loading');
      targetUser = getUserByUsername(username);

      if (!targetUser) {
        showToast('No account found with that username.', 'error');
        return;
      }

      if (targetUser.status === 'inactive') {
        showToast('Account is inactive. Please contact support.', 'error');
        return;
      }

      // Setup Step 2
      document.getElementById('display-sec-q').textContent = targetUser.securityQuestion;
      
      // Mask mobile for display
      const mobile = targetUser.mobile;
      document.getElementById('masked-mobile').textContent = `******${mobile.slice(-4)}`;

      // Generate initial OTP
      sendOTP();
      
      showStep(2);
      document.getElementById('sec-a').focus();
    }, 800);
  });


  // --- Step 2: Verification ---
  
  // OTP Input logic
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length > 1) {
        e.target.value = e.target.value.slice(0, 1);
      }
      if (e.target.value !== '') {
        e.target.classList.add('filled');
        if (index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      } else {
        e.target.classList.remove('filled');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  function sendOTP() {
    expectedOTP = generateOTP();
    console.log(`[KVN Bank] OTP Sent to ${targetUser.mobile}: ${expectedOTP}`);
    showToast(`OTP sent to your registered mobile ending in ${targetUser.mobile.slice(-4)}`, 'success');
    
    // Test helper to auto-fill (since we don't have real SMS)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
      setTimeout(() => {
        const chars = expectedOTP.split('');
        otpInputs.forEach((input, i) => {
          input.value = chars[i];
          input.classList.add('filled');
        });
      }, 1500);
    }

    startOTPTimer();
  }

  document.getElementById('btn-resend').addEventListener('click', (e) => {
    e.preventDefault();
    otpInputs.forEach(i => { i.value = ''; i.classList.remove('filled'); });
    sendOTP();
  });

  function startOTPTimer() {
    let timeLeft = 60;
    const resendBtn = document.getElementById('btn-resend');
    const timerDisplay = document.getElementById('timer-count');
    
    resendBtn.disabled = true;
    if (otpTimerInterval) clearInterval(otpTimerInterval);

    otpTimerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `0:${timeLeft.toString().padStart(2, '0')}`;
      
      if (timeLeft <= 0) {
        clearInterval(otpTimerInterval);
        resendBtn.disabled = false;
        timerDisplay.textContent = '0:00';
      }
    }, 1000);
  }

  form2.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const answer = document.getElementById('sec-a').value.trim().toLowerCase();
    const enteredOTP = Array.from(otpInputs).map(i => i.value).join('');

    if (!answer) {
      showToast('Please answer the security question.', 'error');
      return;
    }

    if (enteredOTP.length !== 6) {
      showToast('Please enter the complete 6-digit OTP.', 'error');
      return;
    }

    btn2.setAttribute('data-loading', 'true');

    setTimeout(() => {
      btn2.removeAttribute('data-loading');

      if (answer !== targetUser.securityAnswer) {
        showToast('Incorrect answer to the security question.', 'error');
        document.getElementById('sec-a').value = '';
        return;
      }

      if (enteredOTP !== expectedOTP) {
        showToast('Invalid OTP. Please try again.', 'error');
        otpInputs.forEach(i => { i.value = ''; i.classList.remove('filled'); });
        otpInputs[0].focus();
        return;
      }

      // Success
      if (otpTimerInterval) clearInterval(otpTimerInterval);
      showStep(3);
    }, 800);
  });


  // --- Step 3: Reset Password ---
  
  // Password Strength
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const strengthBar = document.getElementById('pwd-strength-bar');
    const strengthText = document.getElementById('pwd-strength-text');
    
    if (!val) {
      strengthBar.className = 'password-strength-bar';
      strengthBar.style.removeProperty('--strength-color');
      strengthText.textContent = '';
      return;
    }

    const { score, label, color } = checkPasswordStrength(val);
    strengthBar.className = 'password-strength-bar active';
    strengthBar.style.setProperty('--strength-color', color);
    strengthText.textContent = label;
    strengthText.style.setProperty('--strength-color', color);
  });

  // Toggles
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = e.target.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      e.target.textContent = type === 'password' ? '👁️' : '🔒';
    });
  });

  form3.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const val = passwordInput.value;
    const validation = validatePassword(val);
    
    if (!validation.valid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    if (val !== confirmPasswordInput.value) {
      showToast('Passwords do not match', 'error');
      return;
    }

    btn3.setAttribute('data-loading', 'true');

    setTimeout(() => {
      btn3.removeAttribute('data-loading');
      
      // Update User Password
      const success = updateUser(targetUser.id, {
        passwordHash: btoa(val),
        loginAttempts: 0,
        lockoutUntil: null,
        status: 'active' // Unlock account if it was locked
      });

      if (success) {
        showStep(4); // Success screen
      } else {
        showToast('Failed to reset password. Try again later.', 'error');
      }
    }, 1000);
  });

});
