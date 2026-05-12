import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Brass handle built entirely in JSX — no CSS pseudo-elements
function BrassHandle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, pointerEvents: 'none' }}>
      {/* Top rosette */}
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #f0d060 0%, #c8a020 45%, #7a5c08 100%)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.4)',
        border: '1px solid #6a4c08',
      }} />
      {/* Bar */}
      <div style={{
        width: 12, height: 48,
        background: 'linear-gradient(90deg, #6a4c08 0%, #d4a820 30%, #f0d060 50%, #c8a020 70%, #6a4c08 100%)',
        borderRadius: 6,
        boxShadow: '2px 0 8px rgba(0,0,0,0.7), -1px 0 4px rgba(0,0,0,0.5), inset 1px 0 2px rgba(255,255,255,0.25)',
      }} />
      {/* Bottom rosette */}
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #f0d060 0%, #c8a020 45%, #7a5c08 100%)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.4)',
        border: '1px solid #6a4c08',
      }} />
    </div>
  )
}

function DoorPanel({ side, isOpen, onHandleClick }) {
  const isLeft = side === 'left'

  return (
    <motion.div
      className="relative flex-1 h-full"
      style={{
        transformOrigin: isLeft ? 'left center' : 'right center',
        transformStyle: 'preserve-3d',
        zIndex: isOpen ? 1 : 2,
        overflow: 'visible',
      }}
      animate={{ rotateY: isOpen ? (isLeft ? -108 : 108) : 0 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Door face clipped to door bounds */}
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 0 }}>
        {/* Wood grain */}
        <div className="wood-grain absolute inset-0" />

        {/* Edge shadow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: isLeft
            ? 'inset -10px 0 20px rgba(0,0,0,0.4), inset 6px 0 12px rgba(255,200,80,0.04)'
            : 'inset 10px 0 20px rgba(0,0,0,0.4), inset -6px 0 12px rgba(255,200,80,0.04)',
        }} />

        {/* Top panel inset */}
        <div className="absolute" style={{
          top: '8%', left: '11%', right: '11%', bottom: '54%',
          border: '2px solid rgba(0,0,0,0.4)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.25), inset 2px 2px 4px rgba(255,255,255,0.05)',
          borderRadius: 3,
          background: 'rgba(0,0,0,0.1)',
        }} />

        {/* Bottom panel inset */}
        <div className="absolute" style={{
          top: '50%', left: '11%', right: '11%', bottom: '8%',
          border: '2px solid rgba(0,0,0,0.4)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.25), inset 2px 2px 4px rgba(255,255,255,0.05)',
          borderRadius: 3,
          background: 'rgba(0,0,0,0.1)',
        }} />

        {/* Center horizontal rail */}
        <div className="absolute" style={{
          top: '47.5%', left: 0, right: 0, height: 3,
          background: 'rgba(0,0,0,0.3)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.05)',
        }} />

        {/* Hinges */}
        {[18, 50, 82].map((pct) => (
          <div key={pct} className="absolute" style={{
            top: `${pct}%`,
            [isLeft ? 'left' : 'right']: 0,
            transform: 'translateY(-50%)',
            width: 18, height: 30,
            background: 'linear-gradient(90deg, #777, #ccc, #999)',
            borderRadius: isLeft ? '0 5px 5px 0' : '5px 0 0 5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
            zIndex: 3,
          }} />
        ))}
      </div>

      {/* Handle — outside overflow:hidden so it's always visible */}
      <div
        className="absolute"
        style={{
          top: '50%',
          [isLeft ? 'right' : 'left']: '13%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          cursor: 'pointer',
          filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.8))',
        }}
        onClick={onHandleClick}
      >
        <BrassHandle />
      </div>
    </motion.div>
  )
}

