import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Briefcase,
  Receipt,
  ChefHat,
  UtensilsCrossed,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
  X,
  Lock,
  Sparkles
} from 'lucide-react';

const STAFF_ROLES = [
  {
    role: 'admin',
    title: 'Admin',
    name: 'Admin User',
    email: 'admin@rms.com',
    pin: '1234',
    icon: ShieldCheck,
    color: '#B5543A',
    bg: '#FAF3F0',
    subtitle: 'System Control',
  },
  {
    role: 'manager',
    title: 'Manager',
    name: 'Rajesh Kumar',
    email: 'manager@rms.com',
    pin: '1234',
    icon: Briefcase,
    color: '#C68630',
    bg: '#FBF6EE',
    subtitle: 'Operations & Floor',
  },
  {
    role: 'cashier',
    title: 'Cashier',
    name: 'Priya Nair',
    email: 'cashier@rms.com',
    pin: '1234',
    icon: Receipt,
    color: '#5C7654',
    bg: '#F2F7F1',
    subtitle: 'Billing & POS',
  },
  {
    role: 'kitchen',
    title: 'Chef',
    name: 'Chef Murugan',
    email: 'kitchen@rms.com',
    pin: '1234',
    icon: ChefHat,
    color: '#D45A3F',
    bg: '#FAF2EE',
    subtitle: 'Kitchen KDS',
  },
  {
    role: 'waiter',
    title: 'Waiter',
    name: 'Arun Waiter',
    email: 'waiter@rms.com',
    pin: '1234',
    icon: UtensilsCrossed,
    color: '#3B79A6',
    bg: '#F0F5FA',
    subtitle: 'Table Service',
  },
  {
    role: 'custom',
    title: 'Custom ID',
    name: 'Manual Login',
    email: '',
    pin: '1234',
    icon: KeyRound,
    color: '#706059',
    bg: '#F6F3F0',
    subtitle: 'Enter Staff ID',
    isCustom: true,
  },
];

