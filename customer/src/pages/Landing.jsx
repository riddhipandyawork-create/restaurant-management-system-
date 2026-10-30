import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Minus, Sparkles, Leaf, Coffee, Star, ShieldCheck, Flame, Utensils } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import AboutSection from '../components/AboutSection';

const FEATURED = [
  { 
    _id: '6ac49f3da43d9d4191fb7e0b',
    name: 'Special Ghee Roast Dosa', 
    desc: 'Crispy crepe roasted on iron tawas in pure A2 ghee, served with our signature 4 chutneys & hot drumstick sambar.', 
    price: 220, 
    img: '/images/dosa_ghee_1790422313814.png',
    tag: 'Chef Special · A2 Ghee',
    tagColor: 'var(--terracotta)',
    tagBg: 'rgba(181, 84, 58, 0.12)',
    accent: 'var(--terracotta)'
  },
  { 
    _id: '6ac49f3da43d9d4191fb7dfb',
    name: 'Thatte Idli with Ghee Podi', 
    desc: 'Soft, plate-sized steamed Kaveri rice cakes soaked in aromatic gunpowder podi and melted golden ghee.', 
    price: 140, 
    img: '/images/hero_idli_1790422303195.png',
    tag: 'Temple Recipe · Satvik',
    tagColor: 'var(--olive-dark)',
    tagBg: 'rgba(111, 127, 95, 0.16)',
    accent: 'var(--olive)'
  },
  { 
    _id: '6ac49f3da43d9d4191fb7e02',
    name: 'Mysore Masala Dosa', 
    desc: 'Fiery spiced red shallot-garlic chutney spread with tempered spiced potato mash, cooked crisp.', 
    price: 180, 
    img: '/images/masala_dosa_1790422328173.png',
    tag: 'Crispy & Fiery Podi',
    tagColor: 'var(--terracotta)',
    tagBg: 'rgba(181, 84, 58, 0.12)',
    accent: 'var(--terracotta)'
  },
  { 
    _id: '6ac49f3da43d9d4191fb7e3a',
    name: 'Kumbakonam Degree Kaapi', 
    desc: 'Hand-roasted plantation peaberry & chicory decoction frothed with thick farm-fresh milk in brass dabarah.', 
    price: 80, 
    img: '/images/filter_coffee_1790422340001.png',
    tag: 'Brass Brew · Kaapi',
    tagColor: 'var(--deep-rust)',
    tagBg: 'rgba(90, 46, 37, 0.14)',
    accent: 'var(--deep-rust)'
  },
];

const MARQUEE_ITEMS = [
  'Special Ghee Roast Dosa', 'Steamed Thatte Idli', 'Mysore Masala Dosa',
  'Kumbakonam Degree Kaapi', 'Medu Vada Platter', 'Pure Satvik Kitchen',
  'Zero Artificial Colours', 'Zero Preservatives', 'Heritage Anand', 'Stone-Ground Batters',
];

