import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Menu from './pages/Menu';
import Tracking from './pages/Tracking';

function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const navH = 80;
          const targetTop = element.getBoundingClientRect().top + window.pageYOffset - navH;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }, 120);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return null;
}

function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--text)' }}>
      <ScrollHandler />
      <Navbar />
      <CartDrawer />
      <main className="main-content" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#2C2621',
            borderRadius: '4px',
            padding: '16px 24px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            fontWeight: '500',
            border: '1px solid rgba(44, 38, 33, 0.08)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          }
        }}
      />
      <AppLayout>
        <Routes>
          <Route path="/"       element={<Landing />} />
          <Route path="/menu"   element={<Menu />} />
          <Route path="/track"  element={<Tracking />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