export default function Login() {
  const [loadingRole, setLoadingRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (role === 'kitchen') navigate('/kitchen');
    else if (role === 'cashier') navigate('/billing');
    else if (role === 'waiter') navigate('/pos');
    else navigate('/');
  };

  const handleRoleClick = async (staff) => {
    if (staff.isCustom) {
      setShowModal(true);
      return;
    }

    setLoadingRole(staff.role);
    try {
      const user = await login(staff.email, staff.pin);
      toast.success(`Authenticated as ${staff.title} (${user.name})`);
      redirectByRole(user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoadingRole(null);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setManualLoading(true);
    try {
      const user = await login(customEmail, customPassword);
      toast.success(`Welcome back, ${user.name}!`);
      setShowModal(false);
      redirectByRole(user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 20%, #FDFBF7 0%, #F5EFE6 100%)',
        padding: '2rem 1rem',
        fontFamily: "'Outfit', sans-serif",
        color: '#2C1A14',
      }}
    >
      {/* Main Container Card matching reference */}
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#FFFFFF',
          borderRadius: '28px',
          boxShadow: '0 25px 70px rgba(50, 25, 15, 0.08), 0 2px 6px rgba(0,0,0,0.02)',
          padding: '3rem 2.25rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid #EFEAE2',
          position: 'relative',
        }}
      >
        {/* Top Logo / Circular Badge */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FBF6EF 0%, #F3EAE0 100%)',
            border: '1.5px solid #EBE2D5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 14px rgba(181, 84, 58, 0.08)',
          }}
        >
          <UtensilsCrossed size={28} color="#B5543A" />
        </div>

        {/* Serif Heading */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.1rem',
            fontWeight: 800,
            color: '#231713',
            margin: '0 0 0.35rem',
            letterSpacing: '-0.02em',
          }}
        >
          Staff Portal
        </h1>

        {/* Italicized subtitle */}
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: '1rem',
            color: '#7E6B64',
            margin: '0 0 2rem',
            textAlign: 'center',
          }}
        >
          Secure access for 22nd Parallel personnel.
        </p>

        {/* Uppercase Category Label */}
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#B5543A',
            textTransform: 'uppercase',
            marginBottom: '1.35rem',
          }}
        >
          Select Your Role
        </div>

        {/* 3x2 Role Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            width: '100%',
            marginBottom: '1.85rem',
          }}
        >
          {STAFF_ROLES.map((staff) => {
            const Icon = staff.icon;
            const isLoading = loadingRole === staff.role;

            return (
              <button
                key={staff.role}
                type="button"
                onClick={() => handleRoleClick(staff)}
                disabled={loadingRole !== null || manualLoading}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #EDE8E1',
                  borderRadius: '20px',
                  padding: '1.35rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: loadingRole !== null ? 'wait' : 'pointer',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.02)',
                  position: 'relative',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!loadingRole) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = staff.color;
                    e.currentTarget.style.boxShadow = `0 12px 24px rgba(44, 26, 20, 0.08), 0 0 0 1px ${staff.color}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#EDE8E1';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.02)';
                }}
              >
                {/* Circular Icon Container */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: staff.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: staff.color,
                    marginBottom: '0.85rem',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  {isLoading ? (
                    <div
                      className="spinner"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderWidth: '2.5px',
                        borderColor: `${staff.color} transparent ${staff.color} ${staff.color}`,
                      }}
                    />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>

                {/* Role Title in Serif */}
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: '#231713',
                    marginBottom: '0.2rem',
                  }}
                >
                  {staff.title}
                </span>

                {/* Staff ID */}
                {!staff.isCustom ? (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: '#8C7A73',
                      fontWeight: 500,
                      fontFamily: 'monospace',
                    }}
                  >
                    {staff.email}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: '#8C7A73',
                      fontWeight: 500,
                    }}
                  >
                    Custom Login
                  </span>
                )}

                {/* Password / PIN Badge */}
                <div
                  style={{
                    marginTop: '0.45rem',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    padding: '0.12rem 0.45rem',
                    borderRadius: '5px',
                    background: staff.isCustom ? '#F3EFE9' : '#FAF1EC',
                    color: staff.isCustom ? '#706059' : '#B5543A',
                    border: `1px solid ${staff.isCustom ? '#E6DFD5' : '#F0DFD3'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <Lock size={10} /> PIN: 1234
                </div>
              </button>
            );
          })}
        </div>

        {/* PWA / Security Information Card matching reference */}
        <div
          style={{
            width: '100%',
            background: '#FAF7F2',
            border: '1px solid #ECE6DC',
            borderRadius: '16px',
            padding: '0.9rem 1.25rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#8C5A47',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>📱</span> PWA ACCESS & STAFF TERMINAL
          </div>
          <p
            style={{
              fontSize: '0.74rem',
              color: '#7D6A62',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Tap any staff role to authenticate directly. All team IDs are active with default PIN: <strong>1234</strong>.
          </p>
        </div>
      </div>

      {/* Custom ID / Password Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(25, 14, 11, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '1px solid #EDE8E1',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    margin: 0,
                    color: '#231713',
                  }}
                >
                  Custom Staff Sign-In
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#7E6B64', margin: '0.2rem 0 0' }}>
                  Enter your assigned Staff ID / Email and PIN
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: '#F5EFE8',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#706059',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#4A3B36',
                    marginBottom: '0.4rem',
                  }}
                >
                  Staff ID or Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin or admin@rms.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1.5px solid #EDE5DC',
                    background: '#FAF7F2',
                    fontSize: '0.9rem',
                    color: '#2C1A14',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#4A3B36',
                    marginBottom: '0.4rem',
                  }}
                >
                  Password (PIN: 1234)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter 1234"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #EDE5DC',
                      background: '#FAF7F2',
                      fontSize: '0.9rem',
                      color: '#2C1A14',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#8C7B74',
                      cursor: 'pointer',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={manualLoading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: '#B5543A',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: manualLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 18px rgba(181, 84, 58, 0.3)',
                }}
              >
                <LogIn size={16} />
                {manualLoading ? 'Authenticating...' : 'Sign In with Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
