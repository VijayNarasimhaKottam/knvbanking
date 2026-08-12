/* ============================================================
   KVN BANK — FIXED-DEPOSIT.JS
   FD Calculator logic and active FD listing
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return;

  // DOM Elements - Calculator
  const amtSlider = document.getElementById('calc-amt-slider');
  const amtInput = document.getElementById('calc-amt-input');
  
  const tenureSlider = document.getElementById('calc-tenure-slider');
  const tenureInput = document.getElementById('calc-tenure-input');

  const resPrincipal = document.getElementById('res-principal');
  const resInterest = document.getElementById('res-interest');
  const resMaturity = document.getElementById('res-maturity');
  
  const btnBook = document.getElementById('btn-book-fd');

  // Rates Logic
  function getRate(months) {
    if (months <= 3) return 4.5;
    if (months <= 6) return 5.5;
    if (months <= 12) return 6.5;
    if (months <= 36) return 7.0;
    return 7.5;
  }

  // Calculate FD
  function calculateFD() {
    const principal = parseFloat(amtSlider.value);
    const months = parseInt(tenureSlider.value);
    const rate = getRate(months);
    
    // A = P(1 + r/n)^(n*t) - simplified for monthly compounding
    const r = rate / 100;
    const t = months / 12;
    const n = 4; // Quarterly compounding typically
    
    const maturityAmount = principal * Math.pow((1 + (r/n)), n*t);
    const interestEarned = maturityAmount - principal;

    // Update UI
    amtInput.value = principal.toLocaleString('en-IN');
    tenureInput.value = months;

    resPrincipal.textContent = formatCurrency(principal);
    resInterest.textContent = formatCurrency(interestEarned);
    resMaturity.textContent = formatCurrency(maturityAmount);
    
    // Update active rate display in sidebar
    document.getElementById('current-rate').textContent = `${rate.toFixed(1)}% p.a.`;
  }

  // Sync Input & Sliders
  amtSlider.addEventListener('input', calculateFD);
  tenureSlider.addEventListener('input', calculateFD);
  
  amtInput.addEventListener('change', () => {
    let val = parseInt(amtInput.value.replace(/,/g, ''));
    if (isNaN(val) || val < 10000) val = 10000;
    if (val > 10000000) val = 10000000;
    amtSlider.value = val;
    calculateFD();
  });
  
  tenureInput.addEventListener('change', () => {
    let val = parseInt(tenureInput.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 120) val = 120;
    tenureSlider.value = val;
    calculateFD();
  });

  // Initial Calc
  calculateFD();

  // Book FD Logic
  btnBook.addEventListener('click', () => {
    const principal = parseFloat(amtSlider.value);
    const months = parseInt(tenureSlider.value);
    
    if (user.balance < principal) {
      showToast(`Insufficient balance. Available: ${formatCurrency(user.balance)}`, 'error');
      return;
    }

    btnBook.setAttribute('data-loading', 'true');

    setTimeout(() => {
      btnBook.removeAttribute('data-loading');
      
      const newBalance = user.balance - principal;
      const rate = getRate(months);
      
      // Calculate exact maturity date
      const maturityDate = new Date();
      maturityDate.setMonth(maturityDate.getMonth() + months);
      
      const fdRef = generateTxnRef('FD');

      if (updateUser(user.id, { balance: newBalance })) {
        // Record debit transaction
        addTransaction({
          id: generateTxnRef('TXN'),
          userId: user.id,
          type: 'debit',
          mode: 'FD_BOOKING',
          amount: principal,
          balance: newBalance,
          description: `Fixed Deposit Booking - ${months} Months`,
          referenceNo: fdRef,
          status: 'success',
          timestamp: new Date().toISOString()
        });

        // Add Notification
        addNotification({
          id: generateId('NOTIF'),
          userId: user.id,
          message: `Your Fixed Deposit of ${formatCurrency(principal)} has been booked successfully. Ref: ${fdRef}`,
          type: 'success',
          read: false,
          timestamp: new Date().toISOString()
        });

        // Save FD details to local storage (extending data model temporarily just for UI rendering here)
        const userFDs = JSON.parse(localStorage.getItem(`KVN_FD_${user.id}`)) || [];
        userFDs.push({
          id: fdRef,
          principal,
          months,
          rate,
          maturityDate: maturityDate.toISOString(),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(`KVN_FD_${user.id}`, JSON.stringify(userFDs));

        showToast('Fixed Deposit booked successfully!', 'success');
        
        // Refresh Lists
        renderActiveFDs();
        updateNotificationCounter();
      }
    }, 1500);
  });

  // Render Active FDs
  function renderActiveFDs() {
    const container = document.getElementById('active-fd-list');
    const userFDs = JSON.parse(localStorage.getItem(`KVN_FD_${user.id}`)) || [];
    
    if (userFDs.length === 0) {
      container.innerHTML = `
        <div class="fd-empty-state">
          <div>📄</div>
          <div style="margin-top: 8px;">You don't have any active Fixed Deposits.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    // Reverse to show latest first
    userFDs.reverse().forEach(fd => {
      const card = document.createElement('div');
      card.className = 'active-fd-card';
      
      card.innerHTML = `
        <div class="fd-card-top">
          <div>
            <div class="fd-acc-name">Fixed Deposit - ${fd.months}M</div>
            <div class="fd-acc-num">A/C: ${fd.id}</div>
          </div>
          <div><span class="fd-status">Active</span></div>
        </div>
        <div class="fd-card-details">
          <div class="fd-detail-col">
            <span class="fd-lbl">Principal Amt</span>
            <span class="fd-val">${formatCurrency(fd.principal)}</span>
          </div>
          <div class="fd-detail-col">
            <span class="fd-lbl">Maturity Date</span>
            <span class="fd-val">${formatDate(fd.maturityDate).split(',')[0]}</span>
          </div>
          <div class="fd-detail-col" style="margin-top: var(--space-2);">
            <span class="fd-lbl">Interest Rate</span>
            <span class="fd-val" style="color: var(--color-success);">${fd.rate.toFixed(1)}% p.a.</span>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  }

  // Initial Render
  renderActiveFDs();
});
