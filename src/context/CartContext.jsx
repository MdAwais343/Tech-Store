import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductsContext.jsx'

const CartContext = createContext(null)
const STORAGE_KEY = 'store-cart-v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const { getProduct } = useProducts()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable (private mode): the cart just won't persist
    }
  }, [items])

  const value = useMemo(() => {
    const lines = items.map((i) => ({ ...i, product: getProduct(i.id) })).filter((l) => l.product)
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      add: (id, qty = 1) =>
        setItems((cur) =>
          cur.some((i) => i.id === id)
            ? cur.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
            : [...cur, { id, qty }],
        ),
      setQty: (id, qty) =>
        setItems((cur) => (qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i)))),
      remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    }
  }, [items, getProduct])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export const useCart = () => useContext(CartContext)
