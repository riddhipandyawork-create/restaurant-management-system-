import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cart, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCartStore();

  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!tableNumber.trim()) {
      toast.error('Please enter your table number.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        type: 'dine-in',
        tableNumber: tableNumber.trim(),
        customerName: customerName.trim(),
        items: cart.map(i => {
          const isValidHex = typeof i.menuItem === 'string' && /^[0-9a-fA-F]{24}$/.test(i.menuItem);
          return {
            ...(isValidHex ? { menuItem: i.menuItem } : {}),
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          };
        }),
      };
      const res = await api.post('/orders', payload);
      toast.success(`Order #${res.data.orderNumber} placed! 🍽️`);
      clearCart();
      closeCart();
      setTableNumber('');
      setCustomerName('');
      navigate(`/track?order=${res.data.orderNumber}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-overlay">
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={closeCart} />

      {/* Panel */}
      <div className="cart-panel">

        {/* Header */}
        <div className="cart-header">
          <div>
            <div className="cart-title">
              <UtensilsCrossed size={18} />
              Your Order
            </div>
            {totalItems > 0 && (
              <div className="cart-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</div>
            )}
          </div>
          <button className="btn-icon" onClick={closeCart}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UtensilsCrossed size={42} color="var(--terracotta)" />
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>Your order is empty</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Browse the menu and add your favourites</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.menuItem} className="cart-item">
                <div className="cart-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UtensilsCrossed size={16} color="var(--terracotta)" />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price} each</div>
                  <div className="cart-qty">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gold-light)' }}>
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                  <button
                    onClick={() => removeItem(item.menuItem)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem', padding: '0.2rem' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-footer">

            {/* Dine-in form */}
            <div className="cart-form">
              {/* Dine-In badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1rem', marginBottom: '1rem',
                background: 'rgba(217,119,54,0.08)',
                border: '1px solid rgba(217,119,54,0.2)',
                borderRadius: '4px',
              }}>
                <UtensilsCrossed size={14} style={{ color: 'var(--gold)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Dine-In Order
                </span>
              </div>

              {/* Table Number */}
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Table Number *
                </label>
                <input
                  className="form-input"
                  placeholder="e.g. 5"
                  type="number"
                  min="1"
                  max="50"
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Customer Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Your Name *
                </label>
                <input
                  className="form-input"
                  placeholder="Your name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Totals */}
            <div className="cart-totals">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-total-row">
                <span>GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="cart-total-row final">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem' }}
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing order…' : (
                <>Place Dine-In Order <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
