import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar({ isPublic }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`${isPublic ? 'public-navbar' : 'topnav'} ${scrolled ? 'scrolled' : ''}`}>
      <Link to={currentUser ? "/dashboard" : "/"} className="topnav-brand">
        <img src="/assets/logo.svg" alt="KVN Bank Logo" />
        {isPublic ? <span className="topnav-brand-name">KVN <span>Bank</span></span> : <span>KVN <span>Bank</span></span>}
      </Link>
      
      <button 
        className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        {isPublic ? (
          <>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login" className="btn btn-primary btn-sm" style={{ marginLeft: '1rem', padding: '0.5rem 1.25rem' }}>Login</Link>
            <Link to="/register" className="btn btn-outline btn-sm">Open Account</Link>
          </>
        ) : (
          <div className="user-menu">
            <div className="user-avatar">
              {currentUser?.fullName?.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser?.fullName}</span>
              <span className="user-role">Last Login: Just now</span>
            </div>
            <button className="btn-icon" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
