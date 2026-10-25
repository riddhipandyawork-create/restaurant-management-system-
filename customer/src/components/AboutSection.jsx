import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, ShieldCheck, Coffee, UtensilsCrossed, Leaf, Flame, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VALUES = [
  {
    icon: Flame,
    title: 'Stone-Ground Fermentation',
    subtitle: '16-Hour Natural Process',
    desc: 'Our idli and dosa batters are ground using heavy granite stones and fermented naturally without baking soda, yeast, or artificial leavening agents.',
    tag: 'Digestible & Pure',
    accent: '#B5543A',
    bg: 'rgba(181, 84, 58, 0.12)'
  },
  {
    icon: Leaf,
    title: 'Zero Chemical Additives',
    subtitle: '100% Satvik Purity',
    desc: 'No artificial food colors, no MSG, no palm oil, and zero frozen pre-mixes. Pure cold-pressed sesame oil and unadulterated A2 cow ghee in every dish.',
    tag: 'Banana Leaf Fresh',
    accent: '#6F7F5F',
    bg: 'rgba(111, 127, 95, 0.16)'
  },
  {
    icon: UtensilsCrossed,
    title: 'Generational Spice Blends',
    subtitle: 'Roasted & Ground In-House',
    desc: 'From our fragrant Sambar Podi to fiery Gunpowder Podi, all spices are slow-roasted over low heat and stone-milled in our kitchen every single morning.',
    tag: 'Daily Fresh Podis',
    accent: '#6F7F5F',
    bg: 'rgba(111, 127, 95, 0.16)'
  },
  {
    icon: Coffee,
    title: 'Kumbakonam Degree Kaapi',
    subtitle: 'Brass Dabarah Perfection',
    desc: 'Freshly roasted plantation peaberry coffee beans extracted through traditional brass drip filters, served piping hot with golden froth.',
    tag: 'Degree Brew',
    accent: '#5A2E25',
    bg: 'rgba(90, 46, 37, 0.14)'
  }
];

