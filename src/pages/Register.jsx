import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { generateId, generateTxnRef, formatAccountNo } from '../utils/utils';
import { addUser, addNotification, addTransaction, getNextUserId, getNextAccountNumber } from '../utils/data';

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState({
    fullname: '', dob: '', gender: 'Male', pan: '', aadhaar: '',
    email: '', mobile: '', address: '', city: '', state: '', pincode: '',
    acctype: 'Savings', username: '', password: '', confirmPassword: '',
    secQ: "Mother's maiden name", secA: '', agreeTerms: false
  });

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: getNextUserId(),
        username: userData.username.trim(),
        passwordHash: btoa(userData.password),
        role: 'customer',
        fullName: userData.fullname.trim(),
        dob: userData.dob,
        gender: userData.gender,
        email: userData.email.trim(),
        mobile: userData.mobile.trim(),
        address: userData.address.trim(),
        city: userData.city.trim(),
        state: userData.state,
        pincode: userData.pincode.trim(),
        aadhaar: userData.aadhaar.trim(),
        pan: userData.pan.trim().toUpperCase(),
        accountNumber: getNextAccountNumber(),
        accountType: userData.acctype,
        ifscCode: 'NRJB0001001',
        balance: 10000.00,
        status: 'active',
        loginAttempts: 0,
        lockoutUntil: null,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        securityQuestion: userData.secQ,
        securityAnswer: userData.secA.trim().toLowerCase(),
        nominees: [],
        upiId: null,
        mpin: null
      };

      addUser(newUser);

      addNotification({
        id: generateId('NOTIF'),
        userId: newUser.id,
        message: 'Welcome to KVN Bank! Your account has been successfully created with a welcome bonus of ₹10,000.',
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      });

      addTransaction({
        id: generateTxnRef('TXN'),
        userId: newUser.id,
        type: 'credit',
        mode: 'INTERNAL',
        amount: 10000,
        balance: 10000,
        description: 'Account Opening Welcome Bonus',
        toAccount: newUser.accountNumber,
        fromAccount: 'KVN_PROMO',
        referenceNo: generateTxnRef('PRM'),
        status: 'success',
        timestamp: new Date().toISOString(),
        remarks: 'Welcome to KVN Bank'
      });

      setLoading(false);
      setSuccess(newUser);
    }, 1500);
  };

  if (success) {
    return (
      <div className="register-layout">
        <div className="register-header">
          <Link to="/" className="register-logo">
            <img src="/assets/logo.svg" alt="KVN Bank Logo" />
            <span>KVN <span>Bank</span></span>
          </Link>
        </div>
        <div className="register-container" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>Account Created Successfully!</h2>
          <p>Welcome to KVN Bank, <strong>{success.fullName}</strong>.</p>
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', margin: '2rem auto', maxWidth: '400px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Account Number:</span>
              <strong>{formatAccountNo(success.accountNumber)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Customer ID:</span>
              <strong>{success.username}</strong>
            </div>
          </div>
          <p style={{ marginBottom: '2rem' }}>We've credited a welcome bonus of ₹10,000 to your new account.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Proceed to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-layout">
      <div className="register-header">
        <Link to="/" className="register-logo">
          <img src="/assets/logo.svg" alt="KVN Bank Logo" />
          <span>KVN <span>Bank</span></span>
        </Link>
        <h1 className="register-title">Open Your Digital Account</h1>
        <p className="register-subtitle">Join us today. It only takes 3 minutes.</p>
      </div>

      <div className="register-container">
        <div className="register-steps-wrapper">
          <div className="progress-bar-container">
            <div className="progress-line">
              <div className="progress-line-fill" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
            </div>
            {[1, 2, 3].map(step => (
              <div key={step} className={`progress-step ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}>
                <div className="progress-step-circle">{step}</div>
                <div className="progress-step-label">
                  {step === 1 ? 'Personal Info' : step === 2 ? 'Contact & Address' : 'Account Setup'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="register-form-container">
          <form id="register-form" onSubmit={handleSubmit}>
            
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="form-step active">
                <h2 className="step-title">Personal Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullname" className="form-label">Full Name (as per PAN) *</label>
                    <input type="text" id="fullname" className="form-control" required value={userData.fullname} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob" className="form-label">Date of Birth *</label>
                    <input type="date" id="dob" className="form-control" required value={userData.dob} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gender" className="form-label">Gender *</label>
                    <select id="gender" className="form-control" required value={userData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pan" className="form-label">PAN Number *</label>
                    <input type="text" id="pan" className="form-control" required value={userData.pan} onChange={handleChange} style={{ textTransform: 'uppercase' }} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="aadhaar" className="form-label">Aadhaar Number *</label>
                    <input type="text" id="aadhaar" className="form-control" maxLength="12" required value={userData.aadhaar} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>Next Step →</button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="form-step active">
                <h2 className="step-title">Contact & Address</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input type="email" id="email" className="form-control" required value={userData.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobile" className="form-label">Mobile Number *</label>
                    <input type="tel" id="mobile" className="form-control" required value={userData.mobile} onChange={handleChange} maxLength="10" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Residential Address *</label>
                  <textarea id="address" className="form-control" required value={userData.address} onChange={handleChange}></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City *</label>
                    <input type="text" id="city" className="form-control" required value={userData.city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State *</label>
                    <select id="state" className="form-control" required value={userData.state} onChange={handleChange}>
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pincode" className="form-label">Pincode *</label>
                    <input type="text" id="pincode" className="form-control" required value={userData.pincode} onChange={handleChange} maxLength="6" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>Next Step →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="form-step active">
                <h2 className="step-title">Account Setup</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="acctype" className="form-label">Account Type *</label>
                    <select id="acctype" className="form-control" required value={userData.acctype} onChange={handleChange}>
                      <option value="Savings">Savings Account</option>
                      <option value="Current">Current Account</option>
                      <option value="Salary">Salary Account</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">NetBanking Username *</label>
                    <input type="text" id="username" className="form-control" required value={userData.username} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Password *</label>
                    <input type="password" id="password" className="form-control" required value={userData.password} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                    <input type="password" id="confirmPassword" className="form-control" required value={userData.confirmPassword} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="secQ" className="form-label">Security Question *</label>
                    <select id="secQ" className="form-control" required value={userData.secQ} onChange={handleChange}>
                      <option value="Mother's maiden name">What is your mother's maiden name?</option>
                      <option value="First pet name">What was the name of your first pet?</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="secA" className="form-label">Security Answer *</label>
                    <input type="text" id="secA" className="form-control" required value={userData.secA} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 'var(--space-4)', background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                  <label className="form-check">
                    <input type="checkbox" id="agreeTerms" required checked={userData.agreeTerms} onChange={handleChange} />
                    <span className="form-check-label">I agree to the Terms & Conditions</span>
                  </label>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Open Account Now'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
