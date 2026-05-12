import { useState, useMemo } from 'react'

// Slovenian plural: 1 kos, 2-4 kosi, 5+ kosov
function slKos(n) {
  if (n === 1) return 'kos'
  if (n >= 2 && n <= 4) return 'kosi'
  return 'kosov'
}
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Save, RotateCcw, Sparkles } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import useWardrobeStore from '../store/wardrobeStore'
import { BASE_PILES } from './ClothingPile'

const SLOTS = [
  { id: 'top',    label: 'Zgornji del', icon: '👕', cats: ['tops','tshirt','blouse','hoodie','sweater','tracksuit','dress'] },
  { id: 'bottom', label: 'Spodnji del', icon: '👖', cats: ['jeans','shorts','skirt','trousers','tracksuit','dress'] },
  { id: 'outer',  label: 'Zunanja plast', icon: '🧥', cats: ['jacket','coat'] },
  { id: 'shoes',  label: 'Čevlji', icon: '👟', cats: ['shoes','sneakers','heels','boots'] },
]

const STYLE_VIBES = {
  Sproščen: 'Sproščeno in brezskrbno',
  Formalen: 'Elegantno in prefinjeno',
  Šport: 'Aktivno in energično',
  Uličen: 'Drzno in izrazito',
  Eleganten: 'Brezčasna eleganca',
  Vintage: 'Retro šarm',
  Minimalist: 'Tiha luksuznost',
  Boho: 'Svobodomiselno in kreativno',
}

function MannequinSVG() {
  return (
    <svg viewBox="0 0 200 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}>
      <ellipse cx="100" cy="42" rx="26" ry="30" fill="rgba(200,160,100,0.1)" stroke="rgba(184,150,46,0.35)" strokeWidth="1.5" />
      <rect x="91" y="70" width="18" height="15" rx="4" fill="rgba(200,160,100,0.07)" stroke="rgba(184,150,46,0.2)" strokeWidth="1" />
      <path d="M38 95 Q100 84 162 95 L166 215 Q100 224 34 215 Z" fill="rgba(200,160,100,0.07)" stroke="rgba(184,150,46,0.28)" strokeWidth="1.5" />
      <path d="M38 100 Q16 138 20 205" stroke="rgba(184,150,46,0.18)" strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M162 100 Q184 138 180 205" stroke="rgba(184,150,46,0.18)" strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M34 215 Q100 228 166 215 L170 256 Q100 268 30 256 Z" fill="rgba(200,160,100,0.06)" stroke="rgba(184,150,46,0.22)" strokeWidth="1.5" />
      <path d="M60 256 L52 390" stroke="rgba(184,150,46,0.18)" strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M140 256 L148 390" stroke="rgba(184,150,46,0.18)" strokeWidth="26" strokeLinecap="round" fill="none" />
      <ellipse cx="49" cy="396" rx="20" ry="9" fill="rgba(184,150,46,0.15)" />
      <ellipse cx="151" cy="396" rx="20" ry="9" fill="rgba(184,150,46,0.15)" />
      <path d="M80 95 Q100 88 120 95 L118 200 Q100 206 82 200 Z" fill="rgba(255,255,255,0.025)" />
    </svg>
  )
}

