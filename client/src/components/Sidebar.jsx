import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingCart, Table2,
  ChefHat, CalendarDays, Receipt, Users, BarChart3, LogOut, Store, PlusCircle
} from 'lucide-react';

const NAV = [
  { label: 'Overview', items: [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/pos', icon: PlusCircle, label: 'New Order' },
    { to: '/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/kitchen', icon: ChefHat, label: 'Kitchen Display', roles: ['kitchen', 'admin'] },
  ]},
  { label: 'Management', items: [
    { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/tables', icon: Table2, label: 'Tables' },
    { to: '/reservations', icon: CalendarDays, label: 'Reservations' },
    { to: '/billing', icon: Receipt, label: 'Billing' },
  ]},
  { label: 'Analytics & Staff', items: [
    { to: '/staff', icon: Users, label: 'Staff', roles: ['admin'] },
    { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager'] },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <UtensilsCrossed size={18} color="#FAF7F2" />
        </div>
        <div className="sidebar-logo-text">
          <h2>22nd Parallel</h2>
          <span>Restaurant Suite</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(section => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map(({ to, icon: Icon, label, roles }) => {
              if (roles && !roles.includes(user?.role)) return null;
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                  <Icon size={17} className="sidebar-link-icon" />
                  {label}
                </NavLink>
              );
            })}
          </div>
        ))}
        
        {/* Navigation to Customer Facing Site */}
        <div style={{ marginTop: '2rem' }}>
          <div className="sidebar-section-label">Quick Links</div>
          <a 
            href="http://localhost:5174" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sidebar-link"
            style={{ color: 'var(--accent)' }}
          >
            <Store size={17} className="sidebar-link-icon" style={{ color: 'var(--accent)' }} />
            Back to Customer Site
          </a>
        </div>
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <p>{user?.name || 'User'}</p>
            <span>{user?.role || 'staff'}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="btn" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
