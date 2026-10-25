import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, CheckCircle2, AlertCircle, Clock, SprayCan, X, Map, Users } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { 
  available: { bg: 'var(--olive-bg)', color: 'var(--olive)', border: 'var(--olive-border)', shadow: '0 0 15px rgba(111,127,95,0.2)' },
  occupied: { bg: 'var(--terracotta-bg)', color: 'var(--terracotta)', border: 'rgba(181, 84, 58, 0.4)', shadow: '0 0 15px rgba(181,84,58,0.25)' },
  reserved: { bg: 'var(--warning-bg)', color: 'var(--warning)', border: 'rgba(212, 139, 56, 0.35)', shadow: '0 0 15px rgba(212,139,56,0.2)' },
  cleaning: { bg: 'rgba(90, 46, 37, 0.25)', color: 'var(--limestone)', border: 'rgba(90, 46, 37, 0.45)', shadow: '0 0 15px rgba(90,46,37,0.2)' } 
};

const getStatusIcon = (status, size = 20) => {
  switch (status) {
    case 'available': return <CheckCircle2 size={size} />;
    case 'occupied': return <AlertCircle size={size} />;
    case 'reserved': return <Clock size={size} />;
    case 'cleaning': return <SprayCan size={size} />;
    default: return <AlertCircle size={size} />;
  }
};

const STATUS_OPTIONS = ['available', 'occupied', 'reserved', 'cleaning'];

const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', marginTop: '0.4rem', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ number: '', label: '', capacity: 4, location: 'indoor' });

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/tables'); setTables(data); }
    catch { toast.error('Failed to load tables'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  const updateStatus = async (tableId, status) => {
    try {
      await api.patch(`/tables/${tableId}/status`, { status });
      toast.success(`Table marked as ${status}`);
      fetchTables();
      setShowModal(false);
    } catch { toast.error('Update failed'); }
  };

  const addTable = async () => {
    try {
      await api.post('/tables', { ...form, label: form.label || `T-${String(form.number).padStart(2, '0')}` });
      toast.success('Table added successfully');
      setShowAddModal(false);
      fetchTables();
    } catch (err) { toast.error(err.response?.data?.message || 'Error adding table'); }
  };

  const stats = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  };

  return (
    <div className="page-content" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={24} color="var(--accent)"/> Table Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Manage dining areas and table occupancy.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}>
          <Plus size={18} /> Add Table
        </button>
      </div>

      {/* Status Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px solid ${STATUS_COLORS[key].border}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: STATUS_COLORS[key].bg, color: STATUS_COLORS[key].color, border: `1px solid ${STATUS_COLORS[key].border}` }}>
              {getStatusIcon(key)}
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: STATUS_COLORS[key].color }}>{val}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: '0.25rem' }}>{key}</p>
          </div>
        ))}
      </div>

      {/* Interactive Floor Map */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Floor Map</h3>
        
        {loading ? (
          <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ position: 'relative', height: '600px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {/* Legend */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STATUS_OPTIONS.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1px solid ${STATUS_COLORS[s].border}`, background: STATUS_COLORS[s].bg }} />
                  {s}
                </div>
              ))}
            </div>

            {/* Tables */}
            {tables.map((table, i) => (
              <div
                key={table._id}
                onClick={() => { setSelectedTable(table); setShowModal(true); }}
                style={{
                  position: 'absolute', width: '120px', height: '100px', borderRadius: '16px', border: `2px solid ${STATUS_COLORS[table.status].color}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: STATUS_COLORS[table.status].bg, color: STATUS_COLORS[table.status].color, boxShadow: STATUS_COLORS[table.status].shadow,
                  left: table.posX || (((i) % 5) * 160 + 60),
                  top: table.posY || (Math.floor((i) / 5) * 140 + 60),
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ position: 'absolute', top: '8px', right: '8px', opacity: 0.5 }}>{getStatusIcon(table.status, 16)}</div>
                <h4 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{table.label}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.85 }}>
                  <Users size={13} style={{ opacity: 0.85 }} /> {table.capacity}
                </div>
                {table.currentOrder && (
                  <div style={{ marginTop: '0.5rem', background: 'var(--bg-elevated)', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '100px', fontWeight: 800, border: '1px solid currentColor' }}>
                    #{table.currentOrder.orderNumber?.slice(-4) || 'ORD'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table List View */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Table Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Capacity</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Location</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Order</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{t.label}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{t.capacity} Seats</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{t.location}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: STATUS_COLORS[t.status].bg, color: STATUS_COLORS[t.status].color, border: `1px solid ${STATUS_COLORS[t.status].border}` }}>
                      {getStatusIcon(t.status, 12)}
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {t.currentOrder ? `#${t.currentOrder.orderNumber}` : '—'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button onClick={() => { setSelectedTable(t); setShowModal(true); }} className="btn btn-ghost btn-icon" style={{ color: 'var(--text-secondary)' }}>
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Status Modal */}
      {showModal && selectedTable && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>
            
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                {selectedTable.label}
              </h3>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-icon" style={{ background: 'transparent' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem', background: 'var(--bg-base)', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Current Status</p>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: STATUS_COLORS[selectedTable.status].bg, color: STATUS_COLORS[selectedTable.status].color, border: `1px solid ${STATUS_COLORS[selectedTable.status].border}` }}>
                  {getStatusIcon(selectedTable.status, 16)}
                  <span style={{ textTransform: 'capitalize' }}>{selectedTable.status}</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Change status to:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {STATUS_OPTIONS.filter(s => s !== selectedTable.status).map(s => (
                    <button 
                      key={s} onClick={() => updateStatus(selectedTable._id, s)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${STATUS_COLORS[s].border}`, background: STATUS_COLORS[s].bg, color: STATUS_COLORS[s].color, cursor: 'pointer', transition: 'var(--transition)' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {getStatusIcon(s, 24)}
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '0.5rem', textTransform: 'capitalize' }}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>
            
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>Add New Table</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-icon" style={{ background: 'transparent' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Table Number *</label>
                <input type="number" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Label (Optional)</label>
                <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} style={inputStyle} placeholder="e.g. T-21" />
              </div>
              <div>
                <label style={labelStyle}>Capacity (Seats)</label>
                <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={{ ...inputStyle, textTransform: 'capitalize' }}>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="terrace">Terrace</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
              <button onClick={() => setShowAddModal(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }}>Cancel</button>
              <button onClick={addTable} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
