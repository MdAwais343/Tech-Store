import { useEffect, useState } from 'react'
import ProductImage from '../../components/ProductImage.jsx'
import { repo } from '../../data/repo'
import { discountPercent } from '../../data/products'
import { prepareImage } from '../../utils/image'

const blank = {
  title: '', label: '', category: '', price: '', oldPrice: '', rating: '4',
  image: '', description: '', deal: false, featured: true, freeDelivery: true, inStock: true,
}

const initial = (p) =>
  p.id
    ? { ...blank, ...p, price: String(p.price), oldPrice: p.oldPrice == null ? '' : String(p.oldPrice), rating: String(p.rating) }
    : blank

export default function ProductForm({ product, categories, onSave, onClose }) {
  const [f, setF] = useState(() => initial(product))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key) => (e) => setF((cur) => ({ ...cur, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { blob, ext } = await prepareImage(file)
      const url = await repo.uploadImage(blob, ext)
      setF((cur) => ({ ...cur, image: url }))
    } catch (err) {
      setError(`Image upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const price = Number(f.price)
    const oldPrice = f.oldPrice === '' ? null : Number(f.oldPrice)
    if (!f.title.trim()) return setError('Title is required')
    if (!(price > 0)) return setError('Enter a price above 0')
    if (oldPrice != null && !(oldPrice > price)) return setError('Old price must be higher than the price, or leave it empty')

    setBusy(true)
    setError('')
    try {
      await onSave({
        ...(product.id ? { id: product.id } : {}),
        title: f.title.trim(),
        label: f.label.trim() || f.category.trim(),
        category: f.category.trim() || 'Other',
        price,
        oldPrice,
        rating: Number(f.rating),
        image: f.image.trim(),
        description: f.description.trim(),
        deal: f.deal,
        featured: f.featured,
        freeDelivery: f.freeDelivery,
        inStock: f.inStock,
      })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const off = discountPercent({ price: Number(f.price), oldPrice: f.oldPrice === '' ? null : Number(f.oldPrice) })

  return (
    <div className="adm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="adm-modal" role="dialog" aria-modal="true" aria-label={product.id ? 'Edit product' : 'Add product'} onSubmit={onSubmit}>
        <div className="adm-modal-head">
          <h2>{product.id ? 'Edit product' : 'Add product'}</h2>
          <button type="button" className="adm-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="adm-modal-body">
          <label className="span-2">Title *
            <input value={f.title} onChange={set('title')} placeholder="e.g. 5L Digital Air Fryer" autoFocus />
          </label>
          <label>Category
            <input value={f.category} onChange={set('category')} list="adm-cats" placeholder="Kitchen" />
            <datalist id="adm-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label>Short label <small>(grey text above title)</small>
            <input value={f.label} onChange={set('label')} placeholder="Air Fryer" />
          </label>
          <label>Price *
            <input type="number" min="0" step="0.001" value={f.price} onChange={set('price')} />
          </label>
          <label>Old price <small>(shows % OFF)</small>
            <input type="number" min="0" step="0.001" value={f.oldPrice} onChange={set('oldPrice')} />
          </label>
          <label>Rating
            <select value={f.rating} onChange={set('rating')}>
              {[5, 4.5, 4, 3.5, 3, 2.5, 2].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </label>
          <div className="adm-discount">{off > 0 ? `Shows as ${off}% OFF` : 'No discount badge'}</div>

          <div className="span-2 adm-image">
            <ProductImage src={f.image} alt="" loading="eager" />
            <div>
              <span>Image</span>
              <label className="btn btn-outline adm-upload">
                {uploading ? 'Uploading…' : 'Upload photo'}
                <input type="file" accept="image/*" hidden onChange={onFile} disabled={uploading} />
              </label>
              <input value={f.image} onChange={set('image')} placeholder="…or paste an image URL / path" aria-label="Image URL" />
            </div>
          </div>

          <label className="span-2">Description
            <textarea rows="3" value={f.description} onChange={set('description')} />
          </label>

          <div className="span-2 adm-flags">
            <label><input type="checkbox" checked={f.deal} onChange={set('deal')} /> On deal <small>(listed under Deals and Super deals)</small></label>
            <label><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Featured <small>(Recommended items on home)</small></label>
            <label><input type="checkbox" checked={f.freeDelivery} onChange={set('freeDelivery')} /> Free delivery</label>
            <label><input type="checkbox" checked={f.inStock} onChange={set('inStock')} /> In stock</label>
          </div>
        </div>

        {error && <p className="adm-error" role="alert">{error}</p>}
        <div className="adm-modal-foot">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy || uploading}>{busy ? 'Saving…' : 'Save product'}</button>
        </div>
      </form>
    </div>
  )
}
