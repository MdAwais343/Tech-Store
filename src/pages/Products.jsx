import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { discountPercent } from '../data/products'

const sorters = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  discount: (a, b) => discountPercent(b) - discountPercent(a),
}

export default function Products({ dealsOnly = false }) {
  const { products } = useProducts()
  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products])
  const [params, setParams] = useSearchParams()
  const q = params.get('q')?.trim().toLowerCase() ?? ''
  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'featured'

  const list = useMemo(
    () =>
      products
        .filter((p) => (dealsOnly ? p.deal : true))
        .filter((p) => (category ? p.category === category : true))
        .filter((p) => (q ? `${p.title} ${p.label} ${p.category}`.toLowerCase().includes(q) : true))
        .sort(sorters[sort] ?? sorters.featured),
    [products, dealsOnly, category, q, sort],
  )

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h2>{dealsOnly ? 'Deals' : q ? `Results for “${params.get('q')}”` : 'All products'}</h2>
        <select value={sort} onChange={(e) => update('sort', e.target.value === 'featured' ? '' : e.target.value)} aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="discount">Biggest discount</option>
        </select>
      </div>

      <div className="chips">
        <button className={!category ? 'chip active' : 'chip'} onClick={() => update('category', '')}>All</button>
        {categories.map((c) => (
          <button key={c} className={category === c ? 'chip active' : 'chip'} onClick={() => update('category', c)}>
            {c}
          </button>
        ))}
      </div>

      <ProductGrid products={list} />
    </div>
  )
}
