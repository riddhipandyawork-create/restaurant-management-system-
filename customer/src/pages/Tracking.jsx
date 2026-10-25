import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, ChefHat, CheckCircle, Clock, Info, Utensils, Sparkles, AlertCircle, UtensilsCrossed } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Received', icon: Clock, desc: 'Sent to the master kitchen' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Chefs are roasting & brewing fresh' },
  { id: 'ready', label: 'Ready to Serve', icon: Package, desc: 'Hot & aromatic, ready at the counter' },
  { id: 'served', label: 'Served', icon: CheckCircle, desc: 'Anna Prasadam served with care' }
];

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [socket, setSocket] = useState(null);

  const fetchOrder = async (idToSearch) => {
    const trimmed = idToSearch ? String(idToSearch).trim() : orderNumber.trim();
    if (!trimmed) {
      toast.error('Please enter an Order ID');
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const { data } = await api.get(`/orders/${trimmed}`);
      setOrder(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order not found. Please check your Order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryOrder = searchParams.get('order');
    if (queryOrder) {
      setOrderNumber(queryOrder);
      fetchOrder(queryOrder);
    }
  }, [searchParams]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('order:updated', (updatedOrder) => {
      setOrder(prev => {
        if (prev && (prev._id === updatedOrder._id || String(prev.orderNumber) === String(updatedOrder.orderNumber))) {
          toast.success(`Order status updated to: ${updatedOrder.status.toUpperCase()}`);
          return updatedOrder;
        }
        return prev;
      });
    });

    return () => newSocket.close();
  }, []);

  const searchOrder = (e) => {
    e.preventDefault();
    fetchOrder();
  };

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order?.status);

  return (
    <div style={{
      background: 'var(--bg)',
      minHeight: 'calc(100vh - var(--nav-h, 72px))',
      padding: '3rem 1.5rem 5rem',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontWeight: 700,
            marginBottom: '0.6rem',
          }}>
            <Sparkles size={14} />
            <span>Kitchen Live Dispatch</span>
          </div>
          
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
            fontWeight: 500,
            color: 'var(--cream)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '0.6rem',
          }}>
            Track Your Order
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '520px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}>
            Enter the Order ID from your receipt or digital checkout to view live preparation progress from our kitchen.
          </p>

          {/* Search Form */}
          <form onSubmit={searchOrder} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '460px',
            margin: '0 auto',
            background: '#FFFFFF',
            border: '1.5px solid var(--border)',
            borderRadius: '50px',
            padding: '0.35rem 0.45rem 0.35rem 1.4rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}>
            <input 
              type="text" 
              placeholder="Enter Order ID (e.g. 10024)" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-sans)',
                color: 'var(--cream)',
                background: 'transparent',
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="btn-ed-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.82rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <span>{loading ? 'Searching...' : 'Track'}</span>
              <span className="btn-ed-icon">
                <Search size={14} />
              </span>
            </button>
          </form>
        </motion.div>

        {/* ── RESULTS OR EMPTY HELPER STATE ── */}
        <AnimatePresence mode="wait">
          {order ? (
            <motion.div 
              key={order._id || order.orderNumber}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 15px 45px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Header Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--border-2)',
                paddingBottom: '1.5rem',
                marginBottom: '2rem',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--cream)' }}>
                      Order #{order.orderNumber}
                    </h2>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                      background: 'rgba(217, 119, 54, 0.1)',
                      border: '1px solid rgba(217, 119, 54, 0.25)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                    }}>
                      {order.type || 'Dine-in'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                    <Clock size={13} />
                    Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {order.customerName && <span>· Customer: <strong>{order.customerName}</strong></span>}
                    {order.table?.number && <span>· Table: <strong>#{order.table.number}</strong></span>}
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  textAlign: 'right',
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                    Current Status
                  </span>
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    color: order.status === 'ready' || order.status === 'served' ? '#16A34A' : 'var(--gold)',
                  }}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}>
                {STATUS_STEPS.map((step, index) => {
                  const isDone = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div 
                      key={step.id} 
                      style={{
                        padding: '1.25rem 1rem',
                        borderRadius: '12px',
                        background: isCurrent ? 'rgba(217, 119, 54, 0.08)' : isDone ? '#FAF8F5' : '#FFFFFF',
                        border: isCurrent ? '1.5px solid var(--gold)' : isDone ? '1px solid rgba(217, 119, 54, 0.2)' : '1px solid var(--border)',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: isDone ? 'var(--gold)' : 'var(--bg-2)',
                        color: isDone ? '#FFFFFF' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.6rem',
                        boxShadow: isCurrent ? '0 0 16px var(--gold-glow)' : 'none',
                      }}>
                        <Icon size={18} />
                      </div>
                      <h4 style={{
                        fontSize: '0.88rem',
                        fontWeight: isDone ? 600 : 500,
                        color: isDone ? 'var(--cream)' : 'var(--text-muted)',
                        marginBottom: '0.2rem',
                      }}>
                        {step.label}
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Order Items Box */}
              <div style={{
                background: 'var(--bg)',
                borderRadius: '14px',
                padding: '1.5rem',
                border: '1px solid var(--border)',
              }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--cream)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <Utensils size={15} color="var(--gold)" />
                  Items in this Order
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.88rem',
                      paddingBottom: '0.6rem',
                      borderBottom: '1px solid var(--border-2)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          background: '#FFFFFF',
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--gold)',
                        }}>
                          {item.quantity}×
                        </span>
                        <span style={{ color: 'var(--cream)', fontWeight: 500 }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--cream)' }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.5rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--cream)',
                  }}>
                    <span>Total Bill</span>
                    <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}>
                      ₹{order.total}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '3rem 2rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(217, 119, 54, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: 'var(--terracotta)',
                fontSize: '1.75rem',
              }}>
                <UtensilsCrossed size={32} color="var(--terracotta)" />
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--cream)',
                marginBottom: '0.6rem',
              }}>
                {hasSearched ? 'No Order Found' : 'How Live Order Tracking Works'}
              </h3>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                maxWidth: '460px',
                margin: '0 auto 2rem',
                lineHeight: 1.6,
              }}>
                {hasSearched 
                  ? 'Double-check the Order ID provided when you placed your order or ask the service staff.'
                  : 'Whenever you order via our digital menu or at your table, you receive a 5-digit Order ID. Simply type it above to monitor every stage.'
                }
              </p>

              {/* 3 Step Guide */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem',
                textAlign: 'left',
                borderTop: '1px solid var(--border-2)',
                paddingTop: '2rem',
              }}>
                {[
                  { step: '01', title: 'Place Your Order', desc: 'Browse the menu and order online or through our staff.' },
                  { step: '02', title: 'Watch Preparation', desc: 'Real-time updates as your dosa roasts and filter kaapi brews.' },
                  { step: '03', title: 'Piping Hot Service', desc: 'Get alerted immediately when your meal is served.' },
                ].map((s) => (
                  <div key={s.step} style={{ padding: '0.5rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      display: 'block',
                      marginBottom: '0.2rem',
                    }}>
                      {s.step}
                    </span>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '0.25rem' }}>
                      {s.title}
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <Link to="/menu" className="btn-ed-ghost" style={{ textDecoration: 'none' }}>
                  Explore Menu & Order Now →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
