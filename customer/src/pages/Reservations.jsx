import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, Users, User, Phone, Mail, Star, Check, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TIME_SLOTS = ['11:00','12:00','13:00','14:00','15:00','18:00','19:00','20:00','21:00','22:00'];
const OCCASIONS = ['', 'birthday', 'anniversary', 'business', 'other'];
const OCCASION_LABELS = { '': 'No special occasion', birthday: '🎂 Birthday', anniversary: '💑 Anniversary', business: '💼 Business', other: '🎉 Other' };

export default function Reservations() {
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', date: '', time: '19:00', guestCount: 2, occasion: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // For queue tracking
  const [phoneSearch, setPhoneSearch] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [tracking, setTracking] = useState(false);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/reservations', form);
      setSuccess(true);
      toast.success('Table booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book table');
    } finally {
      setLoading(false);
    }
  };

  const trackReservation = async (e) => {
    e.preventDefault();
    if (!phoneSearch) return;
    setTracking(true);
    try {
      const { data } = await api.get(`/reservations?phone=${phoneSearch}`);
      const activeRes = data.find(r => ['pending', 'confirmed'].includes(r.status));
      if (activeRes) {
        setTrackResult(activeRes);
        toast.success('Reservation found!');
      } else {
        toast.error('No active reservations found for this number.');
        setTrackResult(null);
      }
    } catch (err) {
      toast.error('Failed to find reservation');
      setTrackResult(null);
    } finally {
      setTracking(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-[#FAF8F5] relative overflow-hidden flex flex-col items-center">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D97736]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A5501B]/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10 max-w-2xl"
      >
        <p className="text-[#D97736] font-semibold tracking-[0.2em] uppercase text-sm mb-4">Join Us</p>
        <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-[#2C2621] mb-4">Book a Table</h1>
        <p className="text-[#6D635B] text-lg font-light leading-relaxed">Reserve your spot for an authentic, unforgettable South Indian dining experience.</p>
      </motion.div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Booking Form Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#2C2621]/5 rounded-[2rem] p-12 text-center shadow-[0_8px_40px_rgba(0,0,0,0.04)]"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Check className="w-12 h-12" />
                </div>
                <h2 className="font-serif text-4xl font-medium text-[#2C2621] mb-4">Reservation Confirmed!</h2>
                <p className="text-[#6D635B] mb-10 text-lg font-light">
                  We look forward to hosting you, <strong className="text-[#D97736] font-medium">{form.customerName}</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  {[
                    { label: 'Date', value: form.date, icon: CalendarDays },
                    { label: 'Time', value: form.time, icon: Clock },
                    { label: 'Guests', value: form.guestCount, icon: Users },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-[#FAF8F5] border border-[#2C2621]/5 rounded-2xl p-6 text-center">
                      <Icon className="w-6 h-6 text-[#D97736] mx-auto mb-3" />
                      <div className="text-xl font-bold text-[#2C2621]">{value}</div>
                      <div className="text-xs text-[#8C847D] uppercase tracking-widest mt-1 font-semibold">{label}</div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { setSuccess(false); setForm({ customerName: '', customerPhone: '', customerEmail: '', date: '', time: '19:00', guestCount: 2, occasion: '', notes: '' }); }}
                  className="text-[#D97736] font-semibold hover:text-[#A5501B] transition-colors uppercase tracking-wide text-sm"
                >
                  Book Another Table
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="bg-white border border-[#2C2621]/5 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] space-y-10"
              >
                {/* Guest Info */}
                <div>
                  <div className="flex items-center gap-3 text-[#2C2621] font-bold uppercase tracking-widest text-sm mb-6 pb-4 border-b border-[#2C2621]/5">
                    <User className="w-5 h-5 text-[#D97736]" /> Guest Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-[#8C847D] uppercase tracking-wider">Full Name *</label>
                      <input required type="text" value={form.customerName} onChange={e => set('customerName', e.target.value)} className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl px-5 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621]" placeholder="e.g. Rahul Sharma" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C847D] uppercase tracking-wider">Phone Number *</label>
                      <input required type="tel" value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl px-5 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621]" placeholder="+91 98765 43210" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C847D] uppercase tracking-wider">Email (Optional)</label>
                      <input type="email" value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl px-5 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621]" placeholder="rahul@example.com" />
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <div className="flex items-center gap-3 text-[#2C2621] font-bold uppercase tracking-widest text-sm mb-6 pb-4 border-b border-[#2C2621]/5">
                    <CalendarDays className="w-5 h-5 text-[#D97736]" /> Booking Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C847D] uppercase tracking-wider">Date *</label>
                      <input required type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => set('date', e.target.value)} className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl px-5 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C847D] uppercase tracking-wider">Time *</label>
                      <select required value={form.time} onChange={e => set('time', e.target.value)} className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl px-5 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621] appearance-none">
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C847D] uppercase tracking-wider">Guests *</label>
                      <input required type="number" min="1" max="20" value={form.guestCount} onChange={e => set('guestCount', e.target.value)} className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl px-5 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621]" />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <div className="flex items-center gap-3 text-[#2C2621] font-bold uppercase tracking-widest text-sm mb-6 pb-4 border-b border-[#2C2621]/5">
                    <Star className="w-5 h-5 text-[#D97736]" /> Special Requests
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                      {OCCASIONS.map(o => (
                        <button 
                          key={o} type="button" onClick={() => set('occasion', o)}
                          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${form.occasion === o ? 'bg-[#D97736] border-[#D97736] text-white shadow-md' : 'bg-white border-[#2C2621]/10 text-[#6D635B] hover:border-[#D97736]/50 hover:text-[#D97736]'}`}
                        >
                          {OCCASION_LABELS[o]}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C847D] uppercase tracking-wider">Additional Notes</label>
                      <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl px-5 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621] resize-none" placeholder="Any dietary requirements or accessibility needs..." />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-[#D97736] text-white py-5 rounded-xl font-bold tracking-wide uppercase text-sm hover:scale-[1.02] transition-transform shadow-[0_8px_20px_rgba(217,119,54,0.25)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-5 h-5"/> Confirm Reservation</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar / Tracker */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-[#2C2621]/5 rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)]"
          >
            <h3 className="font-serif text-3xl font-medium mb-4 flex items-center gap-3 text-[#2C2621]">
              <Search className="w-6 h-6 text-[#D97736]"/> Track Booking
            </h3>
            <p className="text-[#6D635B] font-light leading-relaxed mb-8">Enter your phone number to check your booking status or queue position.</p>

            <form onSubmit={trackReservation} className="relative">
              <input 
                type="tel" placeholder="Phone Number" 
                value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#2C2621]/5 rounded-xl pl-5 pr-14 py-4 outline-none focus:border-[#D97736]/50 focus:bg-white transition-all text-[#2C2621]"
              />
              <button type="submit" disabled={tracking} className="absolute right-2 top-2 bottom-2 bg-[#D97736] text-white px-4 rounded-lg hover:bg-[#A5501B] transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center">
                {tracking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <AnimatePresence>
              {trackResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-8 pt-8 border-t border-[#2C2621]/5 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold tracking-wider text-[#8C847D] uppercase">Status</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#D97736]/10 text-[#D97736] capitalize border border-[#D97736]/20">{trackResult.status}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold tracking-wider text-[#8C847D] uppercase">Date</span>
                    <span className="font-medium text-[#2C2621]">{new Date(trackResult.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-wider text-[#8C847D] uppercase">Time</span>
                    <span className="font-bold text-[#2C2621]">{trackResult.time}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#FAF8F5] border border-[#2C2621]/5 rounded-[2rem] p-8 lg:p-10 shadow-sm"
          >
            <h4 className="font-serif text-3xl font-medium mb-6 flex items-center gap-3 text-[#2C2621]">
              <Clock className="w-6 h-6 text-[#D97736]"/> Hours
            </h4>
            <div className="space-y-4 text-[#6D635B] font-light">
              <div className="flex justify-between items-center pb-4 border-b border-[#2C2621]/5">
                <span className="font-medium text-[#2C2621]">Breakfast</span>
                <span>8:00 AM - 11:00 AM</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[#2C2621]/5">
                <span className="font-medium text-[#2C2621]">Lunch</span>
                <span>11:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#2C2621]">Dinner</span>
                <span>6:00 PM - 10:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
