import { seedProducts } from './products'

// Demo mode: products live in this browser's localStorage, so changes are NOT visible to other visitors.
// It lets you try the admin before Supabase is connected.
const KEY = 'store-products-v1'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupted or blocked storage: fall back to the starter catalogue
  }
  return structuredClone(seedProducts)
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    throw new Error('Browser storage is full or blocked. Use smaller images or connect Supabase.')
  }
}

const newestFirst = (list) => [...list].sort((a, b) => b.id - a.id)

export const localRepo = {
  mode: 'local',

  async list() {
    return newestFirst(read())
  },
  async create(p) {
    const list = read()
    const saved = { ...p, id: Math.max(0, ...list.map((x) => x.id)) + 1 }
    write([...list, saved])
    return saved
  },
  async update(id, p) {
    const saved = { ...p, id }
    write(read().map((x) => (x.id === id ? saved : x)))
    return saved
  },
  async remove(id) {
    write(read().filter((x) => x.id !== id))
  },
  async uploadImage(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Could not read the image'))
      reader.readAsDataURL(blob)
    })
  },
  reset() {
    localStorage.removeItem(KEY)
  },

  auth: {
    async getUser() {
      return { email: 'demo mode' }
    },
    onChange() {
      return () => {}
    },
    async signIn() {},
    async signOut() {},
  },
}
