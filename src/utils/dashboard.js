/* ============================================================
   KVN BANK — DASHBOARD.JS
   Renders user data, balance, recent txns, spending chart
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return; // Handled by router auth guard

  // 1. Populate Header / Account Info
  document.getElementById('user-greeting').textContent = `Welcome back, ${user.fullName.split(' ')[0]}`;
  
  const formattedBal = formatCurrency(user.balance);
  document.getElementById('dash-balance').textContent = formattedBal;
  
  // Format Account Number (Masked)
  const accNum = user.accountNumber;
  const maskedAcc = `•••• ${accNum.slice(-4)}`;
  document.getElementById('dash-acc-num').textContent = maskedAcc;
  document.getElementById('dash-acc-type').textContent = `${user.accountType} Account`;

  // 2. Render Recent Transactions
  const txnsContainer = document.getElementById('dash-recent-txns');
  const userTxns = getTransactions(user.id);
  
  if (userTxns.length === 0) {
    txnsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📄</div>
        <p>No recent transactions</p>
      </div>
    `;
  } else {
    // Show top 5
    const recentTxns = userTxns.slice(0, 5);
    let html = '';
    
    recentTxns.forEach(txn => {
      const isCredit = txn.type === 'credit';
      const icon = isCredit ? '↓' : '↑';
      const iconClass = isCredit ? 'credit' : 'debit';
      const amountClass = isCredit ? 'credit' : 'debit';
      const sign = isCredit ? '+' : '−';
      
      html += `
        <div class="txn-item">
          <div class="txn-info">
            <div class="txn-icon ${iconClass}">${icon}</div>
            <div class="txn-details">
              <span class="txn-desc">${txn.description}</span>
              <span class="txn-date">${formatDate(txn.timestamp)}</span>
            </div>
          </div>
          <div class="txn-amounts">
            <span class="txn-amount ${amountClass}">${sign}${formatCurrency(txn.amount)}</span>
          </div>
        </div>
      `;
    });
    
    txnsContainer.innerHTML = html;
  }

  // 3. Render Spending Chart (Mock Data based on balance for visual effect)
  const chartBars = document.querySelectorAll('.chart-bar');
  if (chartBars.length > 0) {
    // Generate pseudo-random heights for the last 7 days
    const baseHeight = 20;
    
    // Animate bars after a short delay
    setTimeout(() => {
      chartBars.forEach((bar, index) => {
        // Just generating some varied heights
        const height = baseHeight + (Math.sin(index) * 20) + (Math.random() * 40);
        bar.style.height = `${Math.max(10, Math.min(100, height))}%`;
      });
    }, 300);
  }

  // 4. CC Widget Masking
  const ccWidgetNum = document.getElementById('cc-widget-num');
  if (ccWidgetNum) {
    // Just a visual mock based on account number
    const p1 = user.accountNumber.slice(0,4).padEnd(4, '0');
    const p2 = user.mobile.slice(0,4).padEnd(4, '1');
    const p3 = 'XXXX';
    const p4 = user.accountNumber.slice(-4).padStart(4, '2');
    ccWidgetNum.textContent = `${p1} ${p2} ${p3} ${p4}`;
    
    document.getElementById('cc-widget-name').textContent = user.fullName;
  }
});
