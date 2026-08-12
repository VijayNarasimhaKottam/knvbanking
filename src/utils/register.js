/* ============================================================
   KVN BANK — REGISTER.JS
   Multi-step form logic, validation, account generation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 3;

  const form = document.getElementById('register-form');
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3')
  ];
  const progressSteps = [
    document.getElementById('progress-step-1'),
    document.getElementById('progress-step-2'),
    document.getElementById('progress-step-3')
  ];
  const progressLine = document.getElementById('progress-line-fill');
  
  const btnNext1 = document.getElementById('btn-next-1');
  const btnNext2 = document.getElementById('btn-next-2');
  const btnPrev2 = document.getElementById('btn-prev-2');
  const btnPrev3 = document.getElementById('btn-prev-3');
  const btnSubmit = document.getElementById('btn-submit');

  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const strengthBar = document.getElementById('pwd-strength-bar');
  const strengthText = document.getElementById('pwd-strength-text');

  // Multi-step Navigation
  function updateUI() {
    steps.forEach((s, idx) => {
      if (idx + 1 === currentStep) s.classList.add('active');
      else s.classList.remove('active');
    });

    progressSteps.forEach((p, idx) => {
      p.classList.remove('active', 'completed');
      if (idx + 1 === currentStep) p.classList.add('active');
      else if (idx + 1 < currentStep) p.classList.add('completed');
    });

    const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = `${progressWidth}%`;
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      currentStep++;
      updateUI();
    }
  }

  function prevStep() {
    currentStep--;
    updateUI();
  }

  btnNext1.addEventListener('click', nextStep);
  btnNext2.addEventListener('click', nextStep);
  btnPrev2.addEventListener('click', prevStep);
  btnPrev3.addEventListener('click', prevStep);

  // Validation
  function showError(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = message;
    }
  }

  function showSuccess(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }

  function validateStep(step) {
    let isValid = true;
    
    if (step === 1) {
      // Personal Info
      const fname = document.getElementById('fullname');
      const dob = document.getElementById('dob');
      const pan = document.getElementById('pan');
      const aadhaar = document.getElementById('aadhaar');

      if (!fname.value.trim()) { showError(fname, 'Full Name is required'); isValid = false; }
      else { showSuccess(fname); }

      if (!dob.value) { showError(dob, 'Date of Birth is required'); isValid = false; }
      else {
        // Validate age >= 18
        const age = (new Date() - new Date(dob.value)) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 18) { showError(dob, 'You must be at least 18 years old'); isValid = false; }
        else { showSuccess(dob); }
      }

      if (!validatePAN(pan.value)) { showError(pan, 'Invalid PAN format (e.g. ABCDE1234F)'); isValid = false; }
      else { showSuccess(pan); }

      if (!validateAadhaar(aadhaar.value)) { showError(aadhaar, 'Invalid Aadhaar (12 digits)'); isValid = false; }
      else { showSuccess(aadhaar); }
    } 
    else if (step === 2) {
      // Contact Info
      const email = document.getElementById('email');
      const mobile = document.getElementById('mobile');
      const pin = document.getElementById('pincode');

      if (!validateEmail(email.value)) { showError(email, 'Invalid email address'); isValid = false; }
      else { showSuccess(email); }

      if (!validateMobile(mobile.value)) { showError(mobile, 'Invalid mobile number (10 digits)'); isValid = false; }
      else { showSuccess(mobile); }

      if (!validatePincode(pin.value)) { showError(pin, 'Invalid Pincode (6 digits)'); isValid = false; }
      else { showSuccess(pin); }
    }
    
    return isValid;
  }

  // Password Strength
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
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

    const validation = validatePassword(val);
    if (!validation.valid) {
      showError(passwordInput, validation.errors[0]);
    } else {
      showSuccess(passwordInput);
    }
    
    // Check confirm password if it has value
    if (confirmPasswordInput.value) {
      if (confirmPasswordInput.value !== val) {
        showError(confirmPasswordInput, 'Passwords do not match');
      } else {
        showSuccess(confirmPasswordInput);
      }
    }
  });

  confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.value !== passwordInput.value) {
      showError(confirmPasswordInput, 'Passwords do not match');
    } else {
      showSuccess(confirmPasswordInput);
    }
  });

  // Password Toggles
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = e.target.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      e.target.textContent = type === 'password' ? '👁️' : '🔒';
    });
  });

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate Step 3
    const username = document.getElementById('username');
    if (!username.value.trim() || username.value.length < 5) {
      showError(username, 'Username must be at least 5 characters');
      return;
    }
    if (getUserByUsername(username.value)) {
      showError(username, 'Username is already taken');
      return;
    }
    showSuccess(username);

    const pwdValid = validatePassword(passwordInput.value);
    if (!pwdValid.valid) {
      showError(passwordInput, pwdValid.errors[0]);
      return;
    }
    
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, 'Passwords do not match');
      return;
    }

    const agree = document.getElementById('agree-terms');
    if (!agree.checked) {
      showToast('You must agree to the Terms and Conditions', 'error');
      return;
    }

    // Process Submission
    btnSubmit.setAttribute('data-loading', 'true');
    btnSubmit.textContent = 'Creating Account...';

    setTimeout(() => {
      const newUser = {
        id: getNextUserId(),
        username: username.value.trim(),
        passwordHash: btoa(passwordInput.value),
        role: 'customer',
        fullName: document.getElementById('fullname').value.trim(),
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value.trim(),
        aadhaar: document.getElementById('aadhaar').value.trim(),
        pan: document.getElementById('pan').value.trim().toUpperCase(),
        accountNumber: getNextAccountNumber(),
        accountType: document.getElementById('acctype').value,
        ifscCode: 'NRJB0001001',
        balance: 10000.00, // Welcome bonus / initial deposit
        status: 'active',
        loginAttempts: 0,
        lockoutUntil: null,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        securityQuestion: document.getElementById('sec-q').value,
        securityAnswer: document.getElementById('sec-a').value.trim().toLowerCase(),
        nominees: [],
        upiId: null,
        mpin: null
      };

      addUser(newUser);

      // Add a welcome notification
      addNotification({
        id: generateId('NOTIF'),
        userId: newUser.id,
        message: 'Welcome to KVN Bank! Your account has been successfully created with a welcome bonus of ₹10,000.',
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      });

      // Add welcome transaction
      addTransaction({
        id: generateTxnRef('TXN'),
        userId: newUser.id,
        type: 'credit',
        mode: 'INTERNAL',
        amount: 10000,
        balance: 10000,
        description: 'Account Opening Welcome Bonus',
        toAccount: newUser.accountNumber,
        fromAccount: 'KVN_PROMO',
        referenceNo: generateTxnRef('PRM'),
        status: 'success',
        timestamp: new Date().toISOString(),
        remarks: 'Welcome to KVN Bank'
      });

      // Show Success Screen
      document.getElementById('register-steps-wrapper').style.display = 'none';
      form.style.display = 'none';
      
      const successScreen = document.getElementById('success-screen');
      document.getElementById('success-name').textContent = newUser.fullName;
      document.getElementById('success-acc').textContent = formatAccountNo(newUser.accountNumber);
      document.getElementById('success-custid').textContent = newUser.username;
      
      successScreen.style.display = 'block';

    }, 1500); // 1.5s simulated delay
  });
});
