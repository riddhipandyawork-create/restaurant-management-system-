import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  ShoppingCart, DollarSign, Activity, ChefHat, CalendarDays, Table2, TrendingUp, UtensilsCrossed, Receipt, PlusCircle
} from 'lucide-react';
import api from '../../services/api';

const COLORS = ['#B5543A', '#6F7F5F', '#D48B38', '#933F29', '#839772'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', boxShadow: 'var(--shadow-lg)' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color }} />
          <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            ₹{p.value?.toFixed(0)}
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

  useEffect(() => {
    api.get('/orders/stats').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const getRoleHeader = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Complete overview of restaurant performance, staff, and revenue',
        };
      case 'manager':
        return {
          title: 'Manager Dashboard',
          subtitle: "Overview of today's operational performance and dining floor",
        };
      case 'cashier':
        return {
          title: 'Cashier Dashboard',
          subtitle: 'Register performance, daily collections, and invoice settlements',
        };
      case 'waiter':
        return {
          title: 'Waiter Dashboard',
          subtitle: 'Active dining service, pending dispatches, and table orders',
        };
      default:
        return {
          title: `${user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff'} Dashboard`,
          subtitle: "Overview of today's performance",
        };
    }
  };

  const roleHeader = getRoleHeader();

  const getKpis = () => {
    if (user?.role === 'cashier') {
      return [
        { label: "Today's Collections", value: `₹${(stats?.todayRevenue ?? 0).toFixed(0)}`, icon: DollarSign, color: 'var(--olive)', bg: 'var(--olive-bg)' },
        { label: "Billed Invoices", value: stats?.todayOrders ?? 0, icon: Receipt, color: 'var(--terracotta)', bg: 'var(--terracotta-bg)' },
        { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: Activity, color: '#D48B38', bg: 'rgba(212, 139, 56, 0.12)' },
        { label: 'In Kitchen Queue', value: stats?.last7Days?.length ?? 0, icon: ChefHat, color: 'var(--terracotta-light)', bg: 'rgba(200, 100, 74, 0.15)' },
      ];
    }
    if (user?.role === 'waiter') {
      return [
        { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: ShoppingCart, color: 'var(--terracotta)', bg: 'var(--terracotta-bg)' },
        { label: "Ready for Pickup", value: stats?.last7Days?.length ?? 0, icon: ChefHat, color: 'var(--olive)', bg: 'var(--olive-bg)' },
        { label: 'Active Floor Orders', value: stats?.totalOrders ?? 0, icon: Activity, color: '#D48B38', bg: 'rgba(212, 139, 56, 0.12)' },
        { label: "Today's Revenue", value: `₹${(stats?.todayRevenue ?? 0).toFixed(0)}`, icon: DollarSign, color: 'var(--olive-light)', bg: 'var(--olive-bg)' },
      ];
    }
    return [
      { label: "Today's Revenue", value: `₹${(stats?.todayRevenue ?? 0).toFixed(0)}`, icon: DollarSign, color: 'var(--olive)', bg: 'var(--olive-bg)' },
      { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: ShoppingCart, color: 'var(--terracotta)', bg: 'var(--terracotta-bg)' },
      { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: Activity, color: '#D48B38', bg: 'rgba(212, 139, 56, 0.12)' },
      { label: 'Pending Kitchen', value: stats?.last7Days?.length ?? 0, icon: ChefHat, color: 'var(--terracotta-light)', bg: 'rgba(200, 100, 74, 0.15)' },
    ];
  };

  const kpis = getKpis();

  const getQuickActions = () => {
    if (user?.role === 'cashier') {
      return [
        { to: '/billing', icon: Receipt, label: 'Billing & Invoices', desc: 'Process payments and receipts', color: 'var(--olive)', bg: 'var(--olive-bg)' },
        { to: '/orders', icon: ShoppingCart, label: 'Manage Orders', desc: 'Monitor served & pending tickets', color: 'var(--terracotta)', bg: 'var(--terracotta-bg)' },
        { to: '/tables', icon: Table2, label: 'View Tables', desc: 'Check table occupancy and bills', color: '#D48B38', bg: 'rgba(212, 139, 56, 0.12)' },
        { to: '/pos', icon: PlusCircle, label: 'New Counter Order', desc: 'Create walk-in customer order', color: 'var(--terracotta-light)', bg: 'rgba(200, 100, 74, 0.15)' },
      ];
    }
    if (user?.role === 'waiter') {
      return [
        { to: '/pos', icon: PlusCircle, label: 'Take New Order', desc: 'Create table dine-in order', color: 'var(--terracotta)', bg: 'var(--terracotta-bg)' },
        { to: '/tables', icon: Table2, label: 'Table Floor Map', desc: 'Check seats and occupancy', color: 'var(--olive)', bg: 'var(--olive-bg)' },
        { to: '/orders', icon: ShoppingCart, label: 'Order Queue', desc: 'Monitor cooking and ready status', color: '#D48B38', bg: 'rgba(212, 139, 56, 0.12)' },
        { to: '/reservations', icon: CalendarDays, label: 'Reservations', desc: 'View incoming guest bookings', color: 'var(--terracotta-light)', bg: 'rgba(200, 100, 74, 0.15)' },
      ];
    }
    return [
      { to: '/orders', icon: ShoppingCart, label: 'Orders', desc: 'Manage incoming orders', color: 'var(--terracotta)', bg: 'var(--terracotta-bg)' },
      { to: '/tables', icon: Table2, label: 'View Tables', desc: 'Check table status', color: 'var(--olive)', bg: 'var(--olive-bg)' },
      { to: '/billing', icon: DollarSign, label: 'Billing', desc: 'Process payments', color: '#D48B38', bg: 'rgba(212, 139, 56, 0.12)' },
      { to: '/reservations', icon: CalendarDays, label: 'Reservations', desc: 'Manage bookings', color: 'var(--terracotta-light)', bg: 'rgba(200, 100, 74, 0.15)' },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <div className="page-content" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {roleHeader.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{roleHeader.subtitle}</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {kpis.map((k, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: k.bg, color: k.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={24} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {loading ? '...' : k.value}
              </p>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Revenue Chart */}
        <div className="card" style={{ flex: '2 1 500px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Revenue Analytics</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Performance over the last 7 days</p>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--accent-glow)', borderRadius: '8px' }}>
              <TrendingUp size={20} color="var(--accent)" />
            </div>
          </div>
          
          <div style={{ height: '300px', width: '100%' }}>
            {stats?.last7Days?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="_id" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <TrendingUp size={48} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>No revenue data yet</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Complete and bill an order to see the chart.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Items Pie Chart */}
        <div className="card" style={{ flex: '1 1 300px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Top Performing Items</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Highest volume sold today</p>
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
            {stats?.topItems?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={stats.topItems} 
                    cx="50%" cy="50%" 
                    innerRadius={70} outerRadius={100}
                    paddingAngle={5} 
                    dataKey="count" 
                    nameKey="name"
                    stroke="none"
                  >
                    {stats.topItems.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} style={{ outline: 'none' }} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                <UtensilsCrossed size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.9rem' }}>No order data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bento Grid */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {quickActions.map((item, i) => (
            <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
