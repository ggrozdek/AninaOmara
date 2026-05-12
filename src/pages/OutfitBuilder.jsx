import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Save, Sparkles, RotateCcw } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import useWardrobeStore from '../store/wardrobeStore'
import { OUTFIT_SLOTS, getCategoryById, getColorById } from '../utils/categories'

function MannequinSVG() {
  return (
    <svg viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Head */}
      <ellipse cx="100" cy="45" rx="28" ry="32" fill="rgba(255,255,255,0.06)" stroke="rgba(192,132,252,0.3)" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="90" y="74" width="20" height="18" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(192,132,252,0.2)" strokeWidth="1" />
      {/* Shoulders */}
      <path d="M40 100 Q100 88 160 100 L168 150 Q100 144 32 150 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(192,132,252,0.2)" strokeWidth="1.5" />
      {/* Torso */}
      <path d="M40 100 L32 220 Q100 230 168 220 L160 100 Q100 88 40 100Z" fill="rgba(255,255,255,0.04)" stroke="rgba(192,132,252,0.2)" strokeWidth="1.5" />
      {/* Left arm */}
      <path d="M40 105 Q18 140 22 200" stroke="rgba(192,132,252,0.25)" strokeWidth="18" strokeLinecap="round" fill="none" />
      {/* Right arm */}
      <path d="M160 105 Q182 140 178 200" stroke="rgba(192,132,252,0.25)" strokeWidth="18" strokeLinecap="round" fill="none" />
      {/* Hips */}
      <path d="M32 220 Q100 235 168 220 L172 260 Q100 270 28 260 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(192,132,252,0.2)" strokeWidth="1.5" />
      {/* Left leg */}
      <path d="M62 260 L55 380" stroke="rgba(192,132,252,0.25)" strokeWidth="24" strokeLinecap="round" fill="none" />
      {/* Right leg */}
      <path d="M138 260 L145 380" stroke="rgba(192,132,252,0.25)" strokeWidth="24" strokeLinecap="round" fill="none" />
      {/* Feet */}
      <ellipse cx="52" cy="385" rx="18" ry="8" fill="rgba(192,132,252,0.2)" />
      <ellipse cx="148" cy="385" rx="18" ry="8" fill="rgba(192,132,252,0.2)" />
    </svg>
  )
}

