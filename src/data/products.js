// Starter catalogue. It is only used to seed the demo mode and the Supabase table (supabase/schema.sql).
// After that, products are managed from the /admin dashboard.
//
// `image` is a path inside /public (served as-is by Vercel) OR a full https:// URL.
// `oldPrice` is optional: when higher than `price` the card shows a "% OFF" badge.
const catalogue = [
  { id: 1, slug: 'vacuum-flask-set', category: 'Kitchen', label: 'Vacuum Flask Set', title: 'Premium Stainless Steel Vacuum Flask Gift Set', price: 4.5, oldPrice: 9.0, rating: 4, image: '/images/products/vacuum-flask-set.svg', description: 'Double-wall insulated flasks that keep drinks hot for 12 hours and cold for 24. Comes in a gift box with matching cups.' },
  { id: 2, slug: 'double-jar-blender', category: 'Kitchen', label: 'Double Jar Blender', title: 'Powerful 4500W Double Jar Blender', price: 8.9, oldPrice: 27.8, rating: 4, image: '/images/products/double-jar-blender.svg', description: 'Two jars for wet and dry grinding, stainless steel blades and a high-torque motor for smoothies, spices and sauces.' },
  { id: 3, slug: 'mini-mop', category: 'Cleaning', label: 'Mini Mop', title: 'Self-Squeeze Portable Mini Mop', price: 3.5, oldPrice: 5.4, rating: 4, image: '/images/products/mini-mop.svg', description: 'Compact squeeze mop with a microfibre head. Perfect for glass, tiles and tight corners.' },
  { id: 4, slug: 'cleaning-brush', category: 'Cleaning', label: '9-in-1 Cleaning Brush', title: 'Rechargeable 9-in-1 Cordless Cleaning Brush', price: 5.9, oldPrice: 11.6, rating: 4.5, image: '/images/products/cleaning-brush.svg', description: 'Nine interchangeable heads, extendable handle and USB charging. Cleans bathrooms, kitchens and cars.' },
  { id: 5, slug: 'dash-cam-mirror', category: 'Car', label: 'Dash Cam Mirror', title: 'Full HD Rear-View Mirror Dash Camera', price: 12.9, oldPrice: 27.4, rating: 4, image: '/images/products/dash-cam-mirror.svg', description: 'Mirror-mounted dash cam with loop recording, night vision and a reversing camera input.' },
  { id: 6, slug: 'glucose-monitor', category: 'Health', label: 'Glucose Monitor', title: 'Digital Blood Glucose Monitor Kit', price: 9.5, oldPrice: 28.0, rating: 4.5, image: '/images/products/glucose-monitor.svg', description: 'Fast, accurate readings with a large display. Includes lancets, test strips and carry case.' },
  { id: 7, slug: 'posture-belt', category: 'Health', label: 'Posture Belt', title: 'Adjustable Back Support Posture Belt', price: 4.9, oldPrice: 7.3, rating: 3.5, image: '/images/products/posture-belt.svg', description: 'Breathable lumbar support belt with adjustable straps for all-day comfort.' },
  { id: 8, slug: 'dish-rack', category: 'Kitchen', label: 'Dish Rack', title: 'Over-Sink Stainless Steel Dish Rack', price: 11.0, oldPrice: 25.6, rating: 4, image: '/images/products/dish-rack.svg', description: 'Extendable two-tier rack with cutlery holder and drip tray. Saves counter space.' },
  { id: 9, slug: 'smart-watch', category: 'Wearables', label: 'Smart Watch', title: 'Smart Watch with Heart-Rate and Sleep Tracking', price: 14.9, oldPrice: 29.8, rating: 4, image: '/images/products/smart-watch.svg', description: 'AMOLED display, 7-day battery, notifications and 20+ sport modes. Works with Android and iOS.' },
  { id: 10, slug: 'wireless-earbuds', category: 'Gadgets', label: 'Wireless Earbuds', title: 'Bluetooth 5.3 Wireless Earbuds with Charging Case', price: 7.9, oldPrice: 15.8, rating: 4, image: '/images/products/wireless-earbuds.svg', description: 'Clear sound, touch controls and up to 24 hours of playtime with the charging case.' },
  { id: 11, slug: 'bluetooth-speaker', category: 'Gadgets', label: 'Bluetooth Speaker', title: 'Portable Waterproof Bluetooth Speaker', price: 9.9, oldPrice: 16.5, rating: 4.5, image: '/images/products/bluetooth-speaker.svg', description: 'Powerful bass, IPX6 splash resistance and a 12-hour battery for the beach or the garden.' },
  { id: 12, slug: 'desk-lamp', category: 'Home', label: 'LED Desk Lamp', title: 'Foldable LED Desk Lamp with 3 Colour Modes', price: 6.5, rating: 4, image: '/images/products/desk-lamp.svg', description: 'Touch dimmer, three colour temperatures and a USB-C rechargeable battery.' },
  { id: 13, slug: 'hand-mixer', category: 'Kitchen', label: 'Hand Mixer', title: '5-Speed Electric Hand Mixer', price: 5.5, rating: 3.5, image: '/images/products/hand-mixer.svg', description: 'Lightweight mixer with whisk and dough-hook attachments, ideal for baking.' },
  { id: 14, slug: 'car-vacuum', category: 'Car', label: 'Car Vacuum', title: 'Cordless Car Vacuum Cleaner', price: 6.9, oldPrice: 11.5, rating: 4, image: '/images/products/car-vacuum.svg', description: 'Strong suction in a pocket-sized body. Includes crevice tool and HEPA filter.' },
  { id: 15, slug: 'fitness-band', category: 'Wearables', label: 'Fitness Band', title: 'Waterproof Fitness Band with Step Counter', price: 4.5, oldPrice: 9.0, rating: 3.5, image: '/images/products/fitness-band.svg', description: 'Track steps, sleep and heart rate on a slim, comfortable band.' },
  { id: 16, slug: 'air-fryer', category: 'Kitchen', label: 'Air Fryer', title: '5L Digital Air Fryer, 1700W', price: 24.9, oldPrice: 39.9, rating: 4.5, image: '/images/products/air-fryer.svg', description: 'Cook crispy meals with up to 90% less oil. Eight presets and a dishwasher-safe basket.' },
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
