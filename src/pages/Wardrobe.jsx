import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useWardrobeStore from '../store/wardrobeStore'
import ClothingCard from '../components/ClothingCard'
import { CATEGORIES, COLORS, STYLES, SEASONS } from '../utils/categories'

export default function Wardrobe() {
  const items = useWardrobeStore((s) => s.items)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [filterStyle, setFilterStyle] = useState('')
  const [filterSeason, setFilterSeason] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !filterCategory || item.category === filterCategory
      const matchColor = !filterColor || item.color === filterColor
      const matchStyle = !filterStyle || item.style === filterStyle
      const matchSeason =
        !filterSeason || item.season === filterSeason || item.season === 'all'
      return matchSearch && matchCategory && matchColor && matchStyle && matchSeason
    })
  }, [items, search, filterCategory, filterColor, filterStyle, filterSeason])

  const hasActiveFilters = filterCategory || filterColor || filterStyle || filterSeason
  const clearFilters = () => {
    setFilterCategory('')
    setFilterColor('')
    setFilterStyle('')
    setFilterSeason('')
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">My Wardrobe</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>
          {items.length === 0
            ? 'Start adding your clothes'
            : `${filtered.length} of ${items.length} items`}
        </p>
      </motion.div>

      {/* Search + Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto mb-6"
      >
        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            />
            <input
              className="input-glass pl-9"
              placeholder="Search clothes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setSearch('')}
              >
                <X size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: showFilters
                ? 'rgba(192,132,252,0.2)'
                : 'rgba(255,255,255,0.05)',
              border: showFilters
                ? '1px solid rgba(192,132,252,0.4)'
                : '1px solid rgba(255,255,255,0.1)',
              color: showFilters ? '#c084fc' : 'rgba(255,255,255,0.6)',
            }}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span
                className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8)' }}
              >
                !
              </span>
            )}
          </motion.button>

          {hasActiveFilters && (
            <button className="btn-ghost text-sm px-3 py-2" onClick={clearFilters}>
              <X size={14} className="inline mr-1" />
              Clear
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upload')}
            className="btn-primary flex items-center gap-2"
          >
            + Add Item
          </motion.button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 p-4 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Category */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Category
                  </label>
                  <select
                    className="input-glass"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Color
                  </label>
                  <select
                    className="input-glass"
                    value={filterColor}
                    onChange={(e) => setFilterColor(e.target.value)}
                  >
                    <option value="">All</option>
                    {COLORS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Style */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Style
                  </label>
                  <select
                    className="input-glass"
                    value={filterStyle}
                    onChange={(e) => setFilterStyle(e.target.value)}
                  >
                    <option value="">All</option>
                    {STYLES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Season */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Season
                  </label>
                  <select
                    className="input-glass"
                    value={filterSeason}
                    onChange={(e) => setFilterSeason(e.target.value)}
                  >
                    <option value="">All</option>
                    {SEASONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="text-8xl mb-6 animate-float">👗</div>
            <h3 className="text-2xl font-bold text-white mb-2">Your closet is empty</h3>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Start building your digital wardrobe
            </p>
            <button className="btn-primary px-8 py-3 text-base" onClick={() => navigate('/upload')}>
              + Add your first item
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white font-semibold mb-2">No items found</p>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Try adjusting your filters</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <ClothingCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
