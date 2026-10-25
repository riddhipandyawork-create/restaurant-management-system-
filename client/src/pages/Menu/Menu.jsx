import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Check, X, Utensils, IndianRupee, Tag, Info, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import CategoryIcon from '../../components/CategoryIcon';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', weight: '', category: '', isSpecial: false, isAvailable: true, tags: { isVegan: false, isGlutenFree: false, isJain: false, isSwaminarayan: false } });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, itemRes] = await Promise.all([api.get('/menu/categories'), api.get('/menu')]);
      setCategories(catRes.data);
      setItems(itemRes.data);
    } catch { toast.error('Failed to load menu'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = items.filter(item => {
    const matchCat = activeCat === 'all' || item.category?._id === activeCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => { setEditItem(null); setForm({ name: '', description: '', price: '', weight: '', category: categories[0]?._id || '', isSpecial: false, isAvailable: true, tags: { isVegan: false, isGlutenFree: false, isJain: false, isSwaminarayan: false } }); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, description: item.description || '', price: item.price, weight: item.weight || '', category: item.category?._id || '', isSpecial: item.isSpecial, isAvailable: item.isAvailable, tags: item.tags || {} }); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/menu/${editItem._id}`, form);
        toast.success('Item updated successfully');
      } else {
        await api.post('/menu', form);
        toast.success('Item added successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving item'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try { await api.delete(`/menu/${id}`); toast.success('Item deleted'); fetchData(); }
    catch { toast.error('Failed to delete item'); }
  };

  const handleToggle = async (id) => {
    try { await api.patch(`/menu/${id}/toggle`); fetchData(); }
    catch { toast.error('Toggle failed'); }
  };

  const setTag = (tag) => setForm(f => ({ ...f, tags: { ...f.tags, [tag]: !f.tags[tag] } }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Menu Editor</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage categories, items, and pricing.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        <button 
          onClick={() => setActiveCat('all')}
          className="btn"
          style={{ 
            background: activeCat === 'all' ? 'var(--accent)' : 'var(--bg-card)', 
            color: activeCat === 'all' ? '#FAF7F2' : 'var(--text-secondary)',
            borderColor: activeCat === 'all' ? 'transparent' : 'var(--border)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.5rem' }}>
            <Utensils size={14} />
          </span>
          All Items ({items.length})
        </button>
        {categories.map(c => (
          <button 
            key={c._id} 
            onClick={() => setActiveCat(c._id)}
            className="btn"
            style={{ 
              background: activeCat === c._id ? 'var(--accent)' : 'var(--bg-card)', 
              color: activeCat === c._id ? '#FAF7F2' : 'var(--text-secondary)',
              borderColor: activeCat === c._id ? 'transparent' : 'var(--border)'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.5rem' }}>
              <CategoryIcon slug={c.slug} size={14} />
            </span>
            {c.name} ({items.filter(i => i.category?._id === c._id).length})
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" placeholder="Search menu items..." 
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ 
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', 
            borderRadius: 'var(--radius)', padding: '0.6rem 1rem 0.6rem 2.5rem', 
            color: 'var(--text-primary)', outline: 'none'
          }}
        />
      </div>

      {loading ? (
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ width: '32px', height: '32px', border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          <Utensils size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No items found</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <AnimatePresence>
            {filtered.map(item => (
              <motion.div 
                key={item._id} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card"
                style={{ 
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  opacity: item.isAvailable ? 1 : 0.5,
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px',
                      background: 'var(--terracotta-bg)', border: '1px solid rgba(181, 84, 58, 0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--terracotta)'
                    }}>
                      <CategoryIcon slug={item.category?.slug} size={20} />
                    </div>
                    {item.isSpecial && (
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, background: 'var(--terracotta-bg)', color: 'var(--terracotta)', border: '1px solid rgba(181, 84, 58, 0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Special</span>
                    )}
                  </div>
                  
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {item.tags?.isVegan && <span style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, background: 'var(--olive-bg)', color: 'var(--olive)', border: '1px solid var(--olive-border)' }}>Vegan</span>}
                    {item.tags?.isGlutenFree && <span style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, background: 'var(--terracotta-bg)', color: 'var(--terracotta)', border: '1px solid rgba(181, 84, 58, 0.3)' }}>GF</span>}
                    {item.tags?.isJain && <span style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(212, 139, 56, 0.3)' }}>Jain</span>}
                    {item.tags?.isSwaminarayan && <span style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(197, 67, 43, 0.15)', color: '#C5432B', border: '1px solid rgba(197, 67, 43, 0.3)' }}>Swami</span>}
                  </div>

                  <div>
                    <p style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--accent)' }}>₹{item.price}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.weight || '1 portion'}</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border)', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={item.isAvailable} onChange={() => handleToggle(item._id)} style={{ marginRight: '0.5rem', accentColor: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available</span>
                  </label>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(item)} className="btn btn-ghost" style={{ padding: '0.4rem' }} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--danger)' }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Menu Item Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal" style={{ position: 'relative', zIndex: 10001, display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {editItem ? <Edit2 size={18} color="var(--accent)"/> : <Utensils size={18} color="var(--accent)"/>}
                  {editItem ? 'Edit Menu Item' : 'Add New Item'}
                </h3>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ padding: '0.4rem' }}>
                  <X size={16} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Name *</label>
                    <input 
                      type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category *</label>
                    <select 
                      value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                    >
                      {categories.map(c => <option key={c._id} value={c._id} style={{ background: '#1a1a24' }}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Description</label>
                    <textarea 
                      rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%', resize: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Price (₹) *</label>
                    <input 
                      type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Weight / Volume</label>
                    <input 
                      type="text" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                      placeholder="e.g. 200 gms"
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Dietary & Tags</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {[
                      { key: 'isVegan', label: '🌱 Vegan' },
                      { key: 'isGlutenFree', label: '🚫 Gluten Free' },
                      { key: 'isJain', label: '🕉️ Jain' },
                      { key: 'isSwaminarayan', label: '🙏 Swaminarayan' }
                    ].map(tag => (
                      <label key={tag.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.tags[tag.key] || false} onChange={() => setTag(tag.key)} style={{ accentColor: 'var(--accent)' }} />
                        {tag.label}
                      </label>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }}>
                      <input type="checkbox" checked={form.isSpecial} onChange={() => setForm(f => ({ ...f, isSpecial: !f.isSpecial }))} style={{ accentColor: 'var(--accent)' }} />
                      ✨ Chef's Special
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn btn-primary">
                  <Check size={16} /> Save Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
