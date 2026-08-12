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
    <nav className={`${isPublic ? 'public-navbar' : 'app-navbar'} ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to={currentUser ? "/dashboard" : "/"} className="logo">
          <img src="/assets/logo.svg" alt="KVN Bank Logo" />
          <span>KVN Bank</span>
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
              <span className="user-greeting">Welcome, {currentUser?.fullName?.split(' ')[0]}</span>
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <User size={16} /> Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-item text-danger">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