function SlotCard({ slot, item, isActive, onClick }) {
  const category = item ? getCategoryById(item.category) : null
  const color = item ? getColorById(item.color) : null

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: isActive
          ? 'rgba(192,132,252,0.12)'
          : 'rgba(255,255,255,0.04)',
        border: isActive
          ? '1.5px solid rgba(192,132,252,0.6)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isActive ? '0 0 20px rgba(192,132,252,0.2)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Image / placeholder */}
        <div
          className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {item?.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span style={{ opacity: 0.4 }}>{slot.icon}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {slot.label}
          </p>
          {item ? (
            <div>
              <p className="text-sm font-semibold text-white truncate">{item.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {color && (
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 inline-block"
                    style={{ background: color.hex }}
                  />
                )}
                {category && (
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {category.label}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Tap to add
            </p>
          )}
        </div>

        {isActive && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: 'rgba(192,132,252,0.3)', color: '#c084fc' }}
          >
            ●
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ItemCarousel({ slot, selectedId, onSelect, onClose }) {
  const items = useWardrobeStore((s) => s.items)
  const [page, setPage] = useState(0)
  const PER_PAGE = 6

  const eligible = useMemo(
    () => items.filter((item) => slot.categories.includes(item.category)),
    [items, slot.categories]
  )

  const pages = Math.ceil(eligible.length / PER_PAGE)
  const visible = eligible.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(10,5,30,0.95)',
        border: '1px solid rgba(192,132,252,0.2)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-white">
            {slot.icon} {slot.label}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {eligible.length} items available
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <X size={14} className="text-white" />
        </button>
      </div>

      {eligible.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-4xl mb-2">{slot.icon}</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No {slot.label.toLowerCase()} items yet
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Add some in the wardrobe
          </p>
        </div>
      ) : (
        <>
          {/* None option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(null)}
            className="w-full text-left p-2 rounded-xl mb-2 flex items-center gap-3 transition-all"
            style={{
              background: !selectedId ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.04)',
              border: !selectedId ? '1px solid rgba(192,132,252,0.4)' : '1px solid transparent',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              ✕
            </div>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              None / Remove
            </span>
          </motion.button>

          <div className="grid grid-cols-3 gap-2">
            <AnimatePresence mode="popLayout">
              {visible.map((item) => {
                const isSelected = item.id === selectedId
                return (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    whileHover={{ y: -2 }}
                    onClick={() => onSelect(item.id)}
                    className="rounded-xl overflow-hidden text-left"
                    style={{
                      background: isSelected ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.04)',
                      border: isSelected
                        ? '1.5px solid rgba(192,132,252,0.6)'
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isSelected ? '0 0 12px rgba(192,132,252,0.25)' : 'none',
                    }}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-2xl"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          {getCategoryById(item.category)?.icon}
                        </div>
                      )}
                      {isSelected && (
                        <div
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8)' }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="p-1.5">
                      <p className="text-xs font-medium text-white truncate">{item.name}</p>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <ChevronLeft size={14} className="text-white" />
              </button>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {page + 1} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                disabled={page === pages - 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <ChevronRight size={14} className="text-white" />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

function OutfitPreview({ slots, slotItems }) {
  const hasItems = Object.values(slotItems).some(Boolean)

  return (
    <div
      className="rounded-3xl p-6 h-full flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <h3 className="text-sm font-semibold mb-4 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
        OUTFIT PREVIEW
      </h3>

      <div className="relative flex-1 flex items-center justify-center">
        {/* Mannequin */}
        <div className="relative w-40 h-80">
          <MannequinSVG />

          {/* Overlay clothing images */}
          {slots.map((slot) => {
            const item = slotItems[slot.id]
            if (!item?.image) return null

            const positions = {
              head: { top: '0%', left: '15%', width: '70%', height: '22%' },
              outer: { top: '18%', left: '5%', width: '90%', height: '42%' },
              top: { top: '20%', left: '10%', width: '80%', height: '38%' },
              bottom: { top: '55%', left: '12%', width: '76%', height: '36%' },
              shoes: { top: '89%', left: '8%', width: '84%', height: '11%' },
              accessory: { top: '25%', right: '-20%', width: '35%', height: '25%' },
            }
            const pos = positions[slot.id]
            if (!pos) return null

            return (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.92, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute overflow-hidden rounded-lg"
                style={{
                  ...pos,
                  zIndex: slot.id === 'outer' ? 3 : slot.id === 'top' ? 2 : 1,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  style={{ mixBlendMode: 'normal' }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Glow behind mannequin */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: hasItems
              ? 'radial-gradient(ellipse at center, rgba(192,132,252,0.08) 0%, transparent 70%)'
              : 'none',
          }}
        />
      </div>

      {/* Item count */}
      <div className="text-center mt-4">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {Object.values(slotItems).filter(Boolean).length} pieces selected
        </p>
      </div>
    </div>
  )
}

function AIStyleCard({ slotItems, slots }) {
  const items = useWardrobeStore((s) => s.items)

  const selected = slots
    .map((s) => ({ slot: s, item: items.find((i) => i.id === slotItems[s.id]) }))
    .filter((x) => x.item)

  if (selected.length === 0) return null

  const styles = [...new Set(selected.map((x) => x.item.style).filter(Boolean))]
  const colors = [...new Set(selected.map((x) => x.item.color).filter(Boolean))]
  const seasons = [...new Set(selected.map((x) => x.item.season).filter(Boolean))]

  const dominantStyle = styles[0] || 'versatile'
  const colorPalette = colors.slice(0, 3)

  const vibes = {
    casual: ['Relaxed & effortless', 'Perfect for a chill day out', 'Easy, breezy confidence'],
    formal: ['Polished & sophisticated', 'Ready for any occasion', 'Power dressing done right'],
    sport: ['Active & energized', 'Move in style', 'Sporty chic'],
    streetwear: ['Bold & expressive', 'Street-ready look', 'Urban edge'],
    elegant: ['Timeless elegance', 'Gracefully put together', 'Classic refined charm'],
    vintage: ['Retro with a twist', 'Nostalgic & unique', 'Timeless vintage flair'],
    minimalist: ['Clean & intentional', 'Less is more', 'Quiet luxury'],
    chic: ['Effortlessly chic', 'Sophisticated simplicity', 'French girl approved'],
    boho: ['Free-spirited & creative', 'Boho goddess energy', 'Artsy & carefree'],
  }

  const vibe = vibes[dominantStyle] || ['Uniquely you', 'A look all your own', 'Style on your terms']
  const tagline = vibe[Math.floor(Math.random() * vibe.length)]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 mt-4"
      style={{
        background: 'linear-gradient(135deg, rgba(192,132,252,0.08), rgba(129,140,248,0.08))',
        border: '1px solid rgba(192,132,252,0.2)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} style={{ color: '#c084fc' }} />
        <span className="text-sm font-semibold" style={{ color: '#c084fc' }}>
          Style Read
        </span>
      </div>

      <p className="text-base font-bold text-white mb-2">"{tagline}"</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {styles.map((s) => (
          <span key={s} className="tag">{s}</span>
        ))}
        {seasons.filter((s) => s !== 'all').map((s) => (
          <span key={s} className="tag" style={{ borderColor: 'rgba(129,140,248,0.4)', color: '#818cf8', background: 'rgba(129,140,248,0.1)' }}>
            {s}
          </span>
        ))}
      </div>

      {colorPalette.length > 0 && (
        <div>
          <p className="text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Color palette</p>
          <div className="flex gap-1.5">
            {colorPalette.map((cId) => {
              const c = getColorById(cId)
              return c ? (
                <div key={cId} className="flex items-center gap-1">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ background: c.hex }}
                  />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.label}</span>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {selected.length} piece{selected.length !== 1 ? 's' : ''} •{' '}
          {selected.map((x) => x.item.name).join(', ')}
        </p>
      </div>
    </motion.div>
  )
}

export default function OutfitBuilder() {
  const items = useWardrobeStore((s) => s.items)
  const saveOutfit = useWardrobeStore((s) => s.saveOutfit)

  const [activeSlot, setActiveSlot] = useState(null)
  const [slotItems, setSlotItems] = useState({})
  const [outfitName, setOutfitName] = useState('')
  const [saved, setSaved] = useState(false)

  const getItem = (slotId) => {
    const itemId = slotItems[slotId]
    return items.find((i) => i.id === itemId) || null
  }

  const handleSlotClick = (slotId) => {
    setActiveSlot(activeSlot === slotId ? null : slotId)
  }

  const handleSelect = (slotId, itemId) => {
    setSlotItems((prev) => ({ ...prev, [slotId]: itemId || null }))
    setActiveSlot(null)
  }

  const handleReset = () => {
    setSlotItems({})
    setActiveSlot(null)
    setOutfitName('')
    setSaved(false)
  }

  const handleSave = () => {
    const hasItems = Object.values(slotItems).some(Boolean)
    if (!hasItems) return

    saveOutfit({
      id: uuidv4(),
      name: outfitName || `Outfit ${new Date().toLocaleDateString()}`,
      slots: slotItems,
      createdAt: new Date().toISOString(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const activeSlotDef = OUTFIT_SLOTS.find((s) => s.id === activeSlot)

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold gradient-text">Outfit Builder</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>
              Mix and match your wardrobe
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="btn-ghost flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={16} />
              {saved ? 'Saved!' : 'Save Outfit'}
            </motion.button>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="text-7xl mb-4 animate-float">✨</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Your wardrobe is empty
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>
              Add some clothes first to start building outfits
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Slots */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-3"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                Select Pieces
              </h2>
              {OUTFIT_SLOTS.map((slot) => (
                <div key={slot.id}>
                  <SlotCard
                    slot={slot}
                    item={getItem(slot.id)}
                    isActive={activeSlot === slot.id}
                    onClick={() => handleSlotClick(slot.id)}
                  />
                  <AnimatePresence>
                    {activeSlot === slot.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2"
                      >
                        <ItemCarousel
                          slot={slot}
                          selectedId={slotItems[slot.id]}
                          onSelect={(id) => handleSelect(slot.id, id)}
                          onClose={() => setActiveSlot(null)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            {/* Center: Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <OutfitPreview slots={OUTFIT_SLOTS} slotItems={slotItems} />
              </div>
            </motion.div>

            {/* Right: AI Style + Save */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                Outfit Details
              </h2>

              {/* Outfit name */}
              <input
                className="input-glass mb-4"
                placeholder="Give this outfit a name..."
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
              />

              {/* Style read */}
              <AIStyleCard slotItems={slotItems} slots={OUTFIT_SLOTS} />

              {/* Quick summary */}
              {Object.values(slotItems).some(Boolean) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <h3 className="text-sm font-semibold mb-3 text-white">This look includes</h3>
                  {OUTFIT_SLOTS.map((slot) => {
                    const item = getItem(slot.id)
                    if (!item) return null
                    return (
                      <div key={slot.id} className="flex items-center gap-3 mb-2">
                        <span className="text-base">{slot.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{item.name}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {slot.label}
                          </p>
                        </div>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
