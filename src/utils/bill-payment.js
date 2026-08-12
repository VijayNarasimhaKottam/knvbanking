/* ============================================================
   KVN BANK — BILL-PAYMENT.JS
   Category navigation, bill fetching simulation, payment processing
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return;

  const categories = document.querySelectorAll('.category-item');
  const views = {
    empty: document.getElementById('view-empty'),
    list: document.getElementById('view-biller-list'),
    fetch: document.getElementById('view-fetch-bill'),
    pay: document.getElementById('view-pay-bill'),
    receipt: document.getElementById('view-receipt')
  };

  let currentCategory = null;
  let selectedBiller = null;
  let fetchedBill = null;

  function showView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
  }

  // Handle Category Selection
  categories.forEach(cat => {
    cat.addEventListener('click', () => {
      categories.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      
      currentCategory = cat.dataset.category;
      document.getElementById('biller-list-title').textContent = `Select ${cat.querySelector('span:last-child').textContent} Provider`;
      
      renderBillers(currentCategory);
      showView('list');
    });
  });

  // Render Billers Grid
  function renderBillers(category) {
    const grid = document.getElementById('biller-grid');
    grid.innerHTML = '';

    const catBillers = BILLERS.filter(b => b.category === category);
    
    if (catBillers.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary); padding: 2rem;">No billers found for this category.</div>`;
      return;
    }

    catBillers.forEach(biller => {
      const card = document.createElement('div');
      card.className = 'biller-card';
      card.innerHTML = `
        <div class="biller-logo">${biller.icon}</div>
        <div class="biller-name">${biller.name}</div>
      `;
      
      card.addEventListener('click', () => {
        selectedBiller = biller;
        setupFetchForm();
        showView('fetch');
      });
      
      grid.appendChild(card);
    });
  }

  // Setup Fetch Form
  function setupFetchForm() {
    document.getElementById('fetch-logo').textContent = selectedBiller.icon;
    document.getElementById('fetch-name').textContent = selectedBiller.name;
    
    const inputContainer = document.getElementById('fetch-input-container');
    inputContainer.innerHTML = '';
    
    selectedBiller.inputs.forEach(input => {
      inputContainer.innerHTML += `
        <div class="form-group">
          <label class="form-label">${input.label} <span class="required">*</span></label>
          <input type="${input.type}" class="form-control" placeholder="${input.placeholder}" required data-key="${input.label}">
        </div>
      `;
    });
  }

  document.getElementById('btn-back-to-list').addEventListener('click', () => {
    showView('list');
  });

  // Handle Bill Fetch (Simulation)
  document.getElementById('form-fetch-bill').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btn-fetch');
    btn.setAttribute('data-loading', 'true');
    btn.textContent = 'Fetching...';

    // Simulate network delay and random bill generation
    setTimeout(() => {
      btn.removeAttribute('data-loading');
      btn.textContent = 'Fetch Bill';

      const inputs = Array.from(document.querySelectorAll('#fetch-input-container input'));
      const customerId = inputs[0].value;

      // Generate random bill amount between 500 and 5000
      const amount = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);

      fetchedBill = {
        amount,
        dueDate: dueDate.toISOString(),
        customerName: user.fullName, // Mocking that the bill belongs to current user
        customerId
      };

      setupPayView();
      showView('pay');
    }, 1200);
  });

  // Setup Pay View
  function setupPayView() {
    document.getElementById('pay-logo').textContent = selectedBiller.icon;
    document.getElementById('pay-name').textContent = selectedBiller.name;
    
    document.getElementById('bill-amt-val').textContent = formatCurrency(fetchedBill.amount);
    document.getElementById('bill-cust-name').textContent = fetchedBill.customerName;
    document.getElementById('bill-due-date').textContent = formatDate(fetchedBill.dueDate).split(',')[0];
    
    // Balance check
    const balanceAlert = document.getElementById('pay-balance-alert');
    const payBtn = document.getElementById('btn-pay-bill');
    
    if (user.balance < fetchedBill.amount) {
      balanceAlert.style.display = 'block';
      balanceAlert.innerHTML = `Insufficient Balance. Available: ${formatCurrency(user.balance)}`;
      payBtn.disabled = true;
    } else {
      balanceAlert.style.display = 'none';
      payBtn.disabled = false;
    }
  }

  document.getElementById('btn-cancel-pay').addEventListener('click', () => {
    showView('fetch');
  });

  // Handle Payment
  document.getElementById('btn-pay-bill').addEventListener('click', (e) => {
    const btn = e.target;
    btn.setAttribute('data-loading', 'true');
    btn.textContent = 'Processing...';

    setTimeout(() => {
      btn.removeAttribute('data-loading');
      
      const newBalance = user.balance - fetchedBill.amount;
      const refNo = generateTxnRef('BP');
      
      if (updateUser(user.id, { balance: newBalance })) {
        
        // Add Transaction
        addTransaction({
          id: generateTxnRef('TXN'),
          userId: user.id,
          type: 'debit',
          mode: 'BILL_PAY',
          amount: fetchedBill.amount,
          balance: newBalance,
          description: `Bill Payment - ${selectedBiller.name}`,
          toAccount: selectedBiller.name,
          fromAccount: user.accountNumber,
          referenceNo: refNo,
          status: 'success',
          timestamp: new Date().toISOString(),
          remarks: `Consumer No: ${fetchedBill.customerId}`
        });

        // Add Notification
        addNotification({
          id: generateId('NOTIF'),
          userId: user.id,
          message: `Your bill payment of ${formatCurrency(fetchedBill.amount)} to ${selectedBiller.name} was successful. Ref: ${refNo}`,
          type: 'success',
          read: false,
          timestamp: new Date().toISOString()
        });
        
        updateNotificationCounter();

        // Setup Receipt
        document.getElementById('receipt-ref').textContent = `Ref: ${refNo}`;
        document.getElementById('receipt-date').textContent = getCurrentDateTime();
        document.getElementById('receipt-amount').textContent = formatCurrency(fetchedBill.amount);
        document.getElementById('receipt-biller').textContent = selectedBiller.name;
        
        showView('receipt');
      } else {
        showToast('Payment failed due to system error', 'error');
        btn.textContent = 'Pay Securely';
      }
    }, 1500);
  });
});
