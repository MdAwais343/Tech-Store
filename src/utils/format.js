import { store } from '../config'

export const formatPrice = (n) => `${+n.toFixed(2)} ${store.currency}`

export function whatsappLink(message) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`
}

export function orderMessage(lines, total) {
  const rows = lines.map((l) => `- ${l.qty} x ${l.product.title} (${formatPrice(l.product.price)})`)
  return [`Hello ${store.name}, I would like to order:`, ...rows, `Total: ${formatPrice(total)}`].join('\n')
}
