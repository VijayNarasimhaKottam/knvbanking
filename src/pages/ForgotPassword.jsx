import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByUsername, updateUser } from '../utils/data';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form states
  const [usernameInput, setUsernameInput] = useState('');
  const [user, setUser] = useState(null);

  const [securityAnswer, setSecurityAnswer] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Step 1: Identify User
  const handleStep1 = (e) => {
    e.preventDefault();
    setError(null);

    if (!usernameInput.trim()) {
      setError('Please enter your username, email, or account number.');
      return;
    }

    const foundUser = getUserByUsername(usernameInput.trim());
    if (!foundUser) {
      setError('No account found with those details. Please check and try again.');
      return;
    }

    setUser(foundUser);
    setStep(2);
  };

  // Step 2: Verify Security Question & OTP
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError(null);

    // Verify security answer (case-insensitive check)
    if (user.securityAnswer && securityAnswer.trim().toLowerCase() !== user.securityAnswer.toLowerCase()) {
      setError('Incorrect security question answer.');
      return;
    }

    // Verify OTP (allow any 6-digit OTP in demo mode)
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    setStep(3);
  };

  // Step 3: Update Password
  const handleStep3 = (e) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Update password in data storage
    const updated = updateUser(user.id, {
      passwordHash: btoa(newPassword),
      loginAttempts: 0,
      lockoutUntil: null,
      status: 'active'
    });

    if (updated) {
      setSuccess('Your password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-alt)', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" className="topnav-brand" style={{ justifyContent: 'center', marginBottom: '1rem', display: 'inline-flex' }}>
            <img src="/assets/logo.svg" alt="KVN Bank Logo" style={{ height: '36px', width: 'auto' }} />
            <span className="topnav-brand-name">KVN <span>Bank</span></span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Forgot Password</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Reset your NetBanking password securely in a few simple steps.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ✓ {success}
          </div>
        )}

        {/* Step 1: Username Input */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Username / Email / Customer ID <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username or email"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                style={{ width: '100%', padding: '0.75rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Next Step →
            </button>
          </form>
        )}

        {/* Step 2: Security Verification & OTP */}
        {step === 2 && (
          <form onSubmit={handleStep2}>
            <div style={{ background: 'var(--color-surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Security Question</div>
              <div style={{ fontWeight: 600 }}>{user?.securityQuestion || "Mother's maiden name"}</div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Your Answer <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter answer"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                style={{ width: '100%', padding: '0.75rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, textAlign: 'center' }}>
                Enter 6-Digit Security OTP (Demo OTP: 123456)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    className="form-control"
                    style={{ width: '45px', height: '50px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 600 }}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Verify & Proceed →
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleStep3}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                New Password <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Confirm New Password <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Re-enter new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Reset Password
            </button>
          </form>
        )}

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--color-primary-mid)', fontWeight: 600 }}>
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
