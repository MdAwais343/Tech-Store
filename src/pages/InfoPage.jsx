import { Link, useParams } from 'react-router-dom'
import { store } from '../config'

// Replace the copy below with your real policies before going live.
const pages = {
  about: { title: 'About us', body: [`${store.name} brings you everyday home, kitchen and gadget essentials at honest prices, with free delivery on every order.`, 'We pick products we would use ourselves and back every order with friendly support.'] },
  'why-us': { title: 'Why us?', body: ['Free delivery on every order.', 'Carefully selected products at low prices.', 'Quick support on WhatsApp.'] },
  delivery: { title: 'Delivery & returns', body: ['Orders are confirmed on WhatsApp and delivered to your door at no extra cost.', 'If an item arrives damaged or not as described, message us within 48 hours and we will make it right.'] },
  privacy: { title: 'Privacy Policy', body: ['We only collect the details you share with us to process and deliver your order. We never sell your information.'] },
  terms: { title: 'Terms of Use', body: ['By placing an order you agree to provide accurate details and to pay on the terms confirmed with our team.'] },
}

export default function InfoPage({ notFound = false }) {
  const { slug } = useParams()
  const page = notFound ? null : pages[slug]

  if (!page) {
    return (
      <div className="container section">
        <h2>Page not found</h2>
        <p className="empty"><Link to="/">Back to home</Link></p>
      </div>
    )
  }

  return (
    <div className="container section prose">
      <h1>{page.title}</h1>
      {page.body.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </div>
  )
}
