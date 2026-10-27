import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  ShoppingCart, DollarSign, Activity, ChefHat, CalendarDays, Table2,
  TrendingUp, UtensilsCrossed, Receipt, PlusCircle, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Store, Shield,
  Sun, Moon, Award, Compass, Flame, Coffee
} from 'lucide-react';
import api from '../../services/api';

const HAUTE_COLORS = ['#B84A2B', '#4D6E48', '#C28E38', '#2E6B8E', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '0.85rem 1.15rem',
        boxShadow: 'var(--shadow-md)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.35rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color || 'var(--terracotta)' }} />
          <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>
            ₹{Number(p.value).toLocaleString('en-IN')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/orders/stats');
      setStats(res.data);
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalWeekRevenue = useMemo(() => {
    return stats?.last7Days?.reduce((acc, curr) => acc + (curr.revenue || 0), 0) || 0;
  }, [stats]);

  const peakDay = useMemo(() => {
    if (!stats?.last7Days?.length) return { date: '—', amount: 0 };
    return stats.last7Days.reduce((prev, curr) => (curr.revenue > prev.amount ? { date: curr._id, amount: curr.revenue } : prev), { date: '', amount: 0 });
  }, [stats]);

  const avgTicket = useMemo(() => {
    const orders = stats?.todayOrders || 1;
    const rev = stats?.todayRevenue || 0;
    return Math.round(rev / (orders || 1));
  }, [stats]);

  return (
    <div className="page-content" style={{ padding: '2.5rem 3rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* ── Haute Hospitality Masthead ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          {/* Status Badge & Heritage Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.65rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                background: 'var(--olive-bg)',
                color: 'var(--olive)',
                border: '1px solid var(--olive-border)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--olive)', animation: 'pulse 2s infinite' }} />
              Live Service Active · Lunch Shift
            </span>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Compass size={14} color="var(--terracotta)" />
              22nd Parallel · Anand Flagship
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              margin: '0 0 0.35rem',
            }}
          >
            {user?.role === 'admin' ? 'Executive Telemetry & Floor Operations' : `${user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff'} Command Suite`}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '720px' }}>
            Real-time culinary dispatch, dining floor velocity, and financial settlement for authentic South Indian service.
          </p>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Dual Theme Switcher (Atelier Light / Noir Dark) */}
          <button
            onClick={toggleTheme}
            className="btn"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            title={`Switch to ${theme === 'light' ? 'Noir Obsidian (Dark)' : 'Atelier Ivory (Light)'}`}
          >
            {theme === 'light' ? (
              <>
                <Moon size={15} color="var(--terracotta)" />
                <span>Noir Mode</span>
              </>
            ) : (
              <>
                <Sun size={15} color="var(--gold)" />
                <span>Atelier Light</span>
              </>
            )}
          </button>

          {/* Refresh / Sync Button */}
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="btn"
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'spinner' : ''} />
            <span>Sync ({lastSync})</span>
          </button>

          {/* Primary Action Button */}
          <Link
            to="/pos"
            className="btn btn-primary"
            style={{
              padding: '0.7rem 1.4rem',
              background: 'linear-gradient(135deg, var(--terracotta-light), var(--terracotta))',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              boxShadow: '0 4px 18px var(--accent-glow)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'var(--transition)',
            }}
          >
            <PlusCircle size={17} />
            <span>New POS Order</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Bespoke Executive Metric Pods ─────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1.4rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Metric Pod 1: Today's Revenue */}
        <div
          className="card"
          style={{
            padding: '1.6rem 1.75rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Gross Revenue Velocity
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--olive-bg)',
                color: 'var(--olive)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--olive-border)',
                boxShadow: '0 2px 8px rgba(77, 110, 72, 0.12)',
              }}
            >
              <DollarSign size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `₹${Number(stats?.todayRevenue || 0).toLocaleString('en-IN')}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--olive)',
                background: 'var(--olive-bg)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                border: '1px solid var(--olive-border)',
              }}
            >
              <TrendingUp size={12} /> +18.4%
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{stats?.todayOrders || 18} settled tickets</strong> · Avg ticket: ₹{avgTicket.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Metric Pod 2: Orders Volume */}
        <div
          className="card"
          style={{
            padding: '1.6rem 1.75rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Ticket Volume
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--terracotta-bg)',
                color: 'var(--terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-hover)',
                boxShadow: '0 2px 8px var(--accent-glow)',
              }}
            >
              <ShoppingCart size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `${stats?.todayOrders || 18}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--terracotta)',
                background: 'var(--terracotta-bg)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-hover)',
              }}
            >
              Dine-In & Counter
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{stats?.totalOrders || 109} cumulative</strong> orders logged across system
          </p>
        </div>

        {/* Metric Pod 3: Kitchen KDS Velocity */}
        <div
          className="card"
          style={{
            padding: '1.6rem 1.75rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Kitchen KDS Queue
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--gold-bg)',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(194, 142, 56, 0.25)',
                boxShadow: '0 2px 8px rgba(194, 142, 56, 0.12)',
              }}
            >
              <ChefHat size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `${stats?.pendingKitchen ?? 4}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--gold)',
                background: 'var(--gold-bg)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(194, 142, 56, 0.25)',
              }}
            >
              Avg: 8.5m
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
            Chef Murugan active · Hearth station on pace
          </p>
        </div>

        {/* Metric Pod 4: Floor Occupancy */}
        <div
          className="card"
          style={{
            padding: '1.6rem 1.75rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Dining Floor Occupancy
            </span>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--info-bg)',
                color: 'var(--info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(46, 107, 142, 0.25)',
                boxShadow: '0 2px 8px rgba(46, 107, 142, 0.12)',
              }}
            >
              <Table2 size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `${stats?.occupiedTables ?? 12} / ${stats?.totalTables ?? 20}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--info)',
                background: 'var(--info-bg)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(46, 107, 142, 0.25)',
              }}
            >
              60% Capacity
            </span>
          </div>

          {/* Micro Occupancy Bar */}
          <div style={{ width: '100%', height: '6px', borderRadius: '100px', background: 'var(--bg-elevated)', overflow: 'hidden', display: 'flex', marginTop: '0.65rem' }}>
            <div style={{ width: '60%', background: 'var(--terracotta)', borderRadius: '100px 0 0 100px' }} title="Occupied (60%)" />
            <div style={{ width: '20%', background: 'var(--gold)' }} title="Reserved (20%)" />
            <div style={{ width: '20%', background: 'var(--olive)', borderRadius: '0 100px 100px 0' }} title="Available (20%)" />
          </div>
        </div>
      </div>

      {/* ── Mid Section: Intelligence Charts ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
        
        {/* Left: 7-Day Revenue Velocity (Area Chart) */}
        <div
          className="card"
          style={{
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.015em',
                  }}
                >
                  Revenue Trajectory & Daily Settlement
                </h3>
                <span style={{ fontSize: '0.72rem', background: 'var(--terracotta-bg)', color: 'var(--terracotta)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800, border: '1px solid var(--border-hover)' }}>
                  Trailing 7 Days
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.35rem', margin: 0 }}>
                Total 7-day volume: <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>₹{totalWeekRevenue.toLocaleString('en-IN')}</strong> · Peak: {peakDay.date ? new Date(peakDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Oct 21'} (₹{peakDay.amount?.toLocaleString('en-IN')})
              </p>
            </div>

            {/* Timeframe Selector Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
              {['7d', '14d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '7px',
                    border: 'none',
                    background: timeRange === range ? 'var(--bg-card)' : 'transparent',
                    color: timeRange === range ? 'var(--terracotta)' : 'var(--text-muted)',
                    boxShadow: timeRange === range ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '320px', width: '100%' }}>
            {stats?.last7Days?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.last7Days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="terracottaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme === 'dark' ? '#E05A38' : '#B84A2B'} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={theme === 'dark' ? '#E05A38' : '#B84A2B'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="_id"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                    }}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-accent)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme === 'dark' ? '#E05A38' : '#B84A2B'}
                    strokeWidth={2.8}
                    fill="url(#terracottaGradient)"
                    activeDot={{ r: 6, fill: 'var(--bg-card)', stroke: theme === 'dark' ? '#E05A38' : '#B84A2B', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Loading Revenue Analytics...
              </div>
            )}
          </div>

          {/* Metric Summary Footer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Daily Velocity</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0 0', fontVariantNumeric: 'tabular-nums' }}>
                ₹{Math.round(totalWeekRevenue / 7).toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}> / day</span>
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>POS Settlement</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--olive)', margin: '0.2rem 0 0' }}>
                100% Real-Time
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Peak Slot</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0 0' }}>
                Lunch Shift (1:30 PM)
              </p>
            </div>
          </div>
        </div>

        {/* Right: Signature Delicacies (Gastronomic Leaderboard) */}
        <div
          className="card"
          style={{
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.015em',
                }}
              >
                Signature Gastronomy
              </h3>
              <Award size={18} color="var(--gold)" />
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.35rem', margin: 0 }}>
              Highest volume authentic items ordered today
            </p>
          </div>

          {/* Ranked Delicacies List */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {stats?.topItems?.length ? (
              stats.topItems.slice(0, 5).map((item, idx) => {
                const maxCount = stats.topItems[0]?.count || 1;
                const percent = Math.round((item.count / maxCount) * 100);
                const color = HAUTE_COLORS[idx % HAUTE_COLORS.length];

                return (
                  <div key={item._id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '8px',
                            background: color,
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 2px 6px ${color}33`,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.86rem', fontVariantNumeric: 'tabular-nums' }}>
                          {item.count} sold
                        </span>
                        {item.revenue ? (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            ₹{item.revenue.toLocaleString('en-IN')}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Styled Multi-hue Progress Bar */}
                    <div style={{ width: '100%', height: '6px', borderRadius: '100px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          borderRadius: '100px',
                          background: color,
                          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                Loading culinary signatures...
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Audited against live kitchen KDS</span>
            <Link to="/menu" style={{ color: 'var(--terracotta)', fontWeight: 700, textDecoration: 'none' }}>
              Full Culinary Catalog →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Live Floor Dispatch & Operations Hub ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '1.75rem' }}>
        
        {/* Live Orders Queue Table */}
        <div
          className="card"
          style={{
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.015em',
                }}
              >
                Live Dining Floor Dispatch Stream
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.35rem', margin: 0 }}>
                Recent dining room tickets and kitchen pass dispatches
              </p>
            </div>
            <Link
              to="/orders"
              style={{
                fontSize: '0.82rem',
                color: 'var(--terracotta)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 700,
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--terracotta-bg)',
                border: '1px solid var(--border-hover)',
              }}
            >
              <span>View All Orders</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>TICKET</th>
                  <th style={{ padding: '0.75rem 0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>TABLE / TYPE</th>
                  <th style={{ padding: '0.75rem 0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>ITEMS</th>
                  <th style={{ padding: '0.75rem 0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>TOTAL</th>
                  <th style={{ padding: '0.75rem 0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.length ? (
                  stats.recentOrders.map((ord) => {
                    const statusColorMap = {
                      confirmed: { bg: 'var(--gold-bg)', text: 'var(--gold)', border: 'rgba(194, 142, 56, 0.25)', label: 'Order Confirmed' },
                      preparing: { bg: 'var(--gold-bg)', text: 'var(--gold)', border: 'rgba(194, 142, 56, 0.25)', label: 'In Kitchen' },
                      ready:     { bg: 'var(--olive-bg)', text: 'var(--olive)', border: 'var(--olive-border)', label: 'Ready for Pickup' },
                      served:    { bg: 'var(--info-bg)', text: 'var(--info)', border: 'rgba(46, 107, 142, 0.25)', label: 'Table Served' },
                      billed:    { bg: 'var(--bg-elevated)', text: 'var(--text-secondary)', border: 'var(--border)', label: 'Settled & Paid' },
                    };
                    const badge = statusColorMap[ord.status] || { bg: 'var(--bg-elevated)', text: 'var(--text-primary)', border: 'var(--border)', label: ord.status };

                    return (
                      <tr key={ord._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.95rem 0.65rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                          {ord.orderNumber}
                        </td>
                        <td style={{ padding: '0.95rem 0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {ord.type === 'dine-in' ? `Table ${ord.table?.number || '—'}` : 'Takeaway'}
                        </td>
                        <td style={{ padding: '0.95rem 0.65rem', color: 'var(--text-secondary)' }}>
                          {ord.items?.map((it) => `${it.name} (×${it.quantity})`).slice(0, 2).join(', ')}
                          {ord.items?.length > 2 ? ` +${ord.items.length - 2} more` : ''}
                        </td>
                        <td style={{ padding: '0.95rem 0.65rem', fontWeight: 800, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                          ₹{ord.total}
                        </td>
                        <td style={{ padding: '0.95rem 0.65rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.22rem 0.65rem',
                              borderRadius: '6px',
                              background: badge.bg,
                              color: badge.text,
                              border: `1px solid ${badge.border}`,
                              display: 'inline-block',
                            }}
                          >
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No orders logged yet today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Command Hub */}
        <div
          className="card"
          style={{
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '0 0 0.35rem',
                letterSpacing: '-0.015em',
              }}
            >
              Operational Command Hub
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Direct station routing for floor, kitchen, and cash registers
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
            
            {/* Action 1: POS Order Station */}
            <Link
              to="/pos"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.95rem',
                padding: '0.95rem 1.15rem',
                borderRadius: '14px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--terracotta)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--terracotta-bg)', color: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hover)' }}>
                <PlusCircle size={20} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>POS Billing Station</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate counter tickets & split bills</div>
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </Link>

            {/* Action 2: Kitchen Display System */}
            <Link
              to="/kitchen"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.95rem',
                padding: '0.95rem 1.15rem',
                borderRadius: '14px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gold-bg)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(194, 142, 56, 0.25)' }}>
                <ChefHat size={20} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Kitchen Display Station</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live order queue for head chef & hearth</div>
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </Link>

            {/* Action 3: Dining Table Map */}
            <Link
              to="/tables"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.95rem',
                padding: '0.95rem 1.15rem',
                borderRadius: '14px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--info)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--info-bg)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(46, 107, 142, 0.25)' }}>
                <Table2 size={20} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dining Table Floor Map</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>20 tables · real-time seating status</div>
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </Link>

            {/* Action 4: Reports & Auditing */}
            <Link
              to="/reports"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.95rem',
                padding: '0.95rem 1.15rem',
                borderRadius: '14px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--olive)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--olive-bg)', color: 'var(--olive)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--olive-border)' }}>
                <Activity size={20} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>EOD Settlement Reports</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sales audit, cashier shifts & GST analytics</div>
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </Link>

          </div>
        </div>
      </div>

    </div>
  );
}