function ItemPicker({ slot, selectedId, onSelect, onClose }) {
  const items = useWardrobeStore((s) => s.items)
  const customPiles = useWardrobeStore((s) => s.customPiles)
  const [page, setPage] = useState(0)
  const PER = 6

  const eligibleFiltered = useMemo(() => items.filter((i) => slot.cats.includes(i.category)), [items, slot.cats])

  const allOpts = [null, ...eligibleFiltered]
  const pages = Math.ceil(allOpts.length / PER)
  const visible = allOpts.slice(page * PER, (page + 1) * PER)

  return (
    <motion.div initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }} transition={{ duration: 0.2 }}
      style={{ background: 'linear-gradient(180deg,#3a1a08,#2a1008)', border: '1px solid rgba(184,150,46,0.3)', borderRadius: 14, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ fontFamily: 'Georgia, serif', color: '#f5ead8', fontSize: 13 }}>{slot.icon} {slot.label} — {eligibleFiltered.length} {slKos(eligibleFiltered.length)}</p>
        <button onClick={onClose} aria-label="Zapri" style={{ background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer', borderRadius: 7, padding: 4, color: 'rgba(245,234,216,0.5)', display: 'flex' }}><X size={13} /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {visible.map((item) => {
          const isNone = item === null
          const isSel = isNone ? !selectedId : item.id === selectedId
          return (
            <motion.button key={isNone ? 'none' : item.id} whileHover={{ y: -2 }} onClick={() => onSelect(isNone ? null : item.id)}
              style={{ borderRadius: 9, overflow: 'hidden', cursor: 'pointer', border: isSel ? '1.5px solid rgba(184,150,46,0.75)' : '1px solid rgba(255,255,255,0.08)', background: isSel ? 'rgba(184,150,46,0.1)' : 'rgba(0,0,0,0.22)', boxShadow: isSel ? '0 0 10px rgba(184,150,46,0.2)' : 'none', transition: 'all 0.14s' }}>
              <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {isNone ? <X size={18} style={{ color: 'rgba(245,234,216,0.22)' }} />
                  : item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 26 }}>{slot.icon}</span>}
                {isSel && !isNone && (
                  <div style={{ position: 'absolute', top: 3, right: 3, width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#b8962e,#d4b04a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#3d1f0d', fontWeight: 700 }}>✓</div>
                )}
              </div>
              <p style={{ fontSize: 10, color: 'rgba(245,234,216,0.55)', padding: '3px 5px 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isNone ? 'Brez' : item.name}
              </p>
            </motion.button>
          )
        })}
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }}>
          <button disabled={page === 0} aria-label="Prejšnja stran" onClick={() => setPage(p => p - 1)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: page === 0 ? 'not-allowed' : 'pointer', borderRadius: 7, padding: '3px 7px', opacity: page === 0 ? 0.3 : 1, color: 'rgba(245,234,216,0.5)' }}><ChevronLeft size={13} /></button>
          <span style={{ fontSize: 11, color: 'rgba(245,234,216,0.4)' }}>{page + 1}/{pages}</span>
          <button disabled={page >= pages - 1} aria-label="Naslednja stran" onClick={() => setPage(p => p + 1)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: page >= pages - 1 ? 'not-allowed' : 'pointer', borderRadius: 7, padding: '3px 7px', opacity: page >= pages - 1 ? 0.3 : 1, color: 'rgba(245,234,216,0.5)' }}><ChevronRight size={13} /></button>
        </div>
      )}
    </motion.div>
  )
}

