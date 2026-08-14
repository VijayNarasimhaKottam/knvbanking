import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { maskAccountNo } from '../../utils/utils';

export default function Navbar({ isPublic }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'KV';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isPublic) {
    return (
      <nav className="public-navbar" id="public-navbar">
        <Link to="/" className="topnav-brand">
          <img src="/assets/logo.svg" alt="KVN Bank Logo" style={{ height: '36px', width: 'auto' }} />
          <span className="topnav-brand-name">KVN <span>Bank</span></span>
        </Link>
        
        <div className={`nav-links ${mobileOpen ? 'open' : ''}`} id="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link>
          <Link to="/locator" className={location.pathname === '/locator' ? 'active' : ''}>ATM & Branches</Link>
          <Link to="/login" className="btn btn-primary btn-sm" style={{ marginLeft: '1rem', padding: '0.5rem 1.25rem' }}>Login</Link>
          <Link to="/register" className="btn btn-outline btn-sm">Open Account</Link>
        </div>

        <button 
          className={`hamburger ${mobileOpen ? 'open' : ''}`} 
          id="nav-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    );
  }

  return (
    <header className="topnav">
      <div className="topnav-left">
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Sidebar">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="topnav-actions">
        <button className="topnav-notification" aria-label="Notifications">
          🔔
          <span className="badge-count" style={{ display: 'none' }}>0</span>
        </button>
        
        <div 
          className="topnav-user" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          tabIndex="0" 
          role="button"
        >
          <div className="topnav-avatar">{getInitials(currentUser?.fullName)}</div>
          <div className="topnav-user-info">
            <span className="topnav-user-name">{currentUser?.fullName}</span>
            <span className="topnav-user-role">Customer</span>
          </div>
          
          {dropdownOpen && (
            <div className="user-dropdown show" style={{ display: 'block' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-light)', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{currentUser?.fullName}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  AC: {maskAccountNo(currentUser?.accountNumber) || 'N/A'}
                </div>
              </div>
              <button className="dropdown-item" onClick={() => navigate('/profile')}>
                <span className="dropdown-item-icon">👤</span> Profile Settings
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={handleLogout}>
                <span className="dropdown-item-icon">🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
