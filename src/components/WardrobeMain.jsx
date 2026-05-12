import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import ClothingPile, { BASE_PILES } from './ClothingPile'
import PileModal from './PileModal'
import useWardrobeStore from '../store/wardrobeStore'

function slKos(n) {
  if (n === 1) return 'kos'
  if (n >= 2 && n <= 4) return 'kosi'
  return 'kosov'
}

const CUSTOM_PILE_ICONS = ['🎽','👗','🧣','🧤','🩱','🩲','🩳','🎩','🥻','🩴','🧦','🩰']

// ── Shelf plank ──────────────────────────────────────────────────────────────
function Shelf({ children, style = {} }) {
  return (
    <div className="relative" style={style}>
      <div className="shelf absolute left-0 right-0" style={{ top: 0, height: 13, zIndex: 2, borderRadius: '2px 2px 0 0' }} />
      <div style={{
        position: 'absolute', top: 11, left: 0, right: 0, height: 9,
        background: 'linear-gradient(180deg,#5c2810,#3a1808)',
        borderRadius: '0 0 2px 2px', boxShadow: '0 4px 12px rgba(0,0,0,0.6)', zIndex: 1,
      }} />
      <div style={{ paddingTop: 20 }}>{children}</div>
    </div>
  )
}

// ── Drugo / add-custom button ────────────────────────────────────────────────
function DrugoPile({ onClick }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{ minWidth: 80, cursor: 'pointer' }}
    >
      <div style={{ width: 82, position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: -7, left: '8%', right: '8%',
          height: 10, background: 'rgba(0,0,0,0.4)', filter: 'blur(5px)', borderRadius: '50%',
        }} />
        <div style={{
          width: 82, height: 90,
          border: '2px dashed rgba(184,150,46,0.4)', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(184,150,46,0.05)',
          transition: 'all 0.2s',
        }}>
          <Plus size={28} style={{ color: 'rgba(184,150,46,0.5)' }} />
        </div>
      </div>
      <p className="pile-label" style={{ color: 'rgba(184,150,46,0.55)' }}>Drugo</p>
      <p className="pile-count">nova vrsta</p>
    </motion.div>
  )
}

// ── Hanging item (jakne / torbice) ───────────────────────────────────────────
function HangingClothes({ pileKey, config, onClick, swayDelay = 0 }) {
  const items = useWardrobeStore((s) => s.items)
  const count = items.filter((i) => config.categories.includes(i.category)).length
  const topItem = items.find((i) => config.categories.includes(i.category) && i.image)
  const isBag = pileKey === 'torbice'

  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: 100 }}
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(pileKey)}
    >
      {/* Entire hanger unit swings as one piece */}
      <div style={{
        animation: `sway ${2.5 + swayDelay * 0.5}s ease-in-out infinite`,
        animationDelay: `${swayDelay * 0.38}s`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        filter: 'drop-shadow(3px 7px 14px rgba(0,0,0,0.7))',
        transformOrigin: 'top center',
      }}>
        {/* Wire from rod */}
        <div style={{ width: 2, height: 24, background: 'linear-gradient(180deg,#ccc 0%,#888 100%)' }} />

        {/* Hanger shape */}
        {isBag ? (
          /* Bag loop / strap hook */
          <div style={{
            width: 28, height: 16,
            borderTop: '2.5px solid #bbb',
            borderLeft: '2.5px solid #bbb',
            borderRight: '2.5px solid #bbb',
            borderBottom: 'none',
            borderRadius: '12px 12px 0 0',
          }} />
        ) : (
          /* Coat-hanger shoulders */
          <div style={{ position: 'relative', width: 94, height: 15 }}>
            <div style={{
              position: 'absolute', inset: 0,
              borderLeft: '2.5px solid #bbb',
              borderRight: '2.5px solid #bbb',
              borderTop: '2.5px solid #bbb',
              borderBottom: 'none',
              borderRadius: '10px 10px 0 0',
            }} />
          </div>
        )}

        {/* Item image / placeholder */}
        <div style={{
          width: isBag ? 84 : 94,
          height: isBag ? 82 : 112,
          borderRadius: isBag ? '0 0 10px 10px' : '0 0 8px 8px',
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(10,4,0,0.7)',
          border: '1px solid rgba(180,120,60,0.2)',
          borderTop: isBag ? '1px solid rgba(180,120,60,0.2)' : 'none',
        }}>
          {topItem?.image ? (
            <img
              src={topItem.image}
              alt={config.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span style={{ fontSize: 34, opacity: 0.32 }}>{config.icon}</span>
            </div>
          )}
          {count > 1 && (
            <div style={{
              position: 'absolute', top: 5, right: 5,
              background: 'rgba(184,150,46,0.92)', color: '#2a0e04',
              borderRadius: 8, padding: '1px 6px', fontSize: 10, fontWeight: 800, lineHeight: 1.5,
            }}>+{count - 1}</div>
          )}
        </div>
      </div>

      <p className="pile-label" style={{ marginTop: 10 }}>{config.label}</p>
      <p className="pile-count">{count} {slKos(count)}</p>
    </motion.div>
  )
}

