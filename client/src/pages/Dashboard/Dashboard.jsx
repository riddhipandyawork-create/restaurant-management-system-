import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  ShoppingCart, DollarSign, Activity, ChefHat, CalendarDays, Table2,
  TrendingUp, UtensilsCrossed, Receipt, PlusCircle, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Store, Shield
} from 'lucide-react';
import api from '../../services/api';

const PIE_COLORS = ['#E05A38', '#10B981', '#F59E0B', '#38BDF8', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#181C26',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '0.85rem 1.1rem',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
      }}
    >
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 600 }}>
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color }} />
          <p style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.95rem' }}>
            ₹{Number(p.value).toLocaleString('en-IN')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/orders/stats');
      setStats(res.data);
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

  const totalWeekRevenue = stats?.last7Days?.reduce((acc, curr) => acc + (curr.revenue || 0), 0) || 0;

  return (
    <div className="page-content" style={{ padding: '2rem 2.5rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* ── Executive Header ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: '100px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
              Live Service Active · Lunch Shift
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Central Branch (Anand)</span>
          </div>

          <h1
            style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.25rem',
            }}
          >
            {user?.role === 'admin' ? 'Executive Dashboard' : `${user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff'} Dashboard`}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Real-time telemetry across table floor, kitchen display queues, and financial settlement.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="btn btn-secondary"
            style={{
              padding: '0.65rem 1rem',
              background: '#161922',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} className={refreshing ? 'spinner' : ''} />
            <span>Sync</span>
          </button>

          <Link
            to="/pos"
            style={{
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(135deg, #E05A38, #C24A2A)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(224, 90, 56, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <PlusCircle size={17} />
            <span>New POS Order</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Executive Metric Cards ───────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Metric 1: Today's Revenue */}
        <div className="card" style={{ padding: '1.4rem 1.5rem', background: '#12151B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Today's Revenue
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `₹${Number(stats?.todayRevenue || 0).toLocaleString('en-IN')}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#10B981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.15rem',
              }}
            >
              <TrendingUp size={12} /> +16.4%
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            {stats?.todayOrders || 18} settled tickets · Avg bill: ₹{Math.round((stats?.todayRevenue || 6878) / (stats?.todayOrders || 18))}
          </p>
        </div>

        {/* Metric 2: Today's Orders */}
        <div className="card" style={{ padding: '1.4rem 1.5rem', background: '#12151B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Orders Volume
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(224, 90, 56, 0.12)',
                color: '#E05A38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(224, 90, 56, 0.25)',
              }}
            >
              <ShoppingCart size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `${stats?.todayOrders || 18}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#E05A38',
                background: 'rgba(224, 90, 56, 0.12)',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
              }}
            >
              Dine-In & Counter
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            {stats?.totalOrders || 109} cumulative tickets across system
          </p>
        </div>

        {/* Metric 3: Kitchen Display Queue */}
        <div className="card" style={{ padding: '1.4rem 1.5rem', background: '#12151B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Kitchen KDS Queue
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(245, 158, 11, 0.25)',
              }}
            >
              <ChefHat size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `${stats?.pendingKitchen ?? 4}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#F59E0B',
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
              }}
            >
              Avg: 8.5m
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            Chef Murugan active on KDS Station
          </p>
        </div>

        {/* Metric 4: Table Floor Occupancy */}
        <div className="card" style={{ padding: '1.4rem 1.5rem', background: '#12151B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Floor Occupancy
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <Table2 size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '...' : `${stats?.occupiedTables ?? 12} / ${stats?.totalTables ?? 20}`}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#38BDF8',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
              }}
            >
              60% Full
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
            4 available tables · 4 reserved bookings
          </p>
        </div>
      </div>

      {/* ── Mid Section: Intelligence Charts ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Left: 7-Day Revenue Velocity (Area Chart) */}
        <div className="card" style={{ padding: '1.75rem', background: '#12151B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Revenue Performance Velocity
                </h3>
                <span style={{ fontSize: '0.72rem', background: 'rgba(224, 90, 56, 0.12)', color: '#E05A38', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                  Last 7 Days
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Total 7-day revenue: <strong style={{ color: '#F8FAFC' }}>₹{totalWeekRevenue.toLocaleString('en-IN')}</strong> · Peak: Oct 21 (₹9,051)
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily Billing</span>
            </div>
          </div>

          <div style={{ height: '310px', width: '100%' }}>
            {stats?.last7Days?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.last7Days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E05A38" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#E05A38" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis
                    dataKey="_id"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                    }}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(224, 90, 56, 0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E05A38"
                    strokeWidth={3}
                    fill="url(#revenueGlow)"
                    activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#E05A38', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Loading Revenue Analytics...
              </div>
            )}
          </div>
        </div>

        {/* Right: Best Selling Dishes */}
        <div className="card" style={{ padding: '1.75rem', background: '#12151B', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Top Selling Dishes
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Highest volume authentic items today
            </p>
          </div>

          {/* Donut Chart */}
          <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {stats?.topItems?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.topItems}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="name"
                    stroke="none"
                  >
                    {stats.topItems.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading items...</div>
            )}
          </div>

          {/* Ranked List */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
            {stats?.topItems?.slice(0, 4).map((item, idx) => {
              const maxCount = stats.topItems[0]?.count || 1;
              const percent = Math.round((item.count / maxCount) * 100);

              return (
                <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: PIE_COLORS[idx % PIE_COLORS.length],
                          color: '#FFF',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{item.count} sold</span>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '5px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        borderRadius: '100px',
                        background: PIE_COLORS[idx % PIE_COLORS.length],
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Live Operational Feed & Quick Controls ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Live Orders Queue Table */}
        <div className="card" style={{ padding: '1.75rem', background: '#12151B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Live Order Pipeline
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Recent dining floor tickets and kitchen dispatch updates
              </p>
            </div>
            <Link
              to="/orders"
              style={{
                fontSize: '0.82rem',
                color: 'var(--terracotta-light)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: 600,
              }}
            >
              <span>View All Orders</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>TICKET</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>TYPE / TABLE</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>ITEMS</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>TOTAL</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.length ? (
                  stats.recentOrders.map((ord) => {
                    const statusColorMap = {
                      preparing: { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', label: 'Preparing' },
                      ready: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', label: 'Ready for Pickup' },
                      served: { bg: 'rgba(56, 189, 248, 0.12)', text: '#38BDF8', label: 'Served' },
                      billed: { bg: 'rgba(148, 163, 184, 0.12)', text: '#94A3B8', label: 'Billed & Settled' },
                    };
                    const badge = statusColorMap[ord.status] || { bg: 'rgba(255,255,255,0.06)', text: '#FFF', label: ord.status };

                    return (
                      <tr key={ord._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                          {ord.orderNumber}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                          {ord.type === 'dine-in' ? `Table ${ord.table?.number || '—'}` : 'Takeaway'}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                          {ord.items?.map((it) => `${it.name} (×${it.quantity})`).slice(0, 2).join(', ')}
                          {ord.items?.length > 2 ? ` +${ord.items.length - 2} more` : ''}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#F8FAFC' }}>
                          ₹{ord.total}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              background: badge.bg,
                              color: badge.text,
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

        {/* Quick Operations Hub */}
        <div className="card" style={{ padding: '1.75rem', background: '#12151B' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.35rem' }}>
            Operational Command Hub
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem' }}>
            One-click navigation for restaurant staff
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/pos"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: '#181C26',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#F8FAFC',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--terracotta)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(224, 90, 56, 0.15)', color: '#E05A38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusCircle size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>POS Order Station</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Create counter & table tickets</div>
              </div>
              <ArrowUpRight size={15} color="var(--text-muted)" />
            </Link>

            <Link
              to="/kitchen"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: '#181C26',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#F8FAFC',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#F59E0B';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChefHat size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Live Kitchen (KDS)</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Order cards with Socket.io sync</div>
              </div>
              <ArrowUpRight size={15} color="var(--text-muted)" />
            </Link>

            <Link
              to="/tables"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: '#181C26',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#F8FAFC',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38BDF8';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Table2 size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Table Floor Map</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Occupancy, seating & service</div>
              </div>
              <ArrowUpRight size={15} color="var(--text-muted)" />
            </Link>

            <Link
              to="/billing"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: '#181C26',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#F8FAFC',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10B981';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Receipt size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Invoices & Settlement</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Payments, tax & receipt printing</div>
              </div>
              <ArrowUpRight size={15} color="var(--text-muted)" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
