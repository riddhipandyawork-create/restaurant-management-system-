import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Check, X, Calendar as CalendarIcon, Clock, Users, Phone, Mail, MapPin, Tag } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { 
  pending: { bg: 'var(--warning-bg)', color: 'var(--warning)', border: 'rgba(212, 139, 56, 0.25)' },
  confirmed: { bg: 'var(--olive-bg)', color: 'var(--olive-light)', border: 'var(--olive-border)' },
  seated: { bg: 'var(--olive-bg)', color: 'var(--olive)', border: 'var(--olive-border)' },
  completed: { bg: 'var(--terracotta-bg)', color: 'var(--terracotta)', border: 'rgba(181, 84, 58, 0.3)' },
  cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger)', border: 'rgba(197, 67, 43, 0.25)' },
  'no-show': { bg: 'rgba(158, 136, 126, 0.12)', color: 'var(--text-muted)', border: 'rgba(158, 136, 126, 0.25)' }
};

const TIME_SLOTS = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
const OCCASIONS = ['birthday','anniversary','business','other'];

const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', marginTop: '0.4rem', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRes, setEditRes] = useState(null);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', date: '', time: '19:00', guestCount: 2, table: '', notes: '', occasion: '' });
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rRes, tRes] = await Promise.all([api.get('/reservations', { params: { date: dateFilter } }), api.get('/tables')]);
      setReservations(rRes.data); setTables(tRes.data);
    } catch { toast.error('Failed to load reservations'); }
    finally { setLoading(false); }
  }, [dateFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditRes(null); setForm({ customerName: '', customerPhone: '', customerEmail: '', date: dateFilter, time: '19:00', guestCount: 2, table: '', notes: '', occasion: '' }); setShowModal(true); };
  const openEdit = (r) => { setEditRes(r); setForm({ customerName: r.customerName, customerPhone: r.customerPhone, customerEmail: r.customerEmail || '', date: r.date?.split('T')[0] || '', time: r.time, guestCount: r.guestCount, table: r.table?._id || '', notes: r.notes || '', occasion: r.occasion || '' }); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editRes) { await api.put(`/reservations/${editRes._id}`, form); toast.success('Reservation updated'); }
      else { await api.post('/reservations', form); toast.success('Reservation created'); }
      setShowModal(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving reservation'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this reservation?')) return;
    try { await api.delete(`/reservations/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/reservations/${id}`, { status }); toast.success(`Marked as ${status}`); fetchData(); }
    catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="page-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Table Reservations</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Manage bookings and waiting queues.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}>
          <Plus size={18} /> New Booking
        </button>
      </div>

      <div className="card" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem', marginBottom: '2rem' }}>
        <CalendarIcon color="var(--text-secondary)" size={20} />
        <input 
          type="date" 
          value={dateFilter} 
          onChange={e => setDateFilter(e.target.value)} 
          style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none', fontSize: '1rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}
        />
        <div style={{ padding: '0.25rem 0.75rem', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
          {reservations.length} Bookings
        </div>
      </div>

      <div className="card" style={{ minHeight: '400px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}><div className="spinner" /></div>
        ) : reservations.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
            <CalendarIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No reservations</p>
            <p style={{ fontSize: '0.85rem' }}>No bookings scheduled for {new Date(dateFilter).toLocaleDateString('en-IN')}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Guest Details</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Date & Time</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Party Size</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Table / Occasion</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.25rem' }}>{r.customerName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={12}/> {r.customerPhone}</p>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{new Date(r.date).toLocaleDateString('en-IN')}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={12}/> {r.time}</p>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <Users size={14} color="var(--text-secondary)" />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.guestCount}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.table ? `Table T-${String(r.table.number).padStart(2,'0')}` : 'Unassigned'}</p>
                      {r.occasion && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Tag size={12}/> {r.occasion}</p>}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: STATUS_COLORS[r.status].bg, color: STATUS_COLORS[r.status].color, border: `1px solid ${STATUS_COLORS[r.status].border}` }}>
                        {r.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        {r.status === 'pending' && <button onClick={() => updateStatus(r._id, 'confirmed')} className="btn btn-ghost btn-icon" style={{ color: 'var(--info)' }} title="Confirm"><Check size={16}/></button>}
                        {r.status === 'confirmed' && <button onClick={() => updateStatus(r._id, 'seated')} className="btn btn-ghost btn-icon" style={{ color: 'var(--success)' }} title="Mark Seated"><Check size={16}/></button>}
                        <button onClick={() => openEdit(r)} className="btn btn-ghost btn-icon" style={{ color: 'var(--text-secondary)' }}><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(r._id)} className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>
            
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                {editRes ? <Edit2 size={20} color="var(--accent)"/> : <CalendarIcon size={20} color="var(--accent)"/>}
                {editRes ? 'Edit Reservation' : 'New Reservation'}
              </h3>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-icon" style={{ background: 'transparent' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Guest Name *</label>
                  <input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} style={inputStyle} placeholder="e.g. Rahul Sharma" />
                </div>
                
                <div>
                  <label style={labelStyle}><Phone size={14}/> Phone *</label>
                  <input type="tel" value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} style={inputStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}><Mail size={14}/> Email</label>
                  <input type="email" value={form.customerEmail} onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))} style={inputStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}><CalendarIcon size={14}/> Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}><Clock size={14}/> Time *</label>
                  <select value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={inputStyle}>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div>
                  <label style={labelStyle}><Users size={14}/> Guests</label>
                  <input type="number" min={1} value={form.guestCount} onChange={e => setForm(f => ({ ...f, guestCount: e.target.value }))} style={inputStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}><MapPin size={14}/> Table (Optional)</label>
                  <select value={form.table} onChange={e => setForm(f => ({ ...f, table: e.target.value }))} style={inputStyle}>
                    <option value="">Any available</option>
                    {tables.map(t => <option key={t._id} value={t._id}>{t.label} ({t.capacity} seats)</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}><Tag size={14}/> Occasion</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    <button onClick={() => setForm(f => ({...f, occasion: ''}))} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: !form.occasion ? 'var(--accent-glow)' : 'transparent', color: !form.occasion ? 'var(--accent)' : 'var(--text-secondary)', border: `1px solid ${!form.occasion ? 'var(--accent)' : 'var(--border)'}` }}>None</button>
                    {OCCASIONS.map(o => (
                      <button key={o} onClick={() => setForm(f => ({...f, occasion: o}))} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textTransform: 'capitalize', background: form.occasion === o ? 'var(--accent-glow)' : 'transparent', color: form.occasion === o ? 'var(--accent)' : 'var(--text-secondary)', border: `1px solid ${form.occasion === o ? 'var(--accent)' : 'var(--border)'}` }}>{o}</button>
                    ))}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Special Notes</label>
                  <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inputStyle, resize: 'none' }} placeholder="e.g. Window seat preferred, allergy constraints..." />
                </div>

              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
              <button onClick={() => setShowModal(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }}>Cancel</button>
              <button onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} /> Save Booking
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
