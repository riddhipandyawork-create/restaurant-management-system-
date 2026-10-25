import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Clock, ArrowUp, Send, 
  Heart, CheckCircle2, ShieldCheck, Sparkles, Coffee, UtensilsCrossed
} from 'lucide-react';
import toast from 'react-hot-toast';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733-16z"/>
    <path d="M4 20l6.768-6.768m2.464-2.464L20 4"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Welcome to the Kaapi Club! Check your inbox for secret specials.');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAbout = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/#about');
    } else {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #3A1F18 0%, #20100C 100%)',
      borderTop: '1px solid rgba(181, 84, 58, 0.35)',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '200px',
        background: 'radial-gradient(ellipse at top, rgba(181,84,58,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── TOP NEWSLETTER / KAAPI CLUB BANNER ── */}
      <div style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.02)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ maxWidth: '520px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--olive-light)',
              fontWeight: 700,
              marginBottom: '0.6rem'
            }}>
              <Coffee size={14} color="var(--olive-light)" />
              <span>The 22nd Parallel Kaapi Club</span>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 500,
              color: '#FFF8F0',
              lineHeight: 1.2,
              marginBottom: '0.5rem'
            }}>
              Tradition, Stories & Secret Specials
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: 1.6
            }}>
              Join our culinary community. Receive regional festival thali menus, seasonal tiffin announcements, and artisanal brewing secrets.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            maxWidth: '440px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(181, 84, 58, 0.35)',
            borderRadius: '50px',
            padding: '0.4rem 0.5rem 0.4rem 1.25rem',
            transition: 'border-color 0.3s ease',
          }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-sans)',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #B5543A 0%, #8C3822 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(181, 84, 58, 0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>{subscribed ? 'Subscribed' : 'Join Club'}</span>
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN 4-COLUMN FOOTER CONTENT ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 2rem 3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3.5rem',
          marginBottom: '4rem',
        }}>

          {/* Column 1: Brand & Philosophy */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #B5543A, #8C3822)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 0 20px rgba(181, 84, 58, 0.35)',
              }}>
                <UtensilsCrossed size={20} color="#FFFFFF" />
              </div>
              <div>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.65rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                  display: 'block',
                  lineHeight: 1
                }}>22nd Parallel</span>
                <span style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#B5543A',
                  fontWeight: 700
                }}>Authentic South Indian</span>
              </div>
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: 1.75,
              marginBottom: '1.5rem',
            }}>
              Preserving generational recipes of Tamil Nadu, Karnataka, and Kerala on Jetalpur Road, Anand. We stone-grind our batters daily with zero shortcuts, zero additives, and pure tradition.
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.75rem' }}>
              {[
                { label: '100% Satvik', color: '#6F7F5F', bg: 'rgba(111,127,95,0.12)', border: 'rgba(111,127,95,0.3)' },
                { label: 'Stone Ground', color: '#B5543A', bg: 'rgba(181,84,58,0.1)', border: 'rgba(181,84,58,0.25)' },
                { label: 'Zero Preservatives', color: '#6F7F5F', bg: 'rgba(111,127,95,0.12)', border: 'rgba(111,127,95,0.3)' },
                { label: 'A2 Pure Ghee', color: '#B5543A', bg: 'rgba(181,84,58,0.1)', border: 'rgba(181,84,58,0.25)' },
              ].map(tag => (
                <span key={tag.label} style={{
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: tag.color,
                  background: tag.bg,
                  border: `1px solid ${tag.border}`,
                  padding: '0.3rem 0.65rem',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Sparkles size={10} />
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
                { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
                { icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
                { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#B5543A';
                    e.currentTarget.style.borderColor = '#B5543A';
                    e.currentTarget.style.background = 'rgba(181, 84, 58, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Signature Delicacies */}
          <div>
            <h4 style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B5543A',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}>
              <span style={{ width: '18px', height: '1px', background: '#B5543A', display: 'inline-block' }}></span>
              Signature Delicacies
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { name: 'Special Ghee Roast Dosa', tag: 'Crispy & Golden' },
                { name: 'Steamed Thatte Idli', tag: 'Podi & Pure Ghee' },
                { name: 'Mysore Masala Dosa', tag: 'Spicy Red Chutney' },
                { name: 'Medu Vada Platter', tag: 'Double Crisp' },
                { name: 'South Indian Raja Thali', tag: 'Full Feast' },
                { name: 'Degree Filter Kaapi', tag: 'Fresh Decoction' },
              ].map(item => (
                <li key={item.name}>
                  <Link
                    to="/menu"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.querySelector('.item-title').style.color = '#B5543A'}
                    onMouseLeave={(e) => e.currentTarget.querySelector('.item-title').style.color = 'rgba(255, 255, 255, 0.7)'}
                  >
                    <span className="item-title" style={{ transition: 'color 0.2s', fontWeight: 400 }}>{item.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.04em' }}>{item.tag}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation & Services */}
          <div>
            <h4 style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B5543A',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}>
              <span style={{ width: '18px', height: '1px', background: '#B5543A', display: 'inline-block' }}></span>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                { label: 'Home Page', to: '/' },
                { label: 'About Our Heritage', onClick: scrollToAbout },
                { label: 'Explore Full Menu', to: '/menu' },
                { label: 'Live Order Tracker', to: '/track' },
                { label: 'Table Reservations', to: '/menu' },
                { label: 'Catering & Events', to: '/menu' },
              ].map(link => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      style={{
                        fontSize: '0.88rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease, transform 0.2s ease',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#B5543A';
                        e.target.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={link.onClick}
                      style={{
                        fontSize: '0.88rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'color 0.2s ease, transform 0.2s ease',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#B5543A';
                        e.target.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Location & Operating Hours */}
          <div>
            <h4 style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B5543A',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}>
              <span style={{ width: '18px', height: '1px', background: '#B5543A', display: 'inline-block' }}></span>
              Visit & Timings
            </h4>

            {/* Address */}
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
              <MapPin size={18} color="#B5543A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.55 }}>
                Ground Floor, Near Amul Dairy Circle,<br />
                Jetalpur Road, Anand, Gujarat – 388001
              </p>
            </div>

            {/* Contact */}
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.25rem', alignItems: 'center' }}>
              <Phone size={16} color="#B5543A" style={{ flexShrink: 0 }} />
              <a
                href="tel:+919825022022"
                style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = '#B5543A'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.65)'}
              >
                +91 98250 22022
              </a>
            </div>

            {/* Hours */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Clock size={14} color="#B5543A" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FFF' }}>
                  Open 7 Days A Week
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <span>Morning Tiffin</span>
                  <span style={{ color: '#E89154', fontFamily: 'monospace' }}>07:30 – 11:30 AM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <span>Grand Lunch</span>
                  <span style={{ color: '#E89154', fontFamily: 'monospace' }}>12:00 – 03:30 PM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <span>Evening Kaapi & Dinner</span>
                  <span style={{ color: '#E89154', fontFamily: 'monospace' }}>05:00 – 10:45 PM</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── BOTTOM CREDITS & COMPLIANCE BAR ── */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}>
          <div>
            <p style={{
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <span>© {new Date().getFullYear()} 22nd Parallel. All rights reserved.</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} color="#B5543A" />
                FSSAI Lic. No. 10721011000234
              </span>
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              Made with <Heart size={12} color="#B5543A" fill="#B5543A" /> in Anand, Gujarat
            </span>

            <button
              onClick={scrollToTop}
              title="Back to Top"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(181, 84, 58, 0.15)',
                border: '1px solid rgba(181, 84, 58, 0.4)',
                color: '#B5543A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#B5543A';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(181, 84, 58, 0.15)';
                e.currentTarget.style.color = '#B5543A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
