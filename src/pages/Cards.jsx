import { useAuth } from '../context/AuthContext';
import { maskAccountNo } from '../utils/utils';

export default function Cards() {
  const { currentUser } = useAuth();

  return (
    <div className="fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Manage Cards</h1>
        <p className="page-subtitle">View and control your debit and credit cards.</p>
      </div>

      <div style={{ maxWidth: '400px' }}>
        <div className="cc-widget">
          <div className="cc-chip"></div>
          <div className="cc-number">XXXX XXXX XXXX {currentUser?.accountNumber?.slice(-4) || '0000'}</div>
          <div className="cc-details">
            <div>
              <div>Card Holder</div>
              <div className="cc-val" style={{ textTransform: 'uppercase' }}>{currentUser?.fullName}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Expires</div>
              <div className="cc-val">12/28</div>
            </div>
          </div>
          <img src="/assets/logo.svg" alt="KVN" style={{ position: 'absolute', bottom: '20px', right: '20px', height: '24px', opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}
