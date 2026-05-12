import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Tag } from 'lucide-react'
import { useState } from 'react'
import useWardrobeStore from '../store/wardrobeStore'
import { getCategoryById, getColorById, getSeasonById } from '../utils/categories'

export default function ClothingCard({ item, selectable, selected, onSelect }) {
  const removeItem = useWardrobeStore((s) => s.removeItem)
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const category = getCategoryById(item.category)
  const color = getColorById(item.color)

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirmDelete) {
      removeItem(item.id)
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
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer card-lift"
      style={{
        background: selected
          ? 'rgba(192,132,252,0.12)'
          : 'rgba(255,255,255,0.04)',
        border: selected
          ? '1px solid rgba(192,132,252,0.5)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: selected ? '0 0 20px rgba(192,132,252,0.25)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
      onClick={() => onSelect?.(item)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-6xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {category?.icon || '👕'}
          </div>
        )}

        {/* Overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(3,7,18,0.8) 0%, transparent 60%)' }}
            />
          )}
        </AnimatePresence>

        {/* Delete button */}
        {!selectable && (
          <AnimatePresence>
            {hovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleDelete}
                className="absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: confirmDelete
                    ? 'rgba(239,68,68,0.8)'
                    : 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Trash2 size={14} className="text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        )}

        {/* Selected check */}
        {selected && (
          <div
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8)' }}
          >
            ✓
          </div>
        )}

        {/* Color dot */}
        {color && (
          <div
            className="absolute bottom-2 right-2 w-4 h-4 rounded-full border border-white/30"
            style={{
              background: color.hex.startsWith('linear') ? color.hex : color.hex,
            }}
          />
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {category && (
            <span className="tag text-xs">{category.icon} {category.label}</span>
          )}
          {item.style && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(129,140,248,0.15)',
                border: '1px solid rgba(129,140,248,0.3)',
                color: '#818cf8',
              }}
            >
              {item.style}
            </span>
          )}
        </div>
        {item.season && item.season !== 'all' && (
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {getSeasonById(item.season)?.icon} {getSeasonById(item.season)?.label}
          </p>
        )}
      </div>
    </motion.div>
  )
}
