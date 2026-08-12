/* ============================================================
   KVN BANK — DATA.JS
   Seed Data + LocalStorage CRUD Operations
   ============================================================ */

const STORAGE_KEYS = {
  INITIALIZED: 'KVN_initialized',
  USERS: 'KVN_users',
  TRANSACTIONS: 'KVN_transactions',
  BENEFICIARIES: 'KVN_beneficiaries',
  FIXED_DEPOSITS: 'KVN_fixed_deposits',
  BILLS: 'KVN_bills',
  UPI: 'KVN_upi',
  SESSION: 'KVN_session',
  NOTIFICATIONS: 'KVN_notifications',
  REMEMBER_ME: 'KVN_remember_me'
};

/* ========== SEED DATA ========== */
function getSeedUsers() {
  return [
    {
      id: 'USR001',
      username: 'john.doe',
      passwordHash: btoa('Test@1234'),
      role: 'customer',
      fullName: 'John Doe',
      dob: '1990-05-15',
      gender: 'Male',
      email: 'john.doe@example.com',
      mobile: '9876543210',
      address: '123 MG Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      aadhaar: 'XXXX-XXXX-1234',
      pan: 'ABCDE1234F',
      accountNumber: 'NRB00100001',
      accountType: 'Savings',
      ifscCode: 'NRJB0001001',
      balance: 125000.00,
      status: 'active',
      loginAttempts: 0,
      lockoutUntil: null,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: null,
      securityQuestion: "Mother's maiden name",
      securityAnswer: 'sharma',
      nominees: [
        { name: 'Jane Doe', relationship: 'Spouse', dob: '1992-03-20', sharePercent: 100 }
      ],
      upiId: null,
      mpin: null
    },
    {
      id: 'USR002',
      username: 'jane.smith',
      passwordHash: btoa('Test@1234'),
      role: 'customer',
      fullName: 'Jane Smith',
      dob: '1988-11-22',
      gender: 'Female',
      email: 'jane.smith@example.com',
      mobile: '9876543211',
      address: '456 Park Street, Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700001',
      aadhaar: 'XXXX-XXXX-5678',
      pan: 'FGHIJ5678K',
      accountNumber: 'NRB00100002',
      accountType: 'Savings',
      ifscCode: 'NRJB0001001',
      balance: 87500.00,
      status: 'active',
      loginAttempts: 0,
      lockoutUntil: null,
      createdAt: '2024-02-15T00:00:00Z',
      lastLogin: null,
      securityQuestion: 'First pet name',
      securityAnswer: 'buddy',
      nominees: [],
      upiId: null,
      mpin: null
    },
    {
      id: 'USR003',
      username: 'ravi.kumar',
      passwordHash: btoa('Test@1234'),
      role: 'customer',
      fullName: 'Ravi Kumar',
      dob: '1985-07-10',
      gender: 'Male',
      email: 'ravi.kumar@example.com',
      mobile: '9876543212',
      address: '789 Rajaji Nagar, Malleshwaram',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560003',
      aadhaar: 'XXXX-XXXX-9012',
      pan: 'KLMNO9012P',
      accountNumber: 'NRB00100003',
      accountType: 'Current',
      ifscCode: 'NRJB0001001',
      balance: 250000.00,
      status: 'active',
      loginAttempts: 0,
      lockoutUntil: null,
      createdAt: '2024-03-10T00:00:00Z',
      lastLogin: null,
      securityQuestion: 'Favorite city',
      securityAnswer: 'bangalore',
      nominees: [
        { name: 'Priya Kumar', relationship: 'Spouse', dob: '1987-01-15', sharePercent: 60 },
        { name: 'Aarav Kumar', relationship: 'Son', dob: '2015-04-22', sharePercent: 40 }
      ],
      upiId: null,
      mpin: null
    },
    {
      id: 'USR_ADMIN',
      username: 'admin',
      passwordHash: btoa('Admin@123'),
      role: 'admin',
      fullName: 'KVN Admin',
      dob: '1980-01-01',
      gender: 'Male',
      email: 'admin@kvnbank.com',
      mobile: '9000000001',
      address: 'KVN Bank Head Office',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      aadhaar: '',
      pan: '',
      accountNumber: '',
      accountType: '',
      ifscCode: '',
      balance: 0,
      status: 'active',
      loginAttempts: 0,
      lockoutUntil: null,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: null,
      securityQuestion: '',
      securityAnswer: '',
      nominees: [],
      upiId: null,
      mpin: null
    }
  ];
}

