import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../utils/data';
import { formatAccountNo, formatCurrency, formatDate } from '../utils/utils';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setBalance(currentUser.balance);
      setTransactions(getTransactions(currentUser.id).slice(0, 5));
    }
  }, [currentUser]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {currentUser?.fullName}</h1>
        <p className="page-subtitle">Here's a summary of your accounts and recent activities.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* Main Content Column */}
        <div className="dashboard-main">
          
          {/* Balance Card */}
          <div className="balance-card">
            <div className="balance-header">
              <div className="account-info">
                <span className="account-type">{currentUser?.accountType || 'Savings'} Account</span>
                <span className="account-number">{formatAccountNo(currentUser?.accountNumber)}</span>
              </div>
              <div className="logo-mark">
                <img src="/assets/logo.svg" alt="KVN" height="32" />
              </div>
            </div>
            
            <div className="balance-amount">
              <div className="balance-label">Available Balance</div>
              <div className="balance-value">{formatCurrency(balance)}</div>
            </div>
            
            <div className="balance-actions">
              <Link to="/transfer" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>Send Money</Link>
              <Link to="/transactions" className="btn btn-primary" style={{ background: 'white', color: 'var(--color-primary-mid)' }}>Statement</Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <div className="section-header">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            
            <div className="quick-actions-grid">
              <Link to="/transfer" className="action-card">
                <div className="action-icon">💸</div>
                <span className="action-label">Transfer</span>
              </Link>
              <Link to="/bills" className="action-card">
                <div className="action-icon">🧾</div>
                <span className="action-label">Pay Bills</span>
              </Link>
              <Link to="/deposits" className="action-card">
                <div className="action-icon">💰</div>
                <span className="action-label">Open FD</span>
              </Link>
              <Link to="/cards" className="action-card">
                <div className="action-icon">💳</div>
                <span className="action-label">Manage Cards</span>
              </Link>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="quick-actions-section" style={{ marginTop: 'var(--space-8)' }}>
            <div className="section-header">
              <h2 className="section-title">Recent Transactions</h2>
              <Link to="/transactions" className="btn btn-sm btn-outline">View All</Link>
            </div>
            
            <div className="recent-transactions">
              <div className="txn-list">
                {transactions.length > 0 ? (
                  transactions.map(txn => (
                    <div className="txn-item" key={txn.id}>
                      <div className="txn-icon" style={{ 
                        background: txn.type === 'credit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: txn.type === 'credit' ? 'var(--color-success)' : 'var(--color-danger)'
                      }}>
                        {txn.type === 'credit' ? '↓' : '↑'}
                      </div>
                      <div className="txn-details">
                        <div className="txn-title">{txn.description}</div>
                        <div className="txn-meta">{formatDate(txn.timestamp)} • {txn.mode}</div>
                      </div>
                      <div className={`txn-amount ${txn.type === 'credit' ? 'text-success' : ''}`}>
                        {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="txn-item" style={{ justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                    No recent transactions found.
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Sidebar Column */}
        <div className="dashboard-sidebar">
          
          {/* Credit Card Mock */}
          <div className="cc-widget">
            <div className="cc-chip"></div>
            <div className="cc-number">XXXX XXXX XXXX {currentUser?.accountNumber?.slice(-4) || '0000'}</div>
            <div className="cc-details">
              <div>
                <div>Card Holder</div>
                <div className="cc-val" style={{ textTransform: 'uppercase' }}>{currentUser?.fullName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>Expires</div>
                <div className="cc-val">12/28</div>
              </div>
            </div>
            <img src="/assets/logo.svg" alt="KVN" style={{ position: 'absolute', bottom: '20px', right: '20px', height: '24px', opacity: 0.8 }} />
          </div>

          {/* Spending Analytics Mock */}
          <div className="chart-widget">
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Spending Analysis</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Last 7 Days</div>
            
            <div className="chart-bars">
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '30%' }}></div><div className="chart-label">M</div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '70%' }}></div><div className="chart-label">T</div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '40%' }}></div><div className="chart-label">W</div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '90%' }}></div><div className="chart-label">T</div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '20%' }}></div><div className="chart-label">F</div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '50%' }}></div><div className="chart-label">S</div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '10%' }}></div><div className="chart-label">S</div></div>
            </div>
          </div>

          {/* Promo Widget */}
          <div className="chart-widget" style={{ background: 'var(--color-surface-alt)', borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Pre-approved Loan</div>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
              You are eligible for a personal loan of up to ₹5,00,000 instantly.
            </p>
            <button className="btn btn-sm btn-primary">Apply Now</button>
          </div>

        </div>
        
      </div>
    </div>
  );
}