export default function MannequinSection() {
  const items = useWardrobeStore((s) => s.items)
  const saveOutfit = useWardrobeStore((s) => s.saveOutfit)
  const [selected, setSelected] = useState({})
  const [activeSlot, setActiveSlot] = useState(null)
  const [outfitName, setOutfitName] = useState('')
  const [savedMsg, setSavedMsg] = useState(false)

  const getItem = (slotId) => items.find((i) => i.id === selected[slotId])
  const selectedItems = SLOTS.map(s => getItem(s.id)).filter(Boolean)

  const styles = [...new Set(selectedItems.map(i => i.style).filter(Boolean))]
  const vibe = STYLE_VIBES[styles[0]] || 'Edinstveno tvoje ✨'

  const handleSave = () => {
    if (!selectedItems.length) return
    saveOutfit({ id: uuidv4(), name: outfitName || `Kombinacija ${new Date().toLocaleDateString('sl')}`, slots: selected, createdAt: new Date().toISOString() })
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const overlayPositions = {
    top:    { top: '19%', left: '8%',  width: '84%', height: '36%', zIndex: 2 },
    outer:  { top: '16%', left: '4%',  width: '92%', height: '42%', zIndex: 3 },
    bottom: { top: '53%', left: '10%', width: '80%', height: '33%', zIndex: 1 },
    shoes:  { top: '89%', left: '8%',  width: '84%', height: '11%', zIndex: 2 },
  }

  return (
    <div className="mannequin-section" style={{ minHeight: '100vh', paddingTop: 56, paddingBottom: 80 }}>
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, color: '#f5ead8', letterSpacing: 2, marginBottom: 6 }}>Sestavljalnik oblačil</h2>
        <p style={{ fontSize: 11, color: 'rgba(184,150,46,0.55)', letterSpacing: 3, textTransform: 'uppercase' }}>Sestavi svojo kombinacijo</p>
      </motion.div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(245,234,216,0.4)' }}>
          <p style={{ fontSize: 44, marginBottom: 12 }}>✨</p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 17 }}>Najprej dodaj oblačila v omaro</p>
        </div>
      ) : (
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, alignItems: 'start' }}>

          {/* Left — slots */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(184,150,46,0.5)', marginBottom: 12 }}>Izberi kose</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SLOTS.map((slot) => {
                const item = getItem(slot.id)
                const isActive = activeSlot === slot.id
                return (
                  <div key={slot.id}>
                    <div className={`slot-card flex items-center gap-3 p-3 ${isActive ? 'active' : ''}`} onClick={() => setActiveSlot(isActive ? null : slot.id)} style={{ cursor: 'pointer' }}>
                      <div style={{ width: 50, height: 50, borderRadius: 9, overflow: 'hidden', background: 'rgba(0,0,0,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item?.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 22, opacity: 0.35 }}>{slot.icon}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 10, color: 'rgba(184,150,46,0.55)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{slot.label}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: item ? '#f5ead8' : 'rgba(245,234,216,0.28)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item ? item.name : 'Dotakni se za izbiro'}
                        </p>
                      </div>
                      {isActive && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d4b04a', flexShrink: 0 }} />}
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginTop: 8 }}>
                          <ItemPicker slot={slot} selectedId={selected[slot.id]} onSelect={(id) => { setSelected(s => ({ ...s, [slot.id]: id })); setActiveSlot(null) }} onClose={() => setActiveSlot(null)} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Center — mannequin */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 260, background: 'linear-gradient(180deg,rgba(28,12,4,0.95),rgba(18,7,2,0.8))', border: '1px solid rgba(184,150,46,0.12)', borderRadius: 18, padding: '22px 14px 18px', position: 'relative', overflow: 'hidden' }}>
              {/* Spotlight */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 100, height: 70, background: 'radial-gradient(ellipse, rgba(220,180,80,0.14) 0%,transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', height: 340 }}>
                <MannequinSVG />
                {Object.entries(overlayPositions).map(([slotId, pos]) => {
                  const item = getItem(slotId)
                  if (!item?.image) return null
                  return (
                    <motion.div key={slotId} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 0.9, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', borderRadius: 5, overflow: 'hidden', ...pos }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                  )
                })}
              </div>
              <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(184,150,46,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 6 }}>
                {selectedItems.length} {slKos(selectedItems.length)}
              </p>
            </div>
          </motion.div>

          {/* Right — save + style read */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(184,150,46,0.5)', marginBottom: 4 }}>Shrani kombinacijo</p>

            <input className="input-wood" placeholder="Poimenuj kombinacijo..." value={outfitName} onChange={(e) => setOutfitName(e.target.value)} />

            {/* Style read */}
            <AnimatePresence>
              {selectedItems.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ background: 'linear-gradient(135deg,rgba(184,150,46,0.09),rgba(120,60,20,0.09))', border: '1px solid rgba(184,150,46,0.22)', borderRadius: 13, padding: 15 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                    <Sparkles size={13} style={{ color: '#d4b04a' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#d4b04a', textTransform: 'uppercase' }}>Tvoj stil</span>
                  </div>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#f5ead8', marginBottom: 10 }}>"{vibe}"</p>
                  {styles.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {styles.map(s => <span key={s} className="tag-brass">{s}</span>)}
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                    {SLOTS.map(slot => {
                      const item = getItem(slot.id)
                      if (!item) return null
                      return (
                        <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 13 }}>{slot.icon}</span>
                          <p style={{ flex: 1, fontSize: 12, color: '#f5ead8', fontWeight: 600 }}>{item.name}</p>
                          {item.image && <img src={item.image} alt="" style={{ width: 26, height: 26, borderRadius: 5, objectFit: 'cover' }} />}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-wood" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={() => { setSelected({}); setActiveSlot(null) }}>
                <RotateCcw size={13} /> Ponastavi
              </button>
              <button className="btn-brass" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: selectedItems.length === 0 ? 0.5 : 1 }}
                onClick={handleSave}>
                <Save size={13} /> {savedMsg ? 'Shranjeno!' : 'Shrani'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
