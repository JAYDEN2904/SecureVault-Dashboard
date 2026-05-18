import { useEffect, useMemo } from 'react'
import { flattenVisible } from '../utils/treeUtils.js'

/**
 * Keyboard navigation for the vault tree aligns with what you actually see: `visibleNodes`
 * is recomputed whenever `treeData` (the explorer root array, including the synthetic vault
 * root) or `expandedIds` changes, using `flattenVisible` — the same preorder walk React uses
 * when rendering expanded folders. Every Arrow key therefore moves along real DOM rows (matched
 * via `data-node-id`), so focus never jumps into collapsed subtrees or skips synthetic branches.
 *
 * @param {{
 *   treeData: import('../utils/treeUtils.js').VaultNode[],
 *   expandedIds: Set<string>,
 *   setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>,
 *   focusedId: string | null,
 *   setFocusedId: React.Dispatch<React.SetStateAction<string | null>>,
 *   selectedNode: import('../utils/treeUtils.js').VaultNode | null,
 *   setSelectedNode: React.Dispatch<React.SetStateAction<import('../utils/treeUtils.js').VaultNode | null>>,
 *   explorerRef: React.RefObject<HTMLElement | null>,
 * }} opts
 */
export function useKeyboardNav(opts) {
  const {
    treeData,
    expandedIds,
    setExpandedIds,
    focusedId,
    setFocusedId,
    selectedNode,
    setSelectedNode,
    explorerRef,
  } = opts

  void selectedNode

  const visibleNodes = useMemo(
    () => flattenVisible(treeData, expandedIds),
    [treeData, expandedIds],
  )

  useEffect(() => {
    const rootEl = explorerRef.current
    if (!rootEl || !focusedId) return

    const target = document.querySelector(
      `[data-node-id="${CSS.escape(focusedId)}"]`,
    )
    target?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusedId, explorerRef])

  useEffect(() => {
    const rootEl = explorerRef.current
    if (!rootEl) return

    const onKeyDown = (e) => {
      const len = visibleNodes.length
      if (!len) return

      const currentIndex = visibleNodes.findIndex((v) => v.node.id === focusedId)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const base = currentIndex < 0 ? -1 : currentIndex
        const nextIndex = Math.min(base + 1, len - 1)
        setFocusedId(visibleNodes[nextIndex].node.id)
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const base = currentIndex < 0 ? len : currentIndex
        const prevIndex = Math.max(base - 1, 0)
        setFocusedId(visibleNodes[prevIndex].node.id)
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (currentIndex < 0) return
        const node = visibleNodes[currentIndex].node
        if (node.type === 'folder') {
          setExpandedIds((prev) => {
            const next = new Set(prev)
            next.add(node.id)
            return next
          })
        }
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentIndex < 0) return
        const node = visibleNodes[currentIndex].node
        if (node.type === 'folder') {
          setExpandedIds((prev) => {
            const next = new Set(prev)
            next.delete(node.id)
            return next
          })
        }
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (currentIndex < 0) return
        const node = visibleNodes[currentIndex].node
        if (node.type === 'file') {
          setSelectedNode(node)
        }
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedNode(null)
        setFocusedId(null)
        return
      }
    }

    rootEl.addEventListener('keydown', onKeyDown)
    return () => rootEl.removeEventListener('keydown', onKeyDown)
  }, [
    explorerRef,
    focusedId,
    setExpandedIds,
    setFocusedId,
    setSelectedNode,
    visibleNodes,
  ])
}
