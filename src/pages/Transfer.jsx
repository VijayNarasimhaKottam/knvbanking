import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccountBalance, addTransaction, validateMpin } from '../utils/data';
import { IndianRupee, Send, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Transfer() {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  
  const [step, setStep] = useState(1);
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setBalance(getAccountBalance(currentUser.id));
    }
  }, [currentUser]);

  const handleNext = (e) => {
    e.preventDefault();
    setError(null);
    
    const amt = parseFloat(amount);
    if (!beneficiaryName || !accountNumber || !ifsc || !amount) {
      setError('Please fill all required fields.');
      return;
    }
    
    if (amt <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    
    if (amt > balance) {
      setError('Insufficient funds.');
      return;
    }
    
    setStep(2);
  };

  const handleMpinChange = (index, value) => {
    if (value.length > 1) return; // Only 1 digit
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);
    
    // Auto-advance
    if (value && index < 3) {
      document.getElementById(`mpin-${index + 1}`).focus();
    }
  };

  const handleTransfer = () => {
    const enteredMpin = mpin.join('');
    if (enteredMpin.length !== 4) {
      setError('Please enter your 4-digit MPIN.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      setLoading(false);
      if (!validateMpin(currentUser.id, enteredMpin)) {
        setError('Invalid MPIN. Please try again.');
        setMpin(['', '', '', '']);
        return;
      }
      
      const successData = addTransaction(currentUser.id, {
        type: 'debit',
        amount: parseFloat(amount),
        description: `Transfer to ${beneficiaryName}`,
        reference: `TRX${Date.now()}`
      });
      
      if (successData) {
        setBalance(getAccountBalance(currentUser.id));
        setSuccess(`Transfer of ₹${amount} to ${beneficiaryName} successful!`);
        setStep(3);
      } else {
        setError('Transfer failed. Please try again later.');
      }
    }, 1500);
  };

  const resetForm = () => {
    setBeneficiaryName('');
    setAccountNumber('');
    setIfsc('');
    setAmount('');
    setRemarks('');
    setMpin(['', '', '', '']);
    setStep(1);
    setSuccess(null);
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Fund Transfer</h1>
        <p className="text-secondary">Send money securely to any bank account</p>
      </div>
      
      <div className="transfer-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        <div className="card">
          {error && (
            <div className="toast toast-error" style={{ position: 'relative', top: 0, right: 0, width: '100%', marginBottom: '1.5rem', transform: 'none' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}
          
          {step === 1 && (
            <form onSubmit={handleNext}>
              <h3 style={{ marginBottom: '1.5rem' }}>Beneficiary Details</h3>
              <div className="form-group">
                <label>Beneficiary Name</label>
                <input type="text" className="form-control" value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} required />
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Account Number</label>
                  <input type="password" className="form-control" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>IFSC Code</label>
                  <input type="text" className="form-control" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} required />
                </div>
              </div>
              
              <h3 style={{ margin: '1.5rem 0' }}>Transfer Details</h3>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required min="1" />
              </div>
              <div className="form-group">
                <label>Remarks (Optional)</label>
                <input type="text" className="form-control" value={remarks} onChange={e => setRemarks(e.target.value)} />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Proceed to Pay <Send size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          )}
          
          {step === 2 && (
            <div className="mpin-verification text-center">
              <ShieldCheck size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
              <h3>Verify Transaction</h3>
              <p className="text-secondary mb-4">Enter your 4-digit MPIN to authorize the transfer of <strong>₹{amount}</strong> to {beneficiaryName}</p>
              
              <div className="mpin-inputs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                {mpin.map((digit, i) => (
                  <input 
                    key={i}
                    id={`mpin-${i}`}
                    type="password" 
                    maxLength="1" 
                    className="form-control" 
                    style={{ width: '50px', height: '60px', fontSize: '24px', textAlign: 'center' }}
                    value={digit}
                    onChange={(e) => handleMpinChange(i, e.target.value)}
                  />
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)} disabled={loading}>Back</button>
                <button className="btn btn-primary" onClick={handleTransfer} disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Transfer'}
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="success-screen text-center" style={{ padding: '2rem 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <ShieldCheck size={40} />
              </div>
              <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Transfer Successful!</h2>
              <p className="text-secondary mb-4">{success}</p>
              <button className="btn btn-primary" onClick={resetForm}>Make Another Transfer</button>
            </div>
          )}
        </div>
        
        <div className="side-panel">
          <div className="metric-card" style={{ marginBottom: '1.5rem' }}>
            <div className="metric-header">
              <h3>Available Balance</h3>
              <div className="metric-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                <IndianRupee size={24} />
              </div>
            </div>
            <div className="metric-value">₹{balance.toLocaleString('en-IN')}</div>
          </div>
          
          <div className="card bg-light">
            <h4>Transfer Limits</h4>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--text)', opacity: 0.8 }}>
              <li style={{ marginBottom: '0.5rem' }}>IMPS: Upto ₹5,00,000</li>
              <li style={{ marginBottom: '0.5rem' }}>NEFT: No Limit</li>
              <li>RTGS: Min ₹2,00,000</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}
