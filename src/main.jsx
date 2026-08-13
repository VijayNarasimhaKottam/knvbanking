import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages/landing.css';
import './styles/pages/login.css';
import './styles/pages/dashboard.css';
import './styles/pages/transfer.css';
import './styles/pages/profile.css';
import './styles/pages/statement.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
