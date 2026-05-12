import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Upload, Trash2, Check, Loader } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import useWardrobeStore from '../store/wardrobeStore'
import { COLORS } from '../utils/categories'

// Slovenian plural: 1 kos, 2-4 kosi, 5+ kosov
function slKos(n) {
  if (n === 1) return 'kos'
  if (n >= 2 && n <= 4) return 'kosi'
  return 'kosov'
}

const SL_STYLES  = ['Sproščen','Formalen','Šport','Uličen','Vintage','Eleganten','Boho','Minimalist']
const SL_SEASONS = [
  { id: 'spring', label: 'Pomlad',   icon: '🌸' },
  { id: 'summer', label: 'Poletje',  icon: '☀️' },
  { id: 'autumn', label: 'Jesen',    icon: '🍂' },
  { id: 'winter', label: 'Zima',     icon: '❄️' },
  { id: 'all',    label: 'Vse leto', icon: '🌍' },
]

// Compress to base64 — max 600px, JPEG 0.75 → keeps Firestore doc well under 1 MB
function compressToBase64(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 600
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.75))
    }
    img.src = url
  })
}

// ── Upload form ───────────────────────────────────────────────────────────────
function UploadForm({ config, onSaved }) {
  const addItem = useWardrobeStore((s) => s.addItem)
  const fileRef = useRef(null)

  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile,    setImageFile]    = useState(null)
  const [dragOver,     setDragOver]     = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [form, setForm] = useState({
    name: '', category: config.categories[0], color: '', style: '', season: '',
  })

  const handleFile = (file) => {
    if (!file?.type.startsWith('image/')) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || saving) return
    setSaving(true)

    try {
      // Compress image to base64 and store directly in Firestore document
      const image = imageFile ? await compressToBase64(imageFile) : null

      addItem({
        id: uuidv4(), ...form,
        image,
        createdAt: new Date().toISOString(),
      })

      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setSaving(false)
        setForm({ name: '', category: config.categories[0], color: '', style: '', season: '' })
        setImagePreview(null)
        setImageFile(null)
        onSaved?.()
      }, 1200)
    } catch (err) {
      console.error('Save error:', err)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Photo */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.45)', marginBottom: 8 }}>Fotografija</label>
          <div
            className={`upload-zone flex items-center justify-center ${dragOver ? 'drag-over' : ''}`}
            style={{ height: 148, borderRadius: 12, cursor: 'pointer', overflow: 'hidden' }}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
          >
            {imagePreview
              ? <img src={imagePreview} alt="predogled" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ textAlign: 'center' }}>
                  <Upload size={22} style={{ color: 'rgba(184,150,46,0.45)', margin: '0 auto 6px' }} />
                  <p style={{ fontSize: 12, color: 'rgba(245,234,216,0.35)' }}>Spusti ali klikni</p>
                </div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.45)', marginBottom: 6 }}>Ime *</label>
            <input className="input-wood" placeholder="npr. Črna usnjena jakna" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>

          {/* Category */}
          {config.categories.length > 1 && (
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.45)', marginBottom: 6 }}>Vrsta</label>
              <select className="input-wood" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {config.categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          )}

          {/* Style */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.45)', marginBottom: 6 }}>Stil</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SL_STYLES.map((s) => (
                <button key={s} type="button" onClick={() => set('style', form.style === s ? '' : s)}
                  style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    background: form.style === s ? 'rgba(184,150,46,0.25)' : 'rgba(0,0,0,0.2)',
                    border: form.style === s ? '1px solid rgba(184,150,46,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    color: form.style === s ? '#d4b04a' : 'rgba(245,234,216,0.45)',
                  }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Color */}
      <div style={{ marginTop: 14 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.45)', marginBottom: 8 }}>Barva</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COLORS.map((c) => (
            <button key={c.id} type="button" onClick={() => set('color', form.color === c.id ? '' : c.id)} title={c.label}
              style={{
                width: 26, height: 26, borderRadius: '50%', cursor: 'pointer',
                background: c.hex,
                border: form.color === c.id ? '2.5px solid #d4b04a' : '2px solid rgba(255,255,255,0.18)',
                boxShadow: form.color === c.id ? '0 0 8px rgba(212,176,74,0.6)' : 'none',
                transform: form.color === c.id ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.15s',
              }} />
          ))}
        </div>
      </div>

      {/* Season */}
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,234,216,0.45)', marginBottom: 8 }}>Sezona</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SL_SEASONS.map((s) => (
            <button key={s.id} type="button" onClick={() => set('season', form.season === s.id ? '' : s.id)}
              style={{
                padding: '4px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                background: form.season === s.id ? 'rgba(184,150,46,0.2)' : 'rgba(0,0,0,0.2)',
                border: form.season === s.id ? '1px solid rgba(184,150,46,0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: form.season === s.id ? '#d4b04a' : 'rgba(245,234,216,0.45)',
              }}>
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn-brass"
        disabled={!form.name || saving}
        style={{ width: '100%', marginTop: 18, opacity: (!form.name || saving) ? 0.55 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {saving && !saved && <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} />}
        {saved ? <><Check size={15} /> Shranjeno!</>
          : saving ? 'Nalagam...'
          : <><Plus size={15} /> Dodaj v omaro</>
        }
      </button>
    </form>
  )
}

