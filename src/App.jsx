import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import Locator from './pages/Locator';
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

// Footer / Info Pages
import About from './pages/About';
import Careers from './pages/Careers';
import Investors from './pages/Investors';
import News from './pages/News';
import Help from './pages/Help';
import Security from './pages/Security';
import Faq from './pages/Faq';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import Accessibility from './pages/Accessibility';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Public Layout (Nav + Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/locator" element={<Locator />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/news" element={<News />} />
            <Route path="/help" element={<Help />} />
            <Route path="/security" element={<Security />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
          </Route>

          {/* Standalone Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected App Routes */}
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
            
            {/* Catch-all inside protected layout */}
            <Route path="*" element={<div className="fade-in" style={{ padding: '2rem' }}><h1 className="page-title">404 - Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
          </Route>
          
          {/* Global catch-all */}
          <Route path="*" element={<div style={{ padding: '4rem', textAlign: 'center' }}><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
