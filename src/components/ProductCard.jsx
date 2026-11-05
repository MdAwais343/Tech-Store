import { Link } from 'react-router-dom'
import { discountPercent } from '../data/products'
import { formatPrice } from '../utils/format'
import ProductImage from './ProductImage.jsx'

export function Stars({ rating }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      <span className="stars-fill" style={{ width: `${(rating / 5) * 100}%` }}>★★★★★</span>
      ★★★★★
    </span>
  )
}

export default function ProductCard({ product }) {
  const off = discountPercent(product)
  return (
    <Link to={`/product/${product.id}`} className={product.inStock ? 'card' : 'card sold-out'}>
      <div className="card-img">
        {off > 0 && <b className="badge badge-red">{off}% OFF</b>}
        {!product.inStock && <b className="badge badge-dark">Out of stock</b>}
        <ProductImage src={product.image} alt={product.title} />
      </div>
      <div className="card-body">
        <Stars rating={product.rating} />
        {product.freeDelivery && <b className="badge badge-green">Free Delivery</b>}
        <span className="card-label">{product.label}</span>
        <span className="card-title">{product.title}</span>
        <div className="price">
          {formatPrice(product.price)}
          {off > 0 && <s>{formatPrice(product.oldPrice)}</s>}
        </div>
      </div>
    </Link>
  )
}
