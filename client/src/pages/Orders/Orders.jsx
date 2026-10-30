import { useEffect, useState, useCallback } from 'react';
import { Receipt, Clock, CheckCircle2, ChevronRight, User, Check, Utensils, CreditCard, XCircle, FileText, ArrowUpDown } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.05)', border: 'var(--border)', icon: Clock },
  confirmed: { label: 'Accepted', color: '#D48B38', bg: 'var(--warning-bg)', border: 'rgba(212, 139, 56, 0.25)', icon: Check },
  preparing: { label: 'Cooking', color: 'var(--terracotta)', bg: 'var(--terracotta-bg)', border: 'rgba(181, 84, 58, 0.3)', icon: Utensils },
  ready: { label: 'Ready', color: 'var(--olive)', bg: 'var(--olive-bg)', border: 'var(--olive-border)', icon: CheckCircle2 },
  served: { label: 'Served', color: 'var(--olive-light)', bg: 'rgba(131, 151, 114, 0.15)', border: 'rgba(131, 151, 114, 0.3)', icon: User },
  billed: { label: 'Paid', color: 'var(--limestone)', bg: 'rgba(240, 230, 216, 0.12)', border: 'rgba(240, 230, 216, 0.25)', icon: CreditCard },
  cancelled: { label: 'Cancelled', color: '#E06A55', bg: 'var(--danger-bg)', border: 'rgba(224, 106, 85, 0.25)', icon: XCircle }
};

