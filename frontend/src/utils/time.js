export function timeAgo(timestamp) {
  if (!timestamp) return '—'

  const diff = Math.floor((Date.now() - timestamp) / 1000)

  if (diff < 5) return 'just now'
  if (diff < 60) return `${diff}s ago`
  return `${Math.floor(diff / 60)}m ago`
}