function getSeedTransactions() {
  const now = new Date();
  const transactions = [];
  const descriptions = {
    credit: [
      'Salary Credit - TechCorp Ltd',
      'Refund from Amazon',
      'Interest Credit',
      'Cash Deposit at Branch',
      'NEFT from Suresh Patel',
      'UPI Received from Meera',
      'Dividend Credit - Mutual Fund',
      'Freelance Payment - Upwork'
    ],
    debit: [
      'Electricity Bill - BESCOM',
      'Mobile Recharge - Airtel',
      'Online Shopping - Flipkart',
      'Grocery - BigBasket',
      'Fuel - Indian Oil',
      'EMI Payment - Home Loan',
      'Insurance Premium',
      'Fund Transfer to Rajesh Kumar',
      'DTH Recharge - Tata Play',
      'Water Bill - Municipal Corp',
      'Restaurant - Swiggy',
      'Subscription - Netflix'
    ]
  };

  // Generate 20 transactions for john.doe (USR001)
  let balance = 125000;
  for (let i = 19; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 3 + Math.floor(Math.random() * 3)));
    const isCredit = Math.random() > 0.6;
    const amount = isCredit
      ? Math.round((Math.random() * 15000 + 2000) * 100) / 100
      : Math.round((Math.random() * 8000 + 500) * 100) / 100;

    if (isCredit) balance += amount; else balance -= amount;
    
    const desc = isCredit
      ? descriptions.credit[Math.floor(Math.random() * descriptions.credit.length)]
      : descriptions.debit[Math.floor(Math.random() * descriptions.debit.length)];
    
    const modes = isCredit ? ['NEFT', 'IMPS', 'UPI', 'INTERNAL'] : ['NEFT', 'IMPS', 'UPI', 'BILL', 'INTERNAL'];
    const mode = modes[Math.floor(Math.random() * modes.length)];

    transactions.push({
      id: `TXN${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}${String(20-i).padStart(3,'0')}`,
      userId: 'USR001',
      type: isCredit ? 'credit' : 'debit',
      mode: mode,
      amount: amount,
      balance: Math.round(balance * 100) / 100,
      description: desc,
      toAccount: isCredit ? 'NRB00100001' : 'EXT' + Math.floor(Math.random()*1000000),
      fromAccount: isCredit ? 'EXT' + Math.floor(Math.random()*1000000) : 'NRB00100001',
      referenceNo: `${mode}${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}${String(Math.floor(Math.random()*100000)).padStart(6,'0')}`,
      status: 'success',
      timestamp: date.toISOString(),
      remarks: ''
    });
  }

  // Generate 15 transactions for jane.smith (USR002)
  let balance2 = 87500;
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 4 + Math.floor(Math.random() * 3)));
    const isCredit = Math.random() > 0.55;
    const amount = isCredit
      ? Math.round((Math.random() * 12000 + 1500) * 100) / 100
      : Math.round((Math.random() * 6000 + 400) * 100) / 100;
    if (isCredit) balance2 += amount; else balance2 -= amount;
    
    const desc = isCredit
      ? descriptions.credit[Math.floor(Math.random() * descriptions.credit.length)]
      : descriptions.debit[Math.floor(Math.random() * descriptions.debit.length)];
    const modes = ['NEFT', 'IMPS', 'UPI'];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    transactions.push({
      id: `TXN${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}${String(100+15-i).padStart(3,'0')}`,
      userId: 'USR002',
      type: isCredit ? 'credit' : 'debit',
      mode, amount,
      balance: Math.round(balance2 * 100) / 100,
      description: desc,
      toAccount: isCredit ? 'NRB00100002' : 'EXT' + Math.floor(Math.random()*1000000),
      fromAccount: isCredit ? 'EXT' + Math.floor(Math.random()*1000000) : 'NRB00100002',
      referenceNo: `${mode}${Date.now()}${Math.floor(Math.random()*1000)}`,
      status: 'success',
      timestamp: date.toISOString(),
      remarks: ''
    });
  }

  // Generate 10 transactions for ravi.kumar (USR003)
  let balance3 = 250000;
  for (let i = 9; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 5 + Math.floor(Math.random() * 4)));
    const isCredit = Math.random() > 0.5;
    const amount = isCredit
      ? Math.round((Math.random() * 25000 + 5000) * 100) / 100
      : Math.round((Math.random() * 15000 + 1000) * 100) / 100;
    if (isCredit) balance3 += amount; else balance3 -= amount;
    const desc = isCredit
      ? descriptions.credit[Math.floor(Math.random() * descriptions.credit.length)]
      : descriptions.debit[Math.floor(Math.random() * descriptions.debit.length)];
    const modes = ['NEFT', 'RTGS', 'IMPS'];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    transactions.push({
      id: `TXN${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}${String(200+10-i).padStart(3,'0')}`,
      userId: 'USR003',
      type: isCredit ? 'credit' : 'debit',
      mode, amount,
      balance: Math.round(balance3 * 100) / 100,
      description: desc,
      toAccount: isCredit ? 'NRB00100003' : 'EXT' + Math.floor(Math.random()*1000000),
      fromAccount: isCredit ? 'EXT' + Math.floor(Math.random()*1000000) : 'NRB00100003',
      referenceNo: `${mode}${Date.now()}${Math.floor(Math.random()*1000)}`,
      status: 'success',
      timestamp: date.toISOString(),
      remarks: ''
    });
  }

  return transactions;
}

