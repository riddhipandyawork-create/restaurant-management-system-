import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Printer, Download, CreditCard, Banknote, IndianRupee, QrCode, ShieldCheck, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Billing() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showBill, setShowBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [served, billed] = await Promise.all([
        api.get('/orders', { params: { status: 'served' } }),
        api.get('/orders', { params: { status: 'billed' } }),
      ]);
      setOrders([...served.data, ...billed.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { toast.error('Failed to load billing'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const processPayment = async (order) => {
    setIsProcessing(true);
    try {
      // Create payment record and update order status via API
      await api.post('/payments', {
        order: order._id,
        amount: order.total,
        method: paymentMethod,
        status: 'completed'
      });
      toast.success('Payment successfully processed!');
      fetchOrders();
      setShowBill(null);
    } catch (err) {
      toast.error('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Invoice ${showBill.orderNumber}</title>
      <style>body{font-family:monospace;padding:20px;max-width:400px;margin:0 auto}h2{text-align:center}table{width:100%}td{padding:4px 0}hr{border:1px dashed #999}.total{font-weight:bold;font-size:1.1em}</style></head>
      <body>
        <h2>22ND PARALLEL</h2>
        <p style="text-align:center;color:#666">Jetalpur Road, Anand</p>
        <hr/>
        <p>Order: <strong>${showBill.orderNumber}</strong></p>
        <p>Date: ${new Date(showBill.createdAt).toLocaleString('en-IN')}</p>
        <p>Type: ${showBill.type} ${showBill.table ? `| Table T-${String(showBill.table.number).padStart(2,'0')}` : ''}</p>
        <hr/>
        <table>
          <tr><th style="text-align:left">Item</th><th>Qty</th><th style="text-align:right">Amt</th></tr>
          ${showBill.items?.map(i => `<tr><td>${i.name}</td><td style="text-align:center">×${i.quantity}</td><td style="text-align:right">₹${(i.price * i.quantity).toFixed(2)}</td></tr>`).join('')}
        </table>
        <hr/>
        <table>
          <tr><td>Subtotal</td><td style="text-align:right">₹${showBill.subtotal?.toFixed(2)}</td></tr>
          <tr><td>GST (5%)</td><td style="text-align:right">₹${showBill.tax?.toFixed(2)}</td></tr>
          <tr class="total"><td><strong>TOTAL</strong></td><td style="text-align:right"><strong>₹${showBill.total?.toFixed(2)}</strong></td></tr>
        </table>
        <hr/>
        <p style="text-align:center;margin-top:16px">Nothing Artificial | Nothing Frozen</p>
        <p style="text-align:center;color:#666;font-size:0.85em">Thank you for dining with us!</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const filtered = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', height: '100%', minHeight: 0, paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Billing & Payments</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage invoices and process payments.</p>
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by order # or customer..." 
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
        {loading ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
            <div style={{ width: '32px', height: '32px', border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            <IndianRupee size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No pending bills</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Served orders will appear here for billing.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Order #</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Customer</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Details</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Items</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Subtotal</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((order) => (
                    <motion.tr 
                      key={order._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                      onClick={() => setShowBill(order)}
                    >
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--accent)' }}>#{order.orderNumber.slice(-6)}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{order.customerName || '—'}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ textTransform: 'capitalize' }}>{order.type}</span>
                          {order.table && <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '100px' }}>{order.table.label || `T-${order.table.number}`}</span>}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{order.items?.length}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>₹{order.subtotal?.toFixed(2)}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-primary)' }}>₹{order.total?.toFixed(2)}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                          ...(order.status === 'billed' 
                            ? { background: 'var(--olive-bg)', color: 'var(--olive)', border: '1px solid var(--olive-border)' }
                            : { background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(212, 139, 56, 0.3)' })
                        }}>
                          {order.status === 'billed' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                          {order.status === 'billed' ? <Printer size={16}/> : <IndianRupee size={16}/>}
                          {order.status === 'billed' ? 'Print' : 'Pay'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill & Payment Modal */}
      <AnimatePresence>
        {showBill && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBill(null)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal" style={{ position: 'relative', zIndex: 10001, display: 'flex', flexDirection: 'row', maxWidth: '900px', width: '90%', padding: 0, overflow: 'hidden' }}
            >
              
              {/* Receipt Area */}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--border)', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '350px', background: 'white', color: 'black', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '12px', background: 'radial-gradient(circle, white 4px, transparent 4px)', backgroundSize: '10px 10px', marginTop: '-6px' }} />
                  
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'serif', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>22ND PARALLEL</h3>
                    <p style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Nothing Artificial • Nothing Frozen</p>
                  </div>

                  <div style={{ borderTop: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db', padding: '0.75rem 0', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span>Order:</span><span style={{ fontWeight: 700 }}>#{showBill.orderNumber}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span>Date:</span><span>{new Date(showBill.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Type:</span><span style={{ textTransform: 'capitalize' }}>{showBill.type} {showBill.table && `(T-${showBill.table.number})`}</span></div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <span>Item</span>
                      <span>Total</span>
                    </div>
                    {showBill.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0' }}>
                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                          <p style={{ fontWeight: 700 }}>{item.name}</p>
                          <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>{item.quantity} x ₹{item.price}</p>
                        </div>
                        <span style={{ fontWeight: 700, paddingTop: '0.1rem' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}><span>Subtotal</span><span>₹{showBill.subtotal?.toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}><span>CGST (2.5%)</span><span>₹{(showBill.tax/2)?.toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}><span>SGST (2.5%)</span><span>₹{(showBill.tax/2)?.toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #d1d5db' }}>
                      <span>TOTAL</span>
                      <span>₹{showBill.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
                    <p>GSTIN: 24XXXXXXX1Z5</p>
                    <p style={{ marginTop: '0.25rem' }}>Thank you for dining with us!</p>
                  </div>

                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '12px', background: 'radial-gradient(circle, white 4px, transparent 4px)', backgroundSize: '10px 10px', marginBottom: '-6px', transform: 'rotate(180deg)' }} />
                </div>
              </div>

              {/* Payment Processing Area */}
              <div style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Checkout</h3>
                    <button onClick={() => setShowBill(null)} className="btn btn-ghost" style={{ padding: '0.4rem' }}>
                      <X size={20} />
                    </button>
                  </div>

                  {showBill.status === 'billed' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--olive-bg)', color: 'var(--olive)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid var(--olive-border)' }}>
                        <ShieldCheck size={32} />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--olive-light)', marginBottom: '0.5rem' }}>Payment Completed</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>This order has already been settled.</p>
                      <button onClick={handlePrint} className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', justifyContent: 'center' }}>
                        <Printer size={16} /> Print Receipt
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ background: 'var(--terracotta-bg)', border: '1px solid rgba(181, 84, 58, 0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Amount Due</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-1px' }}>₹{showBill.total?.toFixed(2)}</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Payment Method</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <button 
                            onClick={() => setPaymentMethod('card')}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderRadius: '12px', border: '1px solid', transition: 'all 0.2s', ...(paymentMethod === 'card' ? { background: 'var(--terracotta-bg)', borderColor: 'var(--accent)', color: 'var(--accent)' } : { background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-muted)' }) }}
                          >
                            <CreditCard size={24} style={{ marginBottom: '0.5rem' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Credit Card</span>
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('upi')}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderRadius: '12px', border: '1px solid', transition: 'all 0.2s', ...(paymentMethod === 'upi' ? { background: 'var(--terracotta-bg)', borderColor: 'var(--accent)', color: 'var(--accent)' } : { background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-muted)' }) }}
                          >
                            <QrCode size={24} style={{ marginBottom: '0.5rem' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>UPI / QR</span>
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('cash')}
                            style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderRadius: '12px', border: '1px solid', transition: 'all 0.2s', ...(paymentMethod === 'cash' ? { background: 'var(--terracotta-bg)', borderColor: 'var(--accent)', color: 'var(--accent)' } : { background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-muted)' }) }}
                          >
                            <Banknote size={24} style={{ marginBottom: '0.5rem' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Cash</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {showBill.status !== 'billed' && (
                  <button 
                    onClick={() => processPayment(showBill)}
                    disabled={isProcessing}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1rem', justifyContent: 'center' }}
                  >
                    {isProcessing ? 'Processing...' : 'Process Payment'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
