import { supabase } from '../lib/supabase'

const BUCKET = 'product-images'

const fromRow = (r) => ({
  id: r.id,
  title: r.title,
  label: r.label ?? '',
  category: r.category ?? '',
  price: Number(r.price),
  oldPrice: r.old_price == null ? null : Number(r.old_price),
  rating: Number(r.rating ?? 4),
  image: r.image ?? '',
  description: r.description ?? '',
  deal: r.is_deal,
  featured: r.featured,
  freeDelivery: r.free_delivery,
  inStock: r.in_stock,
})

const toRow = (p) => ({
  title: p.title,
  label: p.label,
  category: p.category,
  price: p.price,
  old_price: p.oldPrice ?? null,
  rating: p.rating,
  image: p.image,
  description: p.description,
  is_deal: p.deal,
  featured: p.featured,
  free_delivery: p.freeDelivery,
  in_stock: p.inStock,
})

const NOT_ALLOWED = 'Not allowed. Make sure you are signed in with an admin account.'

function unwrap({ data, error }) {
  if (error) throw new Error(error.code === 'PGRST116' ? NOT_ALLOWED : error.message)
  return data
}

export const supabaseRepo = {
  mode: 'supabase',

  async list() {
    return unwrap(await supabase.from('products').select('*').order('id', { ascending: false })).map(fromRow)
  },
  async create(p) {
    return fromRow(unwrap(await supabase.from('products').insert(toRow(p)).select().single()))
  },
  async update(id, p) {
    return fromRow(unwrap(await supabase.from('products').update(toRow(p)).eq('id', id).select().single()))
  },
  async remove(id) {
    const rows = unwrap(await supabase.from('products').delete().eq('id', id).select())
    if (!rows.length) throw new Error(NOT_ALLOWED)
  },
  async uploadImage(blob, ext) {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type,
      cacheControl: '31536000',
    })
    if (error) throw new Error(error.message)
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  },

  auth: {
    async getUser() {
      const { data } = await supabase.auth.getSession()
      return data.session?.user ?? null
    },
    onChange(callback) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null))
      return () => data.subscription.unsubscribe()
    },
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
    },
    async signOut() {
      await supabase.auth.signOut()
    },
  },
}