function getSeedBeneficiaries() {
  return [
    {
      id: 'BEN001', userId: 'USR001', nickName: 'Rajesh - HDFC',
      beneficiaryName: 'Rajesh Kumar', accountNumber: 'HDFC1234567890',
      bankName: 'HDFC Bank', ifscCode: 'HDFC0001234', accountType: 'Savings',
      status: 'active', addedAt: '2026-06-01T10:00:00Z', activatesAt: '2026-06-02T10:00:00Z'
    },
    {
      id: 'BEN002', userId: 'USR001', nickName: 'Priya - SBI',
      beneficiaryName: 'Priya Sharma', accountNumber: 'SBI9876543210',
      bankName: 'State Bank of India', ifscCode: 'SBIN0001234', accountType: 'Savings',
      status: 'active', addedAt: '2026-05-15T14:00:00Z', activatesAt: '2026-05-16T14:00:00Z'
    },
    {
      id: 'BEN003', userId: 'USR001', nickName: 'Office Rent - ICICI',
      beneficiaryName: 'Vikram Properties', accountNumber: 'ICICI5678901234',
      bankName: 'ICICI Bank', ifscCode: 'ICIC0005678', accountType: 'Current',
      status: 'active', addedAt: '2026-04-20T09:00:00Z', activatesAt: '2026-04-21T09:00:00Z'
    },
    {
      id: 'BEN004', userId: 'USR002', nickName: 'Mother - PNB',
      beneficiaryName: 'Lakshmi Smith', accountNumber: 'PNB1122334455',
      bankName: 'Punjab National Bank', ifscCode: 'PUNB0112233', accountType: 'Savings',
      status: 'active', addedAt: '2026-07-01T11:00:00Z', activatesAt: '2026-07-02T11:00:00Z'
    },
    {
      id: 'BEN005', userId: 'USR003', nickName: 'Employee Salary - BOB',
      beneficiaryName: 'Amit Verma', accountNumber: 'BOB7788990011',
      bankName: 'Bank of Baroda', ifscCode: 'BARB0778899', accountType: 'Savings',
      status: 'active', addedAt: '2026-03-10T16:00:00Z', activatesAt: '2026-03-11T16:00:00Z'
    }
  ];
}

