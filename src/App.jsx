import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Settings from './pages/Settings';
import Bills from './pages/Bills';
import Deposits from './pages/Deposits';
import Upi from './pages/Upi';
import Beneficiaries from './pages/Beneficiaries';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/deposits" element={<Deposits />} />
            <Route path="/upi" element={<Upi />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            
            {/* Catch-all for authenticated routes */}
            <Route path="*" element={<div className="fade-in"><h1 className="page-title">404 - Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
          </Route>
          
          {/* Global catch-all */}
          <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h1>404 - Not Found</h1></div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
