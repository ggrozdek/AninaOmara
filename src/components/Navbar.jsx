import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shirt, Sparkles, PlusCircle, BookOpen } from 'lucide-react'
import useWardrobeStore from '../store/wardrobeStore'

const navItems = [
  { to: '/', label: 'Wardrobe', icon: Shirt },
  { to: '/upload', label: 'Add Item', icon: PlusCircle },
  { to: '/builder', label: 'Outfit Builder', icon: Sparkles },
  { to: '/outfits', label: 'Saved Outfits', icon: BookOpen },
]

export default function Navbar() {
  const items = useWardrobeStore((s) => s.items)

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(3,7,18,0.8)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8)' }}
        >
          👗
        </div>
        <span className="font-bold text-lg gradient-text">My Closet</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full ml-1"
          style={{
            background: 'rgba(192,132,252,0.15)',
            border: '1px solid rgba(192,132,252,0.3)',
            color: '#c084fc',
          }}
        >
          {items.length} items
        </span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg,rgba(192,132,252,0.2),rgba(129,140,248,0.2))'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(192,132,252,0.4)'
                    : '1px solid transparent',
                  color: isActive ? '#c084fc' : 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon size={16} />
                <span className="hidden md:block">{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  )
}
