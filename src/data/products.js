// Starter catalogue. It is only used to seed the demo mode and the Supabase table (supabase/schema.sql).
// After that, products are managed from the /admin dashboard.
//
// `image` is a path inside /public (served as-is by Vercel) OR a full https:// URL.
// `oldPrice` is optional: when higher than `price` the card shows a "% OFF" badge.
// The photos are free-licence stock images (Unsplash) standing in for your real stock:
// replace them from the dashboard (Edit -> Upload photo) with photos of the products you actually sell.
const catalogue = [
  { id: 1, slug: 'smart-watch', category: 'Wearables', label: 'Smart Watch', title: 'Smart Watch with Heart-Rate and Sleep Tracking', price: 14.9, oldPrice: 29.8, rating: 4, image: '/images/products/smart-watch.jpg', description: 'AMOLED display, 7-day battery, notifications and 20+ sport modes. Works with Android and iOS.' },
  { id: 2, slug: 'fitness-band', category: 'Wearables', label: 'Fitness Band', title: 'Waterproof Fitness Band with Colour Display', price: 4.5, oldPrice: 9.0, rating: 3.5, image: '/images/products/fitness-band.jpg', description: 'Track steps, sleep and heart rate on a slim, comfortable band with a bright colour screen.' },
  { id: 3, slug: 'wireless-earbuds', category: 'Audio', label: 'Wireless Earbuds', title: 'True Wireless Earbuds with Charging Case', price: 7.9, oldPrice: 15.8, rating: 4, image: '/images/products/wireless-earbuds.jpg', description: 'Bluetooth 5.3, clear sound, touch controls and up to 24 hours of playtime with the charging case.' },
  { id: 4, slug: 'bluetooth-speaker', category: 'Audio', label: 'Bluetooth Speaker', title: 'Mini Portable Bluetooth Speaker with Strap', price: 6.9, oldPrice: 11.5, rating: 4.5, image: '/images/products/bluetooth-speaker.jpg', description: 'Pocket-sized speaker with punchy bass, a carry strap and up to 10 hours of battery.' },
  { id: 5, slug: 'headphones', category: 'Audio', label: 'Headphones', title: 'Foldable Over-Ear Headphones with Mic', price: 8.5, oldPrice: 14.9, rating: 4, image: '/images/products/headphones.jpg', description: 'Soft ear cushions, foldable design and a built-in microphone for calls. 3.5 mm cable included.' },
  { id: 6, slug: 'power-bank', category: 'Gadgets', label: 'Power Bank', title: '10000mAh Slim Power Bank with Fast Charging', price: 7.5, oldPrice: 12.5, rating: 4.5, image: '/images/products/power-bank.jpg', description: 'Slim and light, charges two devices at once. Comes with a 3-in-1 charging cable.' },
  { id: 7, slug: 'wireless-mouse', category: 'Computers', label: 'Wireless Mouse', title: '2.4G Wireless Ergonomic Mouse', price: 3.9, rating: 4, image: '/images/products/wireless-mouse.jpg', description: 'Comfortable ergonomic shape, silent clicks and a USB receiver that works up to 10 metres away.' },
  { id: 8, slug: 'mechanical-keyboard', category: 'Computers', label: 'Mechanical Keyboard', title: 'Compact Mechanical Keyboard with Colour Keycaps', price: 18.9, oldPrice: 29.9, rating: 4.5, image: '/images/products/mechanical-keyboard.jpg', description: 'Tactile switches, compact 87-key layout and durable keycaps for typing and gaming.' },
  { id: 9, slug: 'desk-lamp', category: 'Home', label: 'LED Desk Lamp', title: 'Adjustable Arm LED Desk Lamp', price: 6.5, rating: 4, image: '/images/products/desk-lamp.jpg', description: 'Flexible arm, warm and cool light modes and a sturdy base. Ideal for study and work.' },
  { id: 10, slug: 'vacuum-flask', category: 'Kitchen', label: 'Vacuum Flask', title: 'Stainless Steel Vacuum Flask, 1L', price: 5.5, oldPrice: 9.0, rating: 4, image: '/images/products/vacuum-flask.jpg', description: 'Double-wall insulation keeps drinks hot for 12 hours and cold for 24. Comes with a cup lid.' },
  { id: 11, slug: 'stainless-kettle', category: 'Kitchen', label: 'Tea Kettle', title: 'Stainless Steel Whistling Tea Kettle', price: 4.9, oldPrice: 7.9, rating: 3.5, image: '/images/products/stainless-kettle.jpg', description: 'Classic stovetop kettle with a heat-safe handle and a whistle that tells you when the water is ready.' },
  { id: 12, slug: 'espresso-machine', category: 'Kitchen', label: 'Espresso Machine', title: 'Semi-Automatic Espresso Machine', price: 69.0, oldPrice: 99.0, rating: 4.5, image: '/images/products/espresso-machine.jpg', description: '15-bar pressure pump, steam wand for milk and a removable water tank. Café coffee at home.' },
  { id: 13, slug: 'coffee-brewer', category: 'Kitchen', label: 'Coffee Maker', title: 'Drip Coffee Maker and Grinder Set', price: 39.0, oldPrice: 55.0, rating: 4, image: '/images/products/coffee-brewer.jpg', description: 'Grind fresh beans and brew into a thermal carafe that keeps coffee hot for hours.' },
]

export const slides = [
  { id: 1, image: '/images/banners/slide-1.svg', alt: 'Smart watches and wearables', to: '/products?category=Wearables' },
  { id: 2, image: '/images/banners/slide-2.svg', alt: 'Kitchen essentials with free delivery', to: '/products?category=Kitchen' },
  { id: 3, image: '/images/banners/slide-3.svg', alt: 'Super deals while stocks last', to: '/deals' },
]

// Flags: `deal` lists it under Deals, `featured` under Recommended, plus delivery and stock.
// The store lists newest (highest id) first, so ids count down to keep this order on screen.
export const seedProducts = catalogue.map((p, i) => ({
  ...p,
  id: catalogue.length - i,
  oldPrice: p.oldPrice ?? null,
  deal: Boolean(p.oldPrice),
  featured: i < 8,
  freeDelivery: true,
  inStock: true,
}))

export const discountPercent = (p) => (p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0)