// ── Pile modal ────────────────────────────────────────────────────────────────
export default function PileModal({ pileKey, config, onClose }) {
  const items          = useWardrobeStore((s) => s.items)
  const removeItem     = useWardrobeStore((s) => s.removeItem)
  const removeCustomPile = useWardrobeStore((s) => s.removeCustomPile)

  const pileItems = items.filter((i) => config.categories.includes(i.category))
  const [showUpload,     setShowUpload]     = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(null)

  const isCustom = pileKey.startsWith('custom_')

  const handleDelete = (id) => {
    if (confirmDelete === id) { removeItem(id); setConfirmDelete(null) }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 2000) }
  }

  return (
    <motion.div className="pile-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="pile-modal-content"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#f5ead8' }}>
              {config.icon} {config.label}
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(245,234,216,0.4)', marginTop: 2 }}>
              {pileItems.length} {slKos(pileItems.length)} v tem kupu
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {isCustom && (
              <button onClick={() => { removeCustomPile(pileKey); onClose() }}
                style={{ background: 'rgba(200,60,60,0.2)', border: '1px solid rgba(200,60,60,0.4)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: 'rgba(245,100,100,0.8)', fontSize: 12 }}>
                Izbriši kup
              </button>
            )}
            <button onClick={onClose} aria-label="Zapri"
              style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(245,234,216,0.55)' }}>
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Add toggle */}
        <button className="btn-brass" style={{ width: '100%', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={() => setShowUpload((v) => !v)}>
          <Plus size={15} />
          {showUpload ? 'Skrij obrazec' : `Dodaj v ${config.label}`}
        </button>

        {/* Upload form */}
        <AnimatePresence>
          {showUpload && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(184,150,46,0.2)', borderRadius: 16, padding: 18, marginBottom: 20 }}>
                <UploadForm config={config} onSaved={() => setShowUpload(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items grid */}
        {pileItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(245,234,216,0.35)' }}>
            <p style={{ fontSize: 44, marginBottom: 10 }}>{config.icon}</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, marginBottom: 4 }}>Ta kup je prazen</p>
            <p style={{ fontSize: 12 }}>Dodaj prvo oblačilo</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            <AnimatePresence mode="popLayout">
              {pileItems.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                  className="clothes-card group relative">
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, background: 'rgba(0,0,0,0.15)' }}>{config.icon}</div>
                    }
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#f5ead8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    {item.style && <span className="tag-brass" style={{ fontSize: 10, marginTop: 4, display: 'inline-flex' }}>{item.style}</span>}
                  </div>
                  <button onClick={() => handleDelete(item.id)} aria-label="Izbriši oblačilo"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: confirmDelete === item.id ? 'rgba(200,60,60,0.85)' : 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', color: 'white' }}>
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
