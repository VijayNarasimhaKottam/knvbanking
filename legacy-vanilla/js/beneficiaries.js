/* ============================================================
   KVN BANK — BENEFICIARIES.JS
   List, filter, and add beneficiaries
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) return;

  const beneGrid = document.getElementById('bene-grid');
  const searchInput = document.getElementById('search-bene');
  let beneficiaries = getBeneficiaries(user.id);

  // Render Beneficiaries
  function renderBeneficiaries(filterText = '') {
    beneGrid.innerHTML = '';
    
    const filtered = beneficiaries.filter(b => 
      b.name.toLowerCase().includes(filterText.toLowerCase()) || 
      b.accountNumber.includes(filterText) ||
      b.bankName.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
      beneGrid.innerHTML = `
        <div class="bene-empty">
          <div class="bene-empty-icon">👥</div>
          <h2 style="margin-bottom: 8px;">No Beneficiaries Found</h2>
          <p>You haven't added any beneficiaries yet, or none match your search.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(ben => {
      const card = document.createElement('div');
      card.className = 'bene-card';
      
      card.innerHTML = `
        <div class="bene-card-header">
          <div class="bene-avatar">${getInitials(ben.name)}</div>
          <div class="bene-name-info">
            <div class="bene-name">${ben.name}</div>
            <div class="bene-bank">${ben.bankName}</div>
          </div>
        </div>
        
        <div class="bene-details">
          <div class="bene-detail-row">
            <span class="lbl">Account No.</span>
            <span class="val">${maskAccountNo(ben.accountNumber)}</span>
          </div>
          <div class="bene-detail-row">
            <span class="lbl">IFSC Code</span>
            <span class="val">${ben.ifsc}</span>
          </div>
        </div>
        
        <div class="bene-actions">
          <button class="btn btn-sm btn-outline btn-send" data-id="${ben.id}">Send Money</button>
          <button class="btn btn-sm btn-outline btn-delete" data-id="${ben.id}" style="color: var(--color-danger); border-color: var(--color-danger-light);">Delete</button>
        </div>
      `;
      
      beneGrid.appendChild(card);
    });

    // Attach Event Listeners
    document.querySelectorAll('.btn-send').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Just redirect to transfer page. In a real app, we'd pass the ID via URL params or state.
        window.location.href = 'transfer.html';
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (confirm('Are you sure you want to remove this beneficiary?')) {
          const success = deleteBeneficiary(id);
          if (success) {
            beneficiaries = getBeneficiaries(user.id);
            renderBeneficiaries(searchInput.value);
            showToast('Beneficiary removed successfully', 'success');
          }
        }
      });
    });
  }

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    renderBeneficiaries(e.target.value);
  });

  // Add Beneficiary Modal Logic
  const modal = document.getElementById('modal-add-bene');
  const btnAdd = document.getElementById('btn-add-bene');
  const btnClose = document.getElementById('btn-close-modal');
  const btnCancel = document.getElementById('btn-cancel-modal');
  const form = document.getElementById('form-add-bene');

  function openModal() { modal.classList.add('active'); }
  function closeModal() { 
    modal.classList.remove('active'); 
    form.reset();
  }

  btnAdd.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('bene-name').value.trim();
    const accountNo = document.getElementById('bene-acc').value.trim();
    const confirmAccountNo = document.getElementById('bene-acc-confirm').value.trim();
    const ifsc = document.getElementById('bene-ifsc').value.trim().toUpperCase();
    const bankName = document.getElementById('bene-bank').value.trim();

    if (accountNo !== confirmAccountNo) {
      showToast('Account numbers do not match', 'error');
      return;
    }

    if (!ifsc.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) {
      // Basic IFSC validation (e.g., HDFC0001234)
      showToast('Invalid IFSC format', 'error');
      return;
    }

    const btnSubmit = document.getElementById('btn-save-bene');
    btnSubmit.setAttribute('data-loading', 'true');

    setTimeout(() => {
      btnSubmit.removeAttribute('data-loading');
      
      const newBene = {
        userId: user.id,
        name: name,
        accountNumber: accountNo,
        ifsc: ifsc,
        bankName: bankName
      };

      const added = addBeneficiary(newBene);
      
      if (added) {
        showToast('Beneficiary added successfully', 'success');
        beneficiaries = getBeneficiaries(user.id);
        renderBeneficiaries(searchInput.value);
        closeModal();
      } else {
        showToast('Failed to add beneficiary', 'error');
      }
    }, 1000);
  });

  // Initial Render
  renderBeneficiaries();
});
