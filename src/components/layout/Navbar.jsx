import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { maskAccountNo } from '../../utils/utils';

export default function Navbar({ isPublic }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'KV';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={isPublic ? 'public-navbar' : 'topnav'}>
      <div className="topnav-left">
        {!isPublic && (
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Sidebar">
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
        {isPublic && (
          <Link to="/" className="topnav-brand">
            <img src="/assets/logo.svg" alt="KVN Bank Logo" />
            <span className="topnav-brand-name">KVN <span>Bank</span></span>
          </Link>
        )}
      </div>

      <div className="topnav-actions">
        {isPublic ? (
          <>
            <Link to="/login" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1.25rem' }}>Login</Link>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
}
