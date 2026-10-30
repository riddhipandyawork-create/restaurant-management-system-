import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, Mail, Phone, Clock, UserCog, User, Briefcase } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ROLE_STYLES = { 
  admin: { background: 'var(--terracotta-bg)', color: 'var(--terracotta)', border: '1px solid rgba(181, 84, 58, 0.35)' }, 
  manager: { background: 'var(--olive-bg)', color: 'var(--olive-light)', border: '1px solid var(--olive-border)' }, 
  cashier: { background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(212, 139, 56, 0.3)' }, 
  waiter: { background: 'rgba(131, 151, 114, 0.15)', color: 'var(--olive)', border: '1px solid rgba(131, 151, 114, 0.3)' }, 
  kitchen: { background: 'rgba(200, 100, 74, 0.15)', color: 'var(--terracotta-light)', border: '1px solid rgba(200, 100, 74, 0.3)' } 
};
const ROLE_LABELS = { admin: 'Admin', manager: 'Manager', cashier: 'Cashier', waiter: 'Waiter', kitchen: 'Kitchen' };

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'waiter', phone: '', isActive: true });
  const [search, setSearch] = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/staff'); setStaff(data); }
    catch { toast.error('Failed to load staff'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const openAdd = () => { setEditStaff(null); setForm({ name: '', email: '', password: '', role: 'waiter', phone: '', isActive: true }); setShowModal(true); };
  const openEdit = (s) => { setEditStaff(s); setForm({ name: s.name, email: s.email, password: '', role: s.role, phone: s.phone || '', isActive: s.isActive }); setShowModal(true); };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (editStaff && !payload.password) delete payload.password;
      if (editStaff) { await api.put(`/staff/${editStaff._id}`, payload); toast.success('Staff updated successfully'); }
      else { await api.post('/staff', payload); toast.success('Staff added successfully'); }
      setShowModal(false); fetchStaff();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving staff'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try { await api.delete(`/staff/${id}`); toast.success('Staff removed'); fetchStaff(); }
    catch { toast.error('Failed to remove staff'); }
  };

  const filteredStaff = staff.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.role?.toLowerCase().includes(search.toLowerCase())
  );

  const roleCounts = staff.reduce((acc, s) => { acc[s.role] = (acc[s.role] || 0) + 1; return acc; }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Staff Directory</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage roles, permissions, and accounts.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      {/* Role Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <div key={role} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <UserCog size={20} />
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>{roleCounts[role] || 0}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}s</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search by name, email, or role..." 
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      {/* Staff Table */}
      <div className="card" style={{ overflow: 'hidden', minHeight: '400px', position: 'relative' }}>
        {loading ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
            <div style={{ width: '32px', height: '32px', border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filteredStaff.length === 0 ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <UserCog size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No staff found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Employee</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Contact</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Role</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Last Login</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 800, 
                          fontSize: '0.85rem', 
                          background: ROLE_STYLES[s.role]?.background || 'rgba(255,255,255,0.05)', 
                          color: ROLE_STYLES[s.role]?.color || 'var(--accent)',
                          border: ROLE_STYLES[s.role]?.border || '1px solid rgba(255,255,255,0.1)' 
                        }}>
                          {s.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.2rem' }}>ID: {s._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}><Mail size={14}/> {s.email}</div>
                        {s.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}><Phone size={14}/> {s.phone}</div>}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', ...(ROLE_STYLES[s.role] || {}) }}>
                        {ROLE_LABELS[s.role]}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.isActive ? 'var(--olive)' : 'var(--danger)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{s.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} />
                        {s.lastLogin ? new Date(s.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(s)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(s._id)} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal" style={{ position: 'relative', zIndex: 10001, display: 'flex', flexDirection: 'column', maxWidth: '500px' }}
            >
              <div className="modal-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {editStaff ? <Edit2 size={18} color="var(--accent)"/> : <UserCog size={18} color="var(--accent)"/>}
                  {editStaff ? 'Edit Staff Member' : 'Add New Staff'}
                </h3>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ padding: '0.4rem' }}>
                  <X size={16} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name *</label>
                    <input 
                      type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Email *</label>
                    <input 
                      type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                      placeholder="e.g. john@22ndparallel.com"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone</label>
                    <input 
                      type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                      placeholder="+91..."
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Role *</label>
                    <select 
                      value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                    >
                      {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v} style={{ background: '#1a1a24' }}>{l}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Password {editStaff ? '(Leave blank to keep)' : '*'}</label>
                    <input 
                      type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', color: 'var(--text-primary)', width: '100%' }}
                      placeholder={editStaff ? "••••••••" : "Secure password"}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Account Status</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active accounts can log in</p>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn btn-primary">
                  <Check size={16} /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
