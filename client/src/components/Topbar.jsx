import { Bell, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Topbar({ title, subtitle, actions }) {
  const { user } = useAuthStore();
  const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        <p>{subtitle || now}</p>
      </div>
      <div className="topbar-actions">
        {actions}
        <button className="topbar-icon-btn" title="Refresh" onClick={() => window.location.reload()}>
          <RefreshCw size={16} />
        </button>
        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={16} />
        </button>
        <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'capitalize' }}>
          {user?.role}
        </div>
      </div>
    </header>
  );
}
