/* ============================================================
   KVN BANK — TRANSFER.JS
   Transfer logic, beneficiary handling, receipt generation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return;

  // Sidebar Widgets
  document.getElementById('sidebar-balance').textContent = formatCurrency(user.balance);

  // Daily Limit Mock
  const dailyLimit = 500000;
  const usedLimit = 125000; // Mock used limit
  const percentUsed = (usedLimit / dailyLimit) * 100;
  
  document.getElementById('limit-used').textContent = formatCurrency(usedLimit);
  document.getElementById('limit-total').textContent = formatCurrency(dailyLimit);
  const limitFill = document.getElementById('limit-fill');
  limitFill.style.width = `${percentUsed}%`;
  if (percentUsed > 80) limitFill.classList.add('danger');
  else if (percentUsed > 50) limitFill.classList.add('warning');

  // DOM Elements
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3')
  ];
  const tabs = [
    document.getElementById('tab-1'),
    document.getElementById('tab-2'),
    document.getElementById('tab-3')
  ];

  let currentStep = 1;
  let transferData = {
    method: 'IMPS',
    beneficiaryId: null,
    toAccount: '',
    ifsc: '',
    name: '',
    amount: 0,
    remarks: ''
  };

  // Setup Beneficiaries
  const benContainer = document.getElementById('beneficiary-list');
  const beneficiaries = getBeneficiaries(user.id);

  function renderBeneficiaries() {
    benContainer.innerHTML = '';
    
    beneficiaries.forEach(ben => {
      const card = document.createElement('div');
      card.className = 'beneficiary-card';
      if (transferData.beneficiaryId === ben.id) card.classList.add('selected');
      
      card.innerHTML = `
        <div class="beneficiary-avatar">${getInitials(ben.name)}</div>
        <div class="beneficiary-name">${ben.name}</div>
        <div class="beneficiary-bank">${ben.bankName}</div>
      `;
      
      card.addEventListener('click', () => {
        document.querySelectorAll('.beneficiary-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        transferData.beneficiaryId = ben.id;
        transferData.toAccount = ben.accountNumber;
        transferData.ifsc = ben.ifsc;
        transferData.name = ben.name;
        
        // Auto-fill form
        document.getElementById('to-account').value = maskAccountNo(ben.accountNumber);
        document.getElementById('ifsc').value = ben.ifsc;
        
        // Visual feedback
        showToast(`Selected beneficiary: ${ben.name}`, 'info');
      });
      
      benContainer.appendChild(card);
    });

    // Add New button
    const addNew = document.createElement('div');
    addNew.className = 'beneficiary-add-new';
    addNew.innerHTML = `
      <div class="beneficiary-avatar">+</div>
      <div class="beneficiary-name">Add New</div>
    `;
    addNew.addEventListener('click', () => {
      // Clear selection
      transferData.beneficiaryId = null;
      document.querySelectorAll('.beneficiary-card').forEach(c => c.classList.remove('selected'));
      document.getElementById('to-account').value = '';
      document.getElementById('ifsc').value = '';
      document.getElementById('to-account').focus();
    });
    benContainer.appendChild(addNew);
  }

  renderBeneficiaries();

  // Transfer Methods
  const methodCards = document.querySelectorAll('.method-card');
  methodCards.forEach(card => {
    card.addEventListener('click', () => {
      methodCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      transferData.method = card.dataset.method;
    });
  });

  // Step Navigation
  function updateUI() {
    steps.forEach((s, idx) => {
      if (idx + 1 === currentStep) s.classList.add('active');
      else s.classList.remove('active');
    });

    tabs.forEach((t, idx) => {
      t.classList.remove('active', 'completed');
      if (idx + 1 === currentStep) t.classList.add('active');
      else if (idx + 1 < currentStep) t.classList.add('completed');
    });
  }

  // Next -> Review
  document.getElementById('btn-next-1').addEventListener('click', () => {
    // Collect manual inputs if beneficiary not selected
    if (!transferData.beneficiaryId) {
      transferData.toAccount = document.getElementById('to-account').value.trim();
      transferData.ifsc = document.getElementById('ifsc').value.trim().toUpperCase();
      transferData.name = 'One-Time Transfer';
    }

    const amountInput = document.getElementById('amount').value;
    transferData.amount = parseFloat(amountInput);
    transferData.remarks = document.getElementById('remarks').value.trim();

    // Validation
    if (!transferData.toAccount || !transferData.ifsc) {
      showToast('Please provide beneficiary account details', 'error');
      return;
    }
    
    if (isNaN(transferData.amount) || transferData.amount <= 0) {
      showToast('Please enter a valid amount greater than 0', 'error');
      return;
    }

    if (transferData.amount > user.balance) {
      showToast('Insufficient balance for this transfer', 'error');
      return;
    }

    // Populate Review Step
    document.getElementById('review-amount').textContent = formatCurrency(transferData.amount);
    document.getElementById('review-to').textContent = transferData.name !== 'One-Time Transfer' ? `${transferData.name} (${maskAccountNo(transferData.toAccount)})` : transferData.toAccount;
    document.getElementById('review-ifsc').textContent = transferData.ifsc;
    document.getElementById('review-method').textContent = transferData.method;
    document.getElementById('review-remarks').textContent = transferData.remarks || 'N/A';

    currentStep = 2;
    updateUI();
  });

  // Back from Review
  document.getElementById('btn-prev-2').addEventListener('click', () => {
    currentStep = 1;
    updateUI();
  });

  // Confirm Transfer
  document.getElementById('btn-confirm').addEventListener('click', (e) => {
    const btn = e.target;
    btn.setAttribute('data-loading', 'true');
    btn.textContent = 'Processing...';

    // Simulate network & processing
    setTimeout(() => {
      btn.removeAttribute('data-loading');
      
      // Perform Transaction
      const refNo = generateTxnRef(transferData.method);
      const newBalance = user.balance - transferData.amount;
      
      const success = updateUser(user.id, { balance: newBalance });
      
      if (success) {
        addTransaction({
          id: generateTxnRef('TXN'),
          userId: user.id,
          type: 'debit',
          mode: transferData.method,
          amount: transferData.amount,
          balance: newBalance,
          description: transferData.remarks ? `Fund Transfer - ${transferData.remarks}` : 'Fund Transfer',
          toAccount: transferData.toAccount,
          fromAccount: user.accountNumber,
          referenceNo: refNo,
          status: 'success',
          timestamp: new Date().toISOString(),
          remarks: transferData.remarks
        });

        // Add Notification
        addNotification({
          id: generateId('NOTIF'),
          userId: user.id,
          message: `Your transfer of ${formatCurrency(transferData.amount)} to ${transferData.name !== 'One-Time Transfer' ? transferData.name : transferData.toAccount} was successful. Ref: ${refNo}`,
          type: 'success',
          read: false,
          timestamp: new Date().toISOString()
        });

        // Populate Receipt
        document.getElementById('receipt-ref').textContent = `Ref: ${refNo}`;
        document.getElementById('receipt-date').textContent = getCurrentDateTime();
        document.getElementById('receipt-amount').textContent = formatCurrency(transferData.amount);
        document.getElementById('receipt-to').textContent = transferData.name !== 'One-Time Transfer' ? `${transferData.name} (${maskAccountNo(transferData.toAccount)})` : transferData.toAccount;
        document.getElementById('receipt-method').textContent = transferData.method;

        currentStep = 3;
        updateUI();
        
        // Update sidebar balance dynamically
        document.getElementById('sidebar-balance').textContent = formatCurrency(newBalance);
        updateNotificationCounter(); // Refresh badge
      } else {
        showToast('Transfer failed due to a system error. Please try again.', 'error');
        btn.textContent = 'Confirm & Transfer';
      }
    }, 1500);
  });
});
