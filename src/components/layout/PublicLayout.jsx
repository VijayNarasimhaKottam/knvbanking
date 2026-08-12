import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser && (location.pathname === '/' || location.pathname === '/login')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="public-layout">
      <Navbar isPublic={true} />
      <main className="public-content">
        <Outlet />
      </main>
      <Footer isPublic={true} />
    </div>
  );
}
