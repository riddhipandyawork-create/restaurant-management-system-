import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Utensils, Trash2, Plus, Minus, Search, Tag } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

import CategoryIcon from '../../components/CategoryIcon';

export default function POS() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
  
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine-in');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/menu/categories'),
      api.get('/menu'),
      api.get('/tables')
    ]).then(([catRes, itemRes, tableRes]) => {
      setCategories(catRes.data);
      setItems(itemRes.data.filter(i => i.isAvailable));
      setTables(tableRes.data.filter(t => t.status !== 'occupied'));
    }).catch(() => toast.error('Failed to load menu'));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCat = activeCat === 'all' || item.category?._id === activeCat;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, activeCat, search]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem === item._id);
      if (existing) {
        return prev.map(i => i.menuItem === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItem: item._id, name: item.name, price: item.price, quantity: 1, isSpecial: item.isSpecial }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.menuItem === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const { subtotal, tax, total } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const t = sub * 0.05; // 5% GST
    return { subtotal: sub, tax: t, total: sub + t };
  }, [cart]);

  const placeOrder = async () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    if (orderType === 'dine-in' && !selectedTable) return toast.error('Please select a table');

    setIsSubmitting(true);
    try {
      await api.post('/orders', {
        items: cart,
        type: orderType,
        table: orderType === 'dine-in' ? selectedTable : undefined,
        customerName: customerName.trim(),
        subtotal, tax, total
      });
      toast.success('Order placed successfully!');
      setCart([]);
      setCustomerName('');
      setSelectedTable('');
      
      const tableRes = await api.get('/tables');
      setTables(tableRes.data.filter(t => t.status !== 'occupied'));
      
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', gap: '1.5rem', height: '100vh', padding: '2rem', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>New Order</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tap items to add them to the order</p>
          </div>
          
          <div style={{ position: 'relative', width: '300px', flexShrink: 0 }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" placeholder="Search menu..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none', marginBottom: '0.5rem', flexShrink: 0 }}>
          <button 
            onClick={() => setActiveCat('all')}
            className="btn"
            style={{ background: activeCat === 'all' ? 'var(--accent)' : 'var(--bg-card)', color: activeCat === 'all' ? '#FAF7F2' : 'var(--text-secondary)', borderColor: activeCat === 'all' ? 'transparent' : 'var(--border)' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.5rem' }}>
              <Utensils size={14} />
            </span>
            All Items
          </button>
          {categories.map(c => (
            <button 
              key={c._id} onClick={() => setActiveCat(c._id)}
              className="btn"
              style={{ background: activeCat === c._id ? 'var(--accent)' : 'var(--bg-card)', color: activeCat === c._id ? '#FAF7F2' : 'var(--text-secondary)', borderColor: activeCat === c._id ? 'transparent' : 'var(--border)', whiteSpace: 'nowrap' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.5rem' }}>
                <CategoryIcon slug={c.slug} size={14} />
              </span>
              {c.name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', minHeight: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div 
                  key={item._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={() => addToCart(item)}
                  className="card"
                  style={{ padding: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s', border: '1px solid var(--border)' }}
                  whileHover={{ borderColor: 'var(--accent)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'var(--terracotta-bg)', border: '1px solid rgba(181, 84, 58, 0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--terracotta)'
                    }}>
                      <CategoryIcon slug={item.category?.slug} size={18} />
                    </div>
                    {item.isSpecial && <Tag size={14} color="var(--accent)" />}
                  </div>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{item.name}</h4>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>₹{item.price}</p>
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '100px', padding: '0.2rem', color: 'var(--text-muted)' }}>
                      <Plus size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredItems.length === 0 && (
            <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Utensils size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No items found</p>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ width: '380px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={18} color="var(--accent)" /> Current Order
          </h3>
        </div>

        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius)' }}>
            {['dine-in', 'takeaway'].map(type => (
              <button 
                key={type} onClick={() => setOrderType(type)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s', ...(orderType === type ? { background: 'var(--accent)', color: '#FAF7F2' } : { background: 'transparent', color: 'var(--text-muted)' }) }}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>

          {orderType === 'dine-in' && (
            <select 
              value={selectedTable} onChange={e => setSelectedTable(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="">Select Table *</option>
              {tables.map(t => (
                <option key={t._id} value={t._id} style={{ background: '#2A1713' }}>
                  {t.label || `Table ${t.number}`} (Capacity: {t.capacity})
                </option>
              ))}
            </select>
          )}

          <input 
            type="text" placeholder="Customer Name (Optional)" 
            value={customerName} onChange={e => setCustomerName(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cart.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <ShoppingCart size={40} style={{ opacity: 0.15, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Cart is empty</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Add items from the menu</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.menuItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.2rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
                  <button onClick={() => updateQuantity(item.menuItem, -1)} className="btn btn-ghost" style={{ padding: '0.2rem', minWidth: 'auto', height: 'auto', borderRadius: '50%' }}>
                    {item.quantity === 1 ? <Trash2 size={14} color="var(--danger)" /> : <Minus size={14} />}
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '1.2rem', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItem, 1)} className="btn btn-ghost" style={{ padding: '0.2rem', minWidth: 'auto', height: 'auto', borderRadius: '50%' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Taxes (5%)</span><span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
              <span>Total</span><span style={{ color: 'var(--accent)' }}>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={placeOrder} 
            disabled={cart.length === 0 || isSubmitting}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center' }}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
