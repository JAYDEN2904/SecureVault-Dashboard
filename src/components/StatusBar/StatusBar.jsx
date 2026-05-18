import './StatusBar.css'

/**
 * @param {{ visibleCount: number, query: string }} props
 */
export default function StatusBar({ visibleCount, query }) {
  const q = query.trim()
  return (
    <footer className="status-bar" role="status">
      <span>{visibleCount} visible items</span>
      {q ? <span className="status-bar__muted">Filtered: “{q}”</span> : null}
    </footer>
  )
}
