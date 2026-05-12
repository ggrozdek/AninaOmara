import { motion } from 'framer-motion'
import useWardrobeStore from '../store/wardrobeStore'

export const BASE_PILES = {
  majice: {
    label: 'Majice',
    icon: '👔',
    categories: ['tops', 'tshirt', 'blouse'],
    layers: ['#e8e0d4','#c8d4e8','#e8d4c8','#d4e8c8','#e8c8d4','#dcd4e4','#c8e4d4'],
  },
  puloverji: {
    label: 'Puloverji',
    icon: '🧶',
    categories: ['sweater', 'hoodie', 'tracksuit'],
    layers: ['#d4c4a4','#c44830','#6b7c4a','#4a5c7c','#c8a050','#8c6a4a','#4c7c6a'],
  },
  hlace: {
    label: 'Hlače',
    icon: '👖',
    categories: ['jeans', 'shorts', 'skirt', 'trousers'],
    layers: ['#2a3a5c','#3a3a3a','#5c4a3a','#6a6a6a','#1a2a3a','#4a5a4a','#3a2a4a'],
  },
  jakne: {
    label: 'Jakne',
    icon: '🧥',
    categories: ['jacket', 'coat'],
    layers: ['#1a1a1a','#8b7355','#4a6a4a','#6a4a3a','#3a4a5a','#7a5a3a','#4a4a4a'],
  },
  cevlji: {
    label: 'Čevlji',
    icon: '👟',
    categories: ['shoes', 'sneakers', 'heels', 'boots'],
    layers: ['#1a1a1a','#8b5e3c','#f5f5f0','#4a3a2a','#c0b090','#2a3a4a','#6a4a2a'],
  },
  torbice: {
    label: 'Torbice',
    icon: '👜',
    categories: ['bag', 'scarf', 'accessory'],
    layers: ['#8b6030','#c8a870','#3a2a1a','#b08040','#d4b47a','#6a4020','#a07848'],
  },
}

// Slovenian plural: 1 kos, 2-4 kosi, 5+ kosov
function slKos(n) {
  if (n === 1) return 'kos'
  if (n >= 2 && n <= 4) return 'kosi'
  return 'kosov'
}

function darken(hex, amt) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `rgb(${Math.max(0,r-amt*255)},${Math.max(0,g-amt*255)},${Math.max(0,b-amt*255)})`
}

function FoldedLayer({ color, index, total }) {
  const isTop = index === total - 1
  const isBottom = index === 0
  return (
    <div style={{
      height: 15,
      marginBottom: isBottom ? 0 : -1,
      background: color,
      borderRadius: isTop ? '4px 4px 0 0' : isBottom ? '0 0 4px 4px' : 0,
      boxShadow: isTop
        ? `0 -2px 5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,${0.12 - index * 0.01})`
        : `0 2px 3px rgba(0,0,0,${0.1 + (total - index) * 0.03})`,
      backgroundImage: `
        repeating-linear-gradient(135deg, transparent 0px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px),
        linear-gradient(180deg, ${color}, ${darken(color, 0.08)})
      `,
      position: 'relative',
    }}>
      {/* Fold crease */}
      {!isBottom && (
        <div style={{ position: 'absolute', bottom: 0, left: '8%', right: '8%', height: 1, background: `rgba(0,0,0,${0.1 + index * 0.02})` }} />
      )}
    </div>
  )
}

export default function ClothingPile({ pileKey, config, onClick }) {
  const items = useWardrobeStore((s) => s.items)

  const isCustom = !BASE_PILES[pileKey]
  const layers = config.layers || ['#8a8a8a','#7a7a7a','#9a9a9a','#6a6a6a','#aaaaaa']
  const count = items.filter((i) => config.categories.includes(i.category)).length
  const topItem = items.find((i) => config.categories.includes(i.category) && i.image)

  const displayLayers = layers.slice(0, Math.min(8, Math.max(5, 4 + count)))

  return (
    <motion.div
      className="pile-container flex flex-col items-center"
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(pileKey)}
      style={{ minWidth: 80 }}
    >
      <div style={{ width: 82, position: 'relative' }}>
        {/* Drop shadow */}
        <div style={{
          position: 'absolute', bottom: -7, left: '8%', right: '8%',
          height: 10, background: 'rgba(0,0,0,0.55)',
          filter: 'blur(5px)', borderRadius: '50%',
        }} />

        {/* Layers — bottom to top */}
        <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
          {displayLayers.map((color, i) => (
            <FoldedLayer key={i} color={color} index={i} total={displayLayers.length} />
          ))}
        </div>

        {/* Top item photo preview */}
        {topItem && (
          <div style={{
            position: 'absolute', top: 0, left: '6%', right: '6%', height: 15,
            borderRadius: '4px 4px 0 0', overflow: 'hidden', opacity: 0.82,
          }}>
            <img src={topItem.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <p className="pile-label">{config.label}</p>
      <p className="pile-count">{count} {slKos(count)}</p>
    </motion.div>
  )
}
