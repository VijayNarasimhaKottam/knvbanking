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
      <header className="hero">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span></span> Online banking is fully operational
            </div>
            <h1 className="hero-title">Banking designed for your <span>digital life</span></h1>
            <p className="hero-subtitle">
              Experience seamless, secure, and intuitive banking from anywhere. 
              Manage your money, invest for the future, and achieve your financial goals with KVN Bank.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Open an Account</Link>
              <Link to="/login" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>NetBanking Login</Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Total Balance</span>
                <img src="/assets/logo.svg" alt="KVN" width="24" height="24" />
              </div>
              <div className="mock-balance">₹2,50,000</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>+2.4% from last month</div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <div style={{ height: '4px', flex: 2, background: 'var(--color-accent)', borderRadius: '2px' }}></div>
                <div style={{ height: '4px', flex: 1, background: 'var(--color-success)', borderRadius: '2px' }}></div>
              </div>
            </div>

            <div className="hero-card hero-card-2">
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Recent Activity</div>
              <div className="mock-txn">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>↓</div>
                  <span style={{ fontSize: '0.75rem' }}>Salary</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>+₹85,000</span>
              </div>
              <div className="mock-txn">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>↑</div>
                  <span style={{ fontSize: '0.75rem' }}>Netflix</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>−₹649</span>
              </div>
            </div>

            <div className="hero-card hero-card-3" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>FD</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Fixed Deposit</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Earn up to 7.25% p.a.</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>2M+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Branches</p>
          </div>
          <div className="stat-item">
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support</p>
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
