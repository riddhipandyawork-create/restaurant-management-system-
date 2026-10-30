import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

const CULINARY_MOMENTS = [
  { progress: 0,  text: "Harvesting Heirloom Malabar Spices" },
  { progress: 28, text: "Stone-Grinding Fermented Batter" },
  { progress: 58, text: "Tempering Mustard & Fresh Curry Leaves" },
  { progress: 84, text: "Brewing Single-Origin Peaberry Decoction" },
  { progress: 98, text: "Welcome to 22nd Parallel" },
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(CULINARY_MOMENTS[0].text);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Disable body scroll while loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const startTime = Date.now();
    const duration = 2100; // ~2.1 seconds for luxurious smooth pacing

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Easing curve (easeOutCubic)
      const t = rawProgress / 100;
      const eased = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      
      setProgress(eased);

      // Update culinary story text based on current progress
      for (let i = CULINARY_MOMENTS.length - 1; i >= 0; i--) {
        if (eased >= CULINARY_MOMENTS[i].progress) {
          setCurrentText(CULINARY_MOMENTS[i].text);
          break;
        }
      }

      if (rawProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            document.body.style.overflow = originalOverflow;
            if (onComplete) onComplete();
          }, 650);
        }, 250);
      }
    }, 28);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  const handleSkip = () => {
    setProgress(100);
    setIsFinished(true);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -24, 
            scale: 1.02,
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } 
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#190E0B',
            backgroundImage: `
              radial-gradient(circle at 50% 42%, rgba(181, 84, 58, 0.32) 0%, rgba(25, 14, 11, 0.95) 60%, #120907 100%),
              radial-gradient(circle at 20% 80%, rgba(111, 127, 95, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(194, 141, 71, 0.12) 0%, transparent 50%)
            `,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FAF7F2',
            padding: '2rem',
            userSelect: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Subtle decorative background watermark */}
          <div 
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              border: '1px dashed rgba(240, 230, 216, 0.05)',
              pointerEvents: 'none',
            }}
          />

          {/* Central Medallion */}
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            {/* Outer rotating coordinate ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              style={{
                width: '136px',
                height: '136px',
                borderRadius: '50%',
                border: '1px dashed rgba(194, 141, 71, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 35px rgba(181, 84, 58, 0.25)',
              }}
            />

            {/* Middle pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '9px',
                left: '9px',
                width: '118px',
                height: '118px',
                borderRadius: '50%',
                border: '1px solid rgba(240, 230, 216, 0.2)',
                background: 'radial-gradient(circle, rgba(181, 84, 58, 0.28) 0%, transparent 70%)',
              }}
            />

            {/* Inner Crest Core */}
            <div
              style={{
                position: 'absolute',
                top: '22px',
                left: '22px',
                width: '92px',
                height: '92px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #B5543A, #8F3A24)',
                border: '2px solid rgba(240, 230, 216, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.35), 0 8px 24px rgba(0, 0, 0, 0.55)',
              }}
            >
              <UtensilsCrossed size={28} color="#FAF7F2" strokeWidth={1.8} />
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  letterSpacing: '0.15em', 
                  textTransform: 'uppercase', 
                  color: 'rgba(250, 247, 242, 0.85)',
                  fontWeight: 700,
                  marginTop: '2px'
                }}
              >
                22° N
              </span>
            </div>
          </div>

          {/* Brand Identity */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{ textAlign: 'center', maxWidth: '440px', marginBottom: '2.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ height: '1px', width: '28px', background: 'linear-gradient(to right, transparent, #C28D47)' }} />
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C28D47', fontWeight: 600 }}>
                HAUTE HOSPITALITY
              </span>
              <span style={{ height: '1px', width: '28px', background: 'linear-gradient(to left, transparent, #C28D47)' }} />
            </div>

            <h1 
              style={{ 
                fontFamily: "'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
                fontSize: '2.6rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: '#FAF7F2',
                margin: '0 0 0.35rem 0',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.45)',
              }}
            >
              22nd Parallel
            </h1>

            <p 
              style={{ 
                fontSize: '0.85rem', 
                color: 'rgba(250, 247, 242, 0.65)', 
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: 0,
                fontWeight: 400
              }}
            >
              Authentic South Indian • Vadodara
            </p>
          </motion.div>

          {/* Progress Section */}
          <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Progress track */}
            <div 
              style={{ 
                width: '100%', 
                height: '3px', 
                background: 'rgba(240, 230, 216, 0.12)', 
                borderRadius: '100px', 
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div 
                style={{ 
                  height: '100%', 
                  width: `${progress}%`, 
                  background: 'linear-gradient(90deg, #B5543A, #C28D47, #FAF7F2)',
                  boxShadow: '0 0 10px rgba(194, 141, 71, 0.6)',
                  borderRadius: '100px',
                  transition: 'width 0.12s linear',
                }}
              />
            </div>

            {/* Bottom Meta & Dynamic Text */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'rgba(250, 247, 242, 0.6)',
                fontFamily: "system-ui, -apple-system, sans-serif"
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minHeight: '18px' }}>
                <Sparkles size={11} color="#C28D47" />
                <span style={{ fontStyle: 'italic', color: '#E4D7C5' }}>
                  {currentText}
                </span>
              </div>
              <span style={{ fontWeight: 600, fontFamily: 'monospace', color: '#C28D47' }}>
                {String(progress).padStart(2, '0')}%
              </span>
            </div>
          </div>

          {/* Brand Philosophy Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.4 }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(250, 247, 242, 0.45)',
              margin: 0,
            }}
          >
            Nothing Artificial • Nothing Frozen
          </motion.p>

          {/* Quick Skip Button */}
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute',
              top: '1.75rem',
              right: '2rem',
              background: 'transparent',
              border: '1px solid rgba(240, 230, 216, 0.18)',
              color: 'rgba(250, 247, 242, 0.55)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.8rem',
              borderRadius: '100px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FAF7F2';
              e.currentTarget.style.borderColor = 'rgba(240, 230, 216, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(250, 247, 242, 0.55)';
              e.currentTarget.style.borderColor = 'rgba(240, 230, 216, 0.18)';
            }}
          >
            Skip ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
