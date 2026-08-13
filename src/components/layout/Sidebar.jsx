import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Fund Transfer', icon: '💸', path: '/transfer' },
    { name: 'Account Statement', icon: '📄', path: '/transactions' },
    { name: 'Manage Cards', icon: '💳', path: '/cards' },
    { name: 'My Profile', icon: '👤', path: '/profile' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="topnav-brand">
          <img src="/assets/logo.svg" alt="KVN Bank Logo" />
          <span className="topnav-brand-name">KVN <span>Bank</span></span>
        </Link>
      </div>

      <div className="sidebar-label">Main Menu</div>
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <div className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${path === item.path ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-text">{item.name}</span>
            </Link>
          </div>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎁</div>
          <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: 'white' }}>Refer & Earn</h4>
          <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Invite friends and earn ₹500.</p>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', background: 'var(--color-accent)', color: 'var(--color-primary-dark)' }}>Invite Now</button>
        </div>
      </div>
    </aside>
  );
}
