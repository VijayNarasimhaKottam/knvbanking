import { Link } from 'react-router-dom';

export default function Footer({ isPublic }) {
  if (!isPublic) return null; // Only show on public pages

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="logo" style={{ marginBottom: '1.5rem', color: 'white' }}>
            <img src="/assets/logo.svg" alt="KVN Bank Logo" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>KVN Bank</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Empowering your financial future with modern, secure, and intuitive banking solutions.
          </p>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/investors">Investor Relations</Link></li>
            <li><Link to="/news">News Room</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/security">Security Center</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            <li><Link to="/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} KVN Bank Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
