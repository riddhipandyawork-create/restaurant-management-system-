import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import Login from './pages/Auth/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Menu from './pages/Menu/Menu';
import Orders from './pages/Orders/Orders';
import Tables from './pages/Tables/Tables';
import Kitchen from './pages/Kitchen/Kitchen';
import Reservations from './pages/Reservations/Reservations';
import Billing from './pages/Billing/Billing';
import Staff from './pages/Staff/Staff';
import Reports from './pages/Reports/Reports';
import POS from './pages/POS/POS';

function PrivateRoute({ children, roles, path }) {
  const { user, token, loading } = useAuthStore();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  
  if (user.role === 'kitchen' && path === '/') {
    return <Navigate to="/kitchen" replace />;
  }
  
  return children;
}

function AppContent() {
  const { fetchMe, token, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (token) fetchMe();
    else useAuthStore.setState({ loading: false });
  }, [token, fetchMe]);

  const isKitchen = location.pathname === '/kitchen';

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontSize: '0.875rem' },
          success: { iconTheme: { primary: '#6F7F5F', secondary: '#190E0B' } },
          error: { iconTheme: { primary: '#B5543A', secondary: '#190E0B' } },
        }}
      />
      
      {token && user ? (
        isKitchen ? (
          <Routes>
            <Route path="/kitchen" element={<PrivateRoute><Kitchen /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/kitchen" replace />} />
          </Routes>
        ) : (
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<PrivateRoute path="/"><Dashboard /></PrivateRoute>} />
                <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
                <Route path="/pos" element={<PrivateRoute><POS /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                <Route path="/tables" element={<PrivateRoute><Tables /></PrivateRoute>} />
                <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
                <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
                <Route path="/staff" element={<PrivateRoute roles={['admin']}><Staff /></PrivateRoute>} />
                <Route path="/reports" element={<PrivateRoute roles={['admin', 'manager']}><Reports /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        )
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
