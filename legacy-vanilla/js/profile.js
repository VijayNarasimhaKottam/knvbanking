/* ============================================================
   KVN BANK — PROFILE.JS
   Load profile data, handle tab switching, handle updates
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return;

  // Populate Sidebar
  document.getElementById('prof-avatar').textContent = getInitials(user.fullName);
  document.getElementById('prof-name').textContent = user.fullName;
  
  // Tab Switching
  const navLinks = document.querySelectorAll('.profile-nav-link');
  const sections = document.querySelectorAll('.profile-section');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Remove active from all
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      // Add active to clicked
      link.classList.add('active');
      const targetId = link.dataset.target;
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Populate Personal Details
  document.getElementById('disp-name').textContent = user.fullName;
  document.getElementById('disp-dob').textContent = formatDate(user.dob).split(',')[0];
  document.getElementById('disp-gender').textContent = user.gender;
  document.getElementById('disp-pan').textContent = maskString(user.pan, 2, 2);
  document.getElementById('disp-aadhaar').textContent = maskString(user.aadhaar, 0, 4);
  document.getElementById('disp-address').textContent = `${user.address}, ${user.city}, ${user.state} - ${user.pincode}`;

  // Populate Settings Form
  const emailInput = document.getElementById('edit-email');
  const mobileInput = document.getElementById('edit-mobile');
  emailInput.value = user.email;
  mobileInput.value = user.mobile;

  // Handle Settings Update
  document.getElementById('form-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    const newEmail = emailInput.value.trim();
    const newMobile = mobileInput.value.trim();
    
    if (!validateEmail(newEmail)) {
      showToast('Invalid email address', 'error');
      return;
    }
    
    if (!validateMobile(newMobile)) {
      showToast('Invalid mobile number', 'error');
      return;
    }
    
    const btn = document.getElementById('btn-save-settings');
    btn.setAttribute('data-loading', 'true');
    
    setTimeout(() => {
      btn.removeAttribute('data-loading');
      
      if (updateUser(user.id, { email: newEmail, mobile: newMobile })) {
        showToast('Contact details updated successfully', 'success');
      } else {
        showToast('Failed to update details', 'error');
      }
    }, 800);
  });

  // Handle Password Update
  const pwdForm = document.getElementById('form-security');
  const oldPwdInput = document.getElementById('old-password');
  const newPwdInput = document.getElementById('new-password');
  const confirmPwdInput = document.getElementById('confirm-new-password');

  // Password Strength
  newPwdInput.addEventListener('input', () => {
    const val = newPwdInput.value;
    const bar = document.getElementById('pwd-strength-bar');
    const txt = document.getElementById('pwd-strength-text');
    
    if (!val) {
      bar.className = 'password-strength-bar';
      bar.style.removeProperty('--strength-color');
      txt.textContent = '';
      return;
    }
    
    const { label, color } = checkPasswordStrength(val);
    bar.className = 'password-strength-bar active';
    bar.style.setProperty('--strength-color', color);
    txt.textContent = label;
    txt.style.setProperty('--strength-color', color);
  });

  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = e.target.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      e.target.textContent = type === 'password' ? '👁️' : '🔒';
    });
  });

  pwdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPwd = oldPwdInput.value;
    const newPwd = newPwdInput.value;
    
    // Verify old password
    if (btoa(oldPwd) !== user.passwordHash) {
      showToast('Current password is incorrect', 'error');
      return;
    }
    
    const valid = validatePassword(newPwd);
    if (!valid.valid) {
      showToast(valid.errors[0], 'error');
      return;
    }
    
    if (newPwd !== confirmPwdInput.value) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    if (oldPwd === newPwd) {
      showToast('New password cannot be the same as current password', 'error');
      return;
    }
    
    const btn = document.getElementById('btn-save-security');
    btn.setAttribute('data-loading', 'true');
    
    setTimeout(() => {
      btn.removeAttribute('data-loading');
      
      if (updateUser(user.id, { passwordHash: btoa(newPwd) })) {
        showToast('Password updated successfully', 'success');
        pwdForm.reset();
        
        // Add notification
        addNotification({
          id: generateId('NOTIF'),
          userId: user.id,
          message: 'Your NetBanking password was successfully changed.',
          type: 'info',
          read: false,
          timestamp: new Date().toISOString()
        });
      } else {
        showToast('Failed to update password', 'error');
      }
    }, 1000);
  });
});
