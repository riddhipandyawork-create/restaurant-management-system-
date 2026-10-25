import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Minus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';
import { useCartStore } from '../store/cartStore';

const FALLBACK_IMAGES = [
  '/images/hero_idli_1790422303195.png',
  '/images/dosa_ghee_1790422313814.png',
  '/images/masala_dosa_1790422328173.png',
  '/images/filter_coffee_1790422340001.png'
];

export default function Menu() {
  const { categories, items, fetchMenu, loading, activeCat, setActiveCat } = useMenuStore();
  const { addItem, removeItem, cart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const tabsRef = useRef(null);

  useEffect(() => {
    if (categories.length === 0) fetchMenu();
  }, [categories.length, fetchMenu]);

  // FIX: category is populated — compare _id strings
  const filteredItems = items.filter(item => {
    const catId = typeof item.category === 'object' ? item.category?._id : item.category;
    const catMatch = activeCat === 'all' || String(catId) === String(activeCat);
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const scrollTabs = (dir) => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '6rem' }}>

      {/* ── HEADER ── */}
      <div style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <p className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>22nd Parallel</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.8rem, 8vw, 5rem)',
          fontWeight: 400,
          color: 'var(--cream)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>Our Menu</h1>
      </div>

      {/* ── SEARCH + CATEGORY TABS ── */}
      <div style={{
        position: 'sticky', top: 'var(--nav-h)', zIndex: 100,
        background: 'rgba(250,248,245,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0',
      }}>
        {/* Search */}
        <div style={{ maxWidth: '600px', margin: '0 auto 1rem', padding: '0 1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute', left: '1.1rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
            }} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: '1rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            )}
            <input
              type="text"
              placeholder="Search our dishes…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 2.75rem',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                fontSize: '0.9rem',
                background: 'var(--surface)',
                color: 'var(--text)',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--gold-border)';
                e.target.style.boxShadow = '0 0 0 3px var(--gold-glow)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Category tabs — horizontally scrollable with arrow buttons */}
        <div style={{ position: 'relative', padding: '0 1.5rem' }}>
          {/* Left arrow */}
          <button
            onClick={() => scrollTabs(-1)}
            style={{
              position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
              background: 'linear-gradient(to right, var(--bg) 60%, transparent)',
              border: 'none', cursor: 'pointer', padding: '0.5rem 0.75rem',
              color: 'var(--text-muted)', zIndex: 2, display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={tabsRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '0.5rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '0.25rem 1.5rem',
            }}
          >
            {/* All Items tab */}
            <button
              onClick={() => setActiveCat('all')}
              style={{
                flexShrink: 0,
                padding: '0.55rem 1.25rem',
                borderRadius: '50px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: activeCat === 'all' ? '1.5px solid var(--terracotta)' : '1px solid var(--border)',
                background: activeCat === 'all' ? 'var(--terracotta)' : 'var(--surface)',
                color: activeCat === 'all' ? '#fff' : 'var(--cream)',
                boxShadow: activeCat === 'all' ? '0 4px 15px var(--terracotta-glow)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              All Items
            </button>

            {categories.map(c => (
              <button
                key={c._id}
                onClick={() => setActiveCat(c._id)}
                style={{
                  flexShrink: 0,
                  padding: '0.55rem 1.25rem',
                  borderRadius: '50px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: activeCat === c._id ? '1.5px solid var(--terracotta)' : '1px solid var(--border)',
                  background: activeCat === c._id ? 'var(--terracotta)' : 'var(--surface)',
                  color: activeCat === c._id ? '#fff' : 'var(--cream)',
                  boxShadow: activeCat === c._id ? '0 4px 15px var(--terracotta-glow)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollTabs(1)}
            style={{
              position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
              background: 'linear-gradient(to left, var(--bg) 60%, transparent)',
              border: 'none', cursor: 'pointer', padding: '0.5rem 0.75rem',
              color: 'var(--text-muted)', zIndex: 2, display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── MENU LIST ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 0' }}>

        {/* Active category heading */}
        {activeCat !== 'all' && (
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--cream)',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border)',
          }}>
            {categories.find(c => c._id === activeCat)?.name}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Loading menu…</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              No dishes found.
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 300 }}>Try a different category or search term.</p>
            {activeCat !== 'all' && (
              <button
                onClick={() => setActiveCat('all')}
                style={{
                  marginTop: '1.5rem', padding: '0.6rem 1.4rem',
                  background: 'var(--cream)', color: '#fff',
                  border: 'none', borderRadius: '2px',
                  fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Show All Items
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filteredItems.map((item, i) => {
                const cartItem = cart.find(ci => ci.menuItem === item._id);
                const quantity = cartItem ? cartItem.quantity : 0;
                const imageSrc = item.image || item.imageUrl || FALLBACK_IMAGES[i % 4];

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      padding: '1.5rem 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {/* Index */}
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      minWidth: '1.8rem',
                      flexShrink: 0,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Image */}
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      overflow: 'hidden', flexShrink: 0,
                      border: '2.5px solid var(--surface)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    }}>
                      <img src={imageSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                        <h3 style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                          fontWeight: 500,
                          color: 'var(--cream)',
                          lineHeight: 1.2,
                        }}>
                          {item.name}
                        </h3>
                        {item.tags?.isVegan && (
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--olive-dark)', background: 'var(--olive-bg)', border: '1px solid var(--olive-border)', padding: '0.18rem 0.5rem', borderRadius: '4px' }}>Vegan</span>
                        )}
                        {item.isSpecial && (
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta)', background: 'rgba(181, 84, 58, 0.1)', border: '1px solid rgba(181, 84, 58, 0.3)', padding: '0.18rem 0.5rem', borderRadius: '4px' }}>Special</span>
                        )}
                      </div>
                      {item.description && (
                        <p style={{
                          fontSize: '0.82rem', color: 'var(--text-muted)',
                          lineHeight: 1.55, fontWeight: 300,
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Price + CTA */}
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'flex-end', gap: '0.6rem', flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.1rem', fontWeight: 600,
                        color: 'var(--gold-light)',
                      }}>
                        ₹{item.price}
                      </span>

                      {quantity > 0 ? (
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          background: 'var(--cream)', borderRadius: '2px',
                          overflow: 'hidden',
                        }}>
                          <button
                            onClick={() => removeItem(item._id)}
                            style={{
                              padding: '0.4rem 0.65rem', background: 'none',
                              color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                              border: 'none', display: 'flex', alignItems: 'center',
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700, minWidth: '1.25rem', textAlign: 'center' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => addItem(item)}
                            style={{
                              padding: '0.4rem 0.65rem', background: 'none',
                              color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                              border: 'none', display: 'flex', alignItems: 'center',
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addItem(item)}
                          className="btn-ed-primary"
                          style={{ padding: '0.45rem 0.9rem', fontSize: '0.7rem', borderRadius: '2px' }}
                        >
                          <span>Add</span>
                          <span className="btn-ed-icon"><Plus size={12} /></span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Item count */}
        {filteredItems.length > 0 && (
          <p style={{
            textAlign: 'center', padding: '2rem 0',
            fontSize: '0.75rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
          }}>
            {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} available
          </p>
        )}
      </div>
    </div>
  );
}
