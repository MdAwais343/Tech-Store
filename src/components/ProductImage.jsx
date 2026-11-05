// Falls back to a neutral placeholder if an image URL is missing or broken.
const PLACEHOLDER = '/images/placeholder.svg'

export default function ProductImage({ src, alt = '', ...rest }) {
  return (
    <img
      src={src || PLACEHOLDER}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = PLACEHOLDER
      }}
      {...rest}
    />
  )
}
