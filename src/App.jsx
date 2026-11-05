import { lazy, Suspense, useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import DataGate from './components/DataGate.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import Cart from './pages/Cart.jsx'
import Home from './pages/Home.jsx'
import InfoPage from './pages/InfoPage.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Products from './pages/Products.jsx'

// The admin is code-split so shoppers never download it.
const AdminPage = lazy(() => import('./pages/admin/AdminPage.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function StoreLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <DataGate>
          <Outlet />
        </DataGate>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/deals" element={<Products dealsOnly />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/info/:slug" element={<InfoPage />} />
        <Route path="*" element={<InfoPage notFound />} />
      </Route>
      <Route
        path="/admin"
        element={
          <Suspense fallback={null}>
            <AdminPage />
          </Suspense>
        }
      />
    </Routes>
  )
}