function getSeedFixedDeposits() {
  return [
    {
      id: 'FD001', userId: 'USR001', fdNumber: 'NRB-FD-20260801-001',
      principalAmount: 50000, tenureMonths: 12, interestRate: 7.0,
      interestType: 'compound', maturityAmount: 53606.25, interestEarned: 3606.25,
      openDate: '2026-08-01', maturityDate: '2027-08-01', status: 'active'
    },
    {
      id: 'FD002', userId: 'USR001', fdNumber: 'NRB-FD-20260315-002',
      principalAmount: 100000, tenureMonths: 24, interestRate: 7.25,
      interestType: 'compound', maturityAmount: 115167.84, interestEarned: 15167.84,
      openDate: '2026-03-15', maturityDate: '2028-03-15', status: 'active'
    },
    {
      id: 'FD003', userId: 'USR003', fdNumber: 'NRB-FD-20260601-003',
      principalAmount: 200000, tenureMonths: 6, interestRate: 6.5,
      interestType: 'simple', maturityAmount: 206500.00, interestEarned: 6500.00,
      openDate: '2026-06-01', maturityDate: '2026-12-01', status: 'active'
    }
  ];
}

function getSeedNotifications() {
  const now = new Date().toISOString();
  return [
    { id: 'NOTIF001', userId: 'USR001', message: 'Welcome to KVN Bank NetBanking! Your account is now active.', type: 'info', read: false, timestamp: now },
    { id: 'NOTIF002', userId: 'USR001', message: 'New beneficiary "Rajesh Kumar" has been activated.', type: 'success', read: false, timestamp: now },
    { id: 'NOTIF003', userId: 'USR001', message: 'Fixed Deposit NRB-FD-20260801-001 opened successfully for ₹50,000.', type: 'success', read: true, timestamp: now },
    { id: 'NOTIF004', userId: 'USR002', message: 'Welcome to KVN Bank NetBanking! Your account is now active.', type: 'info', read: false, timestamp: now },
    { id: 'NOTIF005', userId: 'USR003', message: 'Your current account balance has exceeded ₹2,00,000.', type: 'warning', read: false, timestamp: now }
  ];
}

