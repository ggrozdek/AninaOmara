import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ── Small field component ─────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, error, autoFocus }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
        textTransform: 'uppercase', color: 'rgba(245,234,216,0.45)', marginBottom: 7,
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="input-wood"
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{ paddingRight: isPassword ? 44 : 14 }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Skrij geslo' : 'Pokaži geslo'}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(245,234,216,0.35)', display: 'flex', padding: 0,
            }}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 11, color: 'rgba(220,100,80,0.85)', marginTop: 5, lineHeight: 1.4 }}>{error}</p>
      )}
    </div>
  )
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) return
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      onSuccess?.()
    } catch (err) {
      const code = err.code || ''
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Napačno uporabniško ime ali geslo.')
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password prijava ni omogočena v Firebase. Odpri Firebase Console → Authentication → Sign-in method → Email/Password → Enabled.')
      } else if (code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key') {
        setError('Neveljaven Firebase API ključ. Preveri VITE_FIREBASE_API_KEY v .env.local.')
      } else if (code === 'auth/network-request-failed') {
        setError('Napaka omrežja. Preveri internetno povezavo.')
      } else {
        setError(`Napaka: ${err.message || code || 'Neznana napaka'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="Uporabniško ime" value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="tvoje_ime" autoFocus
      />
      <Field
        label="Geslo" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        error={error}
      />
      <button
        type="submit"
        className="btn-brass"
        disabled={loading || !username || !password}
        style={{ width: '100%', marginTop: 8, opacity: (!username || !password || loading) ? 0.55 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <LogIn size={14} />
        {loading ? 'Prijavljam...' : 'Odpri omaro'}
      </button>
    </form>
  )
}

// ── Register form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }) {
  const { register } = useAuth()
  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [password2, setPassword2] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [errors,    setErrors]    = useState({})

  const validate = () => {
    const e = {}
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
      e.username = 'Ime: 3–20 znakov, samo črke, številke in _'
    if (password.length < 6)
      e.password = 'Geslo mora imeti vsaj 6 znakov.'
    if (password !== password2)
      e.password2 = 'Gesli se ne ujemata.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setLoading(true)
    try {
      await register(username, password)
      onSuccess?.()
    } catch (err) {
      const code = err.code || ''
      let msg = err.message || 'Prišlo je do napake.'
      if (code === 'auth/operation-not-allowed') {
        msg = 'Email/Password prijava ni omogočena. Odpri Firebase Console → Authentication → Sign-in method → Email/Password → Enabled.'
      } else if (code === 'auth/weak-password') {
        msg = 'Geslo je prešibko. Uporabi vsaj 6 znakov.'
      } else if (code === 'auth/email-already-in-use') {
        msg = 'To uporabniško ime je že zasedeno.'
      } else if (code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key') {
        msg = 'Neveljaven Firebase API ključ. Preveri .env.local.'
      } else if (code === 'permission-denied' || code === 'auth/network-request-failed') {
        msg = `Firebase napaka (${code}): preveri Firestore pravila in Firebase Console nastavitve.`
      }
      setErrors({ global: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="Izberi uporabniško ime" value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="tvoje_ime" autoFocus
        error={errors.username}
      />
      <Field
        label="Geslo" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="vsaj 6 znakov"
        error={errors.password}
      />
      <Field
        label="Ponovi geslo" type="password" value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        placeholder="••••••••"
        error={errors.password2}
      />
      {errors.global && (
        <p style={{ fontSize: 12, color: 'rgba(220,100,80,0.85)', marginBottom: 10 }}>{errors.global}</p>
      )}
      <button
        type="submit"
        className="btn-brass"
        disabled={loading}
        style={{ width: '100%', marginTop: 4, opacity: loading ? 0.55 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <UserPlus size={14} />
        {loading ? 'Ustvarjam profil...' : 'Ustvari profil'}
      </button>
    </form>
  )
}

// ── Main LoginScreen ──────────────────────────────────────────────────────────
export default function LoginScreen() {
  const [tab, setTab] = useState('login') // 'login' | 'register'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, #2a1008 0%, #0d0503 100%)',
      padding: '24px 16px',
    }}>
      {/* Ceiling warm light */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 280,
        background: 'radial-gradient(ellipse, rgba(220,150,40,0.11) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 380 }}
      >
        {/* Crown decoration */}
        <div style={{
          background: 'linear-gradient(180deg, #9a5228 0%, #7a3818 50%, #5c2810 100%)',
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 5px, rgba(0,0,0,0.07) 5px, rgba(0,0,0,0.07) 6px), linear-gradient(180deg, #9a5228, #7a3818, #5c2810)',
          height: 44, borderRadius: '12px 12px 0 0',
          boxShadow: '0 -2px 20px rgba(0,0,0,0.5), inset 0 -2px 6px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 12, letterSpacing: 6, textTransform: 'uppercase', color: 'rgba(212,176,74,0.7)', fontWeight: 700 }}>
            Moja Omara
          </span>
        </div>

        {/* Panel */}
        <div style={{
          background: 'linear-gradient(180deg, #4a2210 0%, #3a1a08 100%)',
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.055) 6px, rgba(0,0,0,0.055) 7px), linear-gradient(180deg, #4a2210, #3a1a08)',
          border: '3px solid #1a0804', borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(180,120,60,0.12)',
          padding: '28px 32px 36px',
        }}>
          {/* Hanger icon */}
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 8 }}>🪝</div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: 'rgba(245,234,216,0.55)', letterSpacing: 1 }}>
              {tab === 'login' ? 'Dobrodošla nazaj' : 'Nov profil'}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(0,0,0,0.35)', borderRadius: 10,
            padding: 3, marginBottom: 24, border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {[{ id: 'login', label: 'Prijava' }, { id: 'register', label: 'Registracija' }].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: 'none', transition: 'all 0.18s',
                  background: tab === id ? 'linear-gradient(135deg,#b8962e,#d4b04a)' : 'transparent',
                  color: tab === id ? '#3d1f0d' : 'rgba(245,234,216,0.4)',
                  fontFamily: tab === id ? 'Georgia, serif' : 'Inter, sans-serif',
                  letterSpacing: tab === id ? 0.5 : 0,
                }}
              >{label}</button>
            ))}
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === 'login' ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'login' ? 12 : -12 }}
              transition={{ duration: 0.18 }}
            >
              {tab === 'login'
                ? <LoginForm />
                : <RegisterForm />
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feet */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 32px' }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              width: 36, height: 12,
              background: 'linear-gradient(180deg,#3a1608,#1a0804)',
              borderRadius: '0 0 5px 5px',
              boxShadow: '0 6px 14px rgba(0,0,0,0.7)',
            }} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
