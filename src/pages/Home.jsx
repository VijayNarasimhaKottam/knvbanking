import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, TrendingUp, CreditCard } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.querySelectorAll('[data-hover-glow]').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="badge mb-4">
            <span className="badge-dot"></span> Next-Gen Banking
          </div>
          <h1 className="hero-title">Experience Banking<br />Without Boundaries</h1>
          <p className="hero-subtitle">
            Open an account in 3 minutes. Experience lightning-fast transfers, bank-grade security, and 24/7 priority support with KVN Bank.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Open Account <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              NetBanking Login
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <h4>2M+</h4>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h4>₹50k Cr+</h4>
              <p>Assets Managed</p>
            </div>
            <div className="stat-item">
              <h4>99.99%</h4>
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Why Choose KVN Bank?</h2>
          <p>We provide a comprehensive suite of banking solutions designed to empower your financial journey.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card" data-hover-glow>
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Instant Transfers</h3>
            <p>Send money instantly 24/7 via IMPS, NEFT, RTGS, and UPI. Zero downtime, zero hassle.</p>
          </div>
          <div className="feature-card" data-hover-glow>
            <div className="feature-icon"><Shield size={24} /></div>
            <h3>Bank-Grade Security</h3>
            <p>Your money and data are protected with 256-bit encryption and multi-factor authentication.</p>
          </div>
          <div className="feature-card" data-hover-glow>
            <div className="feature-icon"><TrendingUp size={24} /></div>
            <h3>Smart Investments</h3>
            <p>Grow your wealth with our high-yield Fixed Deposits and intelligent investment options.</p>
          </div>
          <div className="feature-card" data-hover-glow>
            <div className="feature-icon"><CreditCard size={24} /></div>
            <h3>One-Click Payments</h3>
            <p>Pay your utility bills, mobile recharges, and credit cards instantly from a single dashboard.</p>
          </div>
        </div>
      </section>
    </>
  );
}
