import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateCaptcha } from '../utils/utils';
import { login as authenticateUser } from '../utils/auth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const remembered = localStorage.getItem('KVN_REMEMBER_ME');
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setCaptchaAnswer('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password || !captchaAnswer) {
      setError('Please fill in all fields.');
      return;
    }

    if (parseInt(captchaAnswer) !== captcha.answer) {
      setError('Incorrect CAPTCHA answer.');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      const authResult = authenticateUser(username, password);
      
      if (!authResult.success) {
        setError(authResult.error);
        refreshCaptcha();
        return;
      }

      login(authResult.session, rememberMe);
      navigate('/dashboard');
      
    }, 1500);
  };

  return (
    <div className="auth-layout">
      {/* Brand Side (Left on Desktop) */}
      <div className="auth-brand-side">
        <Link to="/" className="auth-logo">
          <img src="/assets/logo.svg" alt="KVN Bank Logo" />
          <span>KVN <span>Bank</span></span>
        </Link>
        
        <div className="auth-showcase">
          <h1>Secure banking at your fingertips.</h1>
          <p>Access your accounts, transfer funds, and manage your wealth securely with KVN NetBanking.</p>
        </div>
        
        <div className="auth-graphic"></div>
      </div>
      
      {/* Form Side (Right on Desktop) */}
      <div className="auth-form-side">
        <div className="auth-mobile-logo">
          <img src="/assets/logo.svg" alt="KVN Bank Logo" />
          <span>KVN Bank</span>
        </div>
        
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login.</p>
        </div>
        
        {error && (
          <div className="invalid-feedback" style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem', background: 'var(--color-danger-light)', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username / Customer ID <span className="required">*</span></label>
            <input 
              type="text" 
              id="username" 
              className="form-control" 
              placeholder="Enter username" 
              required 
              autoComplete="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label htmlFor="password" className="form-label">Password <span className="required">*</span></label>
              <Link to="/forgot-password" tabIndex="-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-mid)', fontWeight: 600 }}>Forgot Password?</Link>
            </div>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="form-control" 
                placeholder="Enter password" 
                required 
                autoComplete="current-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Show password"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Security Check <span className="required">*</span></label>
            <div className="captcha-wrapper">
              <div className="captcha-question">{captcha.question}</div>
              <input 
                type="number" 
                id="captcha-answer" 
                className="form-control captcha-input" 
                placeholder="?" 
                required 
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
              />
              <button 
                type="button" 
                className="captcha-refresh" 
                onClick={refreshCaptcha}
                aria-label="Refresh CAPTCHA"
              >
                ↻
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-check">
              <input 
                type="checkbox" 
                id="remember-me" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="form-check-label">Remember my Username</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4" 
            style={{ padding: '0.875rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login Securely'}
          </button>
        </form>
        
        <div className="security-notice">
          <div className="security-notice-icon">🔒</div>
          <div>
            <strong>Security Notice:</strong> KVN Bank will never ask for your Password, PIN, or OTP over phone or email. Ensure the URL starts with https://
          </div>
        </div>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register for NetBanking</Link>
        </div>
      </div>
    </div>
  );
}
