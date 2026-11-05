import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  if (!products.length) return <p className="empty">No products found.</p>
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