// ── Floor shoes ───────────────────────────────────────────────────────────────
function FloorShoes({ pileKey, config, onClick }) {
  const items = useWardrobeStore((s) => s.items)
  const count = items.filter((i) => config.categories.includes(i.category)).length
  const topItem = items.find((i) => config.categories.includes(i.category) && i.image)

  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: 110 }}
      whileHover={{ y: -5, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(pileKey)}
    >
      <div style={{ position: 'relative' }}>
        {/* Floor shadow (standing effect) */}
        <div style={{
          position: 'absolute', bottom: -8, left: '5%', right: '5%',
          height: 10, background: 'rgba(0,0,0,0.55)', filter: 'blur(6px)', borderRadius: '50%',
        }} />

        {/* Shoe display */}
        <div style={{
          width: 110, height: 82,
          borderRadius: 10, overflow: 'hidden',
          background: topItem?.image ? 'none' : 'rgba(10,4,0,0.6)',
          border: '1px solid rgba(180,120,60,0.25)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {topItem?.image ? (
            <img
              src={topItem.image}
              alt={config.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span style={{ fontSize: 36, opacity: 0.36 }}>{config.icon}</span>
            </div>
          )}
        </div>

        {count > 1 && (
          <div style={{
            position: 'absolute', top: -8, right: -8,
            background: 'rgba(184,150,46,0.92)', color: '#2a0e04',
            borderRadius: 9, padding: '1px 7px', fontSize: 10, fontWeight: 800, lineHeight: 1.5,
            zIndex: 1,
          }}>+{count - 1}</div>
        )}
      </div>

      <p className="pile-label" style={{ marginTop: 18 }}>{config.label}</p>
      <p className="pile-count">{count} {slKos(count)}</p>
    </motion.div>
  )
}

