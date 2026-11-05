import { useState } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../config'

const year = new Date().getFullYear()

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  // Front-end only: connect this to Mailchimp / Resend / your backend when you are ready.
  const onSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) setDone(true)
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <section>
          <h4>Contact us</h4>
          <p>{store.name}</p>
          <p>{store.address}</p>
          <p>
            <a href={`mailto:${store.email}`}>{store.email}</a>
          </p>
          <p>
            <a href={`tel:${store.phone.replace(/\s/g, '')}`}>{store.phone}</a>
          </p>
        </section>
        <section>
          <h4>Information</h4>
          <p><Link to="/info/about">About us</Link></p>
          <p><Link to="/info/why-us">Why us?</Link></p>
          <p><Link to="/info/delivery">Delivery &amp; returns</Link></p>
        </section>
        <section>
          <h4>Newsletter</h4>
          {done ? (
            <p>Thanks for subscribing!</p>
          ) : (
            <form className="newsletter" onSubmit={onSubmit}>
              <input type="email" required placeholder="Your email" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="btn">Subscribe</button>
            </form>
          )}
        </section>
      </div>
      <div className="container footer-bottom">
        <span>
          <Link to="/info/privacy">Privacy Policy</Link> · <Link to="/info/terms">Terms of Use</Link>
        </span>
        <span>© {year} {store.name}. All rights reserved.</span>
      </div>
    </footer>
  )
}
