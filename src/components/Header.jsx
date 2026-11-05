import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { store } from '../config'
import { useCart } from '../context/CartContext.jsx'

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { count } = useCart()

  const onSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  return (
    <header className="header">
      <div className="container header-top">
        <Link to="/" className="logo" aria-label={`${store.name} home`}>
          <img className="logo-mark" src={store.logo} alt="" width="38" height="38" />
          <span className="logo-text">{store.name}</span>
        </Link>
        <form className="search" onSubmit={onSubmit} role="search">
          <input
            type="search"
            placeholder="Search"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn">
            Search
          </button>
        </form>
        <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          {count > 0 && <span className="cart-count">{count}</span>}
        </Link>
      </div>
      <nav className="nav">
        <div className="container nav-inner">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products" end>
            All Products
          </NavLink>
          <NavLink to="/deals">Deals</NavLink>
        </div>
      </nav>
    </header>
  )
}
