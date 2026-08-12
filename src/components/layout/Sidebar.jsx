import { Link, useLocation } from 'react-router-dom';
import { Home, Send, List, CreditCard, User, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'Transfer Funds', icon: <Send size={20} />, path: '/transfer' },
    { name: 'Transactions', icon: <List size={20} />, path: '/transactions' },
    { name: 'Cards', icon: <CreditCard size={20} />, path: '/cards' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${path === item.path ? 'active' : ''}`}
          >
            <div className="menu-icon">{item.icon}</div>
            <span className="menu-text">{item.name}</span>
          </Link>
        ))}
      </div>
      
      <div className="sidebar-promo">
        <div className="promo-icon">🎁</div>
        <h4>Refer & Earn</h4>
        <p>Invite friends and earn ₹500 for each successful referral.</p>
        <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>Invite Now</button>
      </div>
    </aside>
  );
}
