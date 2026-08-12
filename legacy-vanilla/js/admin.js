/* ============================================================
   KVN BANK — ADMIN.JS
   Role validation, system stats, user management
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  // Security Check: Only Admin allowed
  if (currentUser.role !== 'admin') {
    showToast('Unauthorized access. Redirecting...', 'error');
    window.location.replace('dashboard.html');
    return;
  }

  // Load Data
  let users = JSON.parse(localStorage.getItem('KVN_USERS')) || [];
  
  // Render Stats
  function renderStats() {
    const totalUsers = users.length;
    let totalDeposits = 0;
    
    users.forEach(u => {
      totalDeposits += u.balance;
    });

    document.getElementById('stat-total-users').textContent = totalUsers;
    document.getElementById('stat-total-deposits').textContent = formatCurrency(totalDeposits);
    
    // Mock Active Sessions & Daily Txns
    document.getElementById('stat-active-sessions').textContent = Math.floor(Math.random() * 20) + 5;
    document.getElementById('stat-daily-txns').textContent = Math.floor(Math.random() * 500) + 100;
  }

  // Render Table
  function renderTable() {
    const tbody = document.getElementById('admin-user-tbody');
    tbody.innerHTML = '';

    users.forEach(u => {
      const isSelf = u.id === currentUser.id;
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="user-cell">
            <div class="user-avatar">${getInitials(u.fullName)}</div>
            <div>
              <div class="user-name">${u.fullName} ${isSelf ? '(You)' : ''}</div>
              <div class="user-email">${u.email}</div>
            </div>
          </div>
        </td>
        <td style="font-family: var(--font-mono); font-size: 12px;">${u.accountNumber || 'N/A'}</td>
        <td>
          <span class="badge-role ${u.role}">${u.role}</span>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 600;">${formatCurrency(u.balance)}</td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="action-btn btn-edit" data-id="${u.id}" title="Edit Balance">✏️</button>
            ${!isSelf ? `<button class="action-btn delete btn-delete" data-id="${u.id}" title="Delete User">🗑️</button>` : ''}
          </div>
        </td>
      `;
      
      tbody.appendChild(tr);
    });

    // Attach Handlers
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const userToEdit = users.find(u => u.id === id);
        
        const newBalanceStr = prompt(`Enter new balance for ${userToEdit.fullName}:`, userToEdit.balance);
        if (newBalanceStr !== null) {
          const newBalance = parseFloat(newBalanceStr);
          if (!isNaN(newBalance) && newBalance >= 0) {
            updateUser(id, { balance: newBalance });
            users = JSON.parse(localStorage.getItem('KVN_USERS')); // Reload
            renderTable();
            renderStats();
            showToast('Balance updated successfully', 'success');
          } else {
            showToast('Invalid balance amount', 'error');
          }
        }
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const userToEdit = users.find(u => u.id === id);
        
        if (confirm(`Are you sure you want to permanently delete user ${userToEdit.fullName}?`)) {
          // Remove user
          users = users.filter(u => u.id !== id);
          localStorage.setItem('KVN_USERS', JSON.stringify(users));
          
          // Cleanup associated data
          localStorage.removeItem(`KVN_TXNS_${id}`);
          localStorage.removeItem(`KVN_BENE_${id}`);
          localStorage.removeItem(`KVN_NOTIFS_${id}`);
          
          renderTable();
          renderStats();
          showToast('User deleted successfully', 'success');
        }
      });
    });
  }

  // Admin Search
  document.getElementById('admin-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#admin-user-tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  });

  // Initial Render
  renderStats();
  renderTable();
});
