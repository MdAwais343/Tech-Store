import { Link } from 'react-router-dom'
import ProductImage from '../components/ProductImage.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, orderMessage, whatsappLink } from '../utils/format'

export default function Cart() {
  const { lines, total, setQty, remove, clear } = useCart()

  if (!lines.length) {
    return (
      <div className="container section">
        <h2>Your cart</h2>
        <p className="empty">Your cart is empty. <Link to="/products">Start shopping</Link></p>
      </div>
    )
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Your cart</h2>
        <button className="link-btn" onClick={clear}>Clear cart</button>
      </div>

      <div className="cart">
        <ul className="cart-lines">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="cart-line">
              <Link to={`/product/${product.id}`}><ProductImage src={product.image} alt={product.title} /></Link>
              <div className="cart-line-info">
                <Link to={`/product/${product.id}`} className="card-title">{product.title}</Link>
                <span className="price">{formatPrice(product.price)}</span>
                <div className="qty">
                  <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(product.id, qty + 1)} aria-label="Increase quantity">+</button>
                </div>
              </div>
              <div className="cart-line-total">
                <b>{formatPrice(product.price * qty)}</b>
                <button className="link-btn" onClick={() => remove(product.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="row"><span>Delivery</span><b className="green">Free</b></div>
          <div className="row total"><span>Total</span><b>{formatPrice(total)}</b></div>
          <a className="btn btn-green btn-lg" href={whatsappLink(orderMessage(lines, total))} target="_blank" rel="noreferrer">
            Checkout on WhatsApp
          </a>
          <p className="note">Your order is sent to our team on WhatsApp to confirm delivery details and payment.</p>
        </aside>
      </div>
    </div>
  )
}
