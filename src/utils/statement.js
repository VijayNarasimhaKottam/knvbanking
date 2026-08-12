/* ============================================================
   KVN BANK — STATEMENT.JS
   Transaction filtering, pagination, and summary calculation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return;

  const allTxns = getTransactions(user.id);
  let filteredTxns = [...allTxns];
  
  const itemsPerPage = 10;
  let currentPage = 1;

  // DOM Elements
  const tbody = document.getElementById('statement-tbody');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('btn-prev-page');
  const nextBtn = document.getElementById('btn-next-page');

  // Filter Elements
  const filterType = document.getElementById('filter-type');
  const filterMonth = document.getElementById('filter-month');
  const filterSearch = document.getElementById('filter-search');
  const btnDownload = document.getElementById('btn-download');

  // Initialize Month Filter Options
  const currentMonth = new Date().getMonth();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let monthOptions = '<option value="all">All Time</option>';
  for (let i = 0; i < 6; i++) {
    let m = currentMonth - i;
    let y = new Date().getFullYear();
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    const val = `${y}-${(m + 1).toString().padStart(2, '0')}`;
    monthOptions += `<option value="${val}">${months[m]} ${y}</option>`;
  }
  filterMonth.innerHTML = monthOptions;

  function calculateSummary(txns) {
    let totalIn = 0;
    let totalOut = 0;
    
    txns.forEach(t => {
      if (t.type === 'credit') totalIn += t.amount;
      else if (t.type === 'debit') totalOut += t.amount;
    });

    document.getElementById('sum-in').textContent = formatCurrency(totalIn);
    document.getElementById('sum-out').textContent = formatCurrency(totalOut);
    document.getElementById('sum-net').textContent = formatCurrency(totalIn - totalOut);
  }

  function renderTable() {
    tbody.innerHTML = '';

    const totalPages = Math.ceil(filteredTxns.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedTxns = filteredTxns.slice(startIdx, endIdx);

    if (paginatedTxns.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: var(--space-8); color: var(--color-text-secondary);">
            No transactions found matching your criteria.
          </td>
        </tr>
      `;
    } else {
      paginatedTxns.forEach(txn => {
        const isCredit = txn.type === 'credit';
        const sign = isCredit ? '+' : '−';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="txn-date-cell">${formatDate(txn.timestamp)}</td>
          <td class="txn-desc-cell">
            ${txn.description}
            <span class="txn-ref">Ref: ${txn.referenceNo}</span>
          </td>
          <td>
            <span class="txn-type-badge ${isCredit ? 'credit' : 'debit'}">${txn.mode || txn.type}</span>
          </td>
          <td class="amount-col ${isCredit ? 'credit' : ''}">${sign}${formatCurrency(txn.amount)}</td>
          <td class="balance-col">${formatCurrency(txn.balance)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Update Pagination UI
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${filteredTxns.length} records)`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    calculateSummary(filteredTxns);
  }

  function applyFilters() {
    const type = filterType.value;
    const month = filterMonth.value;
    const search = filterSearch.value.toLowerCase().trim();

    filteredTxns = allTxns.filter(txn => {
      // Type Filter
      if (type !== 'all' && txn.type !== type) return false;
      
      // Month Filter (format: YYYY-MM)
      if (month !== 'all') {
        const txnDate = new Date(txn.timestamp);
        const txnMonth = `${txnDate.getFullYear()}-${(txnDate.getMonth() + 1).toString().padStart(2, '0')}`;
        if (txnMonth !== month) return false;
      }

      // Search Filter
      if (search) {
        const searchStr = `${txn.description} ${txn.referenceNo} ${txn.amount}`.toLowerCase();
        if (!searchStr.includes(search)) return false;
      }

      return true;
    });

    currentPage = 1;
    renderTable();
  }

  // Event Listeners
  filterType.addEventListener('change', applyFilters);
  filterMonth.addEventListener('change', applyFilters);
  filterSearch.addEventListener('input', applyFilters);

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredTxns.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  btnDownload.addEventListener('click', () => {
    showToast('Statement download initiated. PDF will be saved to your device.', 'success');
  });

  // Initial Render
  renderTable();
});