export default function AboutSection() {
  return (
    <section id="about" style={{
      background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 50%, var(--bg) 100%)',
      padding: '7rem 0',
      position: 'relative',
      overflow: 'hidden',
      scrollMarginTop: 'calc(var(--nav-h, 72px) + 24px)',
    }}>
      {/* Decorative background watermark */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '-5%',
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(8rem, 20vw, 22rem)',
        fontWeight: 700,
        color: 'rgba(181, 84, 58, 0.03)',
        pointerEvents: 'none',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        22°N
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>

        {/* ── SECTION HEADER ── */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
              <span>About Us · Our Culinary Heritage</span>
              <span style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 500,
              color: 'var(--cream)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
            }}>
              The Soul & Tradition of <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>22nd Parallel</em>
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-2)',
              lineHeight: 1.8,
              fontWeight: 400,
            }}>
              Named after the 22nd geographical parallel that cuts right across Gujarat, our restaurant was founded to bring the sacred, authentic breakfast and dining traditions of Tamil Nadu, Karnataka, and Kerala to Anand — uncompromised, unhurried, and crafted with genuine reverence.
            </p>
          </motion.div>
        </div>

        {/* ── TWO-COLUMN STORY & VISUAL SPOTLIGHT ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
          marginBottom: '6rem',
        }}>

          {/* Left Column: Visual Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(44, 38, 33, 0.12)',
              border: '1px solid rgba(181, 84, 58, 0.15)',
              background: '#FFFFFF',
            }}>
              <img
                src="/images/dosa_ghee_1790422313814.png"
                alt="Crafting pure Ghee Roast Dosa"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(20, 16, 13, 0.85) 100%)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '1.75rem',
                left: '2rem',
                right: '2rem',
                color: '#FFFFFF',
              }}>
                <span style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#E89154',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '0.35rem',
                }}>Every Morning In Our Kitchen</span>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}>
                  "Crispy, aromatic dosas roasted on iron cast tawas with fragrant A2 cow ghee."
                </p>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div style={{
              position: 'absolute',
              top: '-1.5rem',
              right: '-1.5rem',
              background: '#FFFFFF',
              border: '1px solid rgba(181, 84, 58, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(181, 84, 58, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B5543A',
              }}>
                <Award size={24} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: '#2C2621', display: 'block', lineHeight: 1 }}>
                  100% Authentic
                </span>
                <span style={{ fontSize: '0.72rem', color: '#8C847D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Regional Heritage
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Detailed Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: 500,
              color: 'var(--cream)',
              lineHeight: 1.25,
              marginBottom: '1.25rem',
            }}>
              "No Shortcuts. No Freezers.<br />Just Honest, Generational Recipes."
            </h3>

            <p style={{
              fontSize: '0.96rem',
              color: 'var(--text-2)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
            }}>
              Most commercial South Indian outlets rely on ready-made packaged batter, vinegar souring, and artificial color boosters. At <strong>22nd Parallel</strong>, we adhere strictly to the traditional kitchen ethos practiced in Madurai and Udupi homes:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { 
                  title: 'Pure Ponni Rice & Urad Gota', 
                  desc: 'Sourced from the fertile Kaveri delta for soft, airy idlis that melt effortlessly.',
                  color: '#4E5D42',
                  bg: 'rgba(111, 127, 95, 0.16)',
                  icon: Leaf
                },
                { 
                  title: 'The Quad-Chutney Standard', 
                  desc: 'Freshly prepared four distinct accompaniments with every tiffin, never repeated or diluted.',
                  color: '#B5543A',
                  bg: 'rgba(181, 84, 58, 0.12)',
                  icon: UtensilsCrossed
                },
                { 
                  title: 'Traditional Brass & Cast Iron', 
                  desc: 'Cooked on seasoned heavy cast iron tawas for that irreplaceable crisp texture and golden caramelized crust.',
                  color: '#5A2E25',
                  bg: 'rgba(90, 46, 37, 0.14)',
                  icon: Flame
                },
              ].map((item, idx) => {
                const BulletIcon = item.icon;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      <BulletIcon size={13} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '0.15rem' }}>{item.title}</h5>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn-ed-primary" style={{ textDecoration: 'none' }}>
                <span>Explore Heritage Menu</span>
                <span className="btn-ed-icon"><ArrowRight size={14} /></span>
              </Link>
              <Link to="/track" className="btn-ed-ghost" style={{ textDecoration: 'none' }}>
                Track Active Order <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* ── 4 PILLARS GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem',
        }}>
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '2.25rem 1.75rem',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(181, 84, 58, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(181, 84, 58, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: val.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: val.accent,
                  marginBottom: '1.5rem',
                }}>
                  <Icon size={22} />
                </div>

                <span style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: val.accent,
                  fontWeight: 700,
                  marginBottom: '0.4rem',
                }}>
                  {val.tag}
                </span>

                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  color: 'var(--cream)',
                  lineHeight: 1.25,
                  marginBottom: '0.35rem',
                }}>
                  {val.title}
                </h4>

                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  {val.subtitle}
                </span>

                <p style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-2)',
                  lineHeight: 1.65,
                  flex: 1,
                }}>
                  {val.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── QUOTE & METRICS STRIP (Deep Rust + Soft Limestone + Olive) ── */}
        <div style={{
          background: 'linear-gradient(135deg, #5A2E25 0%, #3D1C16 100%)',
          borderRadius: '24px',
          padding: '3.5rem 3rem',
          color: 'var(--limestone)',
          border: '1px solid rgba(181, 84, 58, 0.4)',
          boxShadow: '0 25px 65px rgba(90, 46, 37, 0.28)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--olive-light)',
              background: 'rgba(111, 127, 95, 0.25)',
              border: '1px solid rgba(111, 127, 95, 0.4)',
              padding: '0.35rem 0.85rem',
              borderRadius: '50px',
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}>
              <Leaf size={14} color="var(--olive-light)" />
              <span>A Sacred Kitchen Pledge</span>
            </div>
            <blockquote style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
              lineHeight: 1.5,
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--limestone)',
              marginBottom: '1.25rem',
            }}>
              “Food in South India is never mere sustenance; it is Anna Prasadam. We awaken before dawn every morning to grind fresh grains and roast our podis so that every plate carries warmth and honesty.”
            </blockquote>
            <cite style={{
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--terracotta-light)',
              fontStyle: 'normal',
              fontWeight: 600,
            }}>
              — The Kitchen Guild at 22nd Parallel, Anand
            </cite>
          </div>

          {/* 4 Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            borderLeft: '1px solid rgba(240, 230, 216, 0.15)',
            paddingLeft: '2rem',
          }}>
            {[
              { num: '100%', label: 'Fresh Daily Stone-Ground' },
              { num: '0%', label: 'Chemicals & Preservatives' },
              { num: '4', label: 'Fresh Chutneys With Every Dosa' },
              { num: '77+', label: 'Heritage Recipes Mastered' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 600,
                  color: 'var(--terracotta-light)',
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}>
                  {stat.num}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(240, 230, 216, 0.75)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.4,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