export default function Landing() {
  const { addItem, removeItem, cart } = useCartStore();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── LUXURY ARCHITECTURAL HERO ── */}
      <section className="hero-luxury-wrap">
        <div className="hero-luxury">

          {/* Left Column — Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="hero-luxury-eyebrow">
              <Leaf size={14} color="var(--olive-dark)" />
              <span>100% Authentic South Indian · Anand</span>
            </div>

            <h1 className="hero-luxury-title">
              Sacred Flavours of the Deep South,{' '}
              <span className="hero-luxury-accent">Crafted in Purity.</span>
            </h1>

            <p className="hero-luxury-sub">
              Slow-fermented stone-ground batters, pure A2 cow ghee, and generational recipes from Tamil Nadu & Karnataka. Made fresh daily at Jetalpur Road. No shortcuts, zero preservatives.
            </p>

            <div className="hero-luxury-actions">
              <Link to="/menu" className="btn-ed-primary">
                <span>Explore Full Menu</span>
                <span className="btn-ed-icon">
                  <ArrowRight size={16} />
                </span>
              </Link>
              <a href="/#about" className="btn-hero-secondary">
                <span>Our Heritage Story</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="hero-trust-strip">
              <div className="hero-trust-item hero-trust-olive">
                <Leaf size={14} color="var(--olive)" />
                <span>100% Satvik Purity</span>
              </div>
              <div className="hero-trust-item hero-trust-terracotta">
                <ShieldCheck size={14} color="var(--terracotta)" />
                <span>Stone-Ground Batters</span>
              </div>
              <div className="hero-trust-item hero-trust-rust">
                <Star size={14} color="var(--deep-rust)" fill="var(--deep-rust)" />
                <span>4.9 ★ Rating in Anand</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column — Architectural Arched Visual */}
          <motion.div
            className="hero-visual-wrap"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {/* The Architectural Terracotta Alcove Wave (echoing reference café wall) */}
            <div className="hero-alcove-wave"></div>

            {/* The Arched Architectural Niche */}
            <div className="hero-arch-frame">
              <img
                src="/images/hero_idli_1790422303195.png"
                alt="Authentic South Indian Dishes at 22nd Parallel"
                className="hero-arch-img"
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2.5rem 1.5rem 1.5rem',
                background: 'linear-gradient(180deg, transparent 0%, rgba(58, 31, 24, 0.92) 100%)',
                color: 'var(--limestone)',
              }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--olive-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Leaf size={12} />
                  Signature Heritage Spread
                </span>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.18rem', margin: '0.2rem 0 0', fontWeight: 500, color: '#FFF8F0' }}>
                  Steamed Thatte Idli & Quad Chutneys
                </p>
              </div>
            </div>

            {/* Floating Glass Card 1 — Ghee Roast Dosa */}
            <motion.div 
              className="hero-float-card-1"
              whileHover={{ scale: 1.05 }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid var(--terracotta)',
                boxShadow: '0 4px 12px rgba(181, 84, 58, 0.25)',
              }}>
                <img
                  src="/images/dosa_ghee_1790422313814.png"
                  alt="Special Ghee Roast Dosa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.66rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta)', fontWeight: 700, display: 'block' }}>
                  ★ Chef Recommends
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.02rem', fontWeight: 600, color: 'var(--cream)', display: 'block', lineHeight: 1.2 }}>
                  Ghee Roast Dosa
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--terracotta)', fontWeight: 700 }}>₹220</span>
              </div>
            </motion.div>

            {/* Floating Glass Card 2 — Filter Kaapi */}
            <motion.div 
              className="hero-float-card-2"
              whileHover={{ scale: 1.05 }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid var(--olive)',
                boxShadow: '0 4px 12px rgba(111, 127, 95, 0.28)',
              }}>
                <img
                  src="/images/filter_coffee_1790422340001.png"
                  alt="Kumbakonam Degree Filter Kaapi"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.66rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--olive-dark)', fontWeight: 700, display: 'block' }}>
                  Degree Brew · Kumbakonam
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.02rem', fontWeight: 600, color: 'var(--cream)', display: 'block', lineHeight: 1.2 }}>
                  Brass Dabarah Kaapi
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--olive)', fontWeight: 700 }}>Fresh Brew · ₹80</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE STRIP (Deep Rust + Soft Limestone + Olive Accents) ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div className="marquee-inner" key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', padding: '0 1rem' }}>
              <span className="marquee-item">
                {item}
              </span>
              <span className="marquee-dot"></span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED DISHES — LUXURY CARD SHOWCASE ── */}
      <section style={{ padding: '6.5rem 0', background: 'var(--bg-2)', position: 'relative' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem' }}>

          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3.5rem',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.72rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--olive)',
                fontWeight: 700,
                marginBottom: '0.6rem'
              }}>
                <Utensils size={14} />
                <span>Our Signature Offerings</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
                fontWeight: 500,
                color: 'var(--cream)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}>
                Handcrafted with <em style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>Pure Tradition</em>
              </h2>
            </div>
            
            <Link to="/menu" className="btn-hero-secondary" style={{ flexShrink: 0 }}>
              <span>View Full Menu</span>
              <ArrowRight size={14} color="var(--terracotta)" />
            </Link>
          </div>

          {/* Luxury 4-Card Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2rem',
          }}>
            {FEATURED.map((item, i) => {
              const cartItem = cart.find(ci => ci.name === item.name);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: '0 10px 30px rgba(74, 38, 29, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.35s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(90, 46, 37, 0.12)';
                    e.currentTarget.style.borderColor = item.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(74, 38, 29, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {/* Dish Image Container */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#F5EFE6' }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: item.tagBg || 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: `1.5px solid ${item.accent}`,
                      color: item.tagColor,
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '50px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                      {item.tag}
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      right: '0.85rem',
                      background: 'linear-gradient(135deg, #3A1F18 0%, #5A2E25 100%)',
                      color: '#F0E6D8',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.18rem',
                      fontWeight: 600,
                      padding: '0.3rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(181, 84, 58, 0.35)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    }}>
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Dish Info */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      color: 'var(--cream)',
                      lineHeight: 1.25,
                      marginBottom: '0.5rem',
                    }}>
                      {item.name}
                    </h3>
                    
                    <p style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      flex: 1,
                    }}>
                      {item.desc}
                    </p>

                    {/* Order Action Button */}
                    <div style={{ borderTop: '1px solid var(--border-2)', paddingTop: '1rem' }}>
                      {quantity > 0 ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-2)',
                          borderRadius: '8px',
                          padding: '0.35rem 0.6rem',
                          border: `1px solid ${item.accent}`,
                        }}>
                          <button
                            onClick={() => removeItem(cartItem?.menuItem || item._id)}
                            style={{
                              width: '28px', height: '28px',
                              borderRadius: '4px',
                              background: '#FFFFFF',
                              border: '1px solid var(--border)',
                              color: 'var(--cream)',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ color: 'var(--cream)', fontSize: '0.85rem', fontWeight: 700 }}>
                            {quantity} added
                          </span>
                          <button
                            onClick={() => addItem(item)}
                            style={{
                              width: '28px', height: '28px',
                              borderRadius: '4px',
                              background: item.accent,
                              border: 'none',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addItem(item)}
                          style={{
                            width: '100%',
                            padding: '0.65rem 1rem',
                            background: 'var(--surface)',
                            border: `1.5px solid ${item.accent}`,
                            color: item.tagColor,
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.25s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = item.accent;
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--surface)';
                            e.currentTarget.style.color = item.tagColor;
                          }}
                        >
                          <Plus size={14} />
                          <span>Add to Order</span>
                        </button>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── ABOUT US & CULINARY HERITAGE SECTION ── */}
      <AboutSection />

    </div>
  );
}
