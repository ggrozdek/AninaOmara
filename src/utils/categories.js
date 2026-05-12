export const CATEGORIES = [
  { id: 'tops', label: 'Tops', icon: '👕', slots: ['top'] },
  { id: 'tshirt', label: 'T-Shirt', icon: '👕', slots: ['top'] },
  { id: 'blouse', label: 'Blouse', icon: '👗', slots: ['top'] },
  { id: 'hoodie', label: 'Hoodie', icon: '🧥', slots: ['top'] },
  { id: 'sweater', label: 'Sweater', icon: '🧶', slots: ['top'] },
  { id: 'jacket', label: 'Jacket', icon: '🧥', slots: ['outer'] },
  { id: 'coat', label: 'Coat', icon: '🧥', slots: ['outer'] },
  { id: 'jeans', label: 'Jeans', icon: '👖', slots: ['bottom'] },
  { id: 'shorts', label: 'Shorts', icon: '🩳', slots: ['bottom'] },
  { id: 'skirt', label: 'Skirt', icon: '👗', slots: ['bottom'] },
  { id: 'trousers', label: 'Trousers', icon: '👖', slots: ['bottom'] },
  { id: 'tracksuit', label: 'Tracksuit', icon: '🏃', slots: ['top', 'bottom'] },
  { id: 'dress', label: 'Dress', icon: '👗', slots: ['top', 'bottom'] },
  { id: 'shoes', label: 'Shoes', icon: '👟', slots: ['shoes'] },
  { id: 'sneakers', label: 'Sneakers', icon: '👟', slots: ['shoes'] },
  { id: 'heels', label: 'Heels', icon: '👠', slots: ['shoes'] },
  { id: 'boots', label: 'Boots', icon: '🥾', slots: ['shoes'] },
  { id: 'hat', label: 'Hat', icon: '🧢', slots: ['head'] },
  { id: 'bag', label: 'Bag', icon: '👜', slots: ['accessory'] },
  { id: 'scarf', label: 'Scarf', icon: '🧣', slots: ['accessory'] },
]

export const COLORS = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'grey', label: 'Grey', hex: '#9ca3af' },
  { id: 'beige', label: 'Beige', hex: '#d4c5a9' },
  { id: 'brown', label: 'Brown', hex: '#92400e' },
  { id: 'red', label: 'Red', hex: '#ef4444' },
  { id: 'pink', label: 'Pink', hex: '#ec4899' },
  { id: 'orange', label: 'Orange', hex: '#f97316' },
  { id: 'yellow', label: 'Yellow', hex: '#eab308' },
  { id: 'green', label: 'Green', hex: '#22c55e' },
  { id: 'blue', label: 'Blue', hex: '#3b82f6' },
  { id: 'navy', label: 'Navy', hex: '#1e3a5f' },
  { id: 'purple', label: 'Purple', hex: '#a855f7' },
  { id: 'multicolor', label: 'Multi', hex: 'linear-gradient(135deg,#ef4444,#3b82f6,#22c55e)' },
]

export const STYLES = [
  { id: 'casual', label: 'Casual' },
  { id: 'formal', label: 'Formal' },
  { id: 'sport', label: 'Sport' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'boho', label: 'Boho' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'chic', label: 'Chic' },
]

export const SEASONS = [
  { id: 'spring', label: 'Spring', icon: '🌸' },
  { id: 'summer', label: 'Summer', icon: '☀️' },
  { id: 'autumn', label: 'Autumn', icon: '🍂' },
  { id: 'winter', label: 'Winter', icon: '❄️' },
  { id: 'all', label: 'All Seasons', icon: '🌍' },
]

export const OUTFIT_SLOTS = [
  { id: 'head', label: 'Head', icon: '🧢', categories: ['hat'] },
  { id: 'outer', label: 'Outer Layer', icon: '🧥', categories: ['jacket', 'coat'] },
  { id: 'top', label: 'Top', icon: '👕', categories: ['tops', 'tshirt', 'blouse', 'hoodie', 'sweater', 'tracksuit', 'dress'] },
  { id: 'bottom', label: 'Bottom', icon: '👖', categories: ['jeans', 'shorts', 'skirt', 'trousers', 'tracksuit', 'dress'] },
  { id: 'shoes', label: 'Shoes', icon: '👟', categories: ['shoes', 'sneakers', 'heels', 'boots'] },
  { id: 'accessory', label: 'Accessory', icon: '👜', categories: ['bag', 'scarf'] },
]

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id)
export const getColorById = (id) => COLORS.find(c => c.id === id)
export const getStyleById = (id) => STYLES.find(s => s.id === id)
export const getSeasonById = (id) => SEASONS.find(s => s.id === id)
