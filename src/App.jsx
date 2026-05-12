import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginScreen from './components/LoginScreen'
import WardrobeIntro from './components/WardrobeIntro'
import WardrobeMain from './components/WardrobeMain'
import MannequinSection from './components/MannequinSection'

// ── Loading spinner ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, #2a1008 0%, #0d0503 100%)',
    }}>
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        style={{ fontFamily: 'Georgia, serif', fontSize: 13, letterSpacing: 5, textTransform: 'uppercase', color: 'rgba(184,150,46,0.6)' }}
      >
        Nalagam…
      </motion.div>
    </div>
  )
}

// ── Inner app (needs auth context to be mounted first) ────────────────────────
function AppContent() {
  const { user, authReady, logout, username } = useAuth()
  const [phase, setPhase] = useState('intro')

  // Reset intro whenever user switches accounts
  useEffect(() => { if (user) setPhase('intro') }, [user?.uid])

  if (!authReady) return <LoadingScreen />
  if (!user)      return <LoginScreen />

  return (
    <div style={{ background: '#1a0a04', minHeight: '100vh' }}>
      {/* ── Logout / username pill ── */}
      {phase === 'inside' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', top: 14, right: 14, zIndex: 50, display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            background: 'rgba(10,4,0,0.72)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(184,150,46,0.22)', borderRadius: 20,
            padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 11, color: 'rgba(245,234,216,0.55)', letterSpacing: 0.5 }}>
              👤 {username}
            </span>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
            <button
              onClick={logout}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, color: 'rgba(245,234,216,0.38)', letterSpacing: 0.5, padding: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(212,176,74,0.7)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,234,216,0.38)'}
            >
              Odjava
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Phase: intro door → inside wardrobe ── */}
      <AnimatePresence mode="wait">
        {phase === 'intro' ? (
          <WardrobeIntro key="intro" onEnter={() => setPhase('inside')} />
        ) : (
          <motion.div
            key="inside"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <WardrobeMain />
            <div style={{
              height: 3,
              background: 'linear-gradient(90deg, transparent, rgba(184,150,46,0.4), transparent)',
              margin: '0 48px',
            }} />
            <MannequinSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
