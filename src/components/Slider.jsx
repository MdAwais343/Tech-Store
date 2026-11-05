import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Slider({ slides, interval = 5000 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = (n) => setIndex((n + slides.length) % slides.length)

  useEffect(() => {
    if (paused || slides.length < 2) return
    const t = setInterval(() => setIndex((n) => (n + 1) % slides.length), interval)
    return () => clearInterval(t)
  }, [paused, slides.length, interval])

  return (
    <div
      className="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s) => (
          <Link key={s.id} to={s.to} className="slide">
            <img src={s.image} alt={s.alt} />
          </Link>
        ))}
      </div>
      <button className="slider-arrow prev" onClick={() => go(index - 1)} aria-label="Previous slide">‹</button>
      <button className="slider-arrow next" onClick={() => go(index + 1)} aria-label="Next slide">›</button>
      <div className="slider-dots">
        {slides.map((s, i) => (
          <button key={s.id} className={i === index ? 'active' : ''} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}