export default function WardrobeIntro({ onEnter }) {
  const [phase, setPhase] = useState('idle')

  const handleClick = () => {
    if (phase !== 'idle') return
    setPhase('opening')
    setTimeout(() => {
      setPhase('entering')
      setTimeout(() => onEnter(), 650)
    }, 1500)
  }

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, #2a1008 0%, #0d0503 100%)' }}
        exit={{ opacity: 0, scale: 1.12 }}
        transition={{ duration: 0.65, ease: 'easeIn' }}
      >
        {/* Ceiling warm light */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 250,
          background: 'radial-gradient(ellipse, rgba(220,150,40,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floor shadow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))',
          pointerEvents: 'none',
        }} />

        {/* ── Wardrobe ── */}
        <motion.div
          animate={phase === 'entering' ? { scale: 2.4, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 1, 1] }}
          style={{
            width: 'min(620px, 88vw)',
            height: 'min(800px, 88vh)',
            display: 'flex',
            flexDirection: 'column',
            perspective: '1400px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* Crown */}
          <div className="wardrobe-crown flex-shrink-0" style={{
            height: 56,
            borderRadius: '10px 10px 0 0',
            border: '3px solid #1a0804',
            borderBottom: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 5,
          }}>
            <span style={{
              fontFamily: 'Georgia, serif', fontSize: 14,
              letterSpacing: 6, textTransform: 'uppercase',
              color: 'rgba(184,150,46,0.65)', fontWeight: 700,
            }}>Moja Omara</span>
          </div>

          {/* Body */}
          <div className="wardrobe-frame flex-1 relative" style={{
            border: '3px solid #1a0804',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            overflow: 'visible',
            transformStyle: 'preserve-3d',
          }}>
            {/* Interior visible behind doors */}
            <div className="wardrobe-back-wall absolute inset-0" style={{ zIndex: 0, borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
              {/* Hanging rod */}
              <div style={{ position: 'relative', margin: '28px 40px 8px', height: 10 }}>
                <div className="hanging-rod" style={{ width: '100%', height: '100%' }} />
                {[0, '50%', 'calc(100% - 14px)'].map((l, i) => (
                  <div key={i} style={{ position: 'absolute', left: l, top: -16, width: 14, height: 20, background: 'linear-gradient(180deg,#888,#bbb)', borderRadius: '0 0 4px 4px' }} />
                ))}
              </div>
              {/* Hanging garments */}
              <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 48px', gap: 8 }}>
                {['#c8a0a0','#a0b8c8','#b8c8a0','#c8b8a0','#a0a8c8'].map((c, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `sway ${2.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
                    <div style={{ width: 1, height: 22, background: '#888' }} />
                    <div style={{ width: 34, height: 48, background: c, borderRadius: '2px 2px 6px 6px', opacity: 0.75, boxShadow: '2px 4px 8px rgba(0,0,0,0.4)' }} />
                  </div>
                ))}
              </div>
              {/* Interior shelf */}
              <div className="shelf" style={{ margin: '16px 24px 0', height: 10, borderRadius: 2 }} />
            </div>

            {/* Center seam */}
            <div style={{
              position: 'absolute', insetBlock: 0, left: '50%',
              width: 4, background: '#0d0503', zIndex: 6,
              boxShadow: '0 0 10px rgba(0,0,0,0.9)',
            }} />

            {/* Doors */}
            <div className="absolute inset-0 flex" style={{ zIndex: 4, transformStyle: 'preserve-3d', overflow: 'visible' }}>
              <DoorPanel side="left"  isOpen={phase !== 'idle'} onHandleClick={handleClick} />
              <DoorPanel side="right" isOpen={phase !== 'idle'} onHandleClick={handleClick} />
            </div>
          </div>

          {/* Feet */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px', marginTop: -1, flexShrink: 0 }}>
            {[0,1].map(i => (
              <div key={i} style={{ width: 44, height: 16, background: 'linear-gradient(180deg,#3a1608,#1a0804)', borderRadius: '0 0 6px 6px', boxShadow: '0 6px 14px rgba(0,0,0,0.7)' }} />
            ))}
          </div>
        </motion.div>

        {/* Hint */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.0 }}
              style={{
                position: 'absolute', bottom: 48,
                fontFamily: 'Georgia, serif', fontSize: 12,
                letterSpacing: 3, textTransform: 'uppercase',
                color: 'rgba(184,150,46,0.5)',
              }}
            >
              Klikni na ročaj za odprtje
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
