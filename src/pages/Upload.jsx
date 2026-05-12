import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload as UploadIcon, Image, Check, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import useWardrobeStore from '../store/wardrobeStore'
import { CATEGORIES, COLORS, STYLES, SEASONS } from '../utils/categories'

export default function Upload() {
  const navigate = useNavigate()
  const addItem = useWardrobeStore((s) => s.addItem)
  const fileRef = useRef(null)

  const [imagePreview, setImagePreview] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: '',
    color: '',
    style: '',
    season: '',
    notes: '',
  })

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
      setImageData(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.category) return

    addItem({
      id: uuidv4(),
      ...form,
      image: imageData,
      createdAt: new Date().toISOString(),
    })

    setSaved(true)
    setTimeout(() => {
      navigate('/')
    }, 1200)
  }

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-ghost p-2"
            style={{ borderRadius: '12px' }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Add New Item</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>
              Add a new piece to your wardrobe
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left - Image upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className={`upload-zone relative flex flex-col items-center justify-center aspect-[3/4] rounded-2xl overflow-hidden ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.5)' }}
                    >
                      <div className="text-center">
                        <Image size={32} className="text-white mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">Change photo</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    >
                      <UploadIcon
                        size={48}
                        className="mx-auto mb-4"
                        style={{ color: 'rgba(192,132,252,0.6)' }}
                      />
                    </motion.div>
                    <p className="text-white font-semibold mb-2">
                      Drop your photo here
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      or click to browse
                    </p>
                    <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      PNG, JPG, WEBP supported
                    </p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            </motion.div>

            {/* Right - Form fields */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Item Name *
                </label>
                <input
                  className="input-glass"
                  placeholder="e.g. White Linen Shirt"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Category *
                </label>
                <select
                  className="input-glass"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  required
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => set('color', form.color === c.id ? '' : c.id)}
                      className="w-8 h-8 rounded-full border-2 transition-all flex-shrink-0"
                      style={{
                        background: c.hex.startsWith('linear') ? c.hex : c.hex,
                        borderColor: form.color === c.id
                          ? '#c084fc'
                          : 'rgba(255,255,255,0.2)',
                        boxShadow: form.color === c.id
                          ? '0 0 12px rgba(192,132,252,0.5)'
                          : 'none',
                        transform: form.color === c.id ? 'scale(1.2)' : 'scale(1)',
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
                {form.color && (
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Selected: {COLORS.find(c => c.id === form.color)?.label}
                  </p>
                )}
              </div>

              {/* Style */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => set('style', form.style === s.id ? '' : s.id)}
                      className="px-3 py-1 rounded-full text-sm font-medium transition-all"
                      style={{
                        background: form.style === s.id
                          ? 'linear-gradient(135deg,rgba(192,132,252,0.3),rgba(129,140,248,0.3))'
                          : 'rgba(255,255,255,0.05)',
                        border: form.style === s.id
                          ? '1px solid rgba(192,132,252,0.5)'
                          : '1px solid rgba(255,255,255,0.1)',
                        color: form.style === s.id ? '#c084fc' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Season
                </label>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => set('season', form.season === s.id ? '' : s.id)}
                      className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
                      style={{
                        background: form.season === s.id
                          ? 'rgba(129,140,248,0.2)'
                          : 'rgba(255,255,255,0.05)',
                        border: form.season === s.id
                          ? '1px solid rgba(129,140,248,0.5)'
                          : '1px solid rgba(255,255,255,0.1)',
                        color: form.season === s.id ? '#818cf8' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Notes
                </label>
                <textarea
                  className="input-glass resize-none"
                  rows={3}
                  placeholder="Brand, fit notes, how you like to wear it..."
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary py-3 flex items-center justify-center gap-2 mt-2"
                disabled={!form.name || !form.category}
                style={{
                  opacity: !form.name || !form.category ? 0.5 : 1,
                }}
              >
                <AnimatePresence mode="wait">
                  {saved ? (
                    <motion.span
                      key="saved"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} /> Saved!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="save"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <UploadIcon size={18} /> Add to Wardrobe
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}
