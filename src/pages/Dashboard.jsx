import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccountBalance, getRecentTransactions } from '../utils/data';
import { ArrowUpRight, ArrowDownRight, IndianRupee, CreditCard, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setBalance(getAccountBalance(currentUser.id));
      setTransactions(getRecentTransactions(currentUser.id, 5));
    }
  }, [currentUser]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="text-secondary">Welcome back, {currentUser?.fullName}</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3>Available Balance</h3>
            <div className="metric-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
              <IndianRupee size={24} />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(balance)}</div>
          <div className="metric-footer">
            <span className="text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUpRight size={16} /> +2.4%
            </span>
            <span className="text-secondary" style={{ fontSize: '0.875rem' }}> from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Account Details</h3>
            <div className="metric-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>
              <strong>A/C No:</strong> {currentUser?.accountNumber}
            </p>
            <p style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>
              <strong>IFSC:</strong> {currentUser?.ifscCode}
            </p>
            <p style={{ marginBottom: 0, color: 'var(--text)' }}>
              <strong>Type:</strong> {currentUser?.accountType}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Active Cards</h3>
            <div className="metric-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)' }}>
              <CreditCard size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '0.5rem', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: '600' }}>KVN Platinum</span>
              <span>VISA</span>
            </div>
            <div style={{ fontSize: '1.25rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              **** **** **** 4281
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', opacity: 0.8 }}>
              <span>{currentUser?.fullName}</span>
              <span>12/28</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-transactions">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Recent Transactions</h2>
            <a href="/transactions" className="btn btn-outline btn-sm">View All</a>
          </div>

          <div className="transaction-list">
            {transactions.length === 0 ? (
              <p className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>No recent transactions found.</p>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="transaction-item">
                  <div className={`transaction-icon ${t.type}`}>
                    {t.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className="transaction-details">
                    <h4 className="transaction-title">{t.description}</h4>
                    <span className="transaction-date">{formatDate(t.date)}</span>
                  </div>
                  <div className={`transaction-amount ${t.type}`}>
                    {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
