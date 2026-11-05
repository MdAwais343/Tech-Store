import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid.jsx'
import Slider from '../components/Slider.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { discountPercent, slides } from '../data/products'

export default function Home() {
  const { products } = useProducts()
  const featured = products.filter((p) => p.featured)
  const recommended = (featured.length ? featured : products).slice(0, 8)
  const superDeals = products
    .filter((p) => p.deal)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 8)

  return (
    <div className="container">
      <Slider slides={slides} />

      <section className="section">
        <div className="section-head">
          <h2>Recommended items</h2>
          <Link to="/products">View all</Link>
        </div>
        <ProductGrid products={recommended} />
      </section>

      {superDeals.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Super deals</h2>
            <Link to="/deals">View all</Link>
          </div>
          <ProductGrid products={superDeals} />
        </section>
      )}
    </div>
  )
}
