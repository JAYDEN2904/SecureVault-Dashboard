import { useCallback } from 'react'

/**
 * @param {{
 *   visibleRows: { node: { id: string, type: string, children?: unknown[] } }[],
 *   focusedId: string | null,
 *   setFocusedId: (id: string | null) => void,
 *   expandedIds: Set<string>,
 *   setExpandedIds: (updater: (prev: Set<string>) => Set<string>) => void,
 *   setSelectedNode: (node: unknown | null) => void,
 *   setActiveFolder: (node: unknown | null) => void,
 *   getParentOfId: (id: string) => { id: string } | null,
 * }} opts
 */
export function useKeyboardNav(opts) {
  const {
    visibleRows,
    focusedId,
    setFocusedId,
    expandedIds,
    setExpandedIds,
    setSelectedNode,
    setActiveFolder,
    getParentOfId,
  } = opts

  const onKeyDown = useCallback(
    (e) => {
      const ids = visibleRows.map((r) => r.node.id)
      const idx = focusedId ? ids.indexOf(focusedId) : -1
      const rowAt = (i) => (i >= 0 && i < visibleRows.length ? visibleRows[i] : null)
      const current = rowAt(idx)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = idx < ids.length - 1 ? idx + 1 : idx === -1 && ids.length ? 0 : idx
        if (next >= 0 && next < ids.length) setFocusedId(ids[next])
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = idx > 0 ? idx - 1 : idx === -1 && ids.length ? ids.length - 1 : 0
        if (prev >= 0 && prev < ids.length) setFocusedId(ids[prev])
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (current?.node.type === 'folder') {
          setExpandedIds((prev) => {
            const next = new Set(prev)
            next.add(current.node.id)
            return next
          })
        }
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (!focusedId && ids.length) {
          setFocusedId(ids[0])
          return
        }
        if (!current) return
        if (current.node.type === 'folder' && expandedIds.has(current.node.id)) {
          setExpandedIds((prev) => {
            const next = new Set(prev)
            next.delete(current.node.id)
            return next
          })
          return
        }
        const parent = getParentOfId(current.node.id)
        if (parent?.id) setFocusedId(parent.id)
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const focusRow = rowAt(idx >= 0 ? idx : 0)
        if (!focusRow) return
        if (focusRow.node.type === 'file') {
          setSelectedNode(focusRow.node)
          const parent = getParentOfId(focusRow.node.id)
          setActiveFolder(parent)
        }
        if (focusRow.node.type === 'folder') {
          setActiveFolder(focusRow.node)
          setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(focusRow.node.id)) next.delete(focusRow.node.id)
            else next.add(focusRow.node.id)
            return next
          })
        }
        return
      }
    },
    [
      visibleRows,
      focusedId,
      setFocusedId,
      expandedIds,
      setExpandedIds,
      setSelectedNode,
      setActiveFolder,
      getParentOfId,
    ],
  )

  return { onKeyDown }
}
