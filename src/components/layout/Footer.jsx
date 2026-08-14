import { Link } from 'react-router-dom';

export default function Footer({ isPublic }) {
  if (!isPublic) return null; // Only show on public pages

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-section">
          <div className="topnav-brand" style={{ marginBottom: 'var(--space-4)' }}>
            <img src="/assets/logo.svg" alt="KVN Bank Logo" style={{ filter: 'brightness(0) invert(1)', height: '36px', width: 'auto' }} />
            <span className="topnav-brand-name" style={{ color: 'white' }}>KVN <span style={{ color: 'var(--color-accent)' }}>Bank</span></span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            A premium digital banking experience designed for the modern world.
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <Link to="/login">NetBanking</Link>
          <Link to="/register">Open Savings Account</Link>
          <Link to="/deposits">Fixed Deposits</Link>
          <Link to="/bills">Bill Payments</Link>
        </div>
        
        <div className="footer-section">
          <h4>About Us</h4>
          <Link to="/about">Company Profile</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/investors">Investors</Link>
          <Link to="/news">Newsroom</Link>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/locator">Branch Locator</Link>
          <Link to="/security">Security Center</Link>
          <Link to="/faq">FAQs</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="demo-disclaimer" style={{ marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-md)', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', display: 'inline-block' }}>
          DEMO APPLICATION: No real transactions or data storage
        </div>
        <p>&copy; {new Date().getFullYear()} KVN Bank. All rights reserved.</p>
      </div>
    </footer>
  );
}
