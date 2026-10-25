import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Activity, ArrowUpRight, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import api from '../../services/api';

const COLORS = ['#B5543A', '#6F7F5F', '#D48B38', '#933F29', '#839772', '#C8644A', '#4E5D42'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-muted-foreground text-xs font-medium mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <p className="text-foreground font-bold text-sm">
            {p.name === 'revenue' ? `₹${p.value?.toFixed(0)}` : p.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/stats').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalRevenue = stats?.last7Days?.reduce((s, d) => s + d.revenue, 0) || 0;
  const totalOrders7d = stats?.last7Days?.reduce((s, d) => s + d.orders, 0) || 0;
  const avgOrder = totalOrders7d > 0 ? totalRevenue / totalOrders7d : 0;

  const kpis = [
    { label: '7-Day Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: DollarSign },
    { label: '7-Day Orders', value: totalOrders7d, icon: ShoppingCart },
    { label: 'Avg Order Value', value: `₹${avgOrder.toFixed(0)}`, icon: Activity },
    { label: "Today's Revenue", value: `₹${(stats?.todayRevenue || 0).toFixed(0)}`, icon: TrendingUp },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Reports & Analytics</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Comprehensive business performance overview.</p>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {kpis.map((k, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i % 2 === 0 ? 'var(--terracotta-bg)' : 'var(--olive-bg)', border: '1px solid var(--border)' }}>
                    <k.icon size={24} color={i % 2 === 0 ? 'var(--terracotta)' : 'var(--olive)'} />
                  </div>
                  <ArrowUpRight size={20} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                </div>
                <div>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{k.value}</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{k.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Revenue Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="card" style={{ padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Daily Revenue</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last 7 days performance</p>
                </div>
                <div style={{ padding: '0.5rem', background: 'var(--terracotta-bg)', borderRadius: '8px' }}>
                  <BarChart3 size={20} color="var(--terracotta)" />
                </div>
              </div>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.last7Days || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B5543A" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#B5543A" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="_id" tick={{ fill: '#9E887E', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: '#9E887E', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="revenue" fill="url(#colorBar)" radius={[6, 6, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Order Volume Line Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
              className="card" style={{ padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Order Volume Trend</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Orders placed in last 7 days</p>
                </div>
                <div style={{ padding: '0.5rem', background: 'var(--olive-bg)', borderRadius: '8px' }}>
                  <TrendingUp size={20} color="var(--olive)" />
                </div>
              </div>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.last7Days || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6F7F5F" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6F7F5F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="_id" tick={{ fill: '#9E887E', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: '#9E887E', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Line type="monotone" dataKey="orders" stroke="#6F7F5F" strokeWidth={3} dot={{ fill: '#6F7F5F', r: 5, strokeWidth: 2, stroke: '#190E0B' }} activeDot={{ r: 7 }} animationDuration={1500} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Top Items Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Top Performing Items</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Most popular dishes by order count</p>
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(212, 139, 56, 0.15)', borderRadius: '8px' }}>
                <PieChartIcon size={20} color="#D48B38" />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              {stats?.topItems?.length ? (
                <>
                  <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={stats.topItems} 
                          cx="50%" cy="50%" 
                          innerRadius={60} outerRadius={100}
                          paddingAngle={5} 
                          dataKey="count" 
                          nameKey="name"
                          stroke="none"
                          animationDuration={1500}
                        >
                          {stats.topItems.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} style={{ outline: 'none' }} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.topItems.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }} />
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.name}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', background: 'var(--bg-base)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{item.count} orders</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <BarChart3 size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.9rem' }}>No item data available yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