function getSeedATMBranches() {
  return [
    { id: 'ATM001', name: 'KVN Bank ATM - Bandra', type: 'ATM', address: '123 Turner Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '022-26001234', hours: '24/7', atmAvailable: true },
    { id: 'ATM002', name: 'KVN Bank Branch - Fort', type: 'Branch', address: '45 Dalal Street, Fort', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '022-22001234', hours: '10:00 AM - 4:00 PM', atmAvailable: true },
    { id: 'ATM003', name: 'KVN Bank ATM - Andheri', type: 'ATM', address: '78 Link Road, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', phone: '022-26501234', hours: '24/7', atmAvailable: true },
    { id: 'ATM004', name: 'KVN Bank Branch - Thane', type: 'Branch', address: '12 Gokhale Road, Thane West', city: 'Mumbai', state: 'Maharashtra', pincode: '400602', phone: '022-25001234', hours: '10:00 AM - 4:00 PM', atmAvailable: true },
    { id: 'BR001', name: 'KVN Bank Branch - Salt Lake', type: 'Branch', address: '56 Sector V, Salt Lake', city: 'Kolkata', state: 'West Bengal', pincode: '700091', phone: '033-23001234', hours: '10:00 AM - 4:00 PM', atmAvailable: true },
    { id: 'ATM005', name: 'KVN Bank ATM - Park Street', type: 'ATM', address: '89 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016', phone: '033-22001234', hours: '24/7', atmAvailable: true },
    { id: 'ATM006', name: 'KVN Bank ATM - Howrah', type: 'ATM', address: '34 GT Road, Howrah', city: 'Kolkata', state: 'West Bengal', pincode: '711101', phone: '033-26001234', hours: '24/7', atmAvailable: true },
    { id: 'BR002', name: 'KVN Bank Branch - MG Road', type: 'Branch', address: '100 MG Road, Shivaji Nagar', city: 'Bangalore', state: 'Karnataka', pincode: '560001', phone: '080-25001234', hours: '10:00 AM - 4:00 PM', atmAvailable: true },
    { id: 'ATM007', name: 'KVN Bank ATM - Indiranagar', type: 'ATM', address: '12th Main, Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', phone: '080-25601234', hours: '24/7', atmAvailable: true },
    { id: 'ATM008', name: 'KVN Bank ATM - Koramangala', type: 'ATM', address: '4th Block, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034', phone: '080-25701234', hours: '24/7', atmAvailable: true },
    { id: 'BR003', name: 'KVN Bank Branch - Electronic City', type: 'Branch', address: 'Phase 1, Electronic City', city: 'Bangalore', state: 'Karnataka', pincode: '560100', phone: '080-28001234', hours: '10:00 AM - 4:00 PM', atmAvailable: false },
    { id: 'BR004', name: 'KVN Bank Branch - Connaught Place', type: 'Branch', address: 'Block A, Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001', phone: '011-23001234', hours: '10:00 AM - 4:00 PM', atmAvailable: true },
    { id: 'ATM009', name: 'KVN Bank ATM - Saket', type: 'ATM', address: 'Select CityWalk Mall, Saket', city: 'New Delhi', state: 'Delhi', pincode: '110017', phone: '011-26001234', hours: '24/7', atmAvailable: true },
    { id: 'ATM010', name: 'KVN Bank ATM - Nehru Place', type: 'ATM', address: 'Nehru Place Market', city: 'New Delhi', state: 'Delhi', pincode: '110019', phone: '011-26201234', hours: '24/7', atmAvailable: true },
    { id: 'ATM011', name: 'KVN Bank ATM - Dwarka', type: 'ATM', address: 'Sector 12, Dwarka', city: 'New Delhi', state: 'Delhi', pincode: '110075', phone: '011-28001234', hours: '24/7', atmAvailable: true },
    { id: 'BR005', name: 'KVN Bank Branch - Anna Nagar', type: 'Branch', address: '2nd Avenue, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', phone: '044-26001234', hours: '10:00 AM - 4:00 PM', atmAvailable: true },
    { id: 'ATM012', name: 'KVN Bank ATM - T Nagar', type: 'ATM', address: 'Usman Road, T Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', phone: '044-24001234', hours: '24/7', atmAvailable: true },
    { id: 'ATM013', name: 'KVN Bank ATM - Adyar', type: 'ATM', address: 'LB Road, Adyar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600020', phone: '044-24501234', hours: '24/7', atmAvailable: true },
    { id: 'BR006', name: 'KVN Bank Branch - Velachery', type: 'Branch', address: '100 Feet Road, Velachery', city: 'Chennai', state: 'Tamil Nadu', pincode: '600042', phone: '044-22001234', hours: '10:00 AM - 4:00 PM', atmAvailable: true },
    { id: 'ATM014', name: 'KVN Bank ATM - OMR', type: 'ATM', address: 'Old Mahabalipuram Road, Sholinganallur', city: 'Chennai', state: 'Tamil Nadu', pincode: '600119', phone: '044-24801234', hours: '24/7', atmAvailable: true }
  ];
}

function getSeedBillers() {
  return {
    electricity: [
      { id: 'BILL-E-001', name: 'BESCOM Karnataka', region: 'Karnataka' },
      { id: 'BILL-E-002', name: 'MSEDCL Maharashtra', region: 'Maharashtra' },
      { id: 'BILL-E-003', name: 'TNEB Tamil Nadu', region: 'Tamil Nadu' },
      { id: 'BILL-E-004', name: 'BSES Rajdhani Delhi', region: 'Delhi' }
    ],
    water: [
      { id: 'BILL-W-001', name: 'BWSSB Bangalore', region: 'Karnataka' },
      { id: 'BILL-W-002', name: 'Municipal Corp Mumbai', region: 'Maharashtra' },
      { id: 'BILL-W-003', name: 'Delhi Jal Board', region: 'Delhi' }
    ],
    gas: [
      { id: 'BILL-G-001', name: 'Indane Gas', region: 'All India' },
      { id: 'BILL-G-002', name: 'HP Gas', region: 'All India' },
      { id: 'BILL-G-003', name: 'Bharat Gas', region: 'All India' }
    ],
    mobile: [
      { id: 'BILL-M-001', name: 'Airtel Postpaid', region: 'All India' },
      { id: 'BILL-M-002', name: 'Jio Postpaid', region: 'All India' },
      { id: 'BILL-M-003', name: 'Vi Postpaid', region: 'All India' }
    ],
    dth: [
      { id: 'BILL-D-001', name: 'Tata Play', region: 'All India' },
      { id: 'BILL-D-002', name: 'Airtel Digital TV', region: 'All India' },
      { id: 'BILL-D-003', name: 'Dish TV', region: 'All India' }
    ],
    internet: [
      { id: 'BILL-I-001', name: 'ACT Fibernet', region: 'South India' },
      { id: 'BILL-I-002', name: 'Airtel Broadband', region: 'All India' },
      { id: 'BILL-I-003', name: 'JioFiber', region: 'All India' }
    ]
  };
}

/* ========== INITIALIZATION ========== */
function initializeApp() {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true') {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(getSeedUsers()));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(getSeedTransactions()));
  localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(getSeedBeneficiaries()));
  localStorage.setItem(STORAGE_KEYS.FIXED_DEPOSITS, JSON.stringify(getSeedFixedDeposits()));
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.UPI, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(getSeedNotifications()));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

