import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { discountPercent, heroSlides, promoCards } from '../data/products'
import { formatPrice } from '../utils/format'
import { ArrowRight, ChevronLeft, ChevronRight } from './icons.jsx'
import ProductImage from './ProductImage.jsx'

const INTERVAL = 6000

// Summarise a group of products so the hero always matches what is really for sale:
// the lead product (photo and price tag) is the one with the biggest discount.
function summarise(items) {
  if (!items.length) return null
  const lead = items.reduce((best, p) => (discountPercent(p) > discountPercent(best) ? p : best), items[0])
  return { items, lead, from: Math.min(...items.map((p) => p.price)), maxOff: Math.max(...items.map(discountPercent)) }
}

const promoPhoto = ({ pick, info }) =>
  (pick && info.items.find((p) => p.title.toLowerCase().includes(pick))?.image) || info.items[0].image

const categoryItems = (products, category) => products.filter((p) => p.category === category)
const categoryLink = (category) => `/products?category=${encodeURIComponent(category)}`

export default function Hero() {
  const { products } = useProducts()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const slides = useMemo(
    () =>
      heroSlides
        .map((s) => ({ ...s, info: summarise(s.source === 'deals' ? products.filter((p) => p.deal) : categoryItems(products, s.category)) }))
        .filter((s) => s.info),
    [products],
  )
  const promos = useMemo(
    () => promoCards.map((p) => ({ ...p, info: summarise(categoryItems(products, p.category)) })).filter((p) => p.info),
    [products],
  )

  const count = slides.length
  const active = count ? index % count : 0
  const go = (n) => setIndex((n + count) % count)

  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((n) => (n + 1) % count), INTERVAL)
    return () => clearInterval(timer)
  }, [paused, count])

  if (!count && !promos.length) return null

  return (
    <section className="hero" aria-label="Featured">
      {count > 0 && (
        <div
          className="hero-main"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="hero-track" style={{ transform: `translateX(-${active * 100}%)` }} aria-live={paused ? 'polite' : 'off'}>
            {slides.map((s, i) => {
              const { info } = s
              const off = discountPercent(info.lead)
              const isDeals = s.source === 'deals'
              const Title = i === 0 ? 'h1' : 'h2'
              return (
                <div
                  key={s.id}
                  className="hero-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  inert={i !== active}
                >
                  <div className="hero-text">
                    <span className="hero-chip">
                      {isDeals ? 'Deals' : s.category}
                      {info.maxOff > 0 && ` · up to ${info.maxOff}% off`}
                    </span>
                    <Title className="hero-title">
                      {s.headline[0]}
                      <br />
                      {s.headline[1]}
                    </Title>
                    <p className="hero-sub">{s.text}</p>
                    <div className="hero-ctas">
                      <Link to={isDeals ? '/deals' : categoryLink(s.category)} className="hero-cta">
                        {s.cta} <ArrowRight />
                      </Link>
                      <Link to={isDeals ? '/products' : '/deals'} className="hero-cta hero-cta-ghost">
                        {isDeals ? 'All products' : 'View deals'}
                      </Link>
                    </div>
                    <p className="hero-from">
                      {isDeals ? 'Deals' : s.category} from <b>{formatPrice(info.from)}</b>
                    </p>
                  </div>
                  <div className="hero-media">
                    <ProductImage src={info.lead.image} alt={info.lead.title} loading={i === 0 ? 'eager' : 'lazy'} />
                    <div className="hero-tag">
                      <div>
                        <span className="hero-tag-name">{info.lead.label || info.lead.title}</span>
                        <b className="hero-tag-price">
                          {formatPrice(info.lead.price)} {off > 0 && <s>{+info.lead.oldPrice.toFixed(2)}</s>}
                        </b>
                      </div>
                      {off > 0 && <span className="hero-tag-off">{off}% OFF</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {count > 1 && (
            <div className="hero-controls">
              <button type="button" className="hero-arrow" onClick={() => go(active - 1)} aria-label="Previous slide">
                <ChevronLeft />
              </button>
              <button type="button" className="hero-arrow" onClick={() => go(active + 1)} aria-label="Next slide">
                <ChevronRight />
              </button>
              <div className="hero-dots">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    className="hero-dot"
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {promos.length > 0 && (
        <div className="hero-side">
          {promos.map((p) => (
            <Link key={p.category} to={categoryLink(p.category)} className={`promo promo-${p.tone}`}>
              <div className="promo-text">
                <div className="promo-copy">
                  <span className="promo-eyebrow">{p.category}</span>
                  <h2>{p.title}</h2>
                  <p>From {formatPrice(p.info.from)}</p>
                </div>
                <span className="promo-link">
                  {p.cta}
                  <span className="promo-arrow">
                    <ArrowRight size={15} />
                  </span>
                </span>
              </div>
              <div className="promo-img">
                <ProductImage src={promoPhoto(p)} alt="" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
