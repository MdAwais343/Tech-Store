import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid.jsx'
import { Stars } from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { discountPercent } from '../data/products'
import { formatPrice, orderMessage, whatsappLink } from '../utils/format'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, getProduct } = useProducts()
  const product = getProduct(id)
  const { add } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="container section">
        <p className="empty">Product not found. <Link to="/products">Back to products</Link></p>
      </div>
    )
  }

  const off = discountPercent(product)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const addToCart = () => {
    add(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="container section">
      <div className="detail">
        <div className="detail-img">
          {off > 0 && <b className="badge badge-red">{off}% OFF</b>}
          <ProductImage src={product.image} alt={product.title} loading="eager" />
        </div>
        <div className="detail-info">
          <span className="card-label">{product.category}</span>
          <h1>{product.title}</h1>
          <Stars rating={product.rating} />
          <div className="price price-lg">
            {formatPrice(product.price)}
            {off > 0 && <s>{formatPrice(product.oldPrice)}</s>}
          </div>
          <div className="badges">
            {product.freeDelivery && <b className="badge badge-green">Free Delivery</b>}
            {!product.inStock && <b className="badge badge-dark">Out of stock</b>}
          </div>
          <p className="detail-desc">{product.description}</p>

          <div className="qty-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-lg" onClick={addToCart} disabled={!product.inStock}>
              {added ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>
          <div className="qty-row">
            <button
              className="btn btn-outline btn-lg"
              disabled={!product.inStock}
              onClick={() => {
                add(product.id, qty)
                navigate('/cart')
              }}
            >
              Buy now
            </button>
            <a
              className="btn btn-green btn-lg"
              href={whatsappLink(orderMessage([{ qty, product }], qty * product.price))}
              target="_blank"
              rel="noreferrer"
            >
              {product.inStock ? 'Order on WhatsApp' : 'Ask on WhatsApp'}
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>You may also like</h2></div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}
