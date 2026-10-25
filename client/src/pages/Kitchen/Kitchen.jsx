import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, Check, Flame, Utensils, Timer, Info, ChefHat } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const [timeUpdate, setTimeUpdate] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(() => setTimeUpdate(prev => prev + 1), 60000);

    const socket = io('http://localhost:5000', { auth: { token } });
    socket.on('order:new', (order) => setOrders(prev => [order, ...prev]));
    socket.on('order:updated', (updatedOrder) => {
      if (['served', 'billed', 'cancelled'].includes(updatedOrder.status)) {
        setOrders(prev => prev.filter(o => o._id !== updatedOrder._id));
      } else {
        setOrders(prev => {
          const exists = prev.find(o => o._id === updatedOrder._id);
          if (exists) return prev.map(o => o._id === updatedOrder._id ? updatedOrder : o);
          return [updatedOrder, ...prev];
        });
      }
    });

    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, [token]);

  const fetchOrders = async () => {
    try {
      const [pending, conf, prep, ready] = await Promise.all([
        api.get('/orders?status=pending'),
        api.get('/orders?status=confirmed'),
        api.get('/orders?status=preparing'),
        api.get('/orders?status=ready')
      ]);
      setOrders([...pending.data, ...conf.data, ...prep.data, ...ready.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;
  }

  const incomingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const Ticket = ({ order }) => {
    const waitTime = Math.max(0, Math.floor((new Date() - new Date(order.createdAt)) / 60000));
    const isUrgent = waitTime > 15 && order.status !== 'ready';
    const createdTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const orderType = order.table?.label ? `Table ${order.table.label}` : (order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway');

    let timerClass = 'kds-timer';
    if (isUrgent) timerClass += ' warning';
    else if (order.status === 'ready') timerClass += ' ok';

    return (
      <div className={`kds-card ${isUrgent ? 'card-glow' : ''}`} style={{ marginBottom: '1.25rem' }}>
        <div className="kds-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                #{order.orderNumber.slice(-4)}
              </h3>
              <span className={`badge badge-${order.status}`}>
                {order.status}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {orderType} {' • '} {order.type} {' • '} <Clock size={12} style={{ display: 'inline', marginBottom: '-2px' }} /> {createdTime}
            </p>
            {order.chef && (
              <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 800, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ChefHat size={12} /> Chef: {order.chef.name}
              </p>
            )}
          </div>
          
          <div className={timerClass} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {isUrgent ? <Flame size={14} /> : <Timer size={14} />} 
            {waitTime} MIN
          </div>
        </div>

        {order.notes && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--warning-bg)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <Info size={16} color="var(--warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Notes</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{order.notes}</p>
            </div>
          </div>
        )}

        <div className="kds-items">
          {order.items.map((item, idx) => (
            <div key={idx} className="kds-item" style={{ opacity: item.status === 'cancelled' ? 0.5 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="kds-item-qty">{item.quantity}</span>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: item.status === 'cancelled' ? 'line-through' : 'none' }}>
                    {item.name}
                  </p>
                  {item.notes && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <AlertCircle size={12} /> {item.notes}
                    </p>
                  )}
                </div>
              </div>
              {item.status === 'cancelled' && (
                <span className="badge badge-cancelled" style={{ fontSize: '0.65rem' }}>Cancelled</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {useAuthStore.getState().user?.role !== 'kitchen' ? (
            <div style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.03)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Monitoring: {order.status.toUpperCase()} {order.chef ? `• BY ${order.chef.name.toUpperCase()}` : ''}
            </div>
          ) : order.status === 'pending' ? (
            <button onClick={() => updateStatus(order._id, 'confirmed')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <CheckCircle2 size={16} /> Accept Order
            </button>
          ) : order.status === 'confirmed' ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => updateStatus(order._id, 'preparing')} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Utensils size={16} /> Start Cooking
              </button>
              <button onClick={() => toast.success('Manager alerted!')} className="btn btn-ghost btn-icon">
                <AlertCircle size={16} />
              </button>
            </div>
          ) : order.status === 'preparing' ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => updateStatus(order._id, 'ready')} className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }}>
                <Check size={16} /> Mark Ready
              </button>
              <button onClick={() => toast.success('Manager alerted!')} className="btn btn-ghost btn-icon">
                <AlertCircle size={16} />
              </button>
            </div>
          ) : (
            <div style={{ padding: '0.6rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Check size={16} /> Waiting for Pickup
            </div>
          )}
        </div>
      </div>
    );
  };

  const Column = ({ title, count, orders, badgeClass }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 120px)' }}>
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>{title}</h3>
        <span className={`badge ${badgeClass}`}>{count}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {orders.map(order => <Ticket key={order._id} order={order} />)}
        {orders.length === 0 && (
          <div className="empty-state">
            <CheckCircle2 size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No orders in queue</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', minHeight: '100vh', padding: '1.5rem 2rem' }}>
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <h2>Kitchen Display</h2>
          <p>Real-time order synchronization</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {useAuthStore.getState().user?.role !== 'kitchen' && (
            <button onClick={() => navigate('/')} className="btn btn-ghost" style={{ marginRight: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
               ← Back to Dashboard
            </button>
          )}
          <span className="badge badge-pending">Incoming: {incomingOrders.length}</span>
          <span className="badge badge-preparing">Preparing: {preparingOrders.length}</span>
          <span className="badge badge-ready">Ready: {readyOrders.length}</span>
        </div>
      </div>

      <div className="grid-3" style={{ flex: 1, minHeight: 0 }}>
        <Column title="Incoming" count={incomingOrders.length} orders={incomingOrders} badgeClass="badge-pending" />
        <Column title="Preparing" count={preparingOrders.length} orders={preparingOrders} badgeClass="badge-preparing" />
        <Column title="Ready" count={readyOrders.length} orders={readyOrders} badgeClass="badge-ready" />
      </div>
    </div>
  );
}
