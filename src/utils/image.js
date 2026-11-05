// Shrinks phone-sized photos before upload: max 1000px on the long side, JPEG, white background for PNGs.
export async function prepareImage(file, max = 1000, quality = 0.85) {
  if (file.type === 'image/svg+xml') return { blob: file, ext: 'svg' }
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file')

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
  if (!blob) throw new Error('Could not process the image')
  return { blob, ext: 'jpg' }
}