// ── Add custom pile modal ─────────────────────────────────────────────────────
function AddCustomPileModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🎽')

  const handleAdd = () => {
    if (!name.trim()) return
    const id = 'custom_' + uuidv4().slice(0, 8)
    onAdd({ id, label: name.trim(), icon, categories: [id] })
    onClose()
  }

  return (
    <motion.div
      className="pile-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        style={{
          background: 'linear-gradient(180deg, #4a2210, #3a1a08)',
          border: '1px solid rgba(184,150,46,0.4)',
          borderTop: '2px solid rgba(184,150,46,0.4)',
          borderRadius: '20px 20px 0 0',
          padding: '32px 32px 48px',
          width: '100%', maxWidth: 480,
          boxShadow: '0 -20px 60px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#f5ead8' }}>Nova vrsta oblačil</h2>
          <button onClick={onClose} aria-label="Zapri" style={{ background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 10, padding: 6, cursor: 'pointer', color: 'rgba(245,234,216,0.5)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.5)', marginBottom: 8 }}>
            Ime kategorije
          </label>
          <input
            className="input-wood"
            placeholder="npr. Obleke, Pižame, Kopalne..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.5)', marginBottom: 10 }}>
            Ikona
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CUSTOM_PILE_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  width: 40, height: 40, borderRadius: 10, fontSize: 22,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: icon === ic ? 'rgba(184,150,46,0.25)' : 'rgba(0,0,0,0.2)',
                  border: icon === ic ? '2px solid rgba(184,150,46,0.7)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: icon === ic ? '0 0 10px rgba(184,150,46,0.3)' : 'none',
                  transform: icon === ic ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.15s',
                }}
              >{ic}</button>
            ))}
          </div>
        </div>

        <button
          className="btn-brass"
          style={{ width: '100%', opacity: !name.trim() ? 0.5 : 1 }}
          onClick={handleAdd}
          disabled={!name.trim()}
        >
          Ustvari kup
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function WardrobeMain() {
  const customPiles = useWardrobeStore((s) => s.customPiles)
  const addCustomPile = useWardrobeStore((s) => s.addCustomPile)

  const [openPile, setOpenPile] = useState(null)
  const [showAddCustom, setShowAddCustom] = useState(false)

  const allPileConfigs = {
    ...BASE_PILES,
    ...Object.fromEntries(
      customPiles.map((p) => [p.id, {
        label: p.label, icon: p.icon,
        categories: [p.id],
        layers: ['#9a9a9a','#7a7a7a','#b0b0b0','#6a6a6a','#aaaaaa','#888888'],
      }])
    ),
  }

  // Layout assignment
  const shelfKeys   = ['majice', 'puloverji', 'hlace', ...customPiles.map((p) => p.id)]
  const hangingKeys = ['jakne', 'torbice']
  const floorKeys   = ['cevlji']

  const openPileConfig = openPile ? allPileConfigs[openPile] : null

  return (
    <>
      <div className="relative min-h-screen flex flex-col" style={{ overflow: 'hidden' }}>
        {/* Back wall */}
        <div className="wardrobe-back-wall absolute inset-0 -z-10" />

        {/* Side walls */}
        <div className="wardrobe-side-wall absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: 56, clipPath: 'polygon(0 0,100% 5%,100% 95%,0 100%)', boxShadow: 'inset -10px 0 28px rgba(0,0,0,0.45)' }} />
        <div className="wardrobe-side-wall absolute right-0 top-0 bottom-0 pointer-events-none"
          style={{ width: 56, clipPath: 'polygon(0 5%,100% 0,100% 100%,0 95%)', boxShadow: 'inset 10px 0 28px rgba(0,0,0,0.45)' }} />

        {/* Ceiling warm light */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 220,
          background: 'radial-gradient(ellipse 65% 100% at 50% 0%, rgba(220,160,60,0.13) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Crown */}
        <div className="wardrobe-crown flex-shrink-0 mx-12" style={{ height: 32, borderRadius: '0 0 5px 5px', borderTop: 'none' }} />

        {/* ── POLICA: Majice, Puloverji, Hlače + custom ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="mx-10 mt-4 flex-shrink-0"
        >
          <Shelf>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '18px 20px 28px', gap: 10, flexWrap: 'wrap' }}>
              {shelfKeys.map((key) => (
                <ClothingPile key={key} pileKey={key} config={allPileConfigs[key]} onClick={setOpenPile} />
              ))}
              <DrugoPile onClick={() => setShowAddCustom(true)} />
            </div>
          </Shelf>
        </motion.div>

        {/* ── OBEŠALNIK: Jakne, Torbice ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="mx-10 mt-10 flex-shrink-0"
        >
          {/* Rod + brackets */}
          <div style={{ position: 'relative', height: 12 }}>
            <div className="hanging-rod w-full h-full" />
            {[0, '50%', 'calc(100% - 14px)'].map((l, i) => (
              <div key={i} style={{
                position: 'absolute', left: l, top: -16, width: 14, height: 20,
                background: 'linear-gradient(180deg,#888,#bbb)', borderRadius: '0 0 3px 3px',
              }} />
            ))}
          </div>

          {/* Hung items */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 80px' }}>
            {hangingKeys.map((key, i) => (
              <HangingClothes key={key} pileKey={key} config={allPileConfigs[key]} onClick={setOpenPile} swayDelay={i} />
            ))}
          </div>
        </motion.div>

        {/* ── TLA: Čevlji ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
          className="mx-8 mt-8 flex-shrink-0"
        >
          {/* Floor plank */}
          <div style={{
            height: 8,
            background: 'linear-gradient(180deg,#7a3f1a 0%,#5c2810 55%,#3a1808 100%)',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
            borderRadius: '2px 2px 0 0',
          }} />
          {/* Floor surface */}
          <div style={{
            background: 'linear-gradient(180deg,#2e1208 0%,#1e0a04 100%)',
            padding: '24px 0 36px',
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 48,
          }}>
            {floorKeys.map((key) => (
              <FloorShoes key={key} pileKey={key} config={allPileConfigs[key]} onClick={setOpenPile} />
            ))}
          </div>
        </motion.div>

        {/* ── Scroll hint ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, marginBottom: 20, flexShrink: 0 }}
        >
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(184,150,46,0.48)', marginBottom: 6 }}>
            Drsaj navzdol za sestavljalnik oblačil
          </p>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
            <ChevronDown size={18} style={{ color: 'rgba(184,150,46,0.4)' }} />
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
          background: 'linear-gradient(180deg,transparent,rgba(10,4,2,0.85))',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Pile modal */}
      <AnimatePresence>
        {openPile && openPileConfig && (
          <PileModal key={openPile} pileKey={openPile} config={openPileConfig} onClose={() => setOpenPile(null)} />
        )}
      </AnimatePresence>

      {/* Add custom pile modal */}
      <AnimatePresence>
        {showAddCustom && (
          <AddCustomPileModal onClose={() => setShowAddCustom(false)} onAdd={addCustomPile} />
        )}
      </AnimatePresence>
    </>
  )
}
