import { useEffect, useRef } from 'react'
import './SearchBar.css'

/**
 * @param {{
 *   query: string,
 *   onChange: (value: string) => void,
 *   onClear: () => void,
 * }} props
 */
export default function SearchBar({ query, onChange, onClear }) {
  const inputRef = useRef(null)
  const hasQuery = Boolean(query.trim())

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`search-bar ${hasQuery ? 'search-bar--active' : ''}`}>
      <label className="search-bar__label" htmlFor="vault-search">
        Search vault
      </label>
      <span className="search-bar__icon" aria-hidden="true">
        🔍
      </span>
      <input
        ref={inputRef}
        id="vault-search"
        className="search-bar__input"
        type="search"
        placeholder="Search files…"
        autoComplete="off"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {hasQuery ? (
        <button
          type="button"
          className="search-bar__clear"
          aria-label="Clear search"
          onClick={() => {
            onClear()
            inputRef.current?.focus()
          }}
        >
          ✕
        </button>
      ) : (
        <span className="search-bar__kbd-wrap" aria-hidden="true">
          <kbd className="search-bar__kbd">⌘</kbd>
          <kbd className="search-bar__kbd">K</kbd>
        </span>
      )}
    </div>
  )
}
