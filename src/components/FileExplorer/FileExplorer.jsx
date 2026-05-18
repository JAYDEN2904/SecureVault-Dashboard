import { useMemo, useRef } from 'react'
import { useKeyboardNav } from '../../hooks/useKeyboardNav.js'
import { findNodeById, findParentOf } from '../../utils/treeUtils.js'
import TreeNode from '../TreeNode/TreeNode'
import './FileExplorer.css'

export const EXPLORER_ROOT_ID = '__explorer_root__'

export function buildExplorerRootTree(treeData) {
  return {
    id: EXPLORER_ROOT_ID,
    type: 'folder',
    name: 'Vault',
    children: treeData ?? [],
  }
}

/**
 * @param {{
 *   treeData: import('../../utils/treeUtils.js').VaultNode[],
 *   expandedIds: Set<string>,
 *   setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>,
 *   selectedNode: import('../../utils/treeUtils.js').VaultNode | null,
 *   setSelectedNode: React.Dispatch<React.SetStateAction<import('../../utils/treeUtils.js').VaultNode | null>>,
 *   focusedId: string | null,
 *   setFocusedId: React.Dispatch<React.SetStateAction<string | null>>,
 *   searchQuery: string,
 *   activeFolder: import('../../utils/treeUtils.js').VaultNode | null,
 *   setActiveFolder: React.Dispatch<React.SetStateAction<import('../../utils/treeUtils.js').VaultNode | null>>,
 * }} props
 */
export default function FileExplorer({
  treeData,
  expandedIds,
  setExpandedIds,
  selectedNode,
  setSelectedNode,
  focusedId,
  setFocusedId,
  searchQuery,
  activeFolder,
  setActiveFolder,
}) {
  const explorerRef = useRef(null)
  const rootNode = useMemo(() => buildExplorerRootTree(treeData), [treeData])
  const treeRoots = useMemo(() => [rootNode], [rootNode])

  useKeyboardNav({
    treeData: treeRoots,
    expandedIds,
    setExpandedIds,
    focusedId,
    setFocusedId,
    selectedNode,
    setSelectedNode,
    explorerRef,
  })

  const onToggle = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const onFocus = (id) => {
    setFocusedId(id)
    const n = findNodeById(treeRoots, id)
    if (n?.type === 'folder') setActiveFolder(n)
  }

  const onSelect = (node) => {
    setSelectedNode(node)
    const parent = findParentOf(treeRoots, node.id)
    setActiveFolder(parent)
  }

  return (
    <aside className="file-explorer" aria-label="Folder tree">
      <div
        ref={explorerRef}
        className="explorer-sidebar"
        role="tree"
        tabIndex={0}
        data-search-query={searchQuery}
        data-active-folder-id={activeFolder?.id ?? ''}
      >
        <TreeNode
          node={rootNode}
          depth={0}
          expandedIds={expandedIds}
          selectedId={selectedNode?.id ?? null}
          focusedId={focusedId}
          onToggle={onToggle}
          onSelect={onSelect}
          onFocus={onFocus}
        />
      </div>
    </aside>
  )
}
