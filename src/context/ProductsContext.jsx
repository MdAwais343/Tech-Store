import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { repo } from '../data/repo'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      setProducts(await repo.list())
      setStatus('ready')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    repo
      .list()
      .then((list) => {
        if (cancelled) return
        setProducts(list)
        setStatus('ready')
      })
      .catch((e) => {
        if (cancelled) return
        setError(e.message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      products,
      status,
      error,
      mode: repo.mode,
      refresh,
      getProduct: (id) => products.find((p) => p.id === Number(id)),

      // Admin mutations: persist first, then update local state.
      async saveProduct(p) {
        const saved = p.id ? await repo.update(p.id, p) : await repo.create(p)
        setProducts((cur) => (p.id ? cur.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...cur]))
        return saved
      },
      async deleteProduct(id) {
        await repo.remove(id)
        setProducts((cur) => cur.filter((x) => x.id !== id))
      },
      // Optimistic flag toggles (deal / featured / inStock): roll back by reloading on failure.
      async patchProduct(id, patch) {
        const current = products.find((x) => x.id === id)
        setProducts((cur) => cur.map((x) => (x.id === id ? { ...x, ...patch } : x)))
        try {
          await repo.update(id, { ...current, ...patch })
        } catch (e) {
          refresh()
          throw e
        }
      },
      resetDemo() {
        repo.reset?.()
        return refresh()
      },
    }),
    [products, status, error, refresh],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export const useProducts = () => useContext(ProductsContext)
