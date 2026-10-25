import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Check, User, Hash } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Review() {
  const [form, setForm] = useState({ orderNumber: '', customerName: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.orderNumber) {
      toast.error('Please fill in your name and order number');
      return;
    }
    
    setLoading(true);
    try {
      // First verify the order exists
      const { data: order } = await api.get(`/public/orders/${form.orderNumber}`);
      
      // Then submit the review
      await api.post('/public/reviews', {
        order: order._id,
        customerName: form.customerName,
        rating: form.rating,
        comment: form.comment
      });
      
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order not found or error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center pt-10 px-4 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-xl bg-card/80 backdrop-blur-xl border border-black/5 rounded-3xl p-8 md:p-12 shadow-2xl z-10"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">How was your meal?</h1>
              <p className="text-muted-foreground text-sm md:text-base">We're always looking to improve our authentic South Indian experience.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star} type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setForm(f => ({ ...f, rating: star }))}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${
                          star <= (hoveredStar || form.rating) 
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                            : 'text-muted-foreground/30 fill-transparent'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <p className="text-amber-400 font-medium mt-4 text-sm h-5">
                  {['Terrible', 'Poor', 'Average', 'Good', 'Excellent'][hoveredStar ? hoveredStar - 1 : form.rating - 1]}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <User className="absolute left-4 top-[38px] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Your Name *</label>
                  <input 
                    type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                    className="w-full bg-background/50 border border-border rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 transition-all focus:bg-background"
                    placeholder="John Doe" required
                  />
                </div>
                <div className="space-y-1.5 relative">
                  <Hash className="absolute left-4 top-[38px] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Order Number *</label>
                  <input 
                    type="text" value={form.orderNumber} onChange={e => setForm(f => ({ ...f, orderNumber: e.target.value }))}
                    className="w-full bg-background/50 border border-border rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 transition-all focus:bg-background"
                    placeholder="e.g. 10024" required
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <MessageSquare className="absolute left-4 top-[38px] w-4 h-4 text-muted-foreground" />
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Additional Comments</label>
                <textarea 
                  rows={4} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  className="w-full bg-background/50 border border-border rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 transition-all resize-none focus:bg-background"
                  placeholder="Tell us what you loved, or what we can do better..."
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-black/5 rounded-3xl p-10 text-center shadow-2xl z-10"
          >
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Thank You!</h2>
            <p className="text-muted-foreground mb-8">Your feedback helps us continue to serve authentic experiences.</p>
            <button 
              onClick={() => { setForm({ orderNumber: '', customerName: '', rating: 5, comment: '' }); setSubmitted(false); }}
              className="text-primary font-bold hover:underline"
            >
              Submit another review
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
