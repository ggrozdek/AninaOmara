import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Sparkles, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useWardrobeStore from '../store/wardrobeStore'
import { OUTFIT_SLOTS, getCategoryById } from '../utils/categories'

function OutfitCard({ outfit, onDelete }) {
  const items = useWardrobeStore((s) => s.items)
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const slotItems = OUTFIT_SLOTS.map((slot) => ({
    slot,
    item: items.find((i) => i.id === outfit.slots[slot.id]),
  })).filter((x) => x.item)

  const date = new Date(outfit.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(outfit.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2000)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden cursor-pointer card-lift"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
    >
      {/* Images grid */}
      <div
        className="relative aspect-square grid gap-0.5 overflow-hidden"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' }}
      >
        {slotItems.slice(0, 4).map(({ slot, item }, i) => (
          <div key={slot.id} className="overflow-hidden bg-black/20">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {getCategoryById(item.category)?.icon}
              </div>
            )}
          </div>
        ))}

        {slotItems.length === 0 && (
          <div
            className="col-span-2 row-span-2 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <span className="text-4xl opacity-30">✨</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(3,7,18,0.8) 0%, transparent 50%)' }}
        />

        {/* Count badge */}
        {slotItems.length > 4 && (
          <div
            className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-full text-white font-medium"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          >
            +{slotItems.length - 4}
          </div>
        )}

        {/* Delete */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleDelete}
              className="absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: confirmDelete ? 'rgba(239,68,68,0.85)' : 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <Trash2 size={14} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-white truncate">{outfit.name}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <Calendar size={11} />
            <span className="text-xs">{date}</span>
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {slotItems.length} piece{slotItems.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Outfits() {
  const outfits = useWardrobeStore((s) => s.outfits)
  const removeOutfit = useWardrobeStore((s) => s.removeOutfit)
  const navigate = useNavigate()

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
            <h1 className="text-4xl font-bold gradient-text">Saved Outfits</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>
              {outfits.length} outfit{outfits.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/builder')}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles size={16} />
            New Outfit
          </motion.button>
        </motion.div>

        {outfits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="text-8xl mb-6 animate-float">✨</div>
            <h3 className="text-2xl font-bold text-white mb-2">No outfits yet</h3>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Use the outfit builder to create your first look
            </p>
            <button className="btn-primary px-8 py-3 text-base" onClick={() => navigate('/builder')}>
              Open Outfit Builder
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {outfits.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} onDelete={removeOutfit} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