const NEXT_STATUS = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'served', served: 'billed' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortAsc, setSortAsc] = useState(true); // Default to ascending order (oldest first / queue order)

  const fetchOrders = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const params = { sort: sortAsc ? 'asc' : 'desc' };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/orders', { params });
      const sorted = [...data].sort((a, b) => 
        sortAsc ? (new Date(a.createdAt) - new Date(b.createdAt)) : (new Date(b.createdAt) - new Date(a.createdAt))
      );
      setOrders(sorted);
      
      // Keep selected order updated
      setSelectedOrder(prev => {
        if (!prev) return sorted[0] || null;
        const updated = sorted.find(o => o._id === prev._id);
        return updated || sorted[0] || null;
      });
    } catch { 
      toast.error('Failed to load orders'); 
    } finally { 
      if (!isBackground) setLoading(false); 
    }
  }, [statusFilter, sortAsc]);

  useEffect(() => { fetchOrders(false); }, [fetchOrders]);
  useEffect(() => {
    // Auto refresh every 30s without flashing
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const advanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await api.patch(`/orders/${order._id}/status`, { status: next });
      toast.success(`Order marked as ${STATUS_CONFIG[next].label}`);
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const cancelOrder = async (order) => {
    if(!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/orders/${order._id}/status`, { status: 'cancelled' });
      toast.success(`Order Cancelled`);
      fetchOrders();
    } catch { toast.error('Update failed'); }
  }

  const OrderCard = ({ order, isSelected, onClick }) => {
    const conf = STATUS_CONFIG[order.status];
    const Icon = conf.icon;
    const time = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div 
        onClick={onClick}
        className="card"
        style={{
          cursor: 'pointer',
          padding: '1.25rem',
          marginBottom: '1rem',
          border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
          background: isSelected ? 'rgba(255,255,255,0.05)' : 'var(--bg-elevated)',
          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
          transition: 'var(--transition)'
        }}
        onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>#{order.orderNumber?.slice(-4) || 'ORD'}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {order.type === 'dine-in' ? (order.table?.label || `T-${order.tableNumber || '?'}`) : 'Takeaway'}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{time}</span>
            </div>
          </div>
          <div style={{ padding: '0.35rem 0.75rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, background: conf.bg, color: conf.color, border: `1px solid ${conf.border}` }}>
            <Icon size={14} />
            {conf.label}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{order.items?.length || 0} items</p>
          <p style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.25rem' }}>₹{order.total?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="page-content" style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexShrink: 0, flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Receipt size={28} color="var(--accent)"/> Order Queue
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage and track all restaurant orders &middot; <strong style={{ color: 'var(--accent)' }}>{sortAsc ? 'Ascending by time (Oldest first)' : 'Descending by time (Newest first)'}</strong>
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Chronological Sort Toggle */}
          <button 
            onClick={() => setSortAsc(prev => !prev)}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: sortAsc ? 'var(--terracotta-bg)' : 'var(--bg-elevated)',
              color: sortAsc ? 'var(--terracotta)' : 'var(--text-secondary)',
              border: sortAsc ? '1px solid var(--border-hover)' : '1px solid var(--border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'var(--transition)',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Toggle chronological order (Ascending / Descending)"
          >
            <ArrowUpDown size={15} color={sortAsc ? 'var(--terracotta)' : 'var(--text-muted)'} />
            <span>{sortAsc ? 'Time: Ascending (Oldest First)' : 'Time: Descending (Newest First)'}</span>
          </button>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-elevated)', padding: '0.35rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            {['', 'pending', 'confirmed', 'preparing', 'ready', 'served'].map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize', cursor: 'pointer',
                  background: statusFilter === s ? 'var(--accent)' : 'transparent',
                  color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
                  border: 'none', transition: 'var(--transition)'
                }}
              >
                {s || 'All Active'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
        
        {/* Left: Order List */}
        <div style={{ width: '400px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
            ) : orders.length === 0 ? (
              <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Receipt size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <p style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>No orders found</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Try changing your filters.</p>
              </div>
            ) : (
              orders.map(order => (
                <OrderCard 
                  key={order._id} 
                  order={order} 
                  isSelected={selectedOrder?._id === order._id}
                  onClick={() => setSelectedOrder(order)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Order Details Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selectedOrder ? (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* Detail Header */}
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>Order #{selectedOrder.orderNumber?.slice(-4) || 'ORD'}</h3>
                    <span style={{ padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', background: STATUS_CONFIG[selectedOrder.status].bg, color: STATUS_CONFIG[selectedOrder.status].color, border: `1px solid ${STATUS_CONFIG[selectedOrder.status].border}` }}>
                      {STATUS_CONFIG[selectedOrder.status].label}
                    </span>
                  </div>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Clock size={16}/> {new Date(selectedOrder.createdAt).toLocaleString()}
                    <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>•</span>
                    <User size={16}/> {selectedOrder.customerName || 'Walk-in Customer'}
                  </p>
                  {selectedOrder.chef && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      <Utensils size={14}/> Chef: {selectedOrder.chef.name}
                    </p>
                  )}
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Order Type</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {selectedOrder.type} 
                    {selectedOrder.table && <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({selectedOrder.table.label})</span>}
                  </p>
                </div>
              </div>

              {/* Detail Body (Items) */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18}/> Order Items
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--text-secondary)', flexShrink: 0 }}>
                        {item.quantity}x
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.name}</h5>
                        {item.notes && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'inline-block', marginTop: '0.5rem' }}>
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Footer (Totals & Actions) */}
              <div style={{ padding: '2rem', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span>Subtotal:</span> <span style={{ color: 'var(--text-primary)' }}>₹{(selectedOrder.total / 1.05).toFixed(2)}</span>
                    </p>
                    <p style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span>Tax (5%):</span> <span style={{ color: 'var(--text-primary)' }}>₹{(selectedOrder.total - selectedOrder.total / 1.05).toFixed(2)}</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Amount</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>₹{selectedOrder.total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'billed' && (
                    <button 
                      onClick={() => cancelOrder(selectedOrder)}
                      className="btn"
                      style={{ padding: '1rem 2rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {NEXT_STATUS[selectedOrder.status] ? (
                    <button 
                      onClick={() => advanceStatus(selectedOrder)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      Mark as {STATUS_CONFIG[NEXT_STATUS[selectedOrder.status]].label}
                      <ChevronRight size={20} />
                    </button>
                  ) : selectedOrder.status === 'billed' ? (
                    <div style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius)', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
                      <CheckCircle2 size={24} /> Order Completed & Paid
                    </div>
                  ) : (
                    <div style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
                      <XCircle size={24} /> Order Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                <Receipt size={40} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Select an Order</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Click on any order card on the left to view its full details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
