import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, UtensilsCrossed } from 'lucide-react';

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@rms.com', password: 'admin1234' },
  { label: 'Manager', email: 'manager@rms.com', password: 'manager123' },
  { label: 'Cashier', email: 'cashier@rms.com', password: 'cashier123' },
  { label: 'Waiter', email: 'waiter@rms.com', password: 'waiter123' },
  { label: 'Kitchen', email: 'kitchen@rms.com', password: 'kitchen123' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      if (user.role === 'kitchen') {
        navigate('/kitchen');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const fillDemo = (u) => { setEmail(u.email); setPassword(u.password); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <UtensilsCrossed size={28} color="#FAF7F2" />
          </div>
          <h1>22nd Parallel</h1>
          <p>Restaurant Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem' }} disabled={loading}>
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Quick Demo Login</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
            {DEMO_USERS.map(u => (
              <button key={u.label} onClick={() => fillDemo(u)} className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', justifyContent: 'center' }}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