/* ========== GENERIC CRUD HELPERS ========== */
function _getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function _setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ========== USER OPERATIONS ========== */
function getUsers() {
  return _getData(STORAGE_KEYS.USERS);
}

function getUserById(id) {
  return getUsers().find(u => u.id === id) || null;
}

function getUserByUsername(username) {
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users[index] = { ...users[index], ...updates };
  _setData(STORAGE_KEYS.USERS, users);
  return true;
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  _setData(STORAGE_KEYS.USERS, users);
}

function getNextUserId() {
  const users = getUsers();
  const customerUsers = users.filter(u => u.id.startsWith('USR') && u.id !== 'USR_ADMIN');
  const maxId = customerUsers.reduce((max, u) => {
    const num = parseInt(u.id.replace('USR', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `USR${String(maxId + 1).padStart(3, '0')}`;
}

function getNextAccountNumber() {
  const users = getUsers();
  const maxAcc = users.reduce((max, u) => {
    if (!u.accountNumber) return max;
    const num = parseInt(u.accountNumber.replace('NRB', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `NRB${String(maxAcc + 1).padStart(8, '0')}`;
}

/* ========== TRANSACTION OPERATIONS ========== */
function getTransactions(userId) {
  const all = _getData(STORAGE_KEYS.TRANSACTIONS);
  if (!userId) return all;
  return all.filter(t => t.userId === userId);
}

function addTransaction(txn) {
  const transactions = _getData(STORAGE_KEYS.TRANSACTIONS);
  transactions.push(txn);
  _setData(STORAGE_KEYS.TRANSACTIONS, transactions);
}

function getAllTransactions() {
  return _getData(STORAGE_KEYS.TRANSACTIONS);
}

/* ========== BENEFICIARY OPERATIONS ========== */
function getBeneficiaries(userId) {
  const all = _getData(STORAGE_KEYS.BENEFICIARIES);
  if (!userId) return all;
  return all.filter(b => b.userId === userId);
}

function addBeneficiary(ben) {
  const beneficiaries = _getData(STORAGE_KEYS.BENEFICIARIES);
  beneficiaries.push(ben);
  _setData(STORAGE_KEYS.BENEFICIARIES, beneficiaries);
}

function updateBeneficiary(id, updates) {
  const beneficiaries = _getData(STORAGE_KEYS.BENEFICIARIES);
  const index = beneficiaries.findIndex(b => b.id === id);
  if (index === -1) return false;
  beneficiaries[index] = { ...beneficiaries[index], ...updates };
  _setData(STORAGE_KEYS.BENEFICIARIES, beneficiaries);
  return true;
}

function deleteBeneficiary(id) {
  const beneficiaries = _getData(STORAGE_KEYS.BENEFICIARIES);
  const filtered = beneficiaries.filter(b => b.id !== id);
  _setData(STORAGE_KEYS.BENEFICIARIES, filtered);
}

function getNextBeneficiaryId() {
  const bens = _getData(STORAGE_KEYS.BENEFICIARIES);
  const maxId = bens.reduce((max, b) => {
    const num = parseInt(b.id.replace('BEN', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `BEN${String(maxId + 1).padStart(3, '0')}`;
}

/* ========== FIXED DEPOSIT OPERATIONS ========== */
function getFixedDeposits(userId) {
  const all = _getData(STORAGE_KEYS.FIXED_DEPOSITS);
  if (!userId) return all;
  return all.filter(fd => fd.userId === userId);
}

function addFixedDeposit(fd) {
  const fds = _getData(STORAGE_KEYS.FIXED_DEPOSITS);
  fds.push(fd);
  _setData(STORAGE_KEYS.FIXED_DEPOSITS, fds);
}

function closeFixedDeposit(id) {
  const fds = _getData(STORAGE_KEYS.FIXED_DEPOSITS);
  const index = fds.findIndex(fd => fd.id === id);
  if (index === -1) return null;
  fds[index].status = 'closed';
  _setData(STORAGE_KEYS.FIXED_DEPOSITS, fds);
  return fds[index];
}

function getNextFDId() {
  const fds = _getData(STORAGE_KEYS.FIXED_DEPOSITS);
  const maxId = fds.reduce((max, fd) => {
    const num = parseInt(fd.id.replace('FD', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `FD${String(maxId + 1).padStart(3, '0')}`;
}

/* ========== BILL OPERATIONS ========== */
function getBills(userId) {
  const all = _getData(STORAGE_KEYS.BILLS);
  if (!userId) return all;
  return all.filter(b => b.userId === userId);
}

function addBill(bill) {
  const bills = _getData(STORAGE_KEYS.BILLS);
  bills.push(bill);
  _setData(STORAGE_KEYS.BILLS, bills);
}

function getBillers() {
  return getSeedBillers();
}

/* ========== UPI OPERATIONS ========== */
function getUPIRegistrations(userId) {
  const all = _getData(STORAGE_KEYS.UPI);
  if (!userId) return all;
  return all.filter(u => u.userId === userId);
}

function addUPIRegistration(upi) {
  const upis = _getData(STORAGE_KEYS.UPI);
  upis.push(upi);
  _setData(STORAGE_KEYS.UPI, upis);
}

function deleteUPIRegistration(id) {
  const upis = _getData(STORAGE_KEYS.UPI);
  _setData(STORAGE_KEYS.UPI, upis.filter(u => u.id !== id));
}

/* ========== NOTIFICATION OPERATIONS ========== */
function getNotifications(userId) {
  const all = _getData(STORAGE_KEYS.NOTIFICATIONS);
  if (!userId) return all;
  return all.filter(n => n.userId === userId);
}

function addNotification(notification) {
  const notifications = _getData(STORAGE_KEYS.NOTIFICATIONS);
  notifications.push(notification);
  _setData(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

function markNotificationRead(id) {
  const notifications = _getData(STORAGE_KEYS.NOTIFICATIONS);
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    _setData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

function markAllNotificationsRead(userId) {
  const notifications = _getData(STORAGE_KEYS.NOTIFICATIONS);
  notifications.forEach(n => {
    if (n.userId === userId) n.read = true;
  });
  _setData(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

/* ========== ATM/BRANCH DATA ========== */
function getATMBranches() {
  return getSeedATMBranches();
}

/* ========== FD INTEREST RATES ========== */
function getFDInterestRate(tenureMonths) {
  if (tenureMonths <= 1.5) return 4.5;   // 7-45 days
  if (tenureMonths <= 6) return 5.5;     // 46-179 days
  if (tenureMonths <= 12) return 6.5;    // 180 days - 1 year
  if (tenureMonths <= 24) return 7.0;    // 1-2 years
  if (tenureMonths <= 60) return 7.25;   // 2-5 years
  return 6.75;                           // 5-10 years
}

/* ========== RESET APP (for testing) ========== */
function resetApp() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  initializeApp();
}
