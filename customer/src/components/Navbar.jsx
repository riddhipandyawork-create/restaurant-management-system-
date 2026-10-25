import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { cart, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleAboutClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('about');
      if (el) {
        const navH = 80;
        const targetTop = el.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#about';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={18} color="#FAF7F2" />
          </div>
          <span>22nd Parallel</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-center desktop-only" style={{ display: 'flex' }}>
          <Link to="/" className={`nav-link ${isActive('/') && !location.hash ? 'active' : ''}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
          <a href="/#about" onClick={handleAboutClick} className={`nav-link ${location.hash === '#about' ? 'active' : ''}`}>About Us</a>
          <Link to="/track" className={`nav-link ${isActive('/track') ? 'active' : ''}`}>Track Order</Link>
        </div>

        {/* Desktop Right */}
        <div className="nav-right desktop-only" style={{ display: 'flex' }}>
          <button
            className="btn btn-cart"
            onClick={toggleCart}
            style={{
              gap: '0.5rem',
              position: 'relative',
              border: '1.5px solid var(--terracotta)',
              color: 'var(--terracotta)',
              background: 'rgba(181, 84, 58, 0.06)',
              fontWeight: 700,
            }}
          >
            <ShoppingBag size={16} color="var(--terracotta)" />
            <span>Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>

        {/* Mobile Right */}
        <div className="nav-right mobile-only" style={{ display: 'flex' }}>
          <button
            className="btn-icon"
            onClick={toggleCart}
            style={{ position: 'relative', border: '1px solid var(--terracotta)', color: 'var(--terracotta)' }}
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <button className="btn-icon" onClick={() => setMobileOpen(true)}>
            <MenuIcon size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <Link to="/" className="nav-logo">
              <div className="nav-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UtensilsCrossed size={18} color="#FAF7F2" />
              </div>
              <span>22nd Parallel</span>
            </Link>
            <button className="btn-icon" onClick={() => setMobileOpen(false)}>
              <X size={22} />
            </button>
          </div>

          <nav className="mobile-menu-links">
            <Link to="/" className="mobile-menu-link">
              <span>Home</span>
              <ArrowRight size={20} style={{ color: 'var(--gold-dim)' }} />
            </Link>
            <Link to="/menu" className="mobile-menu-link">
              <span>Our Menu</span>
              <ArrowRight size={20} style={{ color: 'var(--gold-dim)' }} />
            </Link>
            <a href="/#about" onClick={handleAboutClick} className="mobile-menu-link">
              <span>About Us</span>
              <ArrowRight size={20} style={{ color: 'var(--gold-dim)' }} />
            </a>
            <Link to="/track" className="mobile-menu-link">
              <span>Track Order</span>
              <ArrowRight size={20} style={{ color: 'var(--gold-dim)' }} />
            </Link>
          </nav>

          <div className="mobile-menu-footer">
            <p>Jetalpur Road, Anand, Gujarat</p>
            <p style={{ marginTop: '0.3rem' }}>Nothing Artificial · Nothing Frozen</p>
          </div>
        </div>
      )}
    </>
  );
}
