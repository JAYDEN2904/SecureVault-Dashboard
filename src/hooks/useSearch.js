import { useMemo } from 'react'

/**
 * Search hook: finds file matches and derives folder ids to expand along ancestor chains.
 *
 * Time complexity: O(n) where n = total nodes in treeData — each node is visited once during DFS.
 *
 * @param {import('../utils/treeUtils.js').VaultNode[]} treeData
 * @param {string} query
 */
export function useSearch(treeData, query) {
  return useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      return {
        filteredNodes: treeData,
        autoExpandedIds: new Set(),
      }
    }

    const q = trimmed.toLowerCase()
    /** @type {import('../utils/treeUtils.js').VaultNode[]} */
    const filteredNodes = []
    const autoExpandedIds = new Set()

    /**
     * @param {import('../utils/treeUtils.js').VaultNode} node
     * @param {string[]} ancestorFolderIds
     */
    function dfs(node, ancestorFolderIds) {
      if (node.type === 'file') {
        if (node.name.toLowerCase().includes(q)) {
          filteredNodes.push(node)
          ancestorFolderIds.forEach((id) => autoExpandedIds.add(id))
        }
        return
      }

      if (node.type === 'folder') {
        const nextAncestors = [...ancestorFolderIds, node.id]
        for (const child of node.children ?? []) {
          dfs(child, nextAncestors)
        }
      }
    }

    for (const root of treeData) {
      dfs(root, [])
    }

    return { filteredNodes, autoExpandedIds }
  }, [treeData, query])
}
