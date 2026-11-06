import { useState } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../config'
import { useCart } from '../context/CartContext.jsx'
import { discountPercent } from '../data/products'
import { formatPrice, whatsappLink } from '../utils/format'
import { Check, Plus, Star, Truck } from './icons.jsx'
import ProductImage from './ProductImage.jsx'

// Five-star scale, used on the product page.
export function Stars({ rating }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      <span className="stars-fill" style={{ width: `${(rating / 5) * 100}%` }}>★★★★★</span>
      ★★★★★
    </span>
  )
}

export default function ProductCard({ product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const off = discountPercent(product)
  const to = `/product/${product.id}`
  const name = product.label || product.title

  const onAdd = () => {
    add(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className={product.inStock ? 'pc' : 'pc pc-out'}>
      <div className="pc-media">
        {/* The title link is the accessible one; the photo link is a bigger click target for the mouse. */}
        <Link to={to} className="pc-photo" tabIndex={-1} aria-hidden="true">
          <ProductImage src={product.image} alt="" />
        </Link>
        {off > 0 && <b className="pc-pill pc-pill-off">{off}% OFF</b>}
        {!product.inStock && <b className="pc-pill pc-pill-out">Out of stock</b>}
        <button
          type="button"
          className="pc-add"
          onClick={onAdd}
          disabled={!product.inStock}
          aria-label={!product.inStock ? `${name} is out of stock` : added ? `${name} added to cart` : `Add ${name} to cart`}
        >
          {added ? <Check /> : <Plus />}
        </button>
      </div>

      <div className="pc-body">
        <span className="pc-cat">{product.category}</span>
        <Link to={to} className="pc-title">{product.title}</Link>
        <span className="pc-rating"><Star /> {Number(product.rating).toFixed(1)}</span>
        <span className="pc-price">
          <b>{formatPrice(product.price)}</b>
          {off > 0 && <s>{formatPrice(product.oldPrice)}</s>}
        </span>
        {product.inStock ? (
          product.freeDelivery && <span className="pc-ship"><Truck /> Free delivery</span>
        ) : (
          <a
            className="pc-ask"
            href={whatsappLink(`Hello ${store.name}, is "${product.title}" coming back in stock?`)}
            target="_blank"
            rel="noreferrer"
          >
            Ask on WhatsApp when it is back
          </a>
        )}
      </div>
    </article>
  )
}
