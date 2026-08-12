import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, RefreshCw } from 'lucide-react';
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

    // Basic Validation
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
    
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      
      const authResult = authenticateUser(username, password);
      
      if (!authResult.success) {
        setError(authResult.error);
        refreshCaptcha();
        return;
      }

      // Success
      login(authResult.session, rememberMe);
      navigate('/dashboard');
      
    }, 1500);
  };

  return (
    <div className="login-container fade-in">
      <div className="login-card">
        <div className="login-header">
          <div className="security-badge">
            <Shield size={20} style={{ color: 'var(--success)' }} />
            <span>Secure Login</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to access your account.</p>
        </div>

        {error && (
          <div className="toast toast-error" style={{ position: 'relative', top: 0, right: 0, width: '100%', marginBottom: '1rem', transform: 'none' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username / Customer ID</label>
            <input 
              type="text" 
              id="username" 
              className="form-control" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                className="form-control" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <a href="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</a>
            </div>
          </div>

          <div className="form-group">
            <label>Security Verification</label>
            <div className="captcha-container">
              <div className="captcha-box">
                <span id="captcha-q">{captcha.question}</span>
                <button type="button" className="btn btn-icon" onClick={refreshCaptcha} title="Refresh CAPTCHA">
                  <RefreshCw size={16} />
                </button>
              </div>
              <input 
                type="number" 
                id="captcha-answer" 
                className="form-control captcha-input" 
                placeholder="Answer" 
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="remember-me" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" style={{ marginBottom: 0, fontWeight: 500 }}>Remember Me</label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4" 
            style={{ padding: '0.875rem' }} 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login Securely'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Open an Account</a></p>
          <div className="security-notice">
            <p>Your connection to this site is encrypted and secure.</p>
            <p>Never share your password or OTP with anyone.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
