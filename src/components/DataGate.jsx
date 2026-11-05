import { useProducts } from '../context/ProductsContext.jsx'

// Shows a message until the product list has loaded.
export default function DataGate({ children }) {
  const { status, error, refresh } = useProducts()

  if (status === 'loading') {
    return <div className="container section"><p className="empty">Loading products…</p></div>
  }
  if (status === 'error') {
    return (
      <div className="container section">
        <p className="empty">
          Couldn’t load products: {error} <button className="link-btn" onClick={refresh}>Retry</button>
        </p>
      </div>
    )
  }
  return children
}
