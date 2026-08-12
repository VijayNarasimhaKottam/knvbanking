/* ============================================================
   KVN BANK — UPI.JS
   UPI ID management, send money logic, and history
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return;

  // Generate UPI ID
  const upiId = `${user.mobile}@kvn`;
  document.getElementById('upi-id-display').textContent = upiId;

  // Copy functionality
  document.getElementById('btn-copy-upi').addEventListener('click', () => {
    navigator.clipboard.writeText(upiId).then(() => {
      showToast('UPI ID copied to clipboard', 'success');
    });
  });

  // Tabs logic
  const tabs = document.querySelectorAll('.upi-tab');
  const views = {
    send: document.getElementById('view-send'),
    receive: document.getElementById('view-receive'),
    manage: document.getElementById('view-manage')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      Object.values(views).forEach(v => v.classList.remove('active'));
      const target = tab.dataset.target;
      views[target].classList.add('active');
    });
  });

  // Send Money Logic
  document.getElementById('form-upi-send').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const payeeUpi = document.getElementById('payee-upi').value.trim();
    const amount = parseFloat(document.getElementById('send-amount').value);
    const remarks = document.getElementById('send-remarks').value.trim();
    
    if (!payeeUpi.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g., name@bank)', 'error');
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    
    if (amount > user.balance) {
      showToast(`Insufficient balance. Available: ${formatCurrency(user.balance)}`, 'error');
      return;
    }

    const btn = document.getElementById('btn-upi-send');
    btn.setAttribute('data-loading', 'true');

    setTimeout(() => {
      btn.removeAttribute('data-loading');
      
      const newBalance = user.balance - amount;
      const refNo = generateTxnRef('UPI');
      
      if (updateUser(user.id, { balance: newBalance })) {
        // Debit Txn
        addTransaction({
          id: generateTxnRef('TXN'),
          userId: user.id,
          type: 'debit',
          mode: 'UPI',
          amount: amount,
          balance: newBalance,
          description: `UPI - ${payeeUpi}`,
          toAccount: payeeUpi,
          fromAccount: upiId,
          referenceNo: refNo,
          status: 'success',
          timestamp: new Date().toISOString(),
          remarks: remarks
        });

        showToast(`Successfully sent ${formatCurrency(amount)} to ${payeeUpi}`, 'success');
        document.getElementById('form-upi-send').reset();
        
        // Refresh History
        renderUpiHistory();
      } else {
        showToast('Transaction failed. Please try again.', 'error');
      }
    }, 1200);
  });

  // Request Money Logic (Mock)
  document.getElementById('btn-upi-request').addEventListener('click', () => {
    const payerUpi = document.getElementById('payer-upi').value.trim();
    const amount = parseFloat(document.getElementById('req-amount').value);
    
    if (!payerUpi.includes('@') || isNaN(amount) || amount <= 0) {
      showToast('Please enter valid UPI ID and amount', 'error');
      return;
    }
    
    const btn = document.getElementById('btn-upi-request');
    btn.setAttribute('data-loading', 'true');
    
    setTimeout(() => {
      btn.removeAttribute('data-loading');
      showToast(`Payment request sent to ${payerUpi}`, 'success');
      document.getElementById('form-upi-req').reset();
    }, 800);
  });

  // Render UPI History
  function renderUpiHistory() {
    const container = document.getElementById('upi-history-list');
    container.innerHTML = '';
    
    const allTxns = getTransactions(user.id);
    const upiTxns = allTxns.filter(t => t.mode === 'UPI').slice(0, 5);
    
    if (upiTxns.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--color-text-secondary); padding: 1rem 0; font-size: 14px;">No recent UPI transactions</div>`;
      return;
    }
    
    upiTxns.forEach(txn => {
      const isCredit = txn.type === 'credit';
      const icon = isCredit ? '↓' : '↑';
      const amtClass = isCredit ? 'credit' : 'debit';
      const sign = isCredit ? '+' : '−';
      
      // Determine name (to or from based on debit/credit)
      const name = isCredit ? (txn.fromAccount || 'Unknown') : (txn.toAccount || 'Unknown');
      // Format specifically for UPI display (remove "UPI - " from desc if present)
      const desc = txn.description.replace('UPI - ', '');
      
      const item = document.createElement('div');
      item.className = 'upi-txn-item';
      
      item.innerHTML = `
        <div class="upi-txn-info">
          <div class="upi-txn-icon">${icon}</div>
          <div class="upi-txn-details">
            <span class="upi-txn-name">${desc}</span>
            <span class="upi-txn-date">${formatDate(txn.timestamp)}</span>
          </div>
        </div>
        <div class="upi-txn-amt ${amtClass}">${sign}${formatCurrency(txn.amount)}</div>
      `;
      
      container.appendChild(item);
    });
  }

  // Initial Render
  renderUpiHistory();
});
