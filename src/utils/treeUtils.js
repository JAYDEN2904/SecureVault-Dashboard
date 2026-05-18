/**
 * @typedef {'folder'|'file'} VaultNodeType
 * @typedef {{ id: string, name: string, type: VaultNodeType, children?: VaultNode[], size?: string, tags?: string[], modified?: string, created?: string, owner?: string }} VaultNode
 */

/**
 * @param {VaultNode[]} nodes
 * @returns {string[]}
 */
export function getTopLevelFolderIds(nodes) {
  return nodes.filter((n) => n.type === 'folder').map((n) => n.id)
}

/**
 * @param {VaultNode[]} nodes
 * @param {string} targetId
 * @returns {VaultNode[]}
 */
export function getPath(nodes, targetId) {
  /** @param {VaultNode[]} list @param {VaultNode[]} acc */
  function walk(list, acc) {
    for (const node of list) {
      const next = [...acc, node]
      if (node.id === targetId) return next
      if (node.children?.length) {
        const found = walk(node.children, next)
        if (found) return found
      }
    }
    return null
  }
  return walk(nodes, []) ?? []
}

/**
 * @param {VaultNode[]} nodes
 * @param {string} id
 * @returns {VaultNode | null}
 */
export function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children?.length) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * @param {VaultNode[]} nodes
 * @param {string} targetId
 * @returns {VaultNode | null}
 */
export function findParentOf(nodes, targetId) {
  /** @param {VaultNode[]} list @param {VaultNode | null} parent */
  function walk(list, parent) {
    for (const node of list) {
      if (node.id === targetId) return parent
      if (node.children?.length) {
        const hit = walk(node.children, node)
        if (hit !== undefined) return hit
      }
    }
    return undefined
  }
  const p = walk(nodes, null)
  return p === undefined ? null : p
}

/**
 * Descendant folder ids under folderNode (excludes folderNode itself).
 * @param {VaultNode} folderNode
 * @returns {string[]}
 */
export function collectDescendantFolderIds(folderNode) {
  const ids = []
  /** @param {VaultNode[]} children */
  function walk(children) {
    for (const c of children ?? []) {
      if (c.type === 'folder') {
        ids.push(c.id)
        walk(c.children)
      }
    }
  }
  walk(folderNode.children)
  return ids
}

/**
 * @param {VaultNode[]} nodes
 * @param {Set<string>} expandedIds
 * @param {number} [depth]
 * @param {{ node: VaultNode; depth: number }[]} [out]
 */
export function flattenVisible(nodes, expandedIds, depth = 0, out = []) {
  for (const node of nodes) {
    out.push({ node, depth })
    if (node.type === 'folder' && expandedIds.has(node.id) && node.children?.length) {
      flattenVisible(node.children, expandedIds, depth + 1, out)
    }
  }
  return out
}

/**
 * @param {VaultNode[]} nodes
 * @param {string} query
 * @returns {VaultNode[]}
 */
export function filterTreeByQuery(nodes, query) {
  const q = query.trim().toLowerCase()
  if (!q) return nodes

  /** @param {VaultNode} node */
  function filterNode(node) {
    const nameMatch = node.name.toLowerCase().includes(q)
    if (node.type === 'file') {
      return nameMatch ? node : null
    }
    const kids = node.children ?? []
    const filteredChildren = kids.map(filterNode).filter(Boolean)
    if (nameMatch || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren }
    }
    return null
  }

  return nodes.map(filterNode).filter(Boolean)
}

/**
 * @param {VaultNode[]} nodes
 * @param {Set<string>} [acc]
 */
export function collectFolderIds(nodes, acc = new Set()) {
  for (const n of nodes) {
    if (n.type === 'folder') {
      acc.add(n.id)
      if (n.children?.length) collectFolderIds(n.children, acc)
    }
  }
  return acc
}
