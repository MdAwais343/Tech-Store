import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from '../../components/ProductImage.jsx'
import { useProducts } from '../../context/ProductsContext.jsx'
import { repo } from '../../data/repo'
import { formatPrice } from '../../utils/format'
import ProductForm from './ProductForm.jsx'

function Switch({ checked, onChange, label }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      <span />
    </label>
  )
}

export default function Dashboard({ user }) {
  const { products, mode, saveProduct, deleteProduct, patchProduct, resetDemo } = useProducts()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // null = closed, {} = new product, product = edit
  const [toast, setToast] = useState('')

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products])
  const shown = products.filter((p) => `${p.title} ${p.label} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase()))

  const flash = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2800)
  }
  const attempt = async (fn, success) => {
    try {
      await fn()
      if (success) flash(success)
    } catch (e) {
      flash(`⚠ ${e.message}`)
    }
  }

  const onSave = async (data) => {
    await saveProduct(data)
    setEditing(null)
    flash(data.id ? 'Product updated' : 'Product added')
  }
  const onDelete = (p) => {
    if (window.confirm(`Delete “${p.title}”? This cannot be undone.`)) attempt(() => deleteProduct(p.id), 'Product deleted')
  }

  return (
    <div className="adm">
      <header className="adm-top">
        <div>
          <h1>Product dashboard</h1>
          <small>{mode === 'local' ? 'Demo mode' : user.email}</small>
        </div>
        <div className="adm-top-actions">
          <Link to="/" className="adm-link">View store</Link>
          {mode === 'supabase' && <button className="adm-link" onClick={() => repo.auth.signOut()}>Sign out</button>}
          <button className="btn" onClick={() => setEditing({})}>+ Add product</button>
        </div>
      </header>

      {mode === 'local' && (
        <div className="adm-banner">
          <span>
            <b>Demo mode.</b> Supabase isn’t connected, so changes are saved in this browser only and visitors won’t see them.
            See “Go live with Supabase” in the README to publish for real.
          </span>
          <button className="adm-link" onClick={() => window.confirm('Reset demo products to the starter list?') && attempt(resetDemo, 'Demo data reset')}>
            Reset demo data
          </button>
        </div>
      )}

      <section className="adm-stats">
        <div><b>{products.length}</b><span>Products</span></div>
        <div><b>{products.filter((p) => p.deal).length}</b><span>On deal</span></div>
        <div><b>{products.filter((p) => p.featured).length}</b><span>Featured</span></div>
        <div><b>{products.filter((p) => !p.inStock).length}</b><span>Out of stock</span></div>
      </section>

      <input className="adm-search" type="search" placeholder="Search products…" aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Product</th><th>Category</th><th>Price</th><th>Deal</th><th>Featured</th><th>In stock</th><th />
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="adm-prod">
                    <ProductImage src={p.image} alt="" />
                    <span>{p.title}</span>
                  </div>
                </td>
                <td>{p.category}</td>
                <td>
                  <b>{formatPrice(p.price)}</b>
                  {p.oldPrice > p.price && <s>{formatPrice(p.oldPrice)}</s>}
                </td>
                <td><Switch label={`${p.title}: on deal`} checked={p.deal} onChange={(e) => attempt(() => patchProduct(p.id, { deal: e.target.checked }))} /></td>
                <td><Switch label={`${p.title}: featured`} checked={p.featured} onChange={(e) => attempt(() => patchProduct(p.id, { featured: e.target.checked }))} /></td>
                <td><Switch label={`${p.title}: in stock`} checked={p.inStock} onChange={(e) => attempt(() => patchProduct(p.id, { inStock: e.target.checked }))} /></td>
                <td>
                  <div className="adm-actions">
                    <button className="adm-link" onClick={() => setEditing(p)}>Edit</button>
                    <button className="adm-link danger" onClick={() => onDelete(p)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!shown.length && (
              <tr><td colSpan="7" className="adm-empty">{products.length ? 'No products match your search.' : 'No products yet. Click “Add product”.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <ProductForm product={editing} categories={categories} onSave={onSave} onClose={() => setEditing(null)} />}
      {toast && <div className="adm-toast" role="status">{toast}</div>}
    </div>
  )
}
